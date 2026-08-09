# portfolio

A personal portfolio styled as a Linux terminal (CachyOS / Catppuccin aesthetic).
Static site, zero backend, $0/month on Google Cloud Run.

**Live:** https://portfolio-153338224716.europe-west1.run.app

## What's here

- Hybrid terminal: an autoplay intro sequence (asciinema-style) hands off to a
  real interactive prompt.
- Whitelisted command parser (no real shell, no XSS through command input).
- CachyOS / Catppuccin palette with JetBrains Mono, a blinking block cursor,
  and a 16-line neofetch-style logo.
- Project cards with live demo + GitHub links (no "coming soon" entries).
- CV served as a static PDF — no auth, no download tracking, no backend.
- Mobile-friendly, accessible (focusable input, role=log screen, ARIA labels),
  honors `prefers-reduced-motion`.

## Commands

| command              | what it does                                         |
| -------------------- | ---------------------------------------------------- |
| `neofetch`           | banner with role, stack, location, "uptime"          |
| `whoami`             | one-paragraph bio                                    |
| `about`              | longer bio and career story (`cat about.md`)         |
| `projects`           | current work + shipped projects at a glance (`work`) |
| `ls`                 | list directory contents (`ls projects/`, `ls socials/`) |
| `cat`                | read a file (`cat projects/<slug>.md` for full card) |
| `contact`            | GitHub / LinkedIn / email                            |
| `theme`              | list or switch color theme (cachyos · matrix · solarized · tokyo, persisted) |
| `wget cv.pdf`        | download the CV (real `<a download>`)                |
| `clear`              | clear the screen (Ctrl+L too)                        |
| `help` / `man`       | list commands                                        |
| `sudo hire-me`       | easter egg, opens your mail client                   |
| `date` / `pwd` / `uname -a` | the classics                                    |

Tab completes commands, ↑/↓ walks history, Ctrl+L clears, Ctrl+C cancels
the current line.

## Tech

- **Plain HTML / CSS / ES modules** — no framework, no build step.
- **nginx:alpine** for serving — small image, fast cold starts.
- **Google Cloud Run** for hosting — free tier covers a portfolio site.
- Fonts: JetBrains Mono (Google Fonts) with system monospace fallbacks.

No npm install. No bundler. No node_modules.

## Project structure

```
.
├── index.html        # single page; the terminal markup
├── style.css         # CachyOS / Catppuccin palette + terminal styling, themes
├── main.js           # autoplay, input handling, tab completion, history
├── data.js           # profile, projects, command implementations
├── nginx.conf        # Cloud Run nginx config (port templated at start)
├── entrypoint.sh     # injects $PORT into nginx.conf and runs nginx
├── Dockerfile        # nginx:1.27-alpine + static assets
├── scripts/
│   ├── pyproject.toml
│   └── img2ascii.py  # image -> ASCII art (for the neofetch logo)
├── .dockerignore
└── cv.pdf, resume.pdf   # drop in before building (optional)
```

## Generating the neofetch logo from an image

`data.js` ships with a hand-coded CachyOS-style ASCII logo. To replace it
with one generated from your own image (your initials, a real CachyOS
logo PNG, anything):

```sh
# One-time: install Pillow into a venv for the tooling
uv sync --project scripts    # or: pip install -r scripts/requirements.txt

# Convert
uv run --project scripts scripts/img2ascii.py path/to/logo.png --width 50 --invert --as-js
```

The output is a `const LOGO = [...]` block you paste over the existing
`LOGO` constant in `data.js`. The site colors it via CSS (per theme), so
the ASCII just needs to be the right shape.

Useful flags:

| flag          | what it does                                                    |
| ------------- | --------------------------------------------------------------- |
| `--width N`   | output width in characters (40–60 is a good range)              |
| `--ramp`      | `default` (70 chars, classic), `simple` (10 chars), or `block` (Unicode ░▒▓█) |
| `--invert`    | use for dark-on-light source images                             |
| `--aspect`    | vertical squish factor (default 0.5, tuned for JetBrains Mono)  |
| `--as-js`     | wrap as a `const LOGO = [...]` literal ready to paste           |
| `--out file`  | write to a file instead of stdout                               |

Tweak `--width` and `--invert` until the result looks like a logo at a
glance, not a noisy gradient.

## Local development

```sh
# Any static file server works. Python is fine:
python3 -m http.server 8000

# Or, if you have Node:
npx --yes serve -l 8000 .
```

Open <http://localhost:8000>.

The site has no build step, so editing any file and refreshing the browser
is the whole dev loop.

## Deploy to Google Cloud Run

Two things: a one-time GCP bootstrap (you do on your laptop), and CI that
handles every subsequent deploy automatically.

### 1. One-time GCP bootstrap

Run these once with `gcloud` authenticated and a project selected. Replace
`YOUR_GH_USER` with the GitHub user/org that owns this repo and
`YOUR_GCP_PROJECT` with the GCP project id.

