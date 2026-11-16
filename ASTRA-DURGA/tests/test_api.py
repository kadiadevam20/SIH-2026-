from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_index_page_loads():
    res = client.get("/")
    assert res.status_code == 200
    assert "ASTRA" in res.text


def test_simulate_page_loads():
    res = client.get("/simulate")
    assert res.status_code == 200
    assert "Simulation" in res.text


def test_healthz():
    res = client.get("/healthz")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_detect_without_wake_word_does_not_trigger_sos():
    res = client.post(
        "/api/astra/detect",
        json={"transcript": "hello there, how are you", "confidence": 0.95, "source": "real"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["wake_word_detected"] is False
    assert data["sos_triggered"] is False


def test_detect_real_source_with_low_confidence_does_not_trigger_sos():
    res = client.post(
        "/api/astra/detect",
        json={"transcript": "help me astra", "confidence": 0.1, "source": "real"},
    )
    data = res.json()
    assert data["wake_word_detected"] is True
    assert data["sos_triggered"] is False


def test_detect_real_source_with_high_confidence_triggers_sos():
    res = client.post(
        "/api/astra/detect",
        json={"transcript": "help me astra please", "confidence": 0.9, "source": "real"},
    )
    data = res.json()
    assert data["sos_triggered"] is True
    assert data["event"]["trigger_source"] == "real"


def test_detect_simulation_source_ignores_confidence():
    res = client.post(
        "/api/astra/detect",
        json={"transcript": "help me astra", "source": "simulation"},
    )
    data = res.json()
    assert data["sos_triggered"] is True
    assert data["event"]["trigger_source"] == "simulation"


def test_manual_sos_endpoint_triggers_sos():
    res = client.post("/api/sos/manual")
    data = res.json()
    assert data["sos_triggered"] is True
    assert data["event"]["trigger_source"] == "manual"


def test_events_list_and_reset_roundtrip():
    client.post("/api/sos/manual")
    listing = client.get("/api/sos/events").json()
    assert listing["count"] == 1

    client.post("/api/sos/reset")
    listing_after_reset = client.get("/api/sos/events").json()
    assert listing_after_reset["count"] == 0
