# ⚡ Digify Soft Solutions™ - Lead Intelligence Engine
> **B2B Outbound Lead Harvester, Pipeline Manager & 1-Click Outreach System**  
> Specially engineered for **Digify Soft Solutions** (*Retail ERP, Smart POS, Manufacturing BOM & IT Services*)

---

## 🌟 Overview

The **Digify Lead Generator System** is an end-to-end B2B outbound customer acquisition platform. It allows the sales and growth team at Digify to:
1. **Extract verified business leads** directly from Google Maps in 60+ Indian commercial hubs (Surat, Ahmedabad, Jaipur, Indore, Mumbai, Pune, Delhi NCR, etc.).
2. **Auto-filter High Priority Prospects**:
   - 🔥 **No Website**: Prime targets for custom corporate websites, e-commerce, and cloud ERP.
   - 🌐 **Has Website**: Prime targets for POS modernization, ERP migration, and SEO upgrades.
3. **Dispatch 1-Click WhatsApp & Email Pitches** tailored to each niche (Supermarket POS, Garment Matrix, Manufacturing BOM, Restaurant QR/KOT, Pharmacy Expiry, etc.).
4. **Track Lead Lifecycle**: From `New` ➔ `Contacted` ➔ `Pitch Sent` ➔ `Demo Scheduled` ➔ `In Discussion` ➔ `Closed Won`.

---

## 🚀 How To Run The System

You have 3 easy ways to run this system:

### Option 1: 1-Click Windows Launcher (Recommended)
Simply **double-click** the file:
```bash
run_digify_leads.bat
```
It launches the local server and automatically opens the dashboard in your default browser at `http://localhost:3030`.

### Option 2: Direct Open (Zero-Dependency)
Double-click `index.html` directly in Windows Explorer to open it in Chrome or Edge. It works 100% offline with zero setup required!

### Option 3: Terminal / Node.js
```bash
npm start
# or: node server.js
```

---

## 📍 Google Maps Lead Harvesting Guide

### Method A: ⭐ 1-Click Bookmarklet (Super Fast & Zero-Error)
1. Open the dashboard and click the **"⭐ 1-Click Bookmarklet"** button at the top.
2. Drag the **"⭐ Digify Maps Scraper"** button into your Chrome/Edge Bookmarks Bar.
3. In the Harvester section, pick your target category (e.g. *Supermarkets & Grocery*) and city (e.g. *Surat*).
4. Click **"Search on Google Maps"**.
5. Once the Google Maps page loads, **just click your bookmark!**
6. An on-screen floating HUD will show live scrolling and lead extraction. The CSV file will automatically download to your computer!
7. Drag & drop the downloaded CSV back into the Digify portal.

### Method B: Console Script
1. On Google Maps, press `F12` on your keyboard.
2. Click on the **Console** tab.
3. Click **"Scraper Script"** in the portal, copy the code, paste it into the console, and press `Enter`.
4. *Note: Our script automatically runs `console.clear()` to mute Google's internal preload service worker messages, giving you a clean green progress indicator.*

---

## 🎯 Target Categories & Tailored Pitch Engines

| Category | High-Value Pain Points | Digify Solution Pitch |
| :--- | :--- | :--- |
| **🛒 Supermarket & Grocery** | Long checkout queues, weighing scale sync, stock expiry | Ultra-fast barcode POS, weighing scale sync, low stock alerts, thermal printing |
| **👗 Garments & Fashion** | Size/color matrix, seasonal inventory, lack of barcodes | S/M/L/XL size-color matrix, custom barcode tags, digital WhatsApp catalogue |
| **🏭 Manufacturing & Factories** | Raw material waste, WIP tracking, manual challans | Bill of Materials (BOM), production planning, GST e-Way bills & e-Invoicing |
| **🍽️ Restaurants & Bakeries** | 25-30% Swiggy/Zomato commission, KOT confusion | Direct table QR ordering, Kitchen Order Ticket (KOT), split billing, POS |
| **💊 Pharmacy & Healthcare** | Expiry losses, batch tracking, drug regulation | Batch & expiry auto-alerts, salt replacement search, 100% GST chemist billing |
| **🌐 Web & IT Upgrades** | Outdated or missing websites, low Google ranking | High-speed responsive websites, Android/iOS mobile apps, Google Search SEO |

---

## 📂 Project Structure

```
Digify-Lead-Generator-System/
├── index.html                    # Master Dashboard Single Page Web Application
├── server.js                     # Built-in zero-dependency local Node server
├── run_digify_leads.bat          # 1-Click Windows Batch Launcher
├── package.json                  # Standard npm config
├── README.md                     # Comprehensive documentation
├── assets/
│   └── images/
│       ├── logo.png              # Digify brand logo
│       ├── favicon.png           # Digify browser favicon
│       └── logo_icon.png         # Digify brand icon
└── scraper/
    ├── digify_maps_scraper.js    # Raw standalone scraper code with HUD
    └── bookmarklet.txt           # Minified bookmarklet URL
```

---

## 🔒 Data Privacy & Offline Persistence
All leads, notes, and pipeline statuses are saved directly in your browser's local storage and can be exported at any time via **Export CSV** or **Backup JSON**. No external database configuration required.

*Built with ❤️ for Digify Soft Solutions.*
