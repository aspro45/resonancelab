import { CONFIG } from "./config.js";

const $ = (id) => document.getElementById(id);

const sessions = [
  {
    code: "RL-102",
    title: "Warehouse dawn recording",
    venue: "Dock 7",
    kind: "field capture",
    status: "VERIFIED",
    verdict: "verified",
    accent: "#31d8d4",
    claim: "Recorder source, public venue note and calibration trail point to the same dawn session.",
    confidence: 91,
    source: 87,
    noise: 19,
    proofs: [["source", 87, "venue source"], ["cal", 94, "reference tone"], ["noise", 19, "floor risk"], ["audit", 14, "ledger rows"]],
    ledger: [
      ["register_session", "Session captured with public venue source."],
      ["add_signal_proof", "Field recorder note and public page attached."],
      ["add_calibration", "Reference tone logged before analysis."],
      ["analyze_session_with_genlayer", "GenLayer matched source and calibration trail."],
      ["press_record", "Signal pressed into the public ledger."],
    ],
  },
  {
    code: "RL-118",
    title: "Subway reverb map",
    venue: "Platform C",
    kind: "civic acoustic map",
    status: "CALIBRATED",
    verdict: "noisy",
    accent: "#ffb000",
    claim: "Transit platform impulse response appears consistent but source identity still needs a stronger public anchor.",
    confidence: 68,
    source: 61,
    noise: 47,
    proofs: [["source", 61, "station note"], ["cal", 76, "clap test"], ["noise", 47, "crowd floor"], ["audit", 8, "ledger rows"]],
    ledger: [
      ["register_session", "Reverb map opened with station source."],
      ["add_calibration", "Impulse response calibration logged."],
      ["open_analysis", "Analysis open, source identity still noisy."],
    ],
  },
  {
    code: "RL-144",
    title: "Night market ambience",
    venue: "Arcade line",
    kind: "ambient proof",
    status: "DISPUTED",
    verdict: "unverified",
    accent: "#ff4d8d",
    claim: "Ambient recording likely belongs to the listed night market, but timestamp and vendor row conflict.",
    confidence: 54,
    source: 49,
    noise: 62,
    proofs: [["source", 49, "event listing"], ["cal", 52, "device note"], ["noise", 62, "crowd blend"], ["audit", 11, "ledger rows"]],
    ledger: [
      ["register_session", "Market ambience session captured."],
      ["file_dispute", "Timestamp conflict filed against the event listing."],
      ["resolve_dispute_with_genlayer", "Resolver asked for another public anchor."],
    ],
  },
  {
    code: "RL-177",
    title: "Gallery tone sweep",
    venue: "Room 3",
    kind: "installation proof",
    status: "PRESSED",
    verdict: "verified",
    accent: "#b9ff4a",
    claim: "Tone sweep, wall note and calibration sequence match the installation session.",
    confidence: 96,
    source: 93,
    noise: 12,
    proofs: [["source", 93, "gallery note"], ["cal", 97, "sweep trace"], ["noise", 12, "low floor"], ["audit", 16, "ledger rows"]],
    ledger: [
      ["register_session", "Gallery tone sweep captured."],
      ["analyze_session_with_genlayer", "Source and calibration strongly aligned."],
      ["press_record", "Session pressed after analysis."],
    ],
  },
];

let selected = 0;
let t = 0;

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function pct(value) {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}

function short(addr) {
  if (!addr || /^0x0{40}$/i.test(addr)) return "Contract pending";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function current() {
  return sessions[selected];
}

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 3200);
}

function renderContractLink() {
  const link = $("contractLink");
  if (/^0x0{40}$/i.test(CONFIG.contractAddress)) {
    link.href = "#";
    link.textContent = "Contract pending";
    link.onclick = (event) => {
      event.preventDefault();
      toast("ResonanceLab contract is ready for deployment.");
    };
    return;
  }
  link.href = `${CONFIG.explorerBase}/contracts/${CONFIG.contractAddress}`;
  link.textContent = short(CONFIG.contractAddress);
  link.onclick = null;
}

function renderSessions() {
  $("sessionList").innerHTML = sessions.map((session, index) => `
    <button class="sessionButton ${index === selected ? "active" : ""}" style="--accent:${session.accent}" data-index="${index}" type="button">
      <span class="reel"></span>
      <span>
        <strong>${esc(session.title)}</strong>
        <small>${esc(session.code)} / ${esc(session.status)} / ${esc(session.venue)}</small>
      </span>
    </button>
  `).join("");
  document.querySelectorAll(".sessionButton").forEach((button) => {
    button.addEventListener("click", () => {
      selected = Number(button.dataset.index);
      render();
    });
  });
}