```sh
PROJECT=YOUR_GCP_PROJECT
REGION=europe-west1
REPO=portfolio
SA="github-deploy@${PROJECT}.iam.gserviceaccount.com"

# APIs
gcloud services enable \
  run.googleapis.com artifactregistry.googleapis.com \
  iamcredentials.googleapis.com

# Artifact Registry
gcloud artifacts repositories create $REPO \
  --repository-format=docker --location=$REGION

# Service account for deploys (least-privilege roles)
gcloud iam service-accounts create github-deploy --display-name="GitHub deploy"
for role in roles/run.admin roles/artifactregistry.writer roles/iam.serviceAccountUser; do
  gcloud projects add-iam-policy-binding $PROJECT \
    --member="serviceAccount:$SA" --role="$role"
done

# Workload Identity Federation — GitHub OIDC, no JSON keys
gcloud iam workload-identity-pools create github --location=global --display-name="GitHub"
gcloud iam workload-identity-pools providers create-oidc github \
  --location=global \
  --workload-identity-pool=github \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
  --attribute-condition="assertion.repository=='YOUR_GH_USER/portfolio'"

PROJECT_NUMBER=$(gcloud projects describe $PROJECT --format='value(projectNumber)')
gcloud iam service-accounts add-iam-policy-binding $SA \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github/attribute.repository/YOUR_GH_USER/portfolio"

# Capture the WIF provider resource name — you'll put it in GitHub next.
gcloud iam workload-identity-pools providers describe github \
  --location=global --workload-identity-pool=github \
  --format='value(name)'
```

### 2. GitHub repo config

In **Settings → Secrets and variables → Actions → Variables**, add:

| Variable | Example |
|---|---|
| `GCP_PROJECT_ID` | `your-gcp-project` |
| `GCP_REGION` | `europe-west1` |
| `GCP_ARTIFACT_REPO` | `portfolio` |
| `GCP_SERVICE_NAME` | `portfolio` |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/<number>/locations/global/workloadIdentityPools/github/providers/github` |
| `GCP_SERVICE_ACCOUNT` | `github-deploy@your-gcp-project.iam.gserviceaccount.com` |

No secrets are required.

### 3. First deploy (bootstrap the Cloud Run service)

Build and push a `bootstrap` image from your laptop, then deploy it once
manually so the Cloud Run service exists. After this, CI owns deploys.

```sh
docker build -t ${REGION}-docker.pkg.dev/${PROJECT}/${REPO}/site:bootstrap .
docker push  ${REGION}-docker.pkg.dev/${PROJECT}/${REPO}/site:bootstrap

gcloud run deploy portfolio \
  --image=${REGION}-docker.pkg.dev/${PROJECT}/${REPO}/site:bootstrap \
  --region=$REGION \
  --allow-unauthenticated \
  --memory=128Mi --cpu=1 \
  --min-instances=0 --max-instances=1 --concurrency=80
```

### 4. Continuous deployment

From here on, every push to `main` builds, pushes a new image, and
rolls Cloud Run — no manual steps.

- `.github/workflows/ci.yml` — runs on every PR: builds the image and
  smoke-tests the container (catches Dockerfile regressions before they
  reach `main`).
- `.github/workflows/deploy.yml` — runs on push to `main`: builds, pushes
  the image tagged `sha-<7-char>` and `latest`, and deploys to Cloud Run.
  Uses the WIF service account — no long-lived keys in GitHub.

**Rollback.** The Cloud Run console shows each deploy as a separate
revision; send 100% traffic to an older revision to roll back. Or push
a revert commit — CI redeploys within ~30 s. The `deploy-production`
concurrency group queues deploys, never cancels one in flight.

Cost: stays in the Cloud Run free tier (2M requests / month, 360k GB-seconds)
as long as traffic stays small — which a portfolio site does.

## Customising

All personal data lives in `data.js`:

- `PROFILE` — name, role, company, contact, languages, bio
- `PROJECTS` — array of project cards; each entry has `slug`, `title`,
  `summary`, `stack`, `status`, `github`, `demo`, `origin`, `details`
- `SOCIALS` — derived from `PROFILE.socials`

The current data mirrors `samples/my_resume.yaml` in this repo's parent
project. To update, edit either file and keep them in sync. For new
projects, add an entry to `PROJECTS` and run `ls projects/` again — the
terminal will pick it up automatically.

If you don't have a live demo for a project, leave `demo: null` — the
site will honestly show `TODO — not published yet` instead of a 404
link.

Then rebuild and redeploy.

## Accessibility

- The terminal screen is a `role="log"` `aria-live="polite"` region.
- Input has a label, focus is preserved, the cursor is visible.
- The autoplay can be skipped with any key or click.
- All animations honor `prefers-reduced-motion: reduce`.

## License

Code: MIT. Content (the bio, project descriptions, copy): yours, but
be honest — the site makes a point of being that, and so should yours.
