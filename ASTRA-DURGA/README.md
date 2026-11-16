# ASTRA — Voice SOS Module for DURGA

A voice wake-word ("**ASTRA**") detection module that raises an SOS event,
built to be integrated into the existing **DURGA** safety application.
Includes a reliable, deterministic simulation mode for SIH judge
presentations that never depends on real speech recognition working on
stage.

---

## 1. Project Overview

**ASTRA** listens for the spoken wake word "ASTRA" and, when detected,
raises an **SOS event**. This project delivers that detection + event
pipeline as a standalone, testable module with a clean integration
contract, so the DURGA frontend/backend developer can wire it into
DURGA's real alerting system without needing to touch ASTRA's internals.

Two independent listening surfaces are provided:

- **PRODUCTION ASTRA MODULE** (`/`) — real microphone + browser speech
  recognition (Web Speech API). This is the actual voice-detection
  feature.
- **SIH DEMONSTRATION SIMULATION** (`/simulate` and `simulation/main.py`)
  — deterministic, no microphone, built purely so a live demo cannot fail
  due to ambient noise, mic hardware, or browser quirks.

## 2. Architecture

```
   [Browser microphone]                    [Presenter's keyboard/click]
          |                                            |
          v                                            v
  ASTRA Voice Detection                    SIH Simulation (deterministic)
  (Web Speech API, JS)                     (web buttons OR terminal CLI)
          |                                            |
          +---------------------+---------------------+
                                |
                                v
                  POST /api/astra/detect (FastAPI)
                                |
                     wake-word match? (case-insensitive)
                                |
                                v
                    app/sos_handler.py : DurgaSOSHandler
                          .trigger_sos()
                                |
                +---------------+----------------+
                |                                |
                v                                v
     Local event store + JSON log     [INTEGRATION POINT]
     (astra_events.log, in-memory)     -> real DURGA SOS pipeline
                                          (to be wired in by the
                                           DURGA developer — see
                                           app/sos_handler.py)
```

`app/sos_handler.py` is the single, narrow integration surface. The rest
of ASTRA (frontend, API, simulation) never needs to change when DURGA's
real SOS pipeline is wired in.

## 3. Requirements

- Windows 10/11 (primary supported OS for these instructions; the app
  itself is cross-platform since it's plain Python + a browser)
- **Python 3.14.3**
- Google Chrome or Microsoft Edge (desktop) — required only for **REAL
  ASTRA VOICE MODE**, because only Chromium-based browsers reliably
  support the Web Speech API. The simulation mode works in any browser.
- No Node.js, Git, or FFmpeg required. No paid API key required.

## 4. Installation

```text
1. Extract ASTRA-DURGA.zip and open a terminal in the extracted folder.

2. Verify Python:
   python --version
   (should report Python 3.14.3 — see section 5 if it does not)

3. Create the virtual environment:
   py -3.14 -m venv .venv

4. Activate it:
   .venv\Scripts\activate

5. Upgrade pip:
   python -m pip install --upgrade pip

6. Install dependencies:
   pip install -r requirements.txt

7. Configure environment:
   copy .env.example .env

8. Start the application:
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

9. Open the application:
   http://127.0.0.1:8000/

10. Click the microphone button, allow microphone access, and say:
    "ASTRA"

11. Verify:
    ASTRA detected -> SOS triggered (a red banner appears on the page)
```

## 5. Virtual Environment (detail)

**If `py` is available (standard Windows installer):**

```bash
py -3.14 -m venv .venv
.venv\Scripts\activate
python --version
```

**If only `python` is on PATH (no `py` launcher):**

```bash
python -m venv .venv
.venv\Scripts\activate
python --version
```

Either way, `python --version` after activation must report:

```text
Python 3.14.3
```

If it reports a different version, you likely have multiple Python
installs; use `py -0p` to list them and `py -3.14 -m venv .venv` to
target 3.14.3 specifically. Only downgrade Python if 3.14.3 is genuinely
unavailable on your machine — it is not required by anything in this
project.

## 6. Running the Application

```bash
.venv\Scripts\activate
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Or use the one-command script from the project root (after the venv and
`.env` already exist):

```bash
run.bat
```

Open:

- Real voice mode: `http://127.0.0.1:8000/`
- Simulation mode: `http://127.0.0.1:8000/simulate`
- API docs (Swagger UI): `http://127.0.0.1:8000/docs`

To stop: press `CTRL+C` in the terminal running uvicorn.

## 7. Running the SIH Simulation

Two independent ways to run the simulation — use whichever is safer for
your presentation setup.

**A. Web simulation (visual, for the projector):**

```bash
.venv\Scripts\activate
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Then open `http://127.0.0.1:8000/simulate` and click **"Simulate saying
ASTRA"**. This never touches the microphone.

**B. Standalone terminal simulation (backup, needs nothing but Python):**

```bash
.venv\Scripts\activate
python simulation/main.py
```

Then type `a` and press Enter to simulate ASTRA detection, `s` for
status, `r` to reset, `q` to quit. This does not require the web server
to be running at all — it is the most failure-proof fallback for a live
demo.

**Resetting the simulation:** click "Reset demo" on the web page, or type
`r` in the terminal simulation, or `POST /api/sos/reset`.

**Stopping:** `CTRL+C` in either terminal.

## 8. Testing Real ASTRA Detection

1. Start the app (section 6) and open `http://127.0.0.1:8000/`.
2. Click the microphone button and allow microphone access when prompted.
3. Say a sentence containing the word "ASTRA", e.g. *"Help me, ASTRA!"*
4. The transcript box updates live; once Chrome finalizes that phrase,
   ASTRA checks it for the wake word and, if the recognizer's confidence
   is at or above `MIN_CONFIDENCE` (default `0.55`), triggers SOS.
5. A red **SOS TRIGGERED** banner appears and the event is listed below.
6. If speech recognition misfires on stage, use the **"Manual SOS (panic
   button)"** button — it bypasses voice entirely and triggers the same
   SOS pipeline.

