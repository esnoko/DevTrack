# DevTrack

> GitHub developer analytics platform — score, visualize, and interpret any GitHub profile in seconds.

**Live demo:** _coming soon_

---

## Overview

DevTrack analyzes any public GitHub profile and surfaces a structured picture of a developer's activity, consistency, and project quality. Enter a username, get a full analytics report: hireability score, commit trends, role-fit breakdown, and actionable insights — all computed server-side.

Built to demonstrate **layered backend architecture**, **analytics pipeline design**, and **clean frontend data visualization** — not another CRUD app.

---

## Screenshots

### Dashboard Overview

![DevTrack dashboard overview](./frontend/public/assets/images/v1%20image.png)

### Charts and Insights

![DevTrack charts and insights](./frontend/public/assets/images/v2%20image.png)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4, Recharts |
| Backend | Node.js 22, Express 4 |
| API | GitHub REST API v3 (public, no auth required) |
| Caching | In-memory TTL cache (server-side) |
| Deployment | Frontend → Vercel · Backend → Render |

---

## Architecture

```
DevTrack/
├── backend/                  # Express API server
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Error handling, 404
│   ├── routes/               # API route definitions
│   ├── services/
│   │   ├── builders/         # Transform raw GitHub data into domain objects
│   │   ├── cache/            # In-memory TTL cache
│   │   ├── github/           # GitHub API client
│   │   ├── insights/         # Text insight generation
│   │   └── scoring/          # Hireability + role-fit scoring
│   └── utils/                # Shared response helpers
│
└── frontend/                 # Vite + React SPA
    └── src/
        ├── components/
        │   ├── cards/        # HeaderCard, RepoSummaryCard, InsightsCard
        │   ├── charts/       # CommitChart (LineChart), RoleFitChart (BarChart)
        │   └── common/       # SearchBar, Loader, ErrorMessage
        ├── hooks/            # useGithubProfile (fetch / loading / error / abort)
        ├── pages/            # Dashboard
        ├── services/         # githubApi.js (HTTP client)
        └── utils/            # scoreTone.js (threshold color logic)
```

**Design principle:** the backend is the analytics engine. The frontend is a display platform. Zero business logic lives in React components.

---

## API

### `GET /api/v1/github/:username`

Fetches and analyzes a GitHub user profile.

Example request:

```http
GET /api/v1/github/esnoko
```

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "esnoko",
    "repositorySummary": {
      "totalRepositories": 7,
      "totalStars": 5,
      "totalForks": 0,
      "totalOpenIssues": 0,
      "mostStarredRepository": {
        "name": "HexSoftwares_Exclusive-Music-player",
        "stars": 2,
        "url": "https://github.com/esnoko/HexSoftwares_Exclusive-Music-player"
      }
    },
    "languageBreakdown": [
      {
        "language": "CSS",
        "repositoryCount": 4,
        "percentage": 57.14
      },
      {
        "language": "JavaScript",
        "repositoryCount": 1,
        "percentage": 14.29
      }
    ],
    "repoQualityIndicators": {
      "repositoriesAnalyzed": 7,
      "repositoriesWithDescription": 4,
      "repositoriesWithLicense": 1,
      "repositoriesWithTopics": 4,
      "recentlyUpdatedRepositories": 5
    },
    "commitActivity": [
      { "week": "2026-W09", "commits": 0 },
      { "week": "2026-W10", "commits": 0 },
      { "week": "2026-W11", "commits": 0 },
      { "week": "2026-W12", "commits": 0 },
      { "week": "2026-W13", "commits": 0 },
      { "week": "2026-W14", "commits": 0 },
      { "week": "2026-W15", "commits": 0 },
      { "week": "2026-W16", "commits": 0 },
      { "week": "2026-W17", "commits": 0 },
      { "week": "2026-W18", "commits": 0 },
      { "week": "2026-W19", "commits": 8 },
      { "week": "2026-W20", "commits": 8 }
    ],
    "hireabilityScore": 30,
    "scoreBreakdown": [
      { "category": "Commit Consistency", "score": 7 },
      { "category": "Repository Quality", "score": 14 },
      { "category": "Project Engagement", "score": 6 },
      { "category": "Activity Level", "score": 3 }
    ],
    "insights": {
      "summary": "Early to mid-stage profile; improving consistency and quality would help most.",
      "strengths": [
        "Has a baseline GitHub presence to build on."
      ],
      "weaknesses": [
        "Commit history is inconsistent across recent weeks."
      ],
      "roleFit": { "frontend": 33, "backend": 28, "fullstack": 31 },
      "recommendation": "Not ready for applications; focus on building consistent projects for frontend roles."
    }
  },
  "meta": {
    "cached": true,
    "timestamp": "2026-05-13T00:01:53.967Z"
  }
}
```

**Headers:**
- `X-Cache: HIT | MISS` — whether the result was served from cache

---

### `GET /api/v1/health`

Returns server status.

---

## Scoring Methodology

The **hireability score** (0–100) is a weighted composite of four signals computed entirely from public GitHub data:

| Signal | Weight | What it measures |
|---|---|---|
| Commit Consistency | 40% | Active weeks ratio and longest inactivity gap over 12 weeks |
| Repository Quality | 30% | Descriptions, licenses, and recently-updated repos ratio |
| Project Engagement | 20% | Stars + forks as a proxy for community traction |
| Activity Recency | 10% | Whether the developer pushed code in the last 4 weeks |

**Role Fit** scores (Frontend / Backend / Fullstack) are derived from weighted combinations of the engagement, quality, and consistency signals — and reflect relative aptitude, not absolute skill.

Score thresholds:
- 🟢 70–100 — strong
- 🟡 40–69 — developing
- 🔴 0–39 — early stage

> **Note:** Scores are based solely on public events and repository metadata available through the GitHub REST API. Commit counts reflect push events (1 push = 1 unit), not commit message counts. Private repositories are not analyzed.

---

## Local Setup

### Prerequisites

- Node.js 18+
- A GitHub account (optional — for a Personal Access Token to avoid rate limits)

### 1. Clone the repository

```bash
git clone https://github.com/esnoko/DevTrack.git
cd DevTrack
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API will be available at `http://localhost:5000`.

**Optional:** Add your GitHub token to `backend/.env` to raise the rate limit from 60 to 5,000 requests/hour:
```
GITHUB_TOKEN=ghp_your_token_here
```
Create a token at [github.com/settings/tokens](https://github.com/settings/tokens) — no scopes required for public data.

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import the repository in [vercel.com](https://vercel.com)
3. Set **Root Directory** to `frontend`
4. Add environment variable: `VITE_API_BASE_URL=https://your-backend-url.onrender.com/api/v1`

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Set **Root Directory** to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables: `PORT`, `GITHUB_TOKEN` (optional), `CACHE_TTL_SECONDS`

---

## Future Improvements

- **Profile Comparison** — side-by-side analytics for two GitHub users
- **GitHub OAuth** — analyze private repos, higher rate limits, user sessions
- **Database Persistence** — store analyses over time, show score trends
- **Streak Analysis** — detect contribution streaks and gaps with pattern recognition
- **Language Breakdown Chart** — visualize language distribution across repositories
- **CI/CD** — GitHub Actions for lint, type-check, and build validation
- **Testing** — Vitest for frontend utils, Supertest for API routes

---

## License

MIT
