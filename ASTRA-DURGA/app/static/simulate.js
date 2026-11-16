/**
 * SIH DEMONSTRATION SIMULATION
 *
 * Deliberately does NOT use the microphone or any speech recognition.
 * Every action here is a deterministic button click, so it is safe to run
 * on stage regardless of ambient noise, mic hardware, or browser support.
 */

const WAKE_WORD = (window.ASTRA_WAKE_WORD || "astra").toUpperCase();
const sosBanner = document.getElementById("sos-banner");
const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");
const eventsList = document.getElementById("events-list");

function setStatus(state, text) {
  statusDot.className = "dot" + (state ? " " + state : "");
  statusText.textContent = text;
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

async function simulateAstra() {
  setStatus("listening", `Simulating: "Help me, ${WAKE_WORD}!"`);
  const res = await fetch("/api/astra/detect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transcript: `help me ${WAKE_WORD.toLowerCase()}`,
      source: "simulation",
    }),
  });
  const data = await res.json();
  if (data.sos_triggered) {
    sosBanner.classList.add("show");
    sosBanner.textContent = `SOS TRIGGERED — event #${data.event.id} (simulation)`;
    setStatus("triggered", "SOS triggered (simulated)");
    refreshEvents();
  }
}

async function reset() {
  await fetch("/api/sos/reset", { method: "POST" });
  sosBanner.classList.remove("show");
  setStatus("", "Idle");
  refreshEvents();
}

document.getElementById("simulate-btn").addEventListener("click", simulateAstra);
document.getElementById("reset-btn").addEventListener("click", reset);

refreshEvents();
setStatus("", "Idle (simulation — no microphone used)");
