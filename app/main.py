"""
ASTRA Voice SOS module — FastAPI application.

Two frontends are served from this single app:

  * "/"          REAL ASTRA VOICE MODE — uses the browser's microphone and
                  the Web Speech API to listen for the wake word.
  * "/simulate"  SIH DEMONSTRATION SIMULATION — no microphone required,
                  deterministic buttons a presenter can click.

Both post to the same `/api/astra/detect` endpoint, which is the single
place wake-word matching + SOS triggering happens.
"""
from __future__ import annotations

import logging
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.config import get_settings
from app.models import AstraDetectionRequest, AstraDetectionResponse, SOSEventList
from app.sos_handler import sos_handler

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("astra.main")

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(
    title="ASTRA Voice SOS Module",
    description="Voice wake-word ('ASTRA') detection that raises an SOS event for DURGA.",
    version="1.0.0",
)

app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


@app.get("/", tags=["frontend"])
def index(request: Request):
    """REAL ASTRA VOICE MODE — requires a Chromium-based browser (Chrome/Edge) and microphone access."""
    settings = get_settings()
    return templates.TemplateResponse(
        request, "index.html", {"wake_word": settings.WAKE_WORD}
    )


@app.get("/simulate", tags=["frontend"])
def simulate(request: Request):
    """SIH DEMONSTRATION SIMULATION — no microphone or speech recognition involved."""
    settings = get_settings()
    return templates.TemplateResponse(
        request, "simulate.html", {"wake_word": settings.WAKE_WORD}
    )


@app.get("/healthz", tags=["ops"])
def healthz():
    return {"status": "ok"}


@app.post("/api/astra/detect", response_model=AstraDetectionResponse, tags=["astra"])
def astra_detect(payload: AstraDetectionRequest):
    """
    Core ASTRA logic: does this transcript contain the wake word, and if so,
    trigger SOS via the DURGA integration point.

    - source="real": a real MIN_CONFIDENCE threshold is enforced, since browser
      speech recognition can mis-hear things.
    - source="simulation": confidence checks are skipped by design — the
      simulation exists specifically so a demo does not depend on real
      speech recognition working.
    """
    settings = get_settings()
    transcript_lower = payload.transcript.lower()
    wake_word_present = settings.WAKE_WORD in transcript_lower

    if not wake_word_present:
        return AstraDetectionResponse(
            wake_word_detected=False,
            sos_triggered=False,
            reason="Wake word not found in transcript.",
        )

    if payload.source == "real" and (payload.confidence or 0.0) < settings.MIN_CONFIDENCE:
        return AstraDetectionResponse(
            wake_word_detected=True,
            sos_triggered=False,
            reason=(
                f"Wake word matched but confidence "
                f"{payload.confidence!r} is below MIN_CONFIDENCE={settings.MIN_CONFIDENCE}."
            ),
        )

    event = sos_handler.trigger_sos(
        trigger_source=payload.source,
        transcript=payload.transcript,
        confidence=payload.confidence,
    )
    return AstraDetectionResponse(
        wake_word_detected=True,
        sos_triggered=True,
        reason="Wake word detected — SOS triggered.",
        event=event,
    )


@app.post("/api/sos/manual", response_model=AstraDetectionResponse, tags=["astra"])
def manual_sos():
    """A visible 'panic button' fallback that bypasses voice entirely.
    Useful during a live demo if voice/audio has any issue on stage."""
    event = sos_handler.trigger_sos(trigger_source="manual")
    return AstraDetectionResponse(
        wake_word_detected=True,
        sos_triggered=True,
        reason="Manual SOS trigger.",
        event=event,
    )


@app.get("/api/sos/events", response_model=SOSEventList, tags=["astra"])
def list_events():
    events = sos_handler.list_events()
    return SOSEventList(count=len(events), events=events)


@app.post("/api/sos/reset", tags=["astra"])
def reset_events():
    sos_handler.reset()
    return {"status": "reset"}


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # A judge-facing demo should never show a raw traceback.
    logger.exception("Unhandled error on %s", request.url)
    raise HTTPException(status_code=500, detail="Internal error — see server logs.") from exc
