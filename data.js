/* ============================================================
   Terminal portfolio — data + command implementations
   ============================================================ */

/* ----------------------------------------------------------------
   Profile
   Mirrors /home/kwaku/Desktop/personal/resume_gen/samples/my_resume.yaml
---------------------------------------------------------------- */
export const PROFILE = {
  name: "Baffour Kusi Frimpong",
  role: "Full-Stack Engineer",
  currentTitle: "Senior Software Engineer",
  company: "TradeComply",
  city: "Heilbronn, Germany",
  region: "Baden-Württemberg",
  openToRelocation: true,
  openToLocations: ["Germany", "Netherlands"],
  languages: {
    en: "Native / Fluent",
    tr: "Professional",
    de: "Basic (A2, working on B1)",
    nl: "Beginner",
  },
  years: 6,
  email: "kinstugi.webdev@gmail.com",
  socials: {
    github: "https://github.com/toxicOxygen",
    linkedin: "https://linkedin.com/in/bkusi-fri/",
  },

  bio: `Full-stack engineer based in <span class="color-cyan">Heilbronn, Germany</span>, currently at <span class="color-cyan">TradeComply</span> building FastAPI services, RAG pipelines, and AI-integrated tooling on AWS. 6+ years of production <span class="color-cyan">Python</span> (FastAPI, Pydantic, Django) with recent hands-on <span class="color-cyan">Flutter</span> work on the mobile side. Earlier: Python REST APIs at INOP BV in Amsterdam, full-stack at Codecks in Istanbul, embedded C/C++ at Yongatek. M.Sc. Software Engineering, Kocaeli University. Currently at <span class="color-cyan">42 Heilbronn</span>. Open to senior backend / platform / LLM-infrastructure roles in Germany and the Netherlands.`,
};

/* Things being worked on right now that don't fit the shipped-projects model:
   a current job, a long-running curriculum, etc. */
export const CURRENT_WORK = [
  {
    name: "TradeComply — Senior Software Engineer",
    period: "since 2025-06",
    status: "current role",
    summary:
      "FastAPI services, RAG pipelines on pydantic-ai + vector stores, AI-integrated tooling on AWS, Kafka event streaming, GitHub Actions CI/CD.",
    stack: ["Python", "FastAPI", "pydantic-ai", "Kafka", "AWS", "GitHub Actions"],
    links: [],
  },
  {
    name: "42 Heilbronn — Core Curriculum",
    period: "started 2026-01",
    status: "in progress",
    summary:
      "Peer-to-peer C and systems programming. Pointers, memory, algorithms, and software that does one thing well.",
    stack: ["C", "Unix", "Make", "Git"],
    links: [],
  },
];

/* ----------------------------------------------------------------
   Work history
   Mirrors the experience section of my_resume.yaml. The `about`
   command renders this with per-company role details and bullet
   highlights. `current: true` flags the active role.
---------------------------------------------------------------- */
export const WORK_HISTORY = [
  {
    company: "TradeComply",
    role: "Senior Software Engineer",
    location: "Heilbronn, DE",
    period: "since 2025-06",
    current: true,
    highlights: [
      "Designed and built high-performance backend services in Python / FastAPI — scalable REST APIs and data pipelines for complex technical product requirements.",
      "Engineered a RAG pipeline using pydantic-ai and vector databases to extract and synthesise insights from large technical document corpora.",
      "Integrated Kafka event streaming for decoupled, fault-tolerant data ingestion across distributed pipeline stages.",
      "Built and maintained ETL workflows and generative-AI tooling on AWS — owned the lifecycle from architecture design to production monitoring.",
      "Established CI/CD pipelines (GitHub Actions) with automated test gates, enabling fast, reliable releases in an Agile team.",
      "Sat close to product strategy — translated business requirements into scalable technical decisions with clear trade-off reasoning.",
    ],
  },
  {
    company: "INOP BV",
    role: "Software Engineer",
    location: "Amsterdam, NL",
    period: "2024-02 → 2025-08",
    highlights: [
      "Built Python REST APIs on PostgreSQL and Redis vector stores — optimised query performance for high-dimensional embedding workloads.",
      "Developed mobile features in React Native and Flutter — owned end-to-end vertical slices from API contract through UI delivery.",
      "Deployed and maintained Docker-containerised services with automated CI/CD release pipelines for enterprise clients.",
      "Designed and executed automated integration test suites, reducing manual verification across sprint cycles.",
      "Collaborated with product and design in a fast-paced international startup — contributed to feature scoping and technical roadmap decisions.",
    ],
  },
  {
    company: "Codecks",
    role: "Full Stack Engineer",
    location: "Istanbul, TR",
    period: "2021-02 → 2024-01",
    highlights: [
      "Designed and scaled Python backend services and RESTful APIs with clean architecture patterns and strict data serialisation via Pydantic.",
      "Owned the complete development lifecycle — database modelling, API design, testing, deployment, production diagnostics — across multiple product lines.",
      "Acted as technical lead on several product features, working with product and design to prioritise and ship on schedule.",
      "Refactored and optimised existing codebases, improving maintainability and reducing server-client latency through targeted performance analysis.",
    ],
  },
  {
    company: "Yongatek",
    role: "Embedded Systems Engineer",
    location: "Istanbul, TR",
    period: "2019-05 → 2021-02",
    highlights: [
      "Developed a Python / OpenCV image processing pipeline for a handheld 3D scanner — depth filtering, point-cloud extraction, REST API integration.",
      "C/C++ firmware and systems programming — performance and memory habits that still shape how I write Python.",
    ],
  },
];

