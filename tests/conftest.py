import os
import sys
from pathlib import Path

import pytest

# Ensure the project root is importable when running `pytest` from anywhere.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.sos_handler import sos_handler  # noqa: E402


@pytest.fixture(autouse=True)
def _clean_sos_state():
    """Reset the shared SOS handler state before and after every test so tests
    never leak events into each other, and remove the small event log file
    this project writes to the working directory."""
    sos_handler.reset()
    yield
    sos_handler.reset()
    log_path = Path(sos_handler._settings.EVENT_LOG_PATH)  # noqa: SLF001
    if log_path.exists():
        os.remove(log_path)
