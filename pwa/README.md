# Daily Tasks PWA

A personal task manager that works as a Progressive Web App (PWA) — installable on iPhone from Safari.

---

## Setup (one time)

### 1. Generate your app icons

Open `generate-icons.html` in any browser (just double-click it).  
Click all three buttons to download:
- `icon-192.png`
- `icon-512.png`
- `apple-touch-icon.png`

Move all three files into the `public/icons/` folder.

---

### 2. Upload to GitHub

1. Go to [github.com](https://github.com) and create a **new repository** (name it anything, e.g. `daily-tasks`)
2. Upload all the files from this project into the repo (drag and drop works in the GitHub UI)
3. Make sure the branch is named **`main`**

---

### 3. Enable GitHub Pages

1. In your repo, go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

GitHub will automatically build and deploy the app every time you push to `main`.  
The first deploy takes ~2 minutes. After that, your app is live at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

---

## Installing on iPhone as a PWA

1. Open the app URL in **Safari** on your iPhone (must be Safari, not Chrome)
2. Tap the **Share** button (the box with an arrow at the bottom)
3. Scroll down and tap **"Add to Home Screen"**
4. Give it a name and tap **Add**

The app icon will appear on your home screen. Opening it will launch the app in full-screen mode with no browser UI, exactly like a native app.

---

## Features

- Multiple users and topics
- Task priorities, due dates, and recurrence
- Urgency color coding (red = today/overdue, orange = 2 days left)
- Light and dark themes
- Export tasks as `.ics` to add reminders to Apple Calendar
- Import/export backups per user or full backup
- Fully offline — works without internet after first load
- Data saved locally on your device (localStorage)

---

## Project structure

```
├── .github/workflows/deploy.yml   ← auto-deploys to GitHub Pages
├── public/
│   └── icons/                     ← put your PNG icons here
├── src/
│   ├── App.jsx                    ← the entire app
│   └── main.jsx                   ← React entry point
├── generate-icons.html            ← open in browser to create PNG icons
├── index.html                     ← HTML shell with PWA meta tags
├── package.json
└── vite.config.js                 ← Vite + PWA plugin config
```
