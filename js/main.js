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
  document.querySelectorAll("[data-i18n='nav.faq']").forEach(el => el.textContent = content.nav.faq);
  document.querySelectorAll("[data-i18n='nav.contact']").forEach(el => el.textContent = content.nav.contact);
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
  setText("#faqCta", h.faq.cta);
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

  // FAQ (card only on the home page — full list lives on faq.html)

  // Contact
  const contactList = document.getElementById("contactList");
  if (contactList) {
    contactList.innerHTML = `
      <li>✉️ <a href="mailto:${h.contact.email}">${escapeHtml(h.contact.email)}</a></li>
      <li>📞 <a href="tel:${h.contact.phone.replace(/[^+\d]/g, "")}">${escapeHtml(h.contact.phone)}</a></li>
      
      <li>linkedin<a href="${h.contact.linkedinUrl}" target="_blank" rel="noopener">${escapeHtml(h.contact.linkedinLabel)}</a></li>
    `;
  }
  setText("#contactCta", h.contact.cta);
  setText("#contactIntro", h.contact.intro);

  const heroImg = document.getElementById("heroPhoto");
  if (heroImg) heroImg.alt = h.heroImageAlt;

  // Hero caption (photo intro text)
  const caption = document.getElementById("heroCaption");
  if (caption && h.heroCaption) {
    caption.innerHTML = "";
    h.heroCaption.paragraphs.forEach((para) => {
      const p = document.createElement("p");
      p.textContent = para;
      caption.appendChild(p);
    });
    const purpose = document.createElement("p");
    purpose.className = "hero-caption-purpose";
    purpose.innerHTML = `${escapeHtml(h.heroCaption.purposeLabel)}<br>&ldquo;${escapeHtml(h.heroCaption.purposeQuote)}&rdquo;`;
    caption.appendChild(purpose);
  }
}

function renderCoachPage(content) {
  const c = content.coachPage;
  setText("#coachTitle", c.title);
  setText("#coachName", c.name);
  setText("#coachRole", c.role);
  setText("#coachIntroHeading", c.introHeading || "");
  setText("#qualificationsTitle", c.qualificationsTitle);

  const bio = document.getElementById("coachBio");
  if (bio) {
    bio.innerHTML = "";
    c.bioSections.forEach((section) => {
      const wrap = document.createElement("div");
      wrap.className = "bio-section";
      const h3 = document.createElement("h3");
      h3.textContent = section.heading;
      wrap.appendChild(h3);
      section.paragraphs.forEach((para) => {
        const p = document.createElement("p");
        p.textContent = para;
        wrap.appendChild(p);
      });
      bio.appendChild(wrap);
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
  setText("#programIntroHeading", p.introHeading || "");

  const introEl = document.getElementById("programIntro");
  if (introEl) {
    introEl.textContent = p.intro || "";
    introEl.style.display = p.intro ? "" : "none";
  }

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

function renderFaqPage(content) {
  const f = content.hero.faq;
  setText("#faqPageTitle", f.title);

  const list = document.getElementById("faqPageList");
  if (list) {
    list.innerHTML = "";
    f.items.forEach((item) => {
      const details = document.createElement("details");
      details.className = "faq-page-item";
      details.innerHTML = `<summary>${escapeHtml(item.q)}</summary><p>${escapeHtml(item.a)}</p>`;
      list.appendChild(details);
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
    if (document.body.dataset.page === "faq") renderFaqPage(content);
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  bindLangToggle();
  init();
});
