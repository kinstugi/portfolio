# AGENTS.md — Terminal Portfolio Site

## Project Goal
A personal portfolio site styled as a Linux terminal (CachyOS-inspired neofetch aesthetic), deployed free on Google Cloud Run. Primary purpose: **get hired** for Python / Kafka / backend / LLM-focused roles in Germany/Netherlands. Every design and content decision should be filtered through "does this make a hiring manager trust this person can build production software?"

## Owner Context
- Senior Software Engineer, currently at TradeComply
- Core stack to highlight: Python (FastAPI, Pydantic), Kafka, LLMs/AI tooling, React, C/C++
- Background: Mechatronics Engineering + embedded systems, M.Sc. Software Engineering (Kocaeli University)
- Currently doing 42 Heilbronn Core Curriculum (Systems & C)
- Based in Heilbronn, Germany; open to relocation (incl. Netherlands)
- Job search is active — CV/cover letters emphasize honesty (gaps named explicitly, German level A2 disclosed transparently, no fabricated skills). **This site must follow the same principle: no inflated claims, no fake metrics.**

## Concept
Fake shell session, not a real OS emulator. Auto-typed intro sequence (asciinema-style) that hands control to the user afterward for a hybrid feel. Neofetch-style banner replaces system specs with career specs.

## Command Set (MVP)
- `neofetch` — banner: role, stack (Python, FastAPI, Kafka, LLMs, React, C/C++), location, "uptime" (years experience), current focus (42 Heilbronn)
- `whoami` — one-paragraph bio
- `cat about.md` — longer narrative, career story, honesty about the German-market transition
- `ls projects/` — list project folders
- `cat projects/<name>.md` — per-project details (see Project Card Spec below)
- `wget cv.pdf` / `cat resume.pdf` — downloads actual CV PDF, no backend required
- `cat contact.txt` / `ls socials/` — GitHub, LinkedIn, email, styled as clickable terminal links
- `help` / `man` — lists commands
- `clear` — clears screen
- `sudo hire-me` — easter egg → mailto: link or playful response

## Project Card Spec (critical for hiring signal)
Every project entry must include, when available:
- **Live demo URL** — actual running instance (Cloud Run, Vercel, etc.), not just "coming soon"
- **GitHub URL** — public repo link (start here; consider a dedicated org/profile README later)
- **Stack** — explicit tech list, matches what's in the job description language recruiters scan for (lead with Python/FastAPI/Kafka/LLM where relevant)
- **One-line problem statement** — what it does and why it exists, not just tech buzzwords
- **Status** — be honest: "in progress", "hackathon prototype", "production", etc. — consistent with the no-fabrication principle above

Known candidate projects to eventually list (verify status before publishing):
- B-Plan footprint extraction pipeline (hackathon, German B-Plan PDFs → CityJSON)
- CV tailoring/matching platform (Python, uv, pydantic_ai, FastAPI, Kafka, Redis, Groq)
- Multi-agent CV generation system (Node.js)
- Karaoke session app (Dockerized, Kafka + ML vocal separation)
- SSE screenshot Flutter app

## Tech Stack (site itself)
- Static-first: plain HTML/CSS/JS or lightweight React/Vite build — no backend needed for MVP
- CV is a static PDF served from `/public` — zero server cost
- Monospace font: JetBrains Mono / Fira Code / Cascadia Code
- Color palette: CachyOS-inspired deep purple/blue background with cyan/green/magenta accents — avoid generic green-on-black
- Prompt styled `user@portfolio:~$` with blinking block cursor

## Deployment (Google Cloud Run)
- Goal: **$0/month** — Cloud Run free tier (2M requests, 360k GB-seconds/month) easily covers a portfolio site
- Serve via minimal nginx or a tiny Node static server in the container — keep image small for fast cold starts
- Containerize with a slim base image (e.g. `nginx:alpine` or `node:XX-slim`)
- Consider a custom domain later (Cloud Run supports domain mapping) — a real domain reads better on a CV than a `*.run.app` URL
- CI: manual `gcloud run deploy` is fine for MVP; GitHub Actions auto-deploy on push to `main` is a good "shows CI/CD literacy" upgrade later

## Hiring-Signal Checklist (things that make this site work harder for the job search)
- [ ] Every project links to a **live, working demo** — dead links or "localhost only" projects hurt more than help
- [ ] GitHub links go to clean, README-documented repos (README quality matters as much as the site)
- [ ] CV download is always in sync with the latest tailored version
- [ ] Contact info is current and works (test the mailto/LinkedIn links)
- [ ] Site loads fast and works on mobile — recruiters often click through on phones
- [ ] No placeholder/lorem-ipsum content ships to production
- [ ] Optional: `README.md` in the portfolio repo itself is well-written — recruiters and engineers who "view source" on GitHub form an impression too

## Open Decisions
- Autoplay-only vs. hybrid (autoplay intro → real input) — leaning hybrid per earlier discussion
- Plain HTML/JS vs. React/Vite — TBD based on how much interactivity is wanted
- Whether to add a real command parser now or fake it with a scripted command whitelist first

## Non-Goals (for now)
- No backend/database — keep it static + serverless-simple
- No real authentication or admin panel
- No over-engineering the "OS simulation" (no fake file system persistence, no real shell scripting)
