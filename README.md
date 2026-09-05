# 🏛️ Campus Notice Copilot for WhatsApp 🚀
### Production Chrome Extension (Manifest v3) Auto-Extracting Campus Notices, Exam Dates & Deadlines

<p align="center">
  <a href="https://github.com/nandhakumar-murugan"><img src="https://img.shields.io/badge/Author-Nandhakumar_Murugan-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Author" /></a>
  <a href="https://www.kgkite.ac.in"><img src="https://img.shields.io/badge/Campus-KGiSL_Institute_of_Technology-EA4335?style=for-the-badge&logo=googleclassroom&logoColor=white" alt="Campus" /></a>
  <img src="https://img.shields.io/badge/Chrome_Extension-Manifest_v3-34A853?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Manifest v3" />
  <img src="https://img.shields.io/badge/Target-WhatsApp_Web-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="WhatsApp Web" />
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache_2.0-green.svg?style=for-the-badge" alt="License" /></a>
  <a href="https://github.com/nandhakumar-murugan/KGISL-CAMPUS-SOLVERS"><img src="https://img.shields.io/badge/Part_of-KGISL--CAMPUS--SOLVERS-8A2BE2?style=for-the-badge&logo=github&logoColor=white" alt="KGISL Solvers" /></a>
</p>

---

**Campus Notice Copilot** is a lightweight, zero-cloud, 100% private Google Chrome extension that silently monitors your **WhatsApp Web** tabs, detects official college circulars, exam dates, CIA test timetables, and homework deadlines, and organizes them into an elegant floating slide-out drawer with **1-click Google Calendar sync**.

---

## ✨ Features

* 🚨 **Automated Categorization**: Automatically classifies incoming messages into:
  * **Exams & Cutoffs** (`CIA`, `Arrears`, `Hall Tickets`, `Timetables`)
  * **Official Circulars** (`College policies`, `Holidays`, `Directives`)
  * **Assignments & Labs** (`Homework`, `Submissions`, `Record note deadlines`)
* 📅 **1-Click Google Calendar Sync**: Every detected notice has an **Add to Calendar** action pre-filling the title, time, and full notice details directly in Google Calendar.
* 📌 **Non-Intrusive Drawer**: Floats neatly on the bottom-right corner of WhatsApp Web. Open or collapse anytime with a single click.
* 🔍 **Instant Search & Filter**: Filter notices by category pills or search for specific subjects and faculty names.
* 📥 **Markdown Export**: Export your semester notice digest into a formatted `.md` file with one click.
* 🔒 **100% Client-Side Privacy**: No external servers. All processing runs locally inside your browser sandbox (`chrome.storage.local`).

---

## 🚀 Quickstart (Installation in 20 Seconds)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/nandhakumar-murugan/campus-notice-copilot-extension.git
   ```
2. Open **Google Chrome** (or Microsoft Edge / Brave).
3. Navigate to `chrome://extensions/` in your browser.
4. Enable **Developer mode** (toggle switch in the top right).
5. Click **Load unpacked** (top left).
6. Select the cloned `campus-notice-copilot-extension` folder.
7. Open **[web.whatsapp.com](https://web.whatsapp.com)** and refresh the tab!

---

## 🛠️ Architecture & Tech Stack

```
campus-notice-copilot-extension/
├── manifest.json       # Chrome Manifest v3 specification
├── background.js       # Event-driven background service worker
├── content.js          # WhatsApp Web DOM MutationObserver & parser
├── content.css         # Material Design 3 drawer and card styles
├── popup.html          # Toolbar popup interface
├── popup.js            # Quick stats & category counts
├── popup.css           # Popup styles
├── icons/              # Multi-resolution extension icons (16, 48, 128)
└── README.md           # Documentation
```

* **Core Engine**: Pure JavaScript (ES6+), Chrome Storage API, MutationObserver DOM interception.
* **Styling**: Material Design 3 palette (Google Blue `#1A73E8`, Google Green `#34A853`, Red `#EA4335`).

---

## 👨‍💻 Author & Maintainer

* **Nandhakumar Murugan**
  * *Google Student Ambassador (GID: 36) | Founder @ Prema AI Labs*
  * Lead Maintainer: [KGISL-CAMPUS-SOLVERS](https://github.com/nandhakumar-murugan/KGISL-CAMPUS-SOLVERS)
  * LinkedIn: [linkedin.com/in/nandhakumar-murugan](https://www.linkedin.com/in/nandhakumar-murugan/)
  * GitHub: [@nandhakumar-murugan](https://github.com/nandhakumar-murugan)

---

## 📜 License
This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.
