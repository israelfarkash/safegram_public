/**
 * SafeGram marketing site — shared UI (nav, FAQ, filter simulator)
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  setActiveNavLink();
  initFaqAccordion();
  initSimulator();
});

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => links.classList.remove("open"));
  });
}

function setActiveNavLink() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll(`.nav-links a[data-nav="${page}"]`).forEach((a) => {
    a.classList.add("active");
  });
}

function initFaqAccordion() {
  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const wasActive = item.classList.contains("active");
      document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("active"));
      if (!wasActive) item.classList.add("active");
    });
  });
}

const SIMULATOR_DATA = {
  level1: {
    title: "דרגה 1: רק צ'אטים פרטיים",
    desc: "צ'אטים אישיים בלבד. קבוצות וערוצים נשארים מחוץ לחוויה — סביבה ממוקדת ושקטה.",
    toggles: { women: false, news: false },
    messages: [
      { text: "שלום, מה שלומך?", type: "in", user: "צ'אט פרטי" },
      { text: "מדברים כאן בנוחות.", type: "out" },
      { isBlocked: true, reason: "ערוץ זה אינו זמין בדרגה 1 — רק שיחות פרטיות." },
    ],
  },
  level2: {
    title: "דרגה 2: ערוצים מסוננים ללא תמונות נשים",
    desc: "ערוצים שעברו בדיקת תוכן, עם סף מחמיר יותר למדיה. תכנים לא מתאימים נחסמים תמיד.",
    toggles: { women: true, news: false },
    messages: [
      { text: "עדכון יומי — ערוץ מאושר לדרגה זו.", type: "in", user: "ערוץ לימוד" },
      { text: "תודה, קראתי.", type: "out" },
      { isBlocked: true, reason: "הערוץ אינו מתאים לדרגת ההגנה שבחרת." },
    ],
  },
  level3: {
    title: "דרגה 3: פתוח יותר, ללא חדשות",
    desc: "מגוון ערוצים מסוננים, בלי ערוצי אקטואליה. הסינון הבסיסי של מדיה פעיל בכל מצב.",
    toggles: { women: true, news: true },
    messages: [
      { text: "מדריך טכנולוגיה — מאושר לצפייה.", type: "in", user: "ערוץ טכנולוגיה" },
      { text: "מעולה.", type: "out" },
      { isBlocked: true, reason: "ערוצי חדשות אינם זמינים בדרגה 3." },
    ],
  },
  level4: {
    title: "דרגה 4: כולל חדשות מסוננות",
    desc: "המסלול הפתוח ביותר — גם אקטואליה, רק אחרי שהערוץ עבר את תהליך הבקרה.",
    toggles: { women: true, news: true },
    messages: [
      { text: "מבזק — ערוץ חדשות מאושר.", type: "in", user: "חדשות מסוננות" },
      { text: "קראתי את העדכון.", type: "out" },
      { isBlocked: true, reason: "תוכן זה אינו עומד במדיניות הסינון." },
    ],
  },
};

function initSimulator() {
  const tabs = document.querySelectorAll(".sim-tab");
  if (!tabs.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderSimulatorTrack(tab.getAttribute("data-track"));
    });
  });
  renderSimulatorTrack("level1");
}

function renderSimulatorTrack(trackKey) {
  const data = SIMULATOR_DATA[trackKey];
  if (!data) return;

  const descBox = document.getElementById("sim-track-desc");
  if (descBox) {
    descBox.innerHTML = `<strong>${data.title}</strong><br><span style="color:var(--text-muted);font-size:0.88rem">${data.desc}</span>`;
  }

  setToggleState("toggle-women", data.toggles.women);
  setToggleState("toggle-news", data.toggles.news);

  const msgContainer = document.getElementById("sim-messages-container");
  if (!msgContainer) return;
  msgContainer.innerHTML = "";
  data.messages.forEach((msg) => {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${msg.type || "in"}`;
    if (msg.isBlocked) {
      bubble.innerHTML = `<div class="blocked-placeholder"><i class="fa-solid fa-shield"></i><span>${msg.reason}</span></div>`;
    } else {
      let html = "";
      if (msg.user) {
        html += `<div style="font-size:0.72rem;font-weight:700;color:var(--accent);margin-bottom:4px">${msg.user}</div>`;
      }
      html += msg.text;
      bubble.innerHTML = html;
    }
    msgContainer.appendChild(bubble);
  });
}

function setToggleState(id, strict) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = strict ? "badge-on" : "badge-off";
  el.textContent = strict ? "מוגבל" : "מותר";
}
