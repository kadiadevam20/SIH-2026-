from simulation.main import simulate_astra_detection, simulate_manual
from app.sos_handler import sos_handler


def test_simulate_astra_detection_triggers_one_sos_event(capsys):
    simulate_astra_detection()

    events = sos_handler.list_events()
    assert len(events) == 1
    assert events[0].trigger_source == "simulation"
    assert events[0].transcript == "help me astra"

    captured = capsys.readouterr()
    assert "SOS TRIGGERED" in captured.out


def test_simulate_manual_triggers_one_sos_event(capsys):
    simulate_manual()

    events = sos_handler.list_events()
    assert len(events) == 1
    assert events[0].trigger_source == "manual"

    captured = capsys.readouterr()
    assert "SOS TRIGGERED" in captured.out
