/* ══════════════════════════════════════
   QUOTE / CATALOGUE MODAL
══════════════════════════════════════ */
(function () {
  const modal      = document.getElementById('quoteModal');
  const closeBtn   = document.getElementById('quoteModalClose');
  const form       = document.getElementById('quoteModalForm');
  if (!modal) return;

  const triggers = Array.from(document.querySelectorAll('button')).filter(b => {
    const t = b.textContent.trim().toLowerCase();
    return t === 'request a quote'
        || t === 'get custom quote'
        || t.startsWith('download full technical datasheet')
        || t === 'request catalogue';
  });

  const open  = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  triggers.forEach(t => t.addEventListener('click', e => { e.preventDefault(); open(); }));
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
  if (form) form.addEventListener('submit', e => { e.preventDefault(); close(); form.reset(); });
})();

/* ══════════════════════════════════════
   STICKY HEADER + PRODUCT BAR
══════════════════════════════════════ */
(function () {
  const header  = document.getElementById('siteHeader');
  const product = document.getElementById('productSticky');
  const fold    = document.querySelector('.fold');
  if (!header || !fold) return;

  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y       = window.scrollY;
    const foldEnd = fold.offsetTop + fold.offsetHeight;
    const pastFold = y > foldEnd;

    header.classList.toggle('scrolled', y > 10);

    if (pastFold) {
      const goingUp = y < lastY;
      header.classList.toggle('hidden', goingUp);
      if (product) product.classList.toggle('visible', !goingUp);
    } else {
      header.classList.remove('hidden');
      if (product) product.classList.remove('visible');
    }

    lastY = y;
  }, { passive: true });
})();

/* ══════════════════════════════════════
   HAMBURGER / MOBILE MENU
══════════════════════════════════════ */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.toggle('open'));
})();

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
    const item     = btn.closest('.faq-item');
    const isActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');

    document.querySelectorAll('.faq-item').forEach(i => {
      const icon = i.querySelector('.faq-icon path');
      if (icon) {
        icon.setAttribute('d', i.classList.contains('active') ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6');
      }
    });
  });
});

/* ══════════════════════════════════════
   APPLICATIONS CAROUSEL + ZOOM PREVIEW
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
    const cardWidth = cards[0].offsetWidth + 16;
    const moveX = (current * cardWidth) + 100;
  track.style.transform = `translateX(-${moveX}px)`;
  };

  current = Math.max(current - 1, 0); updateTrack();

  if (nextBtn) nextBtn.addEventListener('click', () => { current = Math.min(current + 1, maxIndex()); updateTrack(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { current = Math.max(current - 1, 0); updateTrack(); });
  window.addEventListener('resize', () => { current = Math.min(current, maxIndex()); updateTrack(); }, { passive: true });

  const preview    = document.getElementById('zoomPreview');
  const previewImg = document.getElementById('zoomPreviewImg');
  if (!preview || !previewImg) return;

  const OFFSET_X = 20;
  const OFFSET_Y = -260;

  cards.forEach(card => {
    const img = card.querySelector('.app-card-img');

    card.addEventListener('mouseenter', e => {
      if (img) previewImg.src = img.src;
      preview.classList.add('visible');
      positionPreview(e);
    });

    card.addEventListener('mousemove', positionPreview);

    card.addEventListener('mouseleave', () => {
      preview.classList.remove('visible');
    });
  });

  function positionPreview(e) {
    let x = e.clientX + OFFSET_X;
    let y = e.clientY + OFFSET_Y;
    x = Math.min(x, window.innerWidth  - 340);
    y = Math.max(y, 10);
    preview.style.left = x + 'px';
    preview.style.top  = y + 'px';
  }
})();

/* ══════════════════════════════════════
   HERO CAROUSEL + MAGNIFIER ZOOM
══════════════════════════════════════ */
(function () {
  const carouselCards = document.querySelectorAll('.carousel-card');
  carouselCards.forEach(card => {
    card.addEventListener('click', () => {
      carouselCards.forEach(c => c.style.borderColor = 'transparent');
      card.style.borderColor = 'var(--primary-btn)';
    });
  });

  const wrap      = document.getElementById('heroCarouselMain');
  const img       = document.getElementById('heroMainImg');
  const lens      = document.getElementById('zoomLens');
  const result    = document.getElementById('zoomResult');
  if (!wrap || !img || !lens || !result) return;

  const ZOOM = 2.5;

  img.addEventListener('load', setResultBg);
  setResultBg();

  function setResultBg() {
    result.style.backgroundImage = `url('${img.src}')`;
  }

  wrap.addEventListener('mouseenter', () => result.classList.add('active'));
  wrap.addEventListener('mouseleave', () => {
    result.classList.remove('active');
    lens.style.display = 'none';
  });

  wrap.addEventListener('mousemove', e => {
    const rect = img.getBoundingClientRect();
    const lw   = lens.offsetWidth;
    const lh   = lens.offsetHeight;

    let x = e.clientX - rect.left - lw / 2;
    let y = e.clientY - rect.top  - lh / 2;
    x = Math.max(0, Math.min(x, rect.width  - lw));
    y = Math.max(0, Math.min(y, rect.height - lh));

    lens.style.left    = x + 'px';
    lens.style.top     = y + 'px';
    lens.style.display = 'block';

    result.style.backgroundSize     = `${rect.width * ZOOM}px ${rect.height * ZOOM}px`;
    result.style.backgroundPosition = `-${x * ZOOM}px -${y * ZOOM}px`;

    /* position result panel to the right of cursor, keep in viewport */
    let rx = e.clientX + 24;
    let ry = e.clientY - 130;
    if (rx + 340 > window.innerWidth)  rx = e.clientX - 364;
    if (ry < 0)                        ry = 0;
    if (ry + 260 > window.innerHeight) ry = window.innerHeight - 260;
    result.style.left = rx + 'px';
    result.style.top  = ry + 'px';
  });
})();
