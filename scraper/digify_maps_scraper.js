/**
 * ⚡ DIGIFY SOFT SOLUTIONS™ - Google Maps Lead Scraper & Extractor
 * Official B2B Lead Harvester for Retail ERP, POS, Manufacturing & IT Services
 * 
 * Instructions:
 * 1. Open Google Maps (https://maps.google.com) and search your target (e.g., "Supermarkets in Surat")
 * 2. Press F12 -> Go to Console tab -> Paste this script and press Enter.
 * 3. Or use the 1-Click Bookmarklet to run it with a single click without opening DevTools!
 */

(async function runDigifyMapsScraper() {
  // 1. Clear any Google background service worker messages
  console.clear();

  console.log("%c⚡ [Digify Soft Solutions] Starting Outbound Lead Extractor...", "background: #2563eb; color: #fff; font-size: 14px; font-weight: bold; padding: 6px 12px; border-radius: 6px;");

  // 2. Inject floating on-screen HUD (Heads-Up Display) inside Google Maps
  const existingHud = document.getElementById("digify-scraper-hud");
  if (existingHud) existingHud.remove();

  const hud = document.createElement("div");
  hud.id = "digify-scraper-hud";
  hud.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999999;
    background: #0f172a;
    color: #ffffff;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 0 2px #2563eb;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    min-width: 320px;
    max-width: 400px;
    font-size: 13px;
    line-height: 1.5;
  `;
  hud.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
      <div style="font-weight: 700; font-size: 14px; color: #60a5fa; display: flex; align-items: center; gap: 6px;">
        <span>⚡ Digify Lead Harvester</span>
      </div>
      <span id="digify-hud-status" style="background: #2563eb; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase;">Initializing</span>
    </div>
    <div id="digify-hud-msg" style="color: #cbd5e1; margin-bottom: 10px;">Connecting to Google Maps search feed...</div>
    <div style="background: #1e293b; border-radius: 6px; height: 8px; overflow: hidden; margin-bottom: 8px;">
      <div id="digify-hud-bar" style="background: linear-gradient(90deg, #2563eb, #e06930); height: 100%; width: 10%; transition: width 0.3s ease;"></div>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8;">
      <span>Verified Leads: <b id="digify-hud-count" style="color: #10b981; font-size: 13px;">0</b></span>
      <span id="digify-hud-step">Scanning...</span>
    </div>
  `;
  document.body.appendChild(hud);

  const updateHud = (status, msg, percent, count, step) => {
    const elStatus = document.getElementById("digify-hud-status");
    const elMsg = document.getElementById("digify-hud-msg");
    const elBar = document.getElementById("digify-hud-bar");
    const elCount = document.getElementById("digify-hud-count");
    const elStep = document.getElementById("digify-hud-step");
    if (elStatus && status) elStatus.innerText = status;
    if (elMsg && msg) elMsg.innerText = msg;
    if (elBar && percent !== undefined) elBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    if (elCount && count !== undefined) elCount.innerText = count;
    if (elStep && step) elStep.innerText = step;
  };

  // Helper to trigger bulletproof CSV download with UTF-8 BOM
  const downloadCSV = (results, searchName) => {
    if (!results || !results.length) {
      updateHud("Alert", "⚠️ Koi verified phone number nahi mila.", 100, 0, "Finished");
      alert("⚠️ Koi verified lead nahi mili (jisme Phone number ho). Google Maps search result open karein.");
      setTimeout(() => hud.remove(), 4000);
      return;
    }
    const header = "Business Name,Phone,Website,Rating,City,Category";
    const rows = results.map(r => `"${(r.Name||"").replace(/"/g, '""')}","${r.Phone||""}","${r.Website||""}","${r.Rating||""}","${r.City||""}","${r.Category||""}"`);
    const csvContent = "\uFEFF" + [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const cleanName = (searchName || "Digify_Leads").replace(/[^a-zA-Z0-9\s]/g, ' ').trim().replace(/\s+/g, '_') || "Digify_Leads";
    const fileName = `${cleanName}_Digify_Leads.csv`;

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    updateHud("Success", `✅ ${results.length} leads saved! Drop into Digify Portal.`, 100, results.length, "Downloaded!");
    console.log(`%c✅ SUCCESS: ${results.length} verified leads downloaded as ${fileName}!`, "background: #10b981; color: #fff; font-size: 14px; font-weight: bold; padding: 6px 12px; border-radius: 6px;");

    setTimeout(() => {
      hud.style.opacity = "0.7";
    }, 5000);
  };

  // 1. Detect search query / location
  const searchInput = (
    document.querySelector('#searchboxinput')?.value ||
    document.querySelector('input[name="q"]')?.value ||
    (window.location.href.includes('/search/') ? decodeURIComponent(window.location.href.split('/search/')[1].split('/')[0].split('?')[0]) : '') ||
    document.title.replace(/ - Google Maps/i, '').replace(/Google Maps/i, '').trim() ||
    "Leads"
  ).trim();

  const qLower = searchInput.toLowerCase();

  // Detect City intelligently
  let defaultCity = "Surat";
  const cityPatterns = [
    { city: "Surat", keys: ["surat"] },
    { city: "Ahmedabad", keys: ["ahmedabad", "amdavad"] },
    { city: "Jaipur", keys: ["jaipur"] },
    { city: "Indore", keys: ["indore"] },
    { city: "Mumbai", keys: ["mumbai", "bombay"] },
    { city: "Pune", keys: ["pune"] },
    { city: "Delhi NCR", keys: ["delhi", "gurgaon", "gurugram", "noida", "faridabad", "ghaziabad"] },
    { city: "Bengaluru", keys: ["bengaluru", "bangalore"] },
    { city: "Coimbatore", keys: ["coimbatore", "tiruppur"] },
    { city: "Kota", keys: ["kota"] },
    { city: "Udaipur", keys: ["udaipur"] },
    { city: "Bhilwara", keys: ["bhilwara"] },
    { city: "Jodhpur", keys: ["jodhpur"] },
    { city: "Vadodara", keys: ["vadodara", "baroda"] },
    { city: "Rajkot", keys: ["rajkot"] },
    { city: "Bhopal", keys: ["bhopal"] },
    { city: "Lucknow", keys: ["lucknow"] },
    { city: "Chandigarh", keys: ["chandigarh", "mohali", "panchkula"] },
    { city: "Kochi", keys: ["kochi", "cochin", "ernakulam"] },
    { city: "Hyderabad", keys: ["hyderabad", "secunderabad"] },
    { city: "Chennai", keys: ["chennai", "madras"] },
    { city: "Kolkata", keys: ["kolkata", "calcutta"] }
  ];

  for (const item of cityPatterns) {
    if (item.keys.some(k => qLower.includes(k))) {
      defaultCity = item.city;
      break;
    }
  }

  // Detect Category
  let defaultCategory = "Retail & General";
  if (qLower.includes("supermarket") || qLower.includes("hypermarket") || qLower.includes("grocery") || qLower.includes("kirana") || qLower.includes("mart") || qLower.includes("minimart")) {
    defaultCategory = "Supermarkets & Retail";
  } else if (qLower.includes("garment") || qLower.includes("clothing") || qLower.includes("boutique") || qLower.includes("textile") || qLower.includes("apparel") || qLower.includes("footwear") || qLower.includes("fashion") || qLower.includes("saree") || qLower.includes("suit")) {
    defaultCategory = "Garments & Fashion";
  } else if (qLower.includes("manufacturing") || qLower.includes("factory") || qLower.includes("industry") || qLower.includes("industrial") || qLower.includes("mill") || qLower.includes("engineering") || qLower.includes("packaging")) {
    defaultCategory = "Manufacturing & Industry";
  } else if (qLower.includes("restaurant") || qLower.includes("cafe") || qLower.includes("sweet") || qLower.includes("bakery") || qLower.includes("hotel") || qLower.includes("dine") || qLower.includes("bistro")) {
    defaultCategory = "Restaurants & Food";
  } else if (qLower.includes("pharma") || qLower.includes("medical") || qLower.includes("chemist") || qLower.includes("hospital") || qLower.includes("clinic") || qLower.includes("drug")) {
    defaultCategory = "Pharmacy & Healthcare";
  } else if (qLower.includes("hardware") || qLower.includes("electrical") || qLower.includes("sanitary") || qLower.includes("paint") || qLower.includes("decor") || qLower.includes("furniture") || qLower.includes("plywood")) {
    defaultCategory = "Hardware & Decor";
  }

  // ── CASE A: SINGLE PLACE PAGE ──
  const isSinglePlace = window.location.href.includes('/place/') || (!document.querySelector('div[role="feed"]') && document.querySelector('h1.DUwDvf, h1.fontHeadlineLarge'));
  
  if (isSinglePlace) {
    updateHud("Running", "Single Place detected. Extracting details...", 50, 0, "Single Place");
    const nameEl = document.querySelector('h1.DUwDvf, h1.fontHeadlineLarge, h1');
    const name = (nameEl ? (nameEl.innerText || nameEl.getAttribute('aria-label')) : "").trim() || searchInput;

    const phoneBtn = document.querySelector('button[data-item-id^="phone:tel:"], button[data-tooltip*="phone" i], button[aria-label*="Phone" i], [data-item-id*="phone"]');
    let phone = "";
    if (phoneBtn) {
      const rawPhone = phoneBtn.getAttribute('data-item-id') || phoneBtn.getAttribute('aria-label') || phoneBtn.innerText || "";
      const m = rawPhone.match(/(?:\+91[\s-]?)?[0]?[6-9]\d{4}[\s-]?\d{5}|\b0\d{2,4}[\s-]?\d{6,8}\b/);
      if (m) phone = m[0].replace(/[\s-]/g, '');
    }

    const webBtn = document.querySelector('a[data-item-id="authority"], a[data-tooltip*="website" i], a[aria-label*="Website" i], a[data-value="Website"]');
    let website = (webBtn && webBtn.href && !webBtn.href.includes('google.com')) ? webBtn.href : "";

    const rEl = document.querySelector('div.F7nice span[aria-hidden="true"], span.MW4etd, span.ceNzKf');
    const rating = rEl ? rEl.innerText : "";

    const catBtn = document.querySelector('button.DkEaL, span.Y0A0hc');
    let category = catBtn ? catBtn.innerText.trim() : defaultCategory;

    if (!phone) {
      updateHud("Notice", `⚠️ ${name} has no public phone number listed.`, 100, 0, "No Phone");
      alert(`⚠️ ${name} ka phone number Google Maps par publicly listed nahi hai.`);
      return;
    }

    downloadCSV([{ Name: name, Phone: phone, Website: website, Rating: rating, City: defaultCity, Category: category }], name);
    return;
  }

  // ── CASE B: SEARCH RESULTS LIST / FEED ──
  const feed = document.querySelector('div[role="feed"]') || document.querySelector('div.m6QErb[aria-label*="Results" i]') || document.querySelector('div[role="main"]');
  if (!feed) {
    updateHud("Error", "Results feed not found!", 0, 0, "Failed");
    alert("Google Maps Search Results list nahi mili! Pehle Maps search bar me query search karein (jaise 'Supermarkets in Surat' ya 'Garment shops in Ahmedabad').");
    return;
  }

  updateHud("Scrolling", "Scrolling results to fetch maximum businesses...", 20, 0, "Scrolling Feed");
  console.log("⚡ [1/2] Auto-scrolling Google Maps feed...");

  let prevCount = 0;
  for (let i = 0; i < 22; i++) {
    feed.scrollTop = feed.scrollHeight;
    await new Promise(r => setTimeout(r, 900));
    const currentCount = feed.querySelectorAll('div[role="article"], div.Nv2PK').length;
    updateHud("Scrolling", `Loaded ${currentCount} listings...`, 20 + (i * 2), 0, `Scroll ${i + 1}/22`);
    if (currentCount === prevCount && i > 4) break;
    prevCount = currentCount;
  }

  const cards = Array.from(feed.querySelectorAll('div[role="article"], div.Nv2PK'));
  updateHud("Extracting", `Extracting verified leads from ${cards.length} listings...`, 50, 0, "Deep Extraction");
  console.log(`⚡ [2/2] Extracting details from ${cards.length} listings...`);

  const results = [];
  const seenPhones = new Set();

  for (let i = 0; i < cards.length; i++) {
    const el = cards[i];
    const nameEl = el.querySelector('.fontHeadlineSmall') || el.querySelector('a.hfpxzc') || el.querySelector('div.qBF1Pd');
    const name = (nameEl ? (nameEl.getAttribute('aria-label') || nameEl.innerText) : "").trim();
    if (!name) continue;

    const text = el.innerText || "";

    // 1. Try card for website
    let webEl = el.querySelector('a[data-value="Website"], a[aria-label*="website" i], a[href*="http"]:not([href*="google.com"]):not([href*="goo.gl"])');
    let website = webEl ? webEl.href : "";

    // 2. Try card text for phone
    let ph = text.match(/(?:\+91[\s-]?)?[0]?[6-9]\d{4}[\s-]?\d{5}|\b0\d{2,4}[\s-]?\d{6,8}\b/);
    let phone = ph ? ph[0].replace(/[\s-]/g, '') : "";

    // 3. Deep Extraction: Click listing if phone or website is hidden
    if (!phone || !website) {
      try {
        const clickTarget = el.querySelector('a.hfpxzc') || nameEl || el;
        clickTarget.click();
        await new Promise(r => setTimeout(r, 400));

        if (!phone) {
          const phoneBtn = document.querySelector('button[data-item-id^="phone:tel:"], button[data-tooltip*="phone" i], button[aria-label*="Phone" i], [data-item-id*="phone"]');
          if (phoneBtn) {
            const rawPhone = phoneBtn.getAttribute('data-item-id') || phoneBtn.getAttribute('aria-label') || phoneBtn.innerText || "";
            const m = rawPhone.match(/(?:\+91[\s-]?)?[0]?[6-9]\d{4}[\s-]?\d{5}|\b0\d{2,4}[\s-]?\d{6,8}\b/);
            if (m) phone = m[0].replace(/[\s-]/g, '');
          }
        }

        if (!website) {
          const webBtn = document.querySelector('a[data-item-id="authority"], a[data-tooltip*="website" i], a[aria-label*="Website" i], a[data-value="Website"]');
          if (webBtn && webBtn.href && !webBtn.href.includes('google.com')) {
            website = webBtn.href;
          }
        }
      } catch (err) {}
    }

    const rEl = el.querySelector('span[aria-hidden="true"], span.MW4etd');
    const rating = rEl ? rEl.innerText : "";

    // Normalize phone
    const cleanDigits = (phone || "").replace(/\D/g, "");
    if (!cleanDigits || cleanDigits.length < 10) {
      continue;
    }

    // Deduplication check
    const standardMobile = cleanDigits.slice(-10);
    if (seenPhones.has(standardMobile)) {
      continue;
    }
    seenPhones.add(standardMobile);

    results.push({
      Name: name,
      Phone: phone,
      Website: website,
      Rating: rating,
      City: defaultCity,
      Category: defaultCategory
    });

    const progressPct = 50 + Math.round(((i + 1) / cards.length) * 45);
    updateHud("Extracting", `Processed ${i + 1}/${cards.length} cards...`, progressPct, results.length, `${name.substring(0, 18)}...`);
  }

  downloadCSV(results, searchInput);
})();
