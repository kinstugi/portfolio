/* ============================================================
   Terminal portfolio — main script
   - Hybrid mode: autoplay intro, then real interactive input
   - Whitelisted command parser (no real shell)
   ============================================================ */

import { COMMANDS, PROJECTS, PROFILE, SOCIALS } from "./data.js";

/* ----------------------------------------------------------------
   DOM
---------------------------------------------------------------- */
const screen = document.getElementById("screen");
const input = document.getElementById("input");
const form = document.getElementById("form");

/* ----------------------------------------------------------------
   State
---------------------------------------------------------------- */
const history = [];
let historyIndex = -1;
let isAutoplay = true;

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Shared busy / skip state — also read by data.js for the wget bar.
window.__isBusy = false;
window.__skipRequested = false;

function setBusy(v) {
  window.__isBusy = v;
}

function requestSkip() {
  window.__skipRequested = true;
}

/* ----------------------------------------------------------------
   Helpers
---------------------------------------------------------------- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function scrollToBottom() {
  // Always follow explicit new content (a freshly printed line, a new
  // prompt, the end of a command). The "smart" stay-in-place behavior
  // is handled separately in maybeAutoScroll() during typewriter output.
  screen.scrollTop = screen.scrollHeight;
  if (window.__updateJumpButton) window.__updateJumpButton();
}

function el(tag, opts = {}) {
  const node = document.createElement(tag);
  if (opts.cls) node.className = opts.cls;
  if (opts.html != null) node.innerHTML = opts.html;
  if (opts.text != null) node.textContent = opts.text;
  if (opts.attrs) {
    for (const [k, v] of Object.entries(opts.attrs)) node.setAttribute(k, v);
  }
  return node;
}

function line(html, cls = "line--out") {
  const div = el("div", { cls: `line ${cls}`, html });
  screen.appendChild(div);
  scrollToBottom();
  return div;
}

function promptHTML() {
  return (
    `<span class="prompt-user">user</span>` +
    `<span class="prompt-at">@</span>` +
    `<span class="prompt-host">portfolio</span>` +
    `<span class="prompt-colon">:</span>` +
    `<span class="prompt-path">~</span>` +
    `<span class="prompt-dollar">$</span>`
  );
}

function promptLine(cmd) {
  return (
    `<span class="line--prompt">` +
    promptHTML() +
    ` <span class="cmd-text">${escapeHtml(cmd)}</span>` +
    `</span>`
  );
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* ----------------------------------------------------------------
   Typewriter
   Walks all text nodes in an HTML blob and types them char-by-char
   while preserving tags. Skippable.
---------------------------------------------------------------- */
async function typewrite(html, { charDelay = 14, lineDelay = 60 } = {}) {
  if (prefersReducedMotion) {
    line(html);
    await sleep(lineDelay);
    return;
  }
  const container = el("div", { cls: "line line--out", html });
  screen.appendChild(container);

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);

  setBusy(true);
  for (const node of nodes) {
    const text = node.nodeValue;
    if (!text) continue;
    node.nodeValue = "";
    for (let i = 0; i < text.length; i++) {
      if (window.__skipRequested) {
        node.nodeValue = text;
        break;
      }
      node.nodeValue = text.slice(0, i + 1);
      if (i % 3 === 0) scrollToBottom();
      await sleep(charDelay);
    }
    await sleep(lineDelay / 2);
  }
  window.__skipRequested = false;
  setBusy(false);
  scrollToBottom();
}

/* ----------------------------------------------------------------
   Command execution
---------------------------------------------------------------- */
function parseCommand(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(/\s+/);
  return { name: parts[0], args: parts.slice(1), raw: trimmed };
}

async function runInteractive(raw) {
  line(promptLine(raw), "line--prompt");

  const cmd = parseCommand(raw);
  if (!cmd) return;

  history.push(raw);
  historyIndex = history.length;

  const handler = COMMANDS[cmd.name];
  if (!handler) {
    line(
      `<span class="color-red">command not found: ${escapeHtml(cmd.name)}</span>` +
        ` &nbsp;<span class="color-muted">(try <span class="color-cyan">help</span>)</span>`,
      "line--out"
    );
    return;
  }

  try {
    await handler(cmd.args, { raw: cmd.raw });
  } catch (err) {
    console.error(err);
    line(
      `<span class="color-red">error:</span> ${escapeHtml(String((err && err.message) || err))}`,
      "line--err"
    );
  }
}

/* ----------------------------------------------------------------
   Input handling
---------------------------------------------------------------- */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (window.__isBusy) {
    requestSkip();
    return;
  }
  const value = input.value;
  input.value = "";
  runInteractive(value);
});

