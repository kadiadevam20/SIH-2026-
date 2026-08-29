/**
 * ASTRA — REAL VOICE MODE
 *
 * Uses the browser's native Web Speech API (SpeechRecognition /
 * webkitSpeechRecognition). This is free, ships with Chromium-based
 * browsers, and requires no API key and no Python speech-recognition
 * dependency — which is the most reliable free/open path available for
 * always-on browser wake-word listening.
 *
 * Only Chrome and Microsoft Edge (desktop) reliably support this API as of
 * this writing. Firefox and Safari support is partial or absent — this is
 * called out explicitly in the UI and in the README's Limitations section.
 */

const WAKE_WORD = (window.ASTRA_WAKE_WORD || "astra").toLowerCase();

const micBtn = document.getElementById("mic-btn");
const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");
const transcriptBox = document.getElementById("transcript-box");
const sosBanner = document.getElementById("sos-banner");
const warnBox = document.getElementById("warn-box");
const eventsList = document.getElementById("events-list");

let recognition = null;
let listening = false;

function setStatus(state, text) {
  statusDot.className = "dot" + (state ? " " + state : "");
  statusText.textContent = text;
}

function showSOS(event) {
  sosBanner.classList.add("show");
  sosBanner.textContent = `SOS TRIGGERED — event #${event.id} (${event.trigger_source})`;
  setStatus("triggered", "SOS triggered");
}

async function sendToBackend(transcript, confidence) {
  const res = await fetch("/api/astra/detect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript, confidence, source: "real" }),
  });
  const data = await res.json();
  if (data.sos_triggered) {
    showSOS(data.event);
    refreshEvents();
  }
  return data;
}

function refreshEvents() {
  fetch("/api/sos/events")
    .then((r) => r.json())
    .then((data) => {
      eventsList.innerHTML = "";
      data.events
        .slice()
        .reverse()
        .forEach((e) => {
          const row = document.createElement("div");
          row.className = "event-row";
          row.textContent = `#${e.id} [${e.trigger_source}] ${e.triggered_at} — ${e.transcript || "(manual)"}`;
          eventsList.appendChild(row);
        });
    });
}

function initRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    warnBox.classList.add("show");
    warnBox.textContent =
      "Your browser does not support the Web Speech API. Please use Google Chrome or Microsoft Edge for REAL ASTRA VOICE MODE, or use the Simulation page instead.";
    micBtn.disabled = true;
    return null;
  }

  const rec = new SpeechRecognition();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = "en-US";

  rec.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      const text = result[0].transcript;
      const confidence = result[0].confidence;
      if (result.isFinal) {
        transcriptBox.textContent = text;
        sendToBackend(text, confidence);
      } else {
        interim += text;
      }
    }
    if (interim) transcriptBox.textContent = interim;
  };

  rec.onerror = (event) => {
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      warnBox.classList.add("show");
      warnBox.textContent =
        "Microphone permission was denied. Allow microphone access in your browser's site settings and reload the page.";
      stopListening();
    } else if (event.error === "no-speech") {
      // benign — recognition restarts automatically via onend
    } else {
      warnBox.classList.add("show");
      warnBox.textContent = "Speech recognition error: " + event.error;
    }
  };

  rec.onend = () => {
    // Chrome auto-stops after a period of silence; restart while "listening" is on
    // so the mic behaves like a continuous wake-word detector.
    if (listening) {
      try {
        rec.start();
      } catch (e) {
        /* already starting — ignore */
      }
    }
  };

  return rec;
}

function startListening() {
  if (!recognition) recognition = initRecognition();
  if (!recognition) return;
  listening = true;
  try {
    recognition.start();
  } catch (e) {
    /* ignore double-start errors */
  }
  micBtn.classList.add("listening");
  micBtn.textContent = "\u23F9"; // stop icon
  setStatus("listening", `Listening for "${WAKE_WORD.toUpperCase()}"...`);
  warnBox.classList.remove("show");
}

function stopListening() {
  listening = false;
  if (recognition) recognition.stop();
  micBtn.classList.remove("listening");
  micBtn.textContent = "\u{1F3A4}"; // mic icon
  setStatus("", "Idle");
}

micBtn.addEventListener("click", () => {
  if (listening) stopListening();
  else startListening();
});

document.getElementById("manual-sos-btn").addEventListener("click", async () => {
  const res = await fetch("/api/sos/manual", { method: "POST" });
  const data = await res.json();
  if (data.sos_triggered) {
    showSOS(data.event);
    refreshEvents();
  }
});

document.getElementById("reset-btn").addEventListener("click", async () => {
  await fetch("/api/sos/reset", { method: "POST" });
  sosBanner.classList.remove("show");
  transcriptBox.textContent = "";
  setStatus(listening ? "listening" : "", listening ? "Listening..." : "Idle");
  refreshEvents();
});

refreshEvents();
