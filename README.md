# 🏍️ Jack's Candlestick Run

A 2D browser runner game — Jack jumps over candlesticks, à la "Jack be nimble, Jack be quick" — built with a Flask + SQLite leaderboard API, containerized with Docker, and shipped through a CI/CD pipeline with automated testing and security scanning.

This project exists to demonstrate practical DevSecOps skills: not just building an app, but hardening it, testing it, containerizing it, scanning it for vulnerabilities, and automating all of that in a real pipeline.

**[🔗 Live Demo](#)** *(https://sizlau.github.io/jacks-candlestick-run/)*

![status](https://img.shields.io/badge/status-active-39e639)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)

---

## Overview

Jack runs left to right across the screen, jumping over candlesticks with gravity-based physics. When he hits one, the game ends, the player submits their name, and their score is saved to a leaderboard — served live from a Flask API and displayed on the page.

## Features

- **Canvas-based 2D game** — gravity, jump physics, scrolling obstacles, collision detection, and a hand-built scene (sky gradient, sun, clouds, ground, custom sprites)
- **Live leaderboard** — scores persist via a Flask + SQLite backend and update on the page without a refresh
- **Hardened API** — input validation (missing/invalid fields rejected with proper 400 responses), parameterized SQL queries (no injection risk), and try/except error handling that avoids leaking internal error details
- **Automated test suite** — pytest tests covering both the happy path and validation failure cases
- **Containerized backend** — packaged with Docker for portable, consistent deployment
- **CI/CD pipeline** — every push to `main` automatically runs tests, audits dependencies, builds the Docker image, and scans it for vulnerabilities

## Tech stack

- **Frontend:** HTML5 Canvas, vanilla JavaScript, CSS
- **Backend:** Python, Flask, SQLite
- **Testing:** pytest
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Security tooling:** pip-audit (dependency scanning), Trivy (container image scanning)

## Project structure
├── frontend/
│ ├── index.html
│ ├── style.css
│ ├── game.js
│ └── images/ # jack.svg, candlestick.svg
├── backend/
│ ├── app.py # Flask API
│ ├── test_app.py # pytest suite
│ ├── requirements.txt
│ └── Dockerfile
└── .github/workflows/
└── pipeline.yml # CI/CD pipeline

## How it works

The frontend fetches from and posts to a Flask API:
- `POST /scores` — validates and saves a player's name + score
- `GET /leaderboard` — returns the top scores, sorted highest first

Both endpoints are wrapped in error handling, and `/scores` rejects malformed requests (missing fields, wrong types, oversized names) before they ever touch the database.

## CI/CD pipeline

Every push or pull request to `main` triggers a pipeline that:

1. Checks out the code and sets up Python
2. Installs dependencies and runs the pytest suite
3. Runs `pip-audit` against installed packages — **fails the build** on known vulnerabilities
4. Builds the Docker image
5. Scans the image with Trivy — **fails the build** on CRITICAL vulnerabilities with an available fix

## Security notes

This project was built with a "shift left" mindset — security checks run automatically on every push, not as an afterthought.

**What the pipeline actually caught, while building this:**
- `pip-audit` flagged a real vulnerable version of `setuptools` in `requirements.txt` — fixed by upgrading, verified locally, then confirmed green in CI
- Trivy's initial scan surfaced 170+ findings, the overwhelming majority inherited from the Debian base OS image rather than anything in this project's own code
- One CRITICAL finding (a Perl regex bug in the base image) has no upstream fix available yet

**Gating policy:** the pipeline blocks on CRITICAL vulnerabilities *with a fix available* (`ignore-unfixed: true`). Vulnerabilities without a fix are still visible in scan output for monitoring, but don't block deployment — blocking indefinitely on something nobody can currently patch doesn't improve security, it just trains people to ignore a permanently red pipeline.

**Known limitations / next steps:**
- SQLite data isn't currently persisted outside the container (no volume mount) — a production version would use a persistent volume or a managed database
- The base image (`python:3.11-slim`, Debian-based) carries a lot of inherited OS-level CVEs; switching to a smaller/distroless base image would likely reduce this significantly
- No authentication on the leaderboard API — anyone can submit a score; acceptable for a portfolio project, not for production

## Running locally

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\Activate.ps1      # Windows PowerShell
pip install -r requirements.txt
python app.py

# Frontend
# Open frontend/index.html with a local server (e.g. VS Code Live Server)
```

## Running with Docker

```bash
cd backend
docker build -t jacks-candlestick-backend .
docker run -p 5000:5000 jacks-candlestick-backend
```

## What I learned building this

- Debugging real-world data quirks (hidden `\r` characters from CSV/line-ending issues, in an earlier related project)
- Structuring a Flask API with proper input validation and error handling
- Writing and running automated tests with pytest
- Containerizing an application with Docker, including host-binding gotchas (`127.0.0.1` vs `0.0.0.0` inside a container)
- Reading and triaging vulnerability scan output — distinguishing actionable findings from inherited base-image noise
- Building a CI/CD pipeline from scratch in GitHub Actions, including watching it fail on real issues and fixing them
- Making and documenting a defensible security gating policy, rather than either ignoring findings or blocking on everything


- This was my first ever project learning how to get all of these things working together as well as learning some new concepts in code. overall i really enjoyed this project and so much fun building it, getting stuck, debugging errors and fixing it was the best part. cant wait to keep making new projects and learning more and more!! **:)**

## Author

**Jack Hancock**