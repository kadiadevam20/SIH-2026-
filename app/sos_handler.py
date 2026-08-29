"""
DURGA SOS integration point.
====================================================================

THIS FILE IS THE CONTRACT BETWEEN "ASTRA" (this module) AND "DURGA"
(the existing safety application). Everything above the line marked
"INTEGRATION POINT" below is production-ready and does not need to
change. Everything inside `DurgaSOSHandler.trigger_sos()` marked
INTEGRATION POINT is intentionally a documented stub: the frontend /
backend developer who owns the real DURGA application should replace
that block with a call into DURGA's existing SOS pipeline (e.g. its
internal alert service, push-notification sender, emergency-contact
dispatcher, or whatever DURGA already uses today).

We deliberately do NOT invent a fake DURGA API here, because we do not
know its real shape. Inventing one would look like it works and then
silently fail to integrate. Instead this handler:

  1. Records every SOS event locally (in-memory + append-only JSON log)
     so the demo has a reliable, inspectable source of truth.
  2. Optionally POSTs the event as JSON to SOS_WEBHOOK_URL if one is
     configured in .env — this lets a real DURGA backend receive the
     event over plain HTTP with zero paid services involved.
  3. Exposes a single, narrow method `trigger_sos()` that is the only
     thing the rest of ASTRA depends on, so swapping in real DURGA
     logic never requires touching app/main.py or the frontend.
"""
from __future__ import annotations

import json
import logging
import threading
from pathlib import Path
from typing import Optional

import httpx

from app.config import get_settings
from app.models import SOSEvent

logger = logging.getLogger("astra.sos_handler")


class DurgaSOSHandler:
    """In-process SOS event store + DURGA integration hook."""

    def __init__(self) -> None:
        self._settings = get_settings()
        self._lock = threading.Lock()
        self._events: list[SOSEvent] = []
        self._next_id = 1
        self._log_path = Path(self._settings.EVENT_LOG_PATH)

    def trigger_sos(
        self,
        trigger_source: str,
        transcript: Optional[str] = None,
        confidence: Optional[float] = None,
    ) -> SOSEvent:
        with self._lock:
            event = SOSEvent(
                id=self._next_id,
                trigger_source=trigger_source,  # type: ignore[arg-type]
                transcript=transcript,
                confidence=confidence,
            )
            self._next_id += 1
            self._events.append(event)

        self._append_to_log(event)
        logger.warning("SOS TRIGGERED [%s] source=%s transcript=%r", event.id, trigger_source, transcript)

        # ---------------------------------------------------------------
        # INTEGRATION POINT — replace/extend below with real DURGA logic.
        #
        # Example of what a real integration might look like:
        #
        #   from durga.sos import sos_service          # existing DURGA module
        #   sos_service.raise_alert(
        #       user_id=current_user_id,
        #       reason="astra_voice_trigger",
        #       transcript=transcript,
        #   )
        #
        # Until that exists, we only do the free/open-source, optional
        # webhook POST below (skipped entirely if SOS_WEBHOOK_URL is blank).
        # ---------------------------------------------------------------
        if self._settings.SOS_WEBHOOK_URL:
            self._post_webhook(event)

        return event

    def list_events(self) -> list[SOSEvent]:
        with self._lock:
            return list(self._events)

    def reset(self) -> None:
        with self._lock:
            self._events.clear()
            self._next_id = 1
        if self._log_path.exists():
            self._log_path.unlink()

    # -- internal helpers -------------------------------------------------

    def _append_to_log(self, event: SOSEvent) -> None:
        try:
            with self._log_path.open("a", encoding="utf-8") as fh:
                fh.write(event.model_dump_json() + "\n")
        except OSError:
            logger.exception("Could not write to event log at %s", self._log_path)

    def _post_webhook(self, event: SOSEvent) -> None:
        try:
            httpx.post(
                self._settings.SOS_WEBHOOK_URL,
                json=json.loads(event.model_dump_json()),
                timeout=3.0,
            )
        except httpx.HTTPError:
            # A demo must never crash because an optional webhook is down.
            logger.exception("SOS webhook POST failed (non-fatal)")


# Single shared instance used by the FastAPI app and the standalone
# simulation script alike.
sos_handler = DurgaSOSHandler()