input.addEventListener("keydown", (e) => {
  // Tab completion
  if (e.key === "Tab") {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    const names = Object.keys(COMMANDS);
    const matches = names.filter((n) => n.startsWith(value));
    if (matches.length === 1) {
      input.value = matches[0] + " ";
    } else if (matches.length > 1) {
      const prefix = longestCommonPrefix(matches);
      if (prefix.length > value.length) {
        input.value = prefix;
      } else {
        line(promptLine(value), "line--prompt");
        line(matches.map((m) => `<span class="color-cyan">${m}</span>`).join("  "));
      }
    }
    return;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (history.length === 0) return;
    if (historyIndex > 0) historyIndex--;
    input.value = history[historyIndex] ?? "";
    moveCaretEnd(input);
    return;
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (history.length === 0) return;
    if (historyIndex < history.length - 1) {
      historyIndex++;
      input.value = history[historyIndex];
    } else {
      historyIndex = history.length;
      input.value = "";
    }
    moveCaretEnd(input);
    return;
  }

  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
    e.preventDefault();
    COMMANDS.clear();
    return;
  }

  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
    e.preventDefault();
    if (window.__isBusy) {
      requestSkip();
      return;
    }
    line(promptLine(input.value + "^C"), "line--prompt");
    input.value = "";
    return;
  }
});

/* ----------------------------------------------------------------
   Focus + global skip
---------------------------------------------------------------- */
document.addEventListener("click", (e) => {
  if (e.target.closest("a")) return;
  if (isAutoplay) {
    skipAutoplay();
    return;
  }
  if (window.__isBusy) requestSkip();
  else input.focus();
});

document.addEventListener("keydown", (e) => {
  // Ignore key events while typing into the input (they're handled there)
  if (document.activeElement === input) return;
  if (isAutoplay || window.__isBusy) {
    if (e.key === "Tab" || e.key === "ArrowUp" || e.key === "ArrowDown") return;
    if (isAutoplay) skipAutoplay();
    else requestSkip();
  }
});

// Re-evaluate the "↓ latest" jump button whenever the user scrolls
// the terminal screen manually.
screen.addEventListener("scroll", () => {
  if (window.__updateJumpButton) window.__updateJumpButton();
});

function moveCaretEnd(node) {
  requestAnimationFrame(() => {
    node.selectionStart = node.selectionEnd = node.value.length;
  });
}

function longestCommonPrefix(arr) {
  if (!arr.length) return "";
  let prefix = arr[0];
  for (let i = 1; i < arr.length; i++) {
    while (arr[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }
  return prefix;
}

/* ----------------------------------------------------------------
   Autoplay intro
---------------------------------------------------------------- */
async function autoplay() {
  isAutoplay = true;
  setBusy(true);

  await typewrite(
    `<span class="color-muted">CachyOS-inspired portfolio shell v1.0.0</span>\n` +
      `<span class="color-muted">Loading profile...</span>`,
    { charDelay: 10, lineDelay: 80 }
  );
  await sleep(350);

  await typewriteInteractive("neofetch");
  await sleep(450);

  await typewriteInteractive("whoami");
  await sleep(450);

  await typewriteInteractive("ls projects/");
  await sleep(300);

  line("");
  await typewrite(
    `<span class="color-yellow">tip:</span> type <span class="color-cyan">help</span> to see all commands, or press <span class="color-cyan">Tab</span> for completion.`,
    { charDelay: 12 }
  );
  line("");

  isAutoplay = false;
  setBusy(false);
  input.focus();
}

async function typewriteInteractive(raw) {
  line(promptLine(raw), "line--prompt");
  const cmd = parseCommand(raw);
  if (!cmd) return;
  const handler = COMMANDS[cmd.name];
  if (!handler) {
    line(`<span class="color-red">command not found: ${escapeHtml(cmd.name)}</span>`);
    return;
  }
  await handler(cmd.args, { raw: cmd.raw });
}

function skipAutoplay() {
  if (!isAutoplay) return;
  isAutoplay = false;
  window.__skipRequested = true;
  // Clear the screen so the user starts fresh after the skipped intro.
  while (screen.firstChild) screen.removeChild(screen.firstChild);
  setBusy(false);
  input.focus();
}

/* ----------------------------------------------------------------
   Boot
---------------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  autoplay();
});

/* Expose a tiny debug API for the console */
window.__portfolio = { PROFILE, PROJECTS, SOCIALS, COMMANDS, history };
