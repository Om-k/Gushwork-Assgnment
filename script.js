/* ══════════════════════════════════════
   PROCESS TABS
══════════════════════════════════════ */
document.querySelectorAll('.process-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const idx = tab.dataset.tab;

    document.querySelectorAll('.process-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.process-panel').forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    document.querySelector(`.process-panel[data-panel="${idx}"]`).classList.add('active');
  });
});

/* ══════════════════════════════════════
   FAQ ACCORDION
══════════════════════════════════════ */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isActive = item.classList.contains('active');

    // close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

    // open clicked if it wasn't already open
    if (!isActive) item.classList.add('active');

    // swap icon
    document.querySelectorAll('.faq-item').forEach(i => {
      const icon = i.querySelector('.faq-icon path');
      if (icon) {
        icon.setAttribute('d', i.classList.contains('active') ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6');
      }
    });
  });
});

/* ══════════════════════════════════════
   APPLICATIONS CAROUSEL
══════════════════════════════════════ */
(function () {
  const track   = document.getElementById('applicationsTrack');
  const prevBtn = document.getElementById('appPrev');
  const nextBtn = document.getElementById('appNext');
  if (!track) return;

  let current = 0;
  const cards = track.querySelectorAll('.app-card');
  const visibleCount = () => {
    const w = window.innerWidth;
    if (w <= 600)  return 1;
    if (w <= 800)  return 2;
    if (w <= 1080) return 3;
    return 4;
  };

  const maxIndex = () => Math.max(0, cards.length - visibleCount());

  const updateTrack = () => {
    const cardWidth = cards[0].offsetWidth + 16; // gap 16
    track.style.transform = `translateX(-${current * cardWidth}px)`;
  };

  if (nextBtn) nextBtn.addEventListener('click', () => {
    current = Math.min(current + 1, maxIndex());
    updateTrack();
  });
  if (prevBtn) prevBtn.addEventListener('click', () => {
    current = Math.max(current - 1, 0);
    updateTrack();
  });

  window.addEventListener('resize', () => {
    current = Math.min(current, maxIndex());
    updateTrack();
  });
})();

/* ══════════════════════════════════════
   HERO CAROUSEL (basic)
══════════════════════════════════════ */
(function () {
  const carouselCards = document.querySelectorAll('.carousel-card');
  carouselCards.forEach((card, i) => {
    card.addEventListener('click', () => {
      carouselCards.forEach(c => c.style.borderColor = 'transparent');
      card.style.borderColor = 'var(--primary-btn)';
    });
  });
})();