/* ----------------------------------------------------------------
   Education
---------------------------------------------------------------- */
export const EDUCATION = [
  {
    school: "42 Heilbronn",
    degree: "Core Curriculum",
    field: "Systems programming & C",
    period: "since 2026-01",
    current: true,
  },
  {
    school: "Kocaeli University",
    degree: "M.Sc.",
    field: "Software Engineering",
    period: "2023 → 2025",
  },
  {
    school: "Kocaeli University",
    degree: "B.Eng.",
    field: "Mechatronics Engineering",
    period: "2016 → 2020",
  },
];


export const SOCIALS = [
  { label: "github", url: PROFILE.socials.github, hint: "@toxicOxygen" },
  { label: "linkedin", url: PROFILE.socials.linkedin, hint: "career history" },
  { label: "email", url: `mailto:${PROFILE.email}`, hint: PROFILE.email },
];

/* ----------------------------------------------------------------
   Projects
   The first batch (Python / Kafka / LLM / Flutter) is the one that
   does the hiring work — lead with those. The Twitter Clone pair
   is real and public (in my_resume.yaml) but is older learning work,
   so it sits at the bottom.
   Replace `null` URLs with real links as each project ships.
---------------------------------------------------------------- */
export const PROJECTS = [
  {
    slug: "bplan-extraction",
    title: "B-Plan footprint extraction",
    summary:
      "Pipeline that turns German Bebauungsplan (B-Plan) PDFs into CityJSON footprints.",
    stack: ["Python", "pdfplumber", "OpenCV", "Shapely"],
    status: "hackathon prototype",
    github: null,
    demo: null,
    origin: "Built during a weekend hackathon. Rough edges kept on purpose.",
    details: [
      "Parses planzeichnung PDFs page by page and extracts polygon outlines.",
      "Normalises scale and orientation before exporting to CityJSON.",
      "Not productionised — accuracy depends heavily on input PDF quality.",
    ],
  },
  {
    slug: "multi-agent-cv",
    title: "Multi-agent CV generation",
    summary:
      "Node.js service that uses cooperating agents to draft CV sections from raw experience.",
    stack: ["Node.js", "TypeScript", "LLM APIs"],
    status: "in progress",
    github: null,
    demo: null,
    origin: "Spinoff experiment to see if smaller specialised agents beat one large prompt.",
    details: [
      "Each section (summary, experience, skills) is owned by its own agent.",
      "A coordinator agent reconciles tone and removes contradictions.",
    ],
  },
  {
    slug: "karaoke-session",
    title: "Friday Karaoke",
    summary:
      "Real-time karaoke queue app for school Friday-night events. Hosts run the session from a browser, students scan a QR code and add songs via YouTube URLs, the queue advances live across every device in the room.",
    stack: ["FastAPI", "Python", "uv", "WebSockets", "React", "TypeScript", "Vite", "PostgreSQL", "Docker", "Cloud Run"],
    status: "in production (M1–M18 shipped, 240+ tests)",
    github: "https://github.com/kinstugi/friday-karaoke",
    demo: "https://karaoke-app-ywmqmgfyoa-uc.a.run.app/host",
    origin:
      "Built for our school's Friday karaoke nights. Live Cloud Run deployment backs every weekly session.",
    details: [
      "Single-origin deploy: the FastAPI container serves the React SPA, the REST API, and WebSocket endpoints from one Cloud Run service.",
      "WebSockets (`/api/v1/sessions/{id}/ws`) keep host and student clients in sync as the queue advances.",
      "Neon free-tier Postgres for persistence; YouTube URLs are the song source so there is no media to host.",
      "Milestones M1–M18 complete: join flow, round-robin queue, automatic playback, host moderation, notifications, round summaries, and abuse protection — backed by a 240+ test suite.",
    ],
  },
  {
    slug: "sse-screenshot",
    title: "SSE screenshot Flutter app",
    summary:
      "Flutter app that streams device screenshots to a backend over Server-Sent Events.",
    stack: ["Flutter", "Dart", "SSE", "FastAPI"],
    status: "in progress",
    github: null,
    demo: null,
    origin: "Built to test long-lived streams on flaky mobile networks.",
    details: [
      "Uses Server-Sent Events for one-way streaming with auto-reconnect.",
      "Backend stores frames and exposes a simple gallery view.",
    ],
  },
  {
    slug: "my-cv-generator",
    title: "My CV Generator",
    summary:
      "Full-stack CV management platform: register, build and maintain resumes, AI-tailor them to a pasted job description with Groq, and export a styled PDF in four template variants.",
    stack: [
      ".NET 9",
      "ASP.NET Core",
      "C#",
      "PostgreSQL",
      "EF Core",
      "Redis",
      "JWT",
      "Groq (LLaMA)",
      "QuestPDF",
      "React",
      "Vite",
      "Firebase Hosting",
      "Render",
      "Docker",
    ],
    status: "live (older C#/.NET project)",
    github: "https://github.com/kinstugi/my_cv_gen_api",
    demo: "https://my-cv-gen-frontend.web.app/",
    origin:
      "Earlier project from when I was working in C#/.NET. Still deployed because people use it, but it is not the stack I focus on today.",
    details: [
      "Two-repo project: the .NET 9 Web API lives at https://github.com/kinstugi/my_cv_gen_api and the React/Vite SPA at https://github.com/kinstugi/my_cv_gen_frontend.",
      "Resume CRUD with work experiences, education, languages, projects, skills; deletes are soft so resumes stay recoverable.",
      "AI tailoring endpoint rephrases bullets and emphasises relevant skills for a pasted job description — factual data (companies, dates, schools) is left untouched.",
      "PDF export uses QuestPDF and renders four template variants; three of them embed the user's profile image.",
      "Auth is JWT bearer; the user id is always derived from the token so users can only read or mutate their own data.",
      "Backend runs on Render with PostgreSQL and Redis; frontend is on Firebase Hosting.",
    ],
  },
  {
    slug: "twitter-api-clone",
    title: "Twitter Clone — Backend API",
    summary:
      "Django REST API imitating Twitter's core flows: token auth, posts with image upload, comments, likes, follows, and user profiles.",
    stack: [
      "Django 3.0",
      "Django REST Framework",
      "django-allauth",
      "PostgreSQL / SQLite",
      "Pillow",
      "gunicorn",
    ],
    status: "personal learning project (2020-21)",
    github: "https://github.com/toxicOxygen/twitter_api_clone",
    demo: null,
    origin: "Older learning work. Paired with a Flutter mobile client.",
    details: [
      "Token-based auth (django-rest-auth + django-allauth) with per-user permissions.",
      "REST endpoints for posts, comments, likes/unlikes, follow/unfollow, profile CRUD.",
      "Image upload pipeline using Pillow for post media.",
      "Heroku-ready config (Procfile, gunicorn, whitenoise) for static asset serving.",
    ],
  },
  {
    slug: "flutter-twitter-clone",
    title: "Twitter Clone — Mobile Client",
    summary:
      "Flutter mobile client that consumes the paired Django backend — feed, post detail, profile, follow/like flows.",
    stack: [
      "Flutter 2.7 (Dart 2, pre-null-safety)",
      "Provider",
      "http",
      "shared_preferences",
      "carousel_slider",
    ],
    status: "personal learning project (2020-21)",
    github: "https://github.com/toxicOxygen/flutter_twitter_clone",
    demo: null,
    origin: "Mobile half of the Twitter Clone pair. Older learning work.",
    details: [
      "Provider-based state management across feed, post detail, and profile screens.",
      "REST integration against the paired Django backend with token-based auth.",
      "Image picker and carousel for post media upload and display.",
      "Local persistence via shared_preferences for tokens and lightweight user state.",
    ],
  },
];