This is intentionally kept separate from the simulation (section 7) so
judges can see both: the real capability, and a guaranteed-reliable
fallback.

## 9. Frontend Developer Integration

The DURGA frontend/backend developer needs only these two things:

1. **`app/sos_handler.py`** — open `DurgaSOSHandler.trigger_sos()`. There
   is a clearly marked `# INTEGRATION POINT` block with an example of
   what a call into DURGA's real SOS pipeline might look like. Replace it
   with a call into DURGA's actual alert/notification service. Nothing
   else in the project needs to change — the API and both frontends call
   this one method.
2. **`SOS_WEBHOOK_URL`** (optional, in `.env`) — if DURGA already exposes
   (or can expose) an HTTP endpoint, set this and every SOS event is
   POSTed to it as JSON automatically, with zero code changes.

Everything else (the `/`, `/simulate` pages, and `app/static/astra.js` /
`simulate.js`) is UI scaffolding for this standalone module and is not
required to be embedded in DURGA verbatim — DURGA's frontend developer
should feel free to restyle or re-embed the mic button / wake-word logic
into DURGA's existing UI, using `astra.js` as the reference implementation
of the wake-word detection logic.

## 10. Configuration

All configuration lives in `.env` (copy from `.env.example`):

| Variable          | Default              | Meaning                                                                 |
|--------------------|----------------------|--------------------------------------------------------------------------|
| `HOST`             | `127.0.0.1`          | Bind address for the server                                              |
| `PORT`             | `8000`                | Bind port for the server                                                 |
| `WAKE_WORD`        | `astra`               | Word ASTRA listens for (case-insensitive substring match)                |
| `MIN_CONFIDENCE`   | `0.55`                | Minimum recognizer confidence for a REAL detection to trigger SOS        |
| `SOS_WEBHOOK_URL`  | *(blank)*             | Optional: POST every SOS event as JSON to this URL                       |
| `EVENT_LOG_PATH`   | `astra_events.log`    | Local JSON-lines audit log of every SOS event                            |

## 11. Testing

```bash
.venv\Scripts\activate
pytest
```

This runs 15 tests covering:

- `tests/test_sos_handler.py` — the DURGA integration point (event
  creation, ID sequencing, reset, local log writing)
- `tests/test_api.py` — every HTTP endpoint, including wake-word
  matching, confidence thresholds, manual SOS, and event listing/reset
- `tests/test_simulation.py` — the standalone terminal simulation logic

## 12. Troubleshooting

