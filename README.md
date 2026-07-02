# Yameen Alsaaidah — Portfolio

[![Live Website](https://img.shields.io/badge/Visit-yameenrizeq.com-bc4a1c?style=for-the-badge)](https://yameenrizeq.com)
[![GitHub Source](https://img.shields.io/badge/Source-Code-black?style=for-the-badge&logo=github)](https://github.com/Yameen05/portfolio)

**Official portfolio website** showcasing my projects, skills, and journey as a senior Computer Science student at UNC Charlotte pursuing B.S. and Early Entry M.S. degrees. Hosted on a custom domain (`yameenrizeq.com`).

## ✨ Design & Features

An editorial **"Ink & Paper"** design system — Fraunces serif display type, warm paper light theme, deep ink dark theme, and a single burnt-orange accent.

- **Dark + light themes** — respects `prefers-color-scheme`, persists choice in `localStorage`, no flash on load
- **Zero external dependencies** — self-hosted variable fonts (Fraunces, Inter, JetBrains Mono), inline SVG icons, no CDN requests
- **Hand-built project previews** — each project card renders a miniature UI mock in pure CSS that adapts to both themes
- **Scroll-activated reveals** via the IntersectionObserver API, with full `prefers-reduced-motion` support
- **Fully responsive** — verified from 320 px phones to 1920 px desktops with no horizontal overflow
- **Accessible** — skip link, focus-visible styles, aria labels, semantic landmarks

## 🛠️ Tech Stack

| Component       | Technologies Used |
|-----------------|-------------------|
| **Frontend**    | HTML5, CSS3 (custom properties, `color-mix`, grid), vanilla JavaScript |
| **Typography**  | Fraunces, Inter, JetBrains Mono (self-hosted woff2) |
| **Hosting**     | Custom domain (yameenrizeq.com) + GitHub Pages |

## 📂 Project Structure

```
portfolio/
├── CNAME                # Custom domain configuration
├── index.html           # Main page (inline SVG icon sprite, all sections)
├── styles.css           # Design system: tokens, themes, layout, responsive
├── script.js            # Theme, menu, reveals, counters, clock, contact form
├── fonts/               # Self-hosted woff2 fonts
├── pics/                # Portrait, favicon, assets
└── files/
    └── YameenAlsaaidah_Resume.pdf
```

## 🔧 Local Development

```bash
git clone https://github.com/Yameen05/portfolio.git
cd portfolio
python3 -m http.server 3456
# open http://localhost:3456
```

## 🚀 Deployment

- **Hosted on**: GitHub Pages (with custom CNAME for `yameenrizeq.com`)
- **SSL**: Enabled via GitHub Pages (automatic HTTPS)