/* ----------------------------------------------------------------
   CachyOS-inspired logo (compact ASCII)
---------------------------------------------------------------- */
const LOGO = [
"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
"@@@@@@@@@@@@@@@@@*. ..@@@@@@@@@@@@@@@@@@",
"@@@@@@@@@@@@@@@@.......@@@@@@@@@@@@@@@@@",
"@@@@@@@@@@@(. ......  .. ,......@@@@@@@@",
"@@@@@@@.......  ................@@@@@@@@",
"@@@@@..... ..@@@@@@    . .  ...@@@@@@@@@",
"@@@@...  .@@@ ..    .  . /@@@@@@@@@@@@@@",
"@@@.,   .@@@..   .. ..  ......@@@@@ .@@@",
"@@%..   @@@@@@@@@@. .    .    @@@@../@@@",
"@@*.   @@@@.  .       &@@@@@@@@@@*..@@@@",
"@@@  ./@@@...       .      @@@@@. ..@@@@",
"@@@.  @@@@@@@@@@ .     .. .@@.    .@@@@@",
"@@@@.,@@@@@@@     . @@@@@   .   .,@@@@@@",
"@@@@@@@@(     .    ...  . .  ... @@@@@@@",
"@@@@@@@ .  . . .     .  . . ...@@@@@@@@@",
"@@@@@@@@    .  @@..     .@@@@@@@@@@@@@@@",
"@@@@@@@@@@@@@@@@@ .  . ,@@@@@@@@@@@@@@@@",
"@@@@@@@@@@@@@@@@@@@#..@@@@@@@@@@@@@@@@@@",
"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
].join("\n");

/* ----------------------------------------------------------------
   Themes
   Names must match the :root[data-theme="..."] blocks in style.css.
---------------------------------------------------------------- */
const THEMES = [
  { id: "cachyos",   label: "CachyOS Purple",  hint: "Catppuccin Mocha, purple lean" },
  { id: "matrix",    label: "Matrix",          hint: "phosphor green on black" },
  { id: "solarized", label: "Solarized Dark",  hint: "earthy cyan/blue (default)" },
  { id: "tokyo",     label: "Tokyo Night",     hint: "modern blue/purple" },
];

function getCurrentTheme() {
  return document.documentElement.getAttribute("data-theme") || "solarized";
}

function setTheme(id) {
  if (!THEMES.some((t) => t.id === id)) return false;
  document.documentElement.setAttribute("data-theme", id);
  try { localStorage.setItem("portfolio:theme", id); } catch {}
  return true;
}

/* ----------------------------------------------------------------
   Tiny HTML helpers (kept here so the command file is self-contained)
---------------------------------------------------------------- */
const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const promptHTML = () =>
  `<span class="prompt-user">user</span>` +
  `<span class="prompt-at">@</span>` +
  `<span class="prompt-host">portfolio</span>` +
  `<span class="prompt-colon">:</span>` +
  `<span class="prompt-path">~</span>` +
  `<span class="prompt-dollar">$</span>`;

/* ----------------------------------------------------------------
   Reusable rendering: print lines to the active screen
---------------------------------------------------------------- */
function getScreen() {
  return document.getElementById("screen");
}

/* Auto-scroll: always follow new content so the user never has to
   chase the cursor manually. The jump button is still useful for
   anyone who scrolls up on purpose. */