function renderScopeMeta() {
  const session = current();
  $("sessionCode").textContent = session.code;
  $("sessionTitle").textContent = session.title;
  $("sessionStatus").textContent = session.status;
  $("proofRack").style.setProperty("--accent", session.accent);
  $("proofRack").innerHTML = session.proofs.map(([label, value, note]) => `
    <div class="proofTile" style="--accent:${session.accent}">
      <span>${esc(label)}</span>
      <b>${pct(value)}</b>
      <small>${esc(note)}</small>
    </div>
  `).join("");
}

function renderPatch() {
  const session = current();
  const knobs = [
    ["confidence", session.confidence],
    ["source", session.source],
    ["noise", 100 - session.noise],
    ["reputation", Math.min(99, session.confidence + 4)],
  ];
  $("knobBank").innerHTML = knobs.map(([label, value]) => `
    <div class="knob" style="--accent:${session.accent}">
      <div class="dial" style="--value:${value}%"></div>
      <span>${esc(label)} ${pct(value)}</span>
    </div>
  `).join("");
  $("ledgerTape").innerHTML = session.ledger.map(([method, note]) => `
    <div class="tapeRow" style="--accent:${session.accent}">
      <b>${esc(method)}</b>
      <p>${esc(note)}</p>
    </div>
  `).join("");
}

function render() {
  renderContractLink();
  renderSessions();
  renderScopeMeta();
  renderPatch();
}

function addLocalSession(event) {
  event.preventDefault();
  const title = $("captureTitle").value.trim() || "Untitled signal";
  const claim = $("captureClaim").value.trim() || "Signal claim pending source analysis";
  sessions.unshift({
    code: `RL-${200 + sessions.length}`,
    title,
    venue: "Local desk",
    kind: "draft capture",
    status: "CAPTURED",
    verdict: "pending",
    accent: "#ff6b35",
    claim,
    confidence: 42,
    source: 38,
    noise: 55,
    proofs: [["source", 38, "pending"], ["cal", 34, "pending"], ["noise", 55, "draft"], ["audit", 2, "local"]],
    ledger: [
      ["register_session", "Local browser sample staged."],
      ["add_signal_proof", "Deploy contract to write this session on Studionet."],
    ],
  });
  selected = 0;
  render();
  toast("Local reel captured. Deploy/write path is ready.");
}

function drawBackground() {
  const canvas = $("scopeCanvas");
  const ctx = canvas.getContext("2d");
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  window.addEventListener("resize", resize);
  resize();
  const loop = () => {
    t += 0.007;
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    const colors = ["rgba(49,216,212,.28)", "rgba(255,176,0,.18)", "rgba(255,77,141,.20)", "rgba(185,255,74,.18)"];
    for (let i = 0; i < 18; i += 1) {
      ctx.beginPath();
      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = i % 4 === 0 ? 2 : 1;
      const base = (i + 1) * h / 20;
      ctx.moveTo(0, base);
      for (let x = 0; x <= w; x += 24) {
        const y = base + Math.sin(x * 0.018 + t * (1.5 + i * 0.03) + i) * (8 + (i % 5) * 3);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    requestAnimationFrame(loop);
  };
  loop();
}

function drawWave() {
  const canvas = $("waveCanvas");
  const ctx = canvas.getContext("2d");
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  window.addEventListener("resize", resize);
  resize();
  const loop = () => {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const session = current();
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 3;
    ctx.strokeStyle = session.accent;
    ctx.shadowColor = session.accent;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    const amp = 34 + (100 - session.noise) * 0.34;
    for (let x = 0; x <= w; x += 4) {
      const y = h / 2
        + Math.sin(x * 0.018 + t * 4) * amp
        + Math.sin(x * 0.051 + t * 2.2) * 18
        + Math.sin(x * 0.13 + t * 1.4) * 5;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    requestAnimationFrame(loop);
  };
  loop();
}

$("nextBtn").addEventListener("click", () => {
  selected = (selected + 1) % sessions.length;
  render();
});
$("captureForm").addEventListener("submit", addLocalSession);

drawBackground();
drawWave();
render();
