# 🛡️ DURGA --- Dynamic Unified Risk-Awareness Guardian AI

> **AI-powered women's safety and risk-awareness platform developed for
> Smart India Hackathon 2026**

DURGA (**Dynamic Unified Risk-Awareness Guardian AI**) is a proactive
women's safety system designed to help users understand changing safety
conditions, receive timely warnings, and trigger emergency assistance
even when manually requesting help may not be possible.

The project combines **AI-based risk awareness, GIS/H3-based dynamic
safety zones, location-aware monitoring, voice activation, autonomous
SOS concepts, emergency assistance, and offline safety support** into a
unified safety ecosystem.

------------------------------------------------------------------------

## 🏆 Smart India Hackathon 2026

  ---------------------------------------------------------------------
  Detail                             Information
  ---------------------------------- ----------------------------------
  **Problem Statement**              From Uncertainty to Awareness:
                                     Addressing Women's Safety
                                     Challenges

  **Theme**                          AI-Powered Women's Safety & Risk
                                     Awareness

  **PS Category**                    Software & Hardware

  **Problem Statement ID**           Student Innovation

  **Team ID**                        151101

  **Team Name**                      ASTRA

  **Project**                        DURGA
  ---------------------------------------------------------------------

------------------------------------------------------------------------

## 📌 Table of Contents