function isAtBottom() {
  const s = getScreen();
  return s.scrollHeight - s.scrollTop - s.clientHeight < 64;
}
function maybeAutoScroll() {
  getScreen().scrollTop = getScreen().scrollHeight;
  updateJumpButton();
}

/* ----------------------------------------------------------------
   "↓ latest" jump button — appears when the user has scrolled up
   during typing, so they can free-scroll without losing the cursor.
---------------------------------------------------------------- */
let _jumpBtn = null;
function getJumpButton() {
  if (_jumpBtn) return _jumpBtn;
  _jumpBtn = document.createElement("button");
  _jumpBtn.className = "jump-to-latest";
  _jumpBtn.type = "button";
  _jumpBtn.setAttribute("aria-label", "Jump to latest output");
  _jumpBtn.innerHTML = `<span class="jump-to-latest__arrow">↓</span> latest`;
  _jumpBtn.addEventListener("click", () => {
    const s = getScreen();
    s.scrollTop = s.scrollHeight;
    _jumpBtn.classList.remove("is-visible");
  });
  document.body.appendChild(_jumpBtn);
  return _jumpBtn;
}

function updateJumpButton() {
  const btn = getJumpButton();
  if (isAtBottom()) {
    btn.classList.remove("is-visible");
  } else {
    btn.classList.add("is-visible");
  }
}
// Expose for main.js.
window.__updateJumpButton = updateJumpButton;
window.__isAtBottom = isAtBottom;
window.__maybeAutoScroll = maybeAutoScroll;

function write(html, cls = "line--out") {
  const screen = getScreen();
  const div = document.createElement("div");
  div.className = `line ${cls}`;
  div.innerHTML = html;
  screen.appendChild(div);
  maybeAutoScroll();
  return div;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function typewrite(html, { charDelay = 10, lineDelay = 24 } = {}) {
  const screen = getScreen();
  const container = document.createElement("div");
  container.className = "line line--out";
  container.innerHTML = html;
  screen.appendChild(container);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    maybeAutoScroll();
    return container;
  }

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);

  if (window.__isBusy !== undefined) window.__isBusy = true;
  for (const node of nodes) {
    if (window.__skipRequested) {
      // Skip: fill every remaining text node instantly and bail.
      window.__skipRequested = false;
      for (const remaining of nodes) {
        const t = remaining.nodeValue;
        if (t) remaining.nodeValue = t;
      }
      break;
    }
    const text = node.nodeValue;
    if (!text) continue;
    node.nodeValue = "";
    for (let i = 0; i < text.length; i++) {
      if (window.__skipRequested) {
        node.nodeValue = text;
        break;
      }
      node.nodeValue = text.slice(0, i + 1);
      if (i % 3 === 0) maybeAutoScroll();
      await sleep(charDelay);
    }
  }
  if (window.__skipRequested) window.__skipRequested = false;
  if (window.__isBusy !== undefined) window.__isBusy = false;
  maybeAutoScroll();
}

/* ----------------------------------------------------------------
   Command: neofetch
---------------------------------------------------------------- */
async function neofetch() {
  const info = [
    [`<span class="color-bold color-green">${esc(PROFILE.name)}</span>@portfolio`],
    [`<span class="color-muted">────────────────────────────</span>`],
    [
      `<span class="color-bold">OS</span>:     ` +
        `full-stack engineer · ${esc(PROFILE.currentTitle.toLowerCase())}`,
    ],
    [`<span class="color-bold">Host</span>:   ${esc(PROFILE.company)} (prev. INOP BV, Codecks, Yongatek)`],
    [
      `<span class="color-bold">Kernel</span>: ` +
        `Python · FastAPI · Pydantic · Kafka · RAG · LLM APIs · Flutter · C/C++`,
    ],
    [
      `<span class="color-bold">Uptime</span>: ${PROFILE.years}+ years writing production software`,
    ],
    [`<span class="color-bold">Shell</span>:  bash (and a lot of C, lately)`],
    [
      `<span class="color-bold">DE</span>:     VS Code · tmux · a 42 Heilbronn badge`,
    ],
    [
      `<span class="color-bold">WM</span>:     <span class="color-cyan">JetBrains Mono</span>`,
    ],
    [
      `<span class="color-bold">Theme</span>:  ${
        esc((THEMES.find((t) => t.id === getCurrentTheme()) || {}).label || "CachyOS Purple")
      } <span class="color-muted">[Dark]</span>`,
    ],
    [`<span class="color-bold">Terminal</span>: this one`],
    [
      `<span class="color-bold">CPU</span>:    Mechatronics (B.Eng) → M.Sc. Software Engineering`,
    ],
    [
      `<span class="color-bold">Memory</span>: caffeine · good docs · second monitor`,
    ],
    [
      `<span class="color-bold">Lang</span>:   ` +
        `<span class="color-cyan">en</span> ${esc(PROFILE.languages.en)} · ` +
        `<span class="color-cyan">tr</span> ${esc(PROFILE.languages.tr)} · ` +
        `<span class="color-cyan">de</span> ${esc(PROFILE.languages.de)} · ` +
        `<span class="color-cyan">nl</span> ${esc(PROFILE.languages.nl)}`,
    ],
    [
      `<span class="color-bold">Loc</span>:    ${esc(PROFILE.city)}` +
        (PROFILE.openToRelocation
          ? ` <span class="color-muted">(open to ${esc(PROFILE.openToLocations.join(" / "))})</span>`
          : ""),
    ],
  ]
    .map((row) => row.join(""))
    .join("<br>");

  const html = `<div class="neofetch">` +
    `<pre class="neofetch__logo">${esc(LOGO)}</pre>` +
    `<div class="neofetch__info">${info}</div>` +
    `</div>`;

  await typewrite(html, { charDelay: 6, lineDelay: 30 });
}

