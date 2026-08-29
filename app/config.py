"""
ASTRA configuration.

All settings are read from environment variables (see .env.example).
No paid API keys are required anywhere in this module.
"""
from __future__ import annotations

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Server
    HOST: str = "127.0.0.1"
    PORT: int = 8000

    # ASTRA wake word (case-insensitive substring match on the recognized transcript)
    WAKE_WORD: str = "astra"

    # Minimum speech-recognition confidence (0.0 - 1.0) required to accept a REAL
    # (browser microphone) detection as genuine. Simulation events always bypass this
    # because they are not produced by a recognizer.
    MIN_CONFIDENCE: float = 0.55

    # OPTIONAL integration point: if set, every SOS event is also POSTed as JSON to
    # this URL (e.g. a local DURGA SOS webhook). Leave blank to only log locally.
    # This is free/open functionality (plain HTTP POST) — no paid service required.
    SOS_WEBHOOK_URL: str = ""

    # Where SOS + ASTRA events are appended as JSON lines, for audit / demo review.
    EVENT_LOG_PATH: str = "astra_events.log"


@lru_cache
def get_settings() -> Settings:
    return Settings()
