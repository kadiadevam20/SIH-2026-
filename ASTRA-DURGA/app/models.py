"""
Request/response schemas for the ASTRA API.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal, Optional

from pydantic import BaseModel, Field


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class AstraDetectionRequest(BaseModel):
    """Sent by the frontend whenever it wants ASTRA to evaluate a piece of speech
    (real microphone transcript) or a simulated trigger."""

    transcript: str = Field(..., min_length=1, max_length=1000)
    confidence: Optional[float] = Field(
        default=None, ge=0.0, le=1.0, description="Recognizer confidence, if available."
    )
    source: Literal["real", "simulation"] = "real"


class SOSEvent(BaseModel):
    """A single SOS activation record."""

    id: int
    triggered_at: datetime = Field(default_factory=_utcnow)
    trigger_source: Literal["real", "simulation", "manual"]
    transcript: Optional[str] = None
    confidence: Optional[float] = None
    message: str = "ASTRA wake word detected — SOS triggered."


class AstraDetectionResponse(BaseModel):
    wake_word_detected: bool
    sos_triggered: bool
    reason: str
    event: Optional[SOSEvent] = None


class SOSEventList(BaseModel):
    count: int
    events: list[SOSEvent]