/* ----------------------------------------------------------------
   Command: whoami
---------------------------------------------------------------- */
async function whoami() {
  await typewrite(PROFILE.bio, { charDelay: 12, lineDelay: 60 });
}

/* ----------------------------------------------------------------
   Command: about / cat about.md
   Renders the career narrative + per-company role detail.
   Section dividers, breathing room, bullet role-highlights.
---------------------------------------------------------------- */

function section(title) {
  return (
    `<span class="color-muted">──────────────────</span> ` +
    `<span class="color-bold color-cyan">▸ ${esc(title)}</span> ` +
    `<span class="color-muted">──────────────────</span>`
  );
}

function jobCard(job) {
  const lines = [];
  const currentTag = job.current
    ? ` <span class="color-green">[current]</span>`
    : "";
  lines.push(
    `<span class="color-bold">${esc(job.company.toUpperCase())}</span>` +
    `  <span class="color-cyan">${esc(job.role)}</span>` +
    `  <span class="color-muted">— ${esc(job.location)}  ·  ${esc(job.period)}</span>` +
    currentTag
  );
  for (const h of job.highlights) {
    lines.push(`&nbsp;&nbsp;<span class="color-muted">▸</span> ${esc(h)}`);
  }
  return lines.join("<br>");
}

function educationCard(ed) {
  const tag = ed.current ? ` <span class="color-green">[in progress]</span>` : "";
  return (
    `<span class="color-bold">${esc(ed.school)}</span>` +
    `  <span class="color-cyan">${esc(ed.degree)} ${esc(ed.field)}</span>` +
    `  <span class="color-muted">— ${esc(ed.period)}</span>` +
    tag
  );
}

async function about() {
  const out = [];

  // --- header
  out.push(
    `<span class="color-bold color-magenta"># about.md</span>` +
      `  <span class="color-muted">kept in sync with my_resume.yaml</span>`
  );
  out.push(``);

  // --- TL;DR
  out.push(section("TL;DR"));
  out.push(
    `Full-stack engineer in <span class="color-cyan">${esc(PROFILE.city)}</span> with ` +
      `<span class="color-cyan">${PROFILE.years}+ years</span> of production Python.`
  );
  out.push(
    `Right now: FastAPI services, RAG pipelines on pydantic-ai + vector stores, ` +
      `and AI-integrated tooling deployed on AWS.`
  );
  out.push(
    `Also doing <span class="color-cyan">42 Heilbronn</span> in C. ` +
      `Open to senior roles in ${esc(PROFILE.openToLocations.join(" / "))}.`
  );
  out.push(``);

  // --- Currently
  out.push(section("Currently"));
  for (const job of WORK_HISTORY.filter((j) => j.current)) {
    out.push(jobCard(job));
  }
  out.push(``);

  // --- Previously
  out.push(section("Previously"));
  for (const job of WORK_HISTORY.filter((j) => !j.current)) {
    out.push(jobCard(job));
    out.push(`<br>`); // breathing room between companies
  }
  out.pop(); // remove the last trailing <br> (cleaner end)
  out.push(``);

  // --- Education
  out.push(section("Education"));
  for (const ed of EDUCATION) {
    out.push(`&nbsp;&nbsp;<span class="color-muted">▸</span> ${educationCard(ed)}`);
  }
  out.push(``);

  // --- Languages, honestly
  out.push(section("Languages, honestly"));
  for (const [code, level] of Object.entries(PROFILE.languages)) {
    const de = code === "de";
    out.push(
      `&nbsp;&nbsp;<span class="color-muted">▸</span> ` +
        `<span class="color-cyan">${esc(code)}</span>  ` +
        (de ? `<span class="color-yellow">${esc(level)}</span>` : esc(level))
    );
  }
  out.push(
    `Engineering work in English is fine. I disclose the level so it's not a surprise.`
  );
  out.push(``);

  // --- Looking for
  out.push(section("Looking for"));
  out.push(
    `Senior backend, platform, or LLM-infrastructure roles in ` +
      `<span class="color-cyan">${esc(PROFILE.openToLocations.join(" or "))}</span> ` +
      `(or remote across Europe). Teams that take correctness seriously, deploy often, write things down.`
  );
  out.push(``);

  // --- Won't do
  out.push(section("What I won't do"));
  out.push(
    `Inflate my CV, invent metrics, or pretend I'm further along in German than I am. ` +
      `The site you're reading is held to the same rule.`
  );

  await typewrite(out.join("<br>"), { charDelay: 5, lineDelay: 14 });
}

/* ----------------------------------------------------------------
   Command: ls
---------------------------------------------------------------- */
async function ls(args) {
  const arg = (args[0] || "").replace(/\/$/, "");

  if (arg === "" || arg === "." || arg === "~") {
    write(
      `<span class="color-blue">about.md</span>      ` +
        `<span class="color-blue">contact.txt</span>   ` +
        `<span class="color-blue">projects/</span>    ` +
        `<span class="color-blue">socials/</span>     ` +
        `<span class="color-green">cv.pdf</span>        ` +
        `<span class="color-green">resume.pdf</span>`,
      "line--out"
    );
    return;
  }

  if (arg === "projects" || arg === "projects/") {
    const items = PROJECTS.map(
      (p) =>
        `<span class="color-blue">${p.slug}/</span>` +
        `   <span class="color-muted">${esc(p.status)}</span>`
    );
    write(items.join("<br>"), "line--out");
    write(
      `<br><span class="color-muted">${PROJECTS.length} entries. ` +
        `Try: <span class="color-cyan">cat projects/${PROJECTS[0].slug}.md</span></span>`,
      "line--out"
    );
    return;
  }

  if (arg === "socials" || arg === "socials/") {
    SOCIALS.forEach((s) => {
      write(
        `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>` +
          `   <span class="color-muted">${esc(s.hint)}</span>`,
        "line--out"
      );
    });
    return;
  }

  write(
    `<span class="color-red">ls:</span> cannot access '${esc(arg)}': No such file or directory`,
    "line--err"
  );
}

