/* ==========================================================
   All page text comes from /content/content-en.json and
   /content/content-it.json. Edit those two files to change
   any text on the site — no need to touch this code.
   ========================================================== */

const SUPPORTED_LANGS = ["en", "it"];
const DEFAULT_LANG = "en";

function getLang() {
  const saved = localStorage.getItem("lang");
  return SUPPORTED_LANGS.includes(saved) ? saved : DEFAULT_LANG;
}

function setLang(lang) {
  localStorage.setItem("lang", lang);
}

async function loadContent(lang) {
  const res = await fetch(`content/content-${lang}.json`);
  if (!res.ok) throw new Error(`Could not load content-${lang}.json`);
  return res.json();
}

function renderLangToggle(lang) {
  document.querySelectorAll(".lang-toggle button").forEach((btn) => {
    const isActive = btn.dataset.lang === lang;
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function bindLangToggle() {
  document.querySelectorAll(".lang-toggle button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      setLang(lang);
      init();
    });
  });
}

/* ---------- Page renderers ---------- */

function renderNav(content) {
  document.querySelectorAll("[data-i18n='nav.coach']").forEach(el => el.textContent = content.nav.coach);
  document.querySelectorAll("[data-i18n='nav.program']").forEach(el => el.textContent = content.nav.program);
  document.querySelectorAll("[data-i18n='nav.home']").forEach(el => el.textContent = content.nav.home);
  document.title = content.siteTitle;
}

function renderHome(content) {
  const h = content.hero;

  setText("#coachCardTitle", h.coachCard.title);
  setText("#coachCardExcerpt", h.coachCard.excerpt);
  setText("#programCardTitle", h.programCard.title);
  setText("#programCardExcerpt", h.programCard.excerpt);
  setText("#testimonialsTitle", h.testimonialsTitle);
  setText("#faqTitle", h.faq.title);
  setText("#contactTitle", h.contact.title);

  // Testimonials
  const tGrid = document.getElementById("testimonialGrid");
  if (tGrid) {
    tGrid.innerHTML = "";
    h.testimonials.forEach((t) => {
      const box = document.createElement("div");
      box.className = "testimonial-box";
      box.innerHTML = `<p>"${escapeHtml(t.quote)}"</p><span>${escapeHtml(t.name)}</span>`;
      tGrid.appendChild(box);
    });
  }

  // FAQ
  const faqList = document.getElementById("faqList");
  if (faqList) {
    faqList.innerHTML = "";
    h.faq.items.forEach((item) => {
      const details = document.createElement("details");
      details.innerHTML = `<summary>${escapeHtml(item.q)}</summary><p>${escapeHtml(item.a)}</p>`;
      faqList.appendChild(details);
    });
  }

  // Contact
  const contactList = document.getElementById("contactList");
  if (contactList) {
    contactList.innerHTML = `
      <li>✉️ <a href="mailto:${h.contact.email}">${escapeHtml(h.contact.email)}</a></li>
      <li>📞 <a href="tel:${h.contact.phone}">${escapeHtml(h.contact.phone)}</a></li>
      <li>📷 ${escapeHtml(h.contact.instagram)}</li>
    `;
  }

  const heroImg = document.getElementById("heroPhoto");
  if (heroImg) heroImg.alt = h.heroImageAlt;
}

function renderCoachPage(content) {
  const c = content.coachPage;
  setText("#coachTitle", c.title);
  setText("#coachName", c.name);
  setText("#coachRole", c.role);
  setText("#qualificationsTitle", c.qualificationsTitle);

  const bio = document.getElementById("coachBio");
  if (bio) {
    bio.innerHTML = "";
    c.bio.forEach((para) => {
      const p = document.createElement("p");
      p.textContent = para;
      bio.appendChild(p);
    });
  }

  const qualGrid = document.getElementById("qualGrid");
  if (qualGrid) {
    qualGrid.innerHTML = "";
    c.qualifications.forEach((q) => {
      const item = document.createElement("div");
      item.className = "qual-item";
      item.innerHTML = `
        <img src="images/${q.image}" alt="${escapeHtml(q.caption)}" onerror="this.style.opacity='0.15'">
        <p>${escapeHtml(q.caption)}</p>
      `;
      qualGrid.appendChild(item);
    });
  }
}

function renderProgramPage(content) {
  const p = content.programPage;
  setText("#programTitle", p.title);
  setText("#programIntro", p.intro);

  const sections = document.getElementById("programSections");
  if (sections) {
    sections.innerHTML = "";
    p.sections.forEach((s) => {
      const div = document.createElement("div");
      div.className = "program-section";
      div.innerHTML = `<h3>${escapeHtml(s.heading)}</h3><p>${escapeHtml(s.body)}</p>`;
      sections.appendChild(div);
    });
  }
}

function renderFooter(content) {
  setText("#footerText", content.footer.text);
}

/* ---------- Helpers ---------- */

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- Init ---------- */

async function init() {
  const lang = getLang();
  document.documentElement.lang = lang;
  renderLangToggle(lang);

  try {
    const content = await loadContent(lang);
    renderNav(content);
    renderFooter(content);
    if (document.body.dataset.page === "home") renderHome(content);
    if (document.body.dataset.page === "coach") renderCoachPage(content);
    if (document.body.dataset.page === "program") renderProgramPage(content);
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  bindLangToggle();
  init();
});
