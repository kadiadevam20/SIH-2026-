from app.sos_handler import sos_handler


def test_trigger_sos_creates_event_with_expected_fields():
    event = sos_handler.trigger_sos(trigger_source="simulation", transcript="help me astra", confidence=0.9)

    assert event.id == 1
    assert event.trigger_source == "simulation"
    assert event.transcript == "help me astra"
    assert event.confidence == 0.9
    assert event.message


def test_events_accumulate_and_ids_increment():
    e1 = sos_handler.trigger_sos(trigger_source="manual")
    e2 = sos_handler.trigger_sos(trigger_source="manual")

    events = sos_handler.list_events()
    assert [e.id for e in events] == [e1.id, e2.id]
    assert e2.id == e1.id + 1


def test_reset_clears_events_and_id_counter():
    sos_handler.trigger_sos(trigger_source="manual")
    sos_handler.reset()

    assert sos_handler.list_events() == []

    # id counter restarts from 1 after a reset
    event = sos_handler.trigger_sos(trigger_source="manual")
    assert event.id == 1


def test_trigger_sos_writes_to_event_log(tmp_path):
    original_path = sos_handler._settings.EVENT_LOG_PATH  # noqa: SLF001
    sos_handler._log_path = tmp_path / "events.log"  # noqa: SLF001
    try:
        sos_handler.trigger_sos(trigger_source="manual")
        assert sos_handler._log_path.exists()  # noqa: SLF001
        content = sos_handler._log_path.read_text(encoding="utf-8")  # noqa: SLF001
        assert '"trigger_source":"manual"' in content.replace(" ", "")
    finally:
        sos_handler._log_path = sos_handler._settings.EVENT_LOG_PATH  # type: ignore  # noqa: SLF001
        from pathlib import Path

        sos_handler._log_path = Path(original_path)  # noqa: SLF001