/* ----------------------------------------------------------------
   Command: projects
   One-glance view of current work + shipped projects. Use
   `ls projects/` for the bare list, `cat projects/<slug>.md`
   for a full card.
---------------------------------------------------------------- */
async function projects() {
  const out = [];

  out.push(
    `<span class="color-bold color-magenta"># projects — currently working on</span>`
  );

  for (const w of CURRENT_WORK) {
    out.push(
      `<br><span class="color-bold">▸ ${esc(w.name)}</span> ` +
        `<span class="color-muted">[${esc(w.status)} · ${esc(w.period)}]</span>`
    );
    out.push(`  <span class="color-dim">${esc(w.summary)}</span>`);
    out.push(
      `  <span class="color-cyan">stack:</span> ` +
        w.stack.map((s) => `<span class="color-blue">${esc(s)}</span>`).join(" · ")
    );
  }

  out.push(
    `<br><br><span class="color-bold color-magenta"># projects — shipped</span>`
  );
  out.push(
    `<span class="color-muted">${PROJECTS.length} public ` +
      (PROJECTS.length === 1 ? "project" : "projects") +
      ` from my_resume.yaml.</span>`
  );

  for (const p of PROJECTS) {
    out.push(
      `<br><span class="color-bold">▸ ${esc(p.title)}</span> ` +
        `<span class="color-muted">[${esc(p.status)}]</span>`
    );
    out.push(`  <span class="color-dim">${esc(p.summary)}</span>`);
    out.push(
      `  <span class="color-cyan">stack:</span> ` +
        p.stack.map((s) => `<span class="color-blue">${esc(s)}</span>`).join(" · ")
    );
    const links = [];
    if (p.github)
      links.push(
        `<span class="color-cyan">github</span> ` +
          `<a href="${esc(p.github)}" target="_blank" rel="noopener noreferrer">${esc(p.github)}</a>`
      );
    if (p.demo)
      links.push(
        `<span class="color-cyan">demo</span> ` +
          `<a href="${esc(p.demo)}" target="_blank" rel="noopener noreferrer">${esc(p.demo)}</a>`
      );
    if (!p.demo)
      links.push(
        `<span class="color-cyan">demo</span> <span class="color-muted">TODO — not published yet</span>`
      );
    out.push(`  ${links.join(" &nbsp;·&nbsp; ")}`);
  }

  out.push(
    `<br><span class="color-muted">Drill in: <span class="color-cyan">cat projects/${PROJECTS[0].slug}.md</span></span>`
  );

  await typewrite(out.join("<br>"), { charDelay: 6, lineDelay: 20 });
}

/* ----------------------------------------------------------------
   Command: cat
---------------------------------------------------------------- */
async function cat(args) {
  const target = (args[0] || "").replace(/^\.\//, "");

  if (!target) {
    write(
      `<span class="color-red">cat:</span> missing file operand. Try <span class="color-cyan">cat about.md</span>`,
      "line--err"
    );
    return;
  }

  if (
    target === "about.md" ||
    target === "~/about.md" ||
    target === "/home/user/about.md"
  ) {
    return about();
  }

  if (target === "contact.txt") {
    return contact();
  }

  if (target === "resume.pdf" || target === "cv.pdf") {
    return triggerDownload(target);
  }

  // projects/<slug>.md
  const projectMatch = target.match(/^projects\/([\w-]+)\.md$/);
  if (projectMatch) {
    const slug = projectMatch[1];
    const project = PROJECTS.find((p) => p.slug === slug);
    if (!project) {
      write(
        `<span class="color-red">cat:</span> ${esc(target)}: No such project. ` +
          `Try <span class="color-cyan">ls projects/</span>.`,
        "line--err"
      );
      return;
    }
    return showProject(project);
  }

  write(
    `<span class="color-red">cat:</span> ${esc(target)}: No such file or directory`,
    "line--err"
  );
}

/* ----------------------------------------------------------------
   Command: contact
---------------------------------------------------------------- */
async function contact() {
  const lines = [
    `<span class="color-bold color-magenta"># contact.txt</span>`,
    `<span class="color-muted"># pick whichever is least awkward for you</span>`,
    ``,
    ...SOCIALS.map(
      (s) =>
        `<span class="color-cyan">${esc(s.label.padEnd(10))}</span> ` +
        `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.url)}</a>`
    ),
    ``,
    `<span class="color-muted">All links open in a new tab. Email opens your mail client.</span>`,
  ];
  await typewrite(lines.join("<br>"), { charDelay: 10, lineDelay: 30 });
}

/* ----------------------------------------------------------------
   Command: project card
---------------------------------------------------------------- */
async function showProject(p) {
  const urlOrTodo = (u) =>
    u
      ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(u)}</a>`
      : `<span class="color-muted">TODO — not published yet</span>`;

  const card =
    `<span class="color-bold color-magenta"># projects/${esc(p.slug)}.md</span><br>` +
    `<span class="color-muted">status:</span> ` +
    `<span class="color-yellow">${esc(p.status)}</span><br><br>` +
    `<span class="color-bold">${esc(p.title)}</span><br>` +
    `<span class="color-dim">${esc(p.summary)}</span><br><br>` +
    `<span class="color-cyan">stack:</span> ` +
    p.stack.map((s) => `<span class="color-blue">${esc(s)}</span>`).join(" · ") +
    `<br><br>` +
    `<span class="color-cyan">github:</span>  ${urlOrTodo(p.github)}<br>` +
    `<span class="color-cyan">demo:</span>    ${urlOrTodo(p.demo)}<br><br>` +
    `<span class="color-muted">${esc(p.origin)}</span><br>` +
    p.details.map((d) => `<span class="color-muted">  · ${esc(d)}</span>`).join("<br>");

  await typewrite(card, { charDelay: 8, lineDelay: 24 });
}