| Problem | Fix |
|---|---|
| `python --version` doesn't show 3.14.3 | Use `py -3.14 -m venv .venv` instead of `python -m venv .venv`; run `py -0p` to see all installed versions. |
| `pip install -r requirements.txt` fails to build a wheel | Run `python -m pip install --upgrade pip` first (old pip can't find prebuilt wheels for a new Python version). All pinned packages in this project ship prebuilt wheels for 3.14 as of writing. |
| Microphone permission denied | Click the padlock/site-info icon in the browser address bar → Site settings → allow Microphone → reload the page. |
| "Your browser does not support the Web Speech API" | Use Chrome or Edge for real voice mode. Every other browser, and any browser at all, works fine for `/simulate`. |
| Speech recognition never finalizes / seems stuck | Chrome pauses recognition after long silence; the app auto-restarts it (`onend` handler). If it truly hangs, click the mic button twice (stop, then start). |
| `port already in use` | Another process is on 8000. Either stop it, or run `python -m uvicorn app.main:app --host 127.0.0.1 --port 8010` and open that port instead. |
| Virtual environment not activated (commands use system Python) | Your prompt should show `(.venv)`. Re-run `.venv\Scripts\activate`. |
| `.env` missing | `copy .env.example .env` — the app also runs with pure defaults if you skip this, since every setting has a default. |

## 13. Free-Tier Audit

- No paid API key is required anywhere in this project.
- Speech recognition uses the browser's built-in Web Speech API (free,
  no key, ships with Chrome/Edge).
- The backend is plain FastAPI + Uvicorn — free and open-source.
- The optional `SOS_WEBHOOK_URL` integration is a plain HTTP POST — no
  paid service involved, and it is entirely optional.
- All Python dependencies (`requirements.txt`) are free/open-source,
  actively maintained packages.

## 14. Limitations

Be aware of these before relying on this for anything beyond a
prototype/demo:

- **Browser-dependent**: real voice detection only works reliably in
  Chrome/Edge desktop. Firefox and Safari have partial or no support for
  the Web Speech API used here.
- **No background/lock-screen listening**: this is a web page. It can
  only listen while the tab is open and focused (or at least not
  suspended by the OS/browser); it cannot listen in the background like a
  native mobile app, and cannot listen while the phone is locked.
- **Network dependency for recognition**: Chrome's speech recognition
  sends audio to Google's servers for transcription (this is a property
  of the browser API itself, not of this codebase) — it requires an
  internet connection and is not fully private/offline.
- **Single-process, in-memory event store**: `DurgaSOSHandler` keeps
  events in memory plus an append-only local log file; it is not a
  database and is not designed for multiple server instances.
- **No authentication**: the API has no auth layer. Anyone who can reach
  the server can call `/api/sos/manual`. Fine for a local demo; not fine
  for a public deployment.
- **English wake-word matching only**: matching is a simple
  case-insensitive substring check on the recognized English transcript;
  it is not a trained wake-word/keyword-spotting model.

## 15. Future Production Improvements

Before this becomes a real emergency/safety feature in production:

- Replace the in-memory/local-log event store with a real database and
  wire `trigger_sos()` into DURGA's actual alerting/notification
  pipeline (contacts, push notifications, location sharing, etc.).
- Add authentication + per-user scoping to every endpoint, especially
  `/api/sos/manual` and `/api/sos/reset`.
- Consider a dedicated, trained wake-word model (e.g. an on-device
  keyword spotter) instead of full continuous speech-to-text, both for
  privacy (fully offline) and for battery/behavior on mobile.
- Add rate-limiting / duplicate-suppression so a noisy environment can't
  flood SOS events.
- Add HTTPS and proper CORS configuration before exposing this beyond
  `127.0.0.1`.
- Add structured logging/alerting for failed SOS deliveries (e.g. if
  `SOS_WEBHOOK_URL` is unreachable) so a failure never happens silently.
- Add a native mobile listening path (or a persistent companion app) if
  background/lock-screen wake-word detection becomes a real requirement,
  since a browser tab fundamentally cannot guarantee that.

---

### Directory structure

```text
ASTRA-DURGA/
├── app/
│   ├── __init__.py
│   ├── main.py           FastAPI app: routes, both frontends, API
│   ├── config.py          Settings (env-var driven, all optional)
│   ├── models.py          Pydantic request/response schemas
│   ├── sos_handler.py     DURGA integration point (see section 9)
│   ├── static/
│   │   ├── astra.js       Real voice mode (Web Speech API)
│   │   ├── simulate.js    SIH simulation (no microphone)
│   │   └── style.css
│   └── templates/
│       ├── index.html     Real voice mode page
│       └── simulate.html  SIH simulation page
├── simulation/
│   ├── __init__.py
│   └── main.py            Standalone terminal simulation (backup demo)
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_api.py
│   ├── test_simulation.py
│   └── test_sos_handler.py
├── requirements.txt
├── pytest.ini
├── run.bat
├── .env.example
├── .gitignore
└── README.md
```
