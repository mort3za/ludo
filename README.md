# 🎲 Ludo

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub stars](https://img.shields.io/github/stars/mort3za/ludo.svg)](https://github.com/mort3za/ludo/stargazers)

An in-browser **Ludo (Mensch ärgere Dich nicht / Mench)** board game — playable entirely offline as a Progressive Web App. Roll the dice, race your pieces home, and knock your opponents back to start.

**[Play Now](https://mort3za.github.io/ludo)**

![Ludo Game](https://mort3za.github.io/ludo/img/poster.png)

---

## Features

- **Offline-ready** — installable as a PWA; works with no internet connection after the first load.
- **Local multiplayer** — 2–4 players on the same device, taking turns.
- **Persistent state** — game progress is saved to local storage via Vuex so you can resume where you left off.
- **Fair dice** — randomness powered by the Mersenne Twister PRNG.
- **Responsive design** — plays well on phones, tablets, and desktops.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 2 + Vue Router + Vuex |
| Language | TypeScript (class-style components via `vue-class-component`) |
| Styling | SCSS + Bootstrap 4 + `sass-rem` |
| Tooling | Vue CLI 4, Babel, ESLint, Prettier |
| Testing | Jest (unit) · Cypress (e2e) |
| CI/CD | GitHub Actions → GitHub Pages |

## Getting Started

### Prerequisites

- **Node.js** ≥ 10
- **Yarn** (recommended) or npm

### Install & Run

```bash
# Clone the repo
git clone https://github.com/mort3za/ludo.git
cd ludo

# Install dependencies
yarn install

# Start the dev server (hot-reload)
yarn serve
```

The app will be available at `http://localhost:8080` (or the next free port).

## License

This project is licensed under the **GNU General Public License v3.0** — see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Built with Vue.js, TypeScript, and a love for classic board games.