/* ----------------------------------------------------------------
   Command: wget (download CV)
---------------------------------------------------------------- */
async function wget(args) {
  const target = args[0] || "cv.pdf";
  if (target !== "cv.pdf" && target !== "resume.pdf") {
    write(
      `<span class="color-red">wget:</span> ${esc(target)}: 404 Not Found`,
      "line--err"
    );
    return;
  }

  const screen = getScreen();
  const log = document.createElement("div");
  log.className = "line line--out";
  screen.appendChild(log);

  const lines = [
    `<span class="color-muted">--${new Date().toISOString()}--  ` +
      `https://portfolio.example.com/${esc(target)}</span>`,
    `<span class="color-muted">Resolving portfolio.example.com... ` +
      `<span class="color-green">done</span>.</span>`,
    `<span class="color-muted">Connecting... </span>` +
      `<span class="color-green">connected</span>.`,
    `<span class="color-muted">HTTP request sent, awaiting response... ` +
      `200 OK</span>`,
    `<span class="color-muted">Length: <span class="color-cyan">-- bytes</span> ` +
      `[<span class="color-cyan">application/pdf</span>]</span>`,
    `<span class="color-muted">Saving to: '</span><span class="color-cyan">${esc(target)}</span>` +
      `<span class="color-muted">'</span>`,
    ``,
  ];
  log.innerHTML = lines.join("<br>") + "<br>";
  screen.scrollTop = screen.scrollHeight;

  // Animated progress bar
  const total = 30;
  for (let i = 0; i <= total; i++) {
    if (window.__skipRequested) {
      window.__skipRequested = false;
      break;
    }
    const pct = Math.round((i / total) * 100);
    const filled = "█".repeat(i);
    const empty = "░".repeat(total - i);
    const speed = (Math.random() * 4 + 8).toFixed(1);
    const eta = Math.max(0, Math.floor(Math.random() * 9));
    // Update only the progress line by tracking it as a <progress> element
    let bar = log.querySelector(".wget-bar");
    if (!bar) {
      log.insertAdjacentHTML(
        "beforeend",
        `<span class="wget-bar"></span><br>`
      );
      bar = log.querySelector(".wget-bar");
    }
    bar.innerHTML =
      `<span class="color-cyan">${filled}</span>` +
      `<span class="wget-bar__empty">${empty}</span> ` +
      `<span class="color-cyan">${pct}%</span> ` +
      `<span class="color-muted">${speed}MB/s</span> ` +
      `<span class="color-muted">eta 00:00:0${eta}</span>`;
    screen.scrollTop = screen.scrollHeight;
    await sleep(45);
  }

  log.insertAdjacentHTML(
    "beforeend",
    `<br><span class="color-green">✔</span> ` +
      `<span class="color-muted">saved [</span>` +
      `<span class="color-cyan">${Math.floor(Math.random() * 100 + 200)}KB</span>` +
      `<span class="color-muted">]</span>`
  );

  triggerDownload(target);
  write(
    `<span class="color-muted">If the download didn't start, the CV is at </span>` +
      `<a href="/${esc(target)}" download>${esc(target)}</a>`,
    "line--out"
  );
}

