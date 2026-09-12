/* =========================================================
   Our Journey
   ========================================================= */

// ---------------- Navigasi antar halaman ----------------

const pages = Array.from(document.querySelectorAll(".page"));
const navButtons = Array.from(document.querySelectorAll("[data-goto]"));

function goToPage(pageName) {
  pages.forEach((section) => {
    section.classList.toggle("active", section.dataset.page === pageName);
  });
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  history.replaceState(null, "", `#${pageName}`);

  // Setiap kali masuk ke halaman kota, jalankan ulang animasi galeri
  if (["sragen", "solo", "yogya"].includes(pageName)) {
    restartGalleryAnimation(pageName);
  }
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => goToPage(btn.dataset.goto));
});

const btnStart = document.getElementById("btnStart");
if (btnStart) {
  btnStart.addEventListener("click", () => {
    goToPage("map");
    tryPlayMusic();
  });
}

const btnWhereWeWent = document.getElementById("btnWhereWeWent");
if (btnWhereWeWent) {
  btnWhereWeWent.addEventListener("click", () => goToPage("cities"));
}

// Buka halaman sesuai hash URL saat pertama dimuat
const initialPage = (location.hash || "#home").replace("#", "");
if (pages.some((p) => p.dataset.page === initialPage)) {
  goToPage(initialPage);
}

// ---------------- Animasi galeri foto ----------------
// Memberi setiap foto nomor urut (--i) supaya animasi floatIn muncul
// bertahap satu per satu, bukan bersamaan.

function restartGalleryAnimation(pageName) {
  const section = document.getElementById(`page-${pageName}`);
  if (!section) return;
  const items = section.querySelectorAll(".gallery__item");
  items.forEach((item, index) => {
    item.style.setProperty("--i", index);
    // reset animasi supaya terlihat lagi tiap kali halaman dibuka
    item.style.animation = "none";
    // eslint-disable-next-line no-unused-expressions
    item.offsetHeight; // force reflow
    item.style.animation = "";
  });
}

document.querySelectorAll(".gallery").forEach((gallery) => {
  gallery.querySelectorAll(".gallery__item").forEach((item, index) => {
    item.style.setProperty("--i", index);
  });
});

// ---------------- Musik latar (autoplay) ----------------

const bgm = document.getElementById("bgm");
const musicToggle = document.getElementById("musicToggle");
let musicStarted = false;

function tryPlayMusic() {
  if (musicStarted || !bgm) return;
  bgm.volume = 0.5;
  bgm.play()
    .then(() => {
      musicStarted = true;
      musicToggle.setAttribute("aria-pressed", "true");
    })
    .catch(() => {
      // Sebagian besar browser memblokir autoplay bersuara sebelum ada
      // interaksi pengguna. Musik akan otomatis dicoba lagi begitu
      // pengguna mengetuk layar pertama kali (lihat listener di bawah).
    });
}

// Coba putar otomatis saat halaman dimuat (akan gagal di banyak browser
// tanpa interaksi — itu wajar, bukan bug).
window.addEventListener("load", tryPlayMusic);

// Begitu ada ketukan/klik pertama di mana saja, coba putar lagi.
function autoplayFallback() {
  tryPlayMusic();
  document.removeEventListener("click", autoplayFallback);
  document.removeEventListener("touchstart", autoplayFallback);
}
document.addEventListener("click", autoplayFallback, { once: true });
document.addEventListener("touchstart", autoplayFallback, { once: true });

if (musicToggle) {
  musicToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (bgm.paused) {
      bgm.play();
      musicToggle.setAttribute("aria-pressed", "true");
      musicStarted = true;
    } else {
      bgm.pause();
      musicToggle.setAttribute("aria-pressed", "false");
    }
  });
}

// ---------------- Kelopak bunga melayang ----------------

const petalsContainer = document.getElementById("petals");
const PETAL_EMOJIS = ["🌸", "🌺", "🌷", "💮"];
const PETAL_COUNT = 14;

function spawnPetals() {
  if (!petalsContainer) return;
  for (let i = 0; i < PETAL_COUNT; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)];
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--drift", `${(Math.random() - 0.5) * 160}px`);
    petal.style.animationDuration = `${9 + Math.random() * 8}s`;
    petal.style.animationDelay = `${Math.random() * 10}s`;
    petal.style.fontSize = `${0.8 + Math.random() * 0.9}rem`;
    petalsContainer.appendChild(petal);
  }
}

spawnPetals();
