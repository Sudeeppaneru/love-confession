# 💌 Secret Confession Website

An interactive, privacy-first confession web application built with modern vanilla JavaScript, Web Crypto API, and Tailwind CSS. 

Create custom confession messages protected with end-to-end client-side encryption. The generated link contains the encrypted payload and key directly inside the URL hash, meaning no database or backend server ever sees the confession content.

---

## ✨ Features

- 🔒 **Zero-Database Privacy**: Messages are encrypted via **AES-GCM (256-bit)** using the native browser Web Crypto API.
- 🛡️ **Zero-Knowledge Links**: The encryption key is stored in the URL fragment identifier (`#k=...`), which browsers never send to the hosting server.
- 🎯 **Interactive & Playful UI**:
  - The "No" button dodges the cursor/taps whenever hovered or clicked.
  - Clicking "Yes" triggers floating heart animations.
- 📱 **Mobile & Responsive**: Designed to look clean and romantic across all devices.
- ⚡ **Zero Dependencies**: Pure static web application (HTML, CSS, ES Module JS).

---

## 📁 Project Structure

```text
├── assets/
│   └── pink-gradient.png     # Background graphic
├── css/
│   └── style.css             # Tailwind / project styling
├── js/
│   ├── crypter.js            # AES-GCM key generation, encryption & decryption
│   └── generator.js          # Form handling & link generation
├── pages/
│   └── 404.html              # Fallback page for invalid or broken links
├── confession.html           # Recipient view page
├── index.html                # Confession builder / sender page
└── README.md