function triggerDownload(filename) {
  const a = document.createElement("a");
  a.href = `/${filename}`;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ----------------------------------------------------------------
   Command: help / man
---------------------------------------------------------------- */
async function help() {
  const lines = [
    `<span class="color-bold color-magenta">Available commands</span>`,
    ``,
    `<span class="color-cyan">  neofetch</span>             banner with role, stack, location`,
    `<span class="color-cyan">  whoami</span>               one-paragraph bio`,
    `<span class="color-cyan">  about</span>                longer bio and career story  ` +
      `<span class="color-muted">(= cat about.md)</span>`,
    `<span class="color-cyan">  projects</span>             current work + shipped projects  ` +
      `<span class="color-muted">(alias: work)</span>`,
    `<span class="color-cyan">  ls</span> [path]            list directory contents  ` +
      `<span class="color-muted">(try: projects, socials)</span>`,
    `<span class="color-cyan">  cat</span> &lt;file&gt;           read a file  ` +
      `<span class="color-muted">(try: cat projects/&lt;slug&gt;.md)</span>`,
    `<span class="color-cyan">  contact</span>              contact and social links`,
    `<span class="color-cyan">  theme</span> [name]         list or switch color theme  ` +
      `<span class="color-muted">(cachyos · matrix · solarized · tokyo)</span>`,
    `<span class="color-cyan">  wget cv.pdf</span>          download the CV`,
    `<span class="color-cyan">  clear</span>                clear the screen  ` +
      `<span class="color-muted">(Ctrl+L)</span>`,
    ``,
    `<span class="color-bold color-magenta">Easter eggs</span>`,
    `<span class="color-cyan">  sudo hire-me</span>          (you knew this was here)`,
    `<span class="color-cyan">  date</span> / <span class="color-cyan">pwd</span> / <span class="color-cyan">uname -a</span>   the classics`,
    ``,
    `<span class="color-muted">Tip: Tab to autocomplete, ↑/↓ for history, Ctrl+L to clear.</span>`,
  ];
  write(lines.join("<br>"), "line--out");
}

/* ----------------------------------------------------------------
   Command: clear
---------------------------------------------------------------- */
function clear() {
  const screen = getScreen();
  while (screen.firstChild) screen.removeChild(screen.firstChild);
  write(""); // one empty line so the screen isn't visually collapsed
}

/* ----------------------------------------------------------------
   Command: theme
---------------------------------------------------------------- */
async function theme(args) {
  const current = getCurrentTheme();

  if (args.length === 0) {
    const lines = [
      `<span class="color-bold color-magenta">Available themes</span> ` +
        `<span class="color-muted">(active: <span class="color-cyan">${esc(current)}</span>)</span>`,
      ``,
      ...THEMES.map((t) => {
        const active = t.id === current;
        const marker = active
          ? `<span class="color-green">▸</span>`
          : `&nbsp;`;
        const name = active
          ? `<span class="color-bold color-cyan">${esc(t.id)}</span>`
          : `<span class="color-cyan">${esc(t.id)}</span>`;
        const tag = active
          ? ` <span class="color-green">[active]</span>`
          : ``;
        return `${marker} ${name}${tag} &nbsp;` +
          `<span class="color-muted">— ${esc(t.label)}: ${esc(t.hint)}</span>`;
      }),
      ``,
      `<span class="color-muted">Switch: <span class="color-cyan">theme matrix</span></span>`,
    ];
    write(lines.join("<br>"));
    return;
  }

  const target = args[0].toLowerCase();
  if (setTheme(target)) {
    const t = THEMES.find((x) => x.id === target);
    write(
      `<span class="color-green">✔</span> theme set to ` +
        `<span class="color-cyan">${esc(target)}</span> ` +
        `<span class="color-muted">— ${esc(t.label)}</span>`,
      "line--ok"
    );
  } else {
    write(
      `<span class="color-red">theme:</span> ${esc(target)}: no such theme. ` +
        `Try <span class="color-cyan">theme</span> to list.`,
      "line--err"
    );
  }
}

/* ----------------------------------------------------------------
   Command: sudo hire-me
---------------------------------------------------------------- */
async function sudoHireMe(args) {
  if (args[0] !== "hire-me") {
    write(
      `<span class="color-red">sudo:</span> ${esc(args[0] || "")}: command not found`,
      "line--err"
    );
    return;
  }
  const text =
    `<span class="color-yellow">[sudo]</span> password for user: <br>` +
    `<span class="color-muted">(typing...)</span><br><br>` +
    `<span class="color-green">✔ correct</span><br><br>` +
    `<span class="color-magenta">Initiating hiring sequence...</span><br>` +
    `<span class="color-green">  ✔ pulling CV</span><br>` +
    `<span class="color-green">  ✔ drafting cover letter</span><br>` +
    `<span class="color-green">  ✔ opening mail client</span><br><br>` +
    `Reach me at ` +
    `<a href="mailto:${esc(PROFILE.email)}">${esc(PROFILE.email)}</a> ` +
    `or via the socials. ` +
    `<span class="color-dim">Thanks for trying this command — it's the one I'd run too.</span>`;
  await typewrite(text, { charDelay: 12, lineDelay: 50 });

  // Open mail client
  setTimeout(() => {
    window.location.href = `mailto:${PROFILE.email}?subject=Hi%20from%20your%20portfolio%20terminal`;
  }, 800);
}

/* ----------------------------------------------------------------
   Misc classic commands
---------------------------------------------------------------- */
function pwd() {
  // Pull the first plausible "username" out of PROFILE.name, but fall back
  // to "user" if the name is still a TODO placeholder.
  const first = (PROFILE.name || "").trim().split(/\s+/)[0] || "";
  const username =
    first && !first.toLowerCase().startsWith("todo") ? first.toLowerCase() : "user";
  write(`/home/${username}`, "line--out");
}
function date() {
  write(new Date().toString(), "line--out");
}
function uname(args) {
  if (args[0] === "-a") {
    write(
      `Portfolio portfolio 1.0.0 #1 SMP ${new Date().toDateString()} x86_64 GNU/Linux`,
      "line--out"
    );
  } else {
    write(`Portfolio`, "line--out");
  }
}
function who() {
  write(
    `<span class="color-cyan">user</span>   tty1   ${new Date().toDateString()} ${new Date().toTimeString().slice(0, 5)}`,
    "line--out"
  );
}
function echo(args) {
  write(esc(args.join(" ")), "line--out");
}
function history() {
  // We don't have access to the outer history array; show a hint.
  write(
    `<span class="color-muted">history is held in this tab. Try ↑/↓ in the input.</span>`,
    "line--out"
  );
}

/* ----------------------------------------------------------------
   Command registry
---------------------------------------------------------------- */
export const COMMANDS = {
  help,
  man: help,
  "?": help,

  neofetch,
  whoami,
  about,
  contact,
  socials: contact,

  projects,
  work: projects,

  ls,
  cat,

  wget,
  clear,

  theme,
  themes: theme,
  pwd,
  date,
  uname,
  who,
  echo,
  history,

  sudo: sudoHireMe,
};
