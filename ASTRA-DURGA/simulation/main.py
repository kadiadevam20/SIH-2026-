"""
ASTRA — Standalone terminal simulation.

This is the most reliable fallback for an SIH stage demo: it does not need
a browser, a microphone, network access, or the FastAPI server to be
running. It only needs Python. Run it with:

    python simulation/main.py

Commands (type and press Enter):
    a  / astra   -> simulate ASTRA wake word being detected -> triggers SOS
    m  / manual  -> trigger SOS manually (panic-button fallback)
    s  / status  -> show all SOS events triggered so far in this run
    r  / reset   -> clear all simulated events
    q  / quit    -> exit

Every action is deterministic and does not depend on real speech
recognition, matching the "extremely reliable for an SIH presentation"
requirement.
"""
from __future__ import annotations

import sys
from pathlib import Path

# Allow running as `python simulation/main.py` from the project root without
# needing the project installed as a package.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.sos_handler import sos_handler  # noqa: E402  (import after sys.path fix)

BANNER = r"""
=====================================================
   ASTRA — SIH DEMONSTRATION SIMULATION (terminal)
   No microphone. No network required. Deterministic.
=====================================================
"""

HELP = """Commands:
  a / astra   simulate ASTRA wake word detected -> SOS
  m / manual  trigger SOS manually (panic button)
  s / status  list SOS events triggered this session
  r / reset   clear simulated events
  h / help    show this help
  q / quit    exit
"""


def simulate_astra_detection() -> None:
    print('>> Simulating: "help me ASTRA!"')
    event = sos_handler.trigger_sos(
        trigger_source="simulation",
        transcript="help me astra",
        confidence=None,
    )
    print_event(event)


def simulate_manual() -> None:
    print(">> Manual SOS trigger (panic button fallback)")
    event = sos_handler.trigger_sos(trigger_source="manual")
    print_event(event)


def print_event(event) -> None:
    print(f"   SOS TRIGGERED -> id={event.id} source={event.trigger_source} "
          f"time={event.triggered_at.isoformat()}")


def show_status() -> None:
    events = sos_handler.list_events()
    if not events:
        print("   (no SOS events yet)")
        return
    for e in events:
        print(f"   #{e.id} [{e.trigger_source}] {e.triggered_at.isoformat()} — {e.transcript or '(manual)'}")


def reset() -> None:
    sos_handler.reset()
    print("   Simulation state reset.")


def main() -> None:
    print(BANNER)
    print(HELP)
    while True:
        try:
            raw = input("astra-sim> ").strip().lower()
        except (EOFError, KeyboardInterrupt):
            print("\nExiting.")
            break

        if raw in ("a", "astra"):
            simulate_astra_detection()
        elif raw in ("m", "manual"):
            simulate_manual()
        elif raw in ("s", "status"):
            show_status()
        elif raw in ("r", "reset"):
            reset()
        elif raw in ("h", "help", ""):
            print(HELP)
        elif raw in ("q", "quit", "exit"):
            print("Exiting.")
            break
        else:
            print(f"   Unknown command: {raw!r} — type 'h' for help.")


if __name__ == "__main__":
    main()