-   [About DURGA](#-about-durga)
-   [Problem Statement](#-problem-statement)
-   [Our Solution](#-our-solution)
-   [Key Features](#-key-features)
-   [How It Works](#-how-it-works)
-   [Dynamic Risk-Zone Concept](#-dynamic-risk-zone-concept)
-   [ASTRA Voice SOS](#-astra-voice-sos)
-   [System Architecture](#-system-architecture)
-   [Technology Stack](#-technology-stack)
-   [Repository Structure](#-repository-structure)
-   [Getting Started](#-getting-started)
-   [Running the Application](#-running-the-application)
-   [API Endpoints](#-api-endpoints)
-   [Environment Configuration](#-environment-configuration)
-   [Testing](#-testing)
-   [Project Status](#-project-status)
-   [Future Scope](#-future-scope)
-   [Impact](#-impact)
-   [References](#-references)
-   [Team](#-team)
-   [Disclaimer](#-safety--privacy-note)

------------------------------------------------------------------------

## 🚨 About DURGA

Traditional women's safety systems are often **reactive**. In many
situations, the user must recognize the danger and manually request help
after a threat has already occurred.

DURGA is designed around a more proactive approach.

The system aims to continuously understand the surrounding risk level,
communicate that risk clearly, and provide emergency support when a user
may not be able to manually raise an alarm.

### Core idea

``` text
Location + Crime/Risk Data
          ↓
     H3 Hex Indexing
          ↓
   Risk Aggregation
          ↓
      Rule Engine
          ↓
 Dynamic Risk Classification
          ↓
 Green / Orange / Red Zone
          ↓
 Risk Awareness + Emergency Support
```

------------------------------------------------------------------------

## ❗ Problem Statement

Women can face safety risks while:

-   travelling through unfamiliar locations
-   moving through public spaces
-   entering crime-prone areas
-   travelling alone
-   experiencing rapidly changing local conditions

Existing safety solutions can be limited because they may depend on:

1.  the user manually identifying a threat
2.  the user manually pressing an emergency button
3.  static crime maps that do not represent changing local risk

DURGA addresses this gap by proposing an intelligent, location-aware and
proactive safety ecosystem.

------------------------------------------------------------------------

## 💡 Our Solution

DURGA combines multiple safety mechanisms into one platform:

-   **AI-based risk prediction**
-   **GIS and H3-based spatial risk mapping**
-   **Dynamic Green / Orange / Red safety zones**
-   **Location-aware risk monitoring**
-   **ASTRA voice activation**
-   **Inactivity-based emergency detection**
-   **Autonomous SOS alert concepts**
-   **Nearby police and hospital identification**
-   **Offline safety support**

The goal is to provide useful safety awareness **before**, **during**,
and **after** a potentially dangerous situation.

------------------------------------------------------------------------

## ✨ Key Features

### 🗺️ Dynamic Safety Zones

Locations are represented using three risk levels:

-   🟢 **Green --- Safe**
-   🟠 **Orange --- Caution**
-   🔴 **Red --- High Risk**

The risk classification is designed to change according to available
crime/risk information rather than relying only on a fixed map.

### 🤖 AI-Based Risk Awareness

The proposed system analyzes available crime and location information to
identify changing risk levels and provide proactive safety information.

### 📍 Location-Aware Monitoring

The user's location can be used to understand the surrounding risk area
and support timely safety actions.

### 🎙️ ASTRA Voice Activation

ASTRA provides a voice-based emergency trigger. The current repository
contains the FastAPI implementation for detecting the **ASTRA** wake
word and creating an SOS event.

### 🚨 SOS Support

The system supports:

-   voice-triggered SOS
-   manual SOS fallback
-   SOS event recording
-   optional webhook-based integration with a DURGA backend

### 🏥 Nearby Emergency Assistance

The overall DURGA concept includes identifying nearby:

-   police stations
-   hospitals
-   emergency support locations

### 📵 Offline Safety Support

The proposed system also considers safety guidance and essential support
when normal network availability is limited.

------------------------------------------------------------------------

## ⚙️ How It Works

### Step 1 --- Location

The user's latitude and longitude are obtained.

### Step 2 --- H3 Indexing

The location is converted into an **H3 hexagonal index**.

### Step 3 --- Risk Aggregation

Relevant crime/risk information is aggregated for the corresponding
spatial area.

### Step 4 --- Risk Rules

Rules are applied to the aggregated information.

### Step 5 --- Risk Classification

The area is classified as:

``` text
🟢 Green  → Safe
🟠 Orange → Caution
🔴 Red    → High Risk
```

### Step 6 --- Safety Response

Depending on the situation, the platform can provide:

-   risk awareness
-   alerts
-   emergency assistance
-   SOS triggering
-   nearby emergency-location information

------------------------------------------------------------------------

## 🧭 Dynamic Risk-Zone Concept

The core spatial processing flow is:

``` text
[ Latitude, Longitude ]
          │
          ▼
[ H3 Hex Index ]
          │
          ▼
[ Aggregate Risk Metrics ]
          │
          ▼
[ Apply Risk Rules ]
          │
          ▼
[ Assign Risk Color ]
          │
     ┌────┼────┐
     ▼    ▼    ▼
  Green Orange Red
   Safe Caution High Risk
```

H3-based indexing allows geographic locations to be represented as
consistent hexagonal cells, making it suitable for spatial aggregation
and risk visualization.

------------------------------------------------------------------------

## 🎙️ ASTRA Voice SOS

ASTRA is the voice-triggered emergency component of the project.

The current implementation provides two modes:

### 1. Real Voice Mode

The `/` route uses a browser microphone and the Web Speech API to listen
for the configured wake word.

### 2. SIH Demonstration Simulation

The `/simulate` route provides a deterministic demonstration mode that
does not require microphone or speech recognition.

Both modes use the same backend detection endpoint:

``` text
POST /api/astra/detect
```

The current implementation checks whether the configured wake word is
present in the recognized transcript. For real voice input, a minimum
confidence threshold is also applied.

### SOS Flow

``` text
User speaks "ASTRA"
        ↓
Browser Speech Recognition
        ↓
Transcript + Confidence
        ↓
/api/astra/detect
        ↓
Wake Word Check
        ↓
Confidence Check (Real Mode)
        ↓
SOS Event Created
        ↓
Local Event Log
        ↓
Optional DURGA Webhook
```

A manual panic-button endpoint is also available as a fallback.

------------------------------------------------------------------------

## 🏗️ System Architecture

The current repository is organized around a FastAPI application:

``` text
                    ┌─────────────────────┐
                    │     User / Demo     │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
          Real Voice Mode              Simulation Mode
              "/"                       "/simulate"
                 │                           │
                 └─────────────┬─────────────┘
                               ▼
                    ┌─────────────────────┐
                    │    FastAPI Server   │
                    └──────────┬──────────┘
                               │
                               ▼
                    /api/astra/detect
                               │
                               ▼
                    ┌─────────────────────┐
                    │ ASTRA Detection     │
                    │ + Confidence Check  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ DURGA SOS Handler   │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
          Local Event Log             Optional Webhook
```

------------------------------------------------------------------------

## 🛠️ Technology Stack

### Backend

-   Python
-   FastAPI
-   Uvicorn
-   Pydantic
-   Pydantic Settings
-   Jinja2
-   HTTPX

### Frontend / Browser Capabilities

-   HTML
-   JavaScript
-   Browser Web Speech API
-   Browser microphone access for real voice mode

### Testing

-   Pytest

### Spatial / Safety Architecture

-   GIS concepts
-   H3-based spatial indexing
-   Dynamic risk classification
-   Location-aware safety monitoring

> The repository's current dependency file specifically defines the
> Python/FastAPI stack above. The wider DURGA proposal also includes the
> GIS/H3 risk-mapping architecture.

------------------------------------------------------------------------

## 📁 Repository Structure

``` text
SIH-2026-/
│
├── app/
│   ├── main.py
│   ├── config.py
│   ├── models.py
│   ├── sos_handler.py
│   ├── static/
│   └── templates/
│
├── simulation/
│
├── tests/
│
├── requirements.txt
├── run.bat
└── README.md
```

### Important files

  ---------------------------------------------------------------------
  File / Folder                      Purpose
  ---------------------------------- ----------------------------------
  `app/main.py`                      FastAPI application, routes and
                                     ASTRA detection API

  `app/config.py`                    Environment-based application
                                     configuration

  `app/models.py`                    Request/response and SOS event
                                     models

  `app/sos_handler.py`               SOS event handling and DURGA
                                     integration point

  `app/templates/`                   Web interfaces for real and
                                     simulation modes

  `app/static/`                      Frontend static assets

  `simulation/`                      Demonstration/simulation
                                     components

  `tests/`                           Automated tests

  `requirements.txt`                 Python dependencies

  `run.bat`                          Windows one-command launcher
  ---------------------------------------------------------------------

------------------------------------------------------------------------

# 🚀 Getting Started

## Prerequisites

The current repository is configured for Python **3.14.x**.

You will need:

-   Python
-   Git
-   pip
-   A modern Chromium-based browser such as Chrome or Edge for real
    voice mode

------------------------------------------------------------------------

## 1. Clone the Repository

``` bash
git clone https://github.com/kadiadevam20/SIH-2026-.git
cd SIH-2026-
```

------------------------------------------------------------------------

## 2. Create a Virtual Environment

### Windows

``` bash
py -3.14 -m venv .venv
```

Activate it:

``` bash
.venv\Scripts\activate
```

### macOS / Linux

``` bash
python3 -m venv .venv
source .venv/bin/activate
```

------------------------------------------------------------------------

## 3. Install Dependencies

``` bash
pip install -r requirements.txt
```

The project uses pinned Python dependencies, including FastAPI,
Pydantic, Uvicorn, Jinja2, HTTPX, python-dotenv and Pytest.

------------------------------------------------------------------------

# ▶️ Running the Application

## Option 1 --- Windows One-Command Launcher

After creating `.venv` and installing the dependencies:

``` bash
run.bat
```

The launcher starts the server at:

``` text
http://127.0.0.1:8000
```

------------------------------------------------------------------------

## Option 2 --- Start Manually

``` bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Then open:

``` text
http://127.0.0.1:8000
```

------------------------------------------------------------------------

## 🎙️ Real Voice Mode

Open:

``` text
http://127.0.0.1:8000/
```

Allow microphone access when the browser asks.

The application uses the browser's Web Speech API to recognize speech
and detect the configured wake word.

------------------------------------------------------------------------

## 🧪 SIH Demonstration Mode

Open:

``` text
http://127.0.0.1:8000/simulate
```

This mode is designed for reliable demonstrations and does not require
microphone input.

------------------------------------------------------------------------

## 📚 API Documentation

FastAPI automatically provides interactive API documentation.

Open:

``` text
http://127.0.0.1:8000/docs
```

Health check:

``` text
http://127.0.0.1:8000/healthz
```

------------------------------------------------------------------------

# 🔌 API Endpoints

  -----------------------------------------------------------------------
  Method                  Endpoint                Purpose
  ----------------------- ----------------------- -----------------------
  `GET`                   `/`                     Real ASTRA voice
                                                  interface

  `GET`                   `/simulate`             SIH demonstration
                                                  interface

  `GET`                   `/healthz`              Application health
                                                  check

  `POST`                  `/api/astra/detect`     Detect ASTRA wake word
                                                  and trigger SOS

  `POST`                  `/api/sos/manual`       Manual SOS trigger

  `GET`                   `/api/sos/events`       View recorded SOS
                                                  events

  `POST`                  `/api/sos/reset`        Reset recorded SOS
                                                  events
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# ⚙️ Environment Configuration

The application reads configuration from `.env`.

Important settings include:

``` env
HOST=127.0.0.1
PORT=8000
WAKE_WORD=astra
MIN_CONFIDENCE=0.55
SOS_WEBHOOK_URL=
EVENT_LOG_PATH=astra_events.log
```

### Configuration details

  Variable            Purpose
  ------------------- ---------------------------------------------
  `HOST`              Server host
  `PORT`              Server port
  `WAKE_WORD`         Voice wake word
  `MIN_CONFIDENCE`    Minimum confidence for real voice detection
  `SOS_WEBHOOK_URL`   Optional DURGA SOS webhook
  `EVENT_LOG_PATH`    Local SOS event log location

No paid API key is required by the current ASTRA module.

------------------------------------------------------------------------

# 🧪 Testing

The repository includes a Pytest-based test suite.

Run:

``` bash
pytest
```

For more detailed output:

``` bash
pytest -v
```

------------------------------------------------------------------------

# 📊 Project Status

### Current Prototype

The current repository contains a working **ASTRA voice-SOS module**
supporting:

-   FastAPI backend
-   real browser voice mode
-   SIH simulation mode
-   ASTRA wake-word detection
-   confidence checking for real voice input
-   manual SOS fallback
-   SOS event storage
-   append-only JSON event logging
-   optional HTTP webhook integration
-   automated tests
-   FastAPI Swagger documentation

### DURGA Integration

The SOS handler contains a clearly defined integration point for
connecting ASTRA to the wider DURGA emergency-response pipeline.

The integration layer is intentionally kept narrow so the actual DURGA
SOS service can be connected without rewriting the ASTRA frontend or
detection logic.

------------------------------------------------------------------------

# 🔮 Future Scope

The broader DURGA platform can be extended with:

### AI & Risk Intelligence

-   improved crime-risk prediction
-   real-time risk scoring
-   predictive safety alerts
-   continuous location-aware risk analysis

### GIS & Mapping

-   live dynamic risk maps
-   H3-based geographic aggregation
-   safer-route recommendations
-   real-time risk-zone updates

### Emergency Response

-   direct emergency-contact notification
-   police and hospital integration
-   real-time location sharing
-   autonomous emergency escalation
-   emergency response coordination

### Offline Safety

-   offline safety instructions
-   cached emergency information
-   low-connectivity emergency workflows

### Platform Expansion

-   mobile application
-   stronger authentication and privacy controls
-   analytics dashboard
-   larger-scale crime/risk datasets
-   integration with verified government and emergency data sources

------------------------------------------------------------------------

# 🌍 Impact

DURGA aims to move women's safety from a purely **reactive model**
toward a more **proactive and intelligent model**.

### Expected benefits

-   Better awareness of surrounding risk
-   Earlier warnings in potentially unsafe areas
-   Reduced dependence on manual SOS actions
-   Faster access to emergency assistance
-   Better use of geographic and crime information
-   Support for users who may be unable to manually request help

The project is designed around the idea:

> **Understand the risk. Warn the user. Act when help is needed.**

------------------------------------------------------------------------

# 📚 References

The project proposal references the following resources:

-   **National Crime Records Bureau (NCRB)** --- Crime data and
    resources\
    https://www.ncrb.gov.in/

-   **BBC --- Crime in Indian States**\
    https://www.bbc.com/news/world-asia-india-62830634

-   **GitHub Repository**\
    https://github.com/kadiadevam20/SIH-2026-

-   **Project Report**\
    https://drive.google.com/file/d/1nCsZ6qXC_HA4orDN4ygqlU3raagHJCuK/view?usp=sharing

-   **Project Video**\
    https://youtu.be/gC2sXfnTCAY

-   **Digital Personal Data Protection Act, 2023 --- Ministry of
    Electronics and Information Technology**

-   **MDN Web Docs --- Web Speech API**\
    https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

------------------------------------------------------------------------

# 👥 Team

### Team ASTRA

**Team ID:** 151101

**Smart India Hackathon 2026**

The project was developed as a student innovation focused on AI-powered
women's safety and risk awareness.

------------------------------------------------------------------------

# 🔐 Safety & Privacy Note

DURGA is a research and hackathon prototype. Safety classifications and
automated SOS mechanisms should not be treated as guaranteed emergency
detection.

Real-world deployment should include:

-   verified emergency-service integrations
-   strong authentication
-   secure handling of location data
-   privacy-preserving data storage
-   false-positive and false-negative testing
-   reliable network and offline fallback mechanisms
-   compliance with applicable data-protection and safety requirements

------------------------------------------------------------------------

# 📄 License

No explicit open-source license is currently specified in the
repository.

If this project is released publicly for reuse, an appropriate license
should be added to the repository.

------------------------------------------------------------------------

::: {align="center"}
### 🛡️ DURGA --- Dynamic Unified Risk-Awareness Guardian AI

**From Uncertainty to Awareness**

**Built for Smart India Hackathon 2026 🇮🇳**
:::
