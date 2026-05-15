/* ══════════════════════════════════════
   QUOTE / CATALOGUE MODAL
══════════════════════════════════════ */
(function () {
  const modal    = document.getElementById('quoteModal');
  const closeBtn = document.getElementById('quoteModalClose');
  const form     = document.getElementById('quoteModalForm');
  if (!modal) return;

  const triggers = Array.from(document.querySelectorAll('button')).filter(b => {
    const t = b.textContent.trim().toLowerCase();
    return t === 'request a quote'
        || t === 'get custom quote'
        || t.startsWith('download full technical datasheet')
        || t === 'request catalogue';
  });

  const open  = () => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };

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
   HERO CAROUSEL — image switching + arrows
══════════════════════════════════════ */
(function () {
  const mainImg     = document.getElementById('heroMainImg');
  const cards       = document.querySelectorAll('.carousel-card');
  const arrowLeft   = document.querySelector('#heroCarouselMain .carousel-arrow--left');
  const arrowRight  = document.querySelector('#heroCarouselMain .carousel-arrow--right');
  if (!mainImg || !cards.length) return;

  /* Each card carries the image it should show, set via data-src */
  let current = 0;

  const goTo = (idx) => {
    current = (idx + cards.length) % cards.length;
    cards.forEach((c, i) => c.style.borderColor = i === current ? 'var(--primary-btn)' : 'transparent');
    const src = cards[current].dataset.src;
    if (src) {
      mainImg.style.opacity = '0';
      setTimeout(() => { mainImg.src = src; mainImg.style.opacity = '1'; }, 150);
    }
  };

  /* Inject images into cards */
  const images = [
    './Assets/product-thumb.png',
    './Assets/portfolio-fittings.png',
    './Assets/portfolio-installation.png',
    './Assets/portfolio-fittings.png',
  ];
  cards.forEach((card, i) => {
    const img = images[i % images.length];
    card.dataset.src = img;
    card.style.backgroundImage  = `url('${img}')`;
    card.style.backgroundSize   = 'cover';
    card.style.backgroundPosition = 'center';
    card.addEventListener('click', () => goTo(i));
  });

  /* Initialise first card */
  goTo(0);

  if (arrowLeft)  arrowLeft.addEventListener('click',  () => goTo(current - 1));
  if (arrowRight) arrowRight.addEventListener('click', () => goTo(current + 1));

  /* smooth opacity transition */
  mainImg.style.transition = 'opacity 0.15s ease';
})();

/* ══════════════════════════════════════
   PROCESS TABS + PANEL ARROWS
══════════════════════════════════════ */
(function () {
  const tabs   = Array.from(document.querySelectorAll('.process-tab'));
  const panels = Array.from(document.querySelectorAll('.process-panel'));
  if (!tabs.length) return;

  const goToTab = (idx) => {
    // wrap around
    idx = (idx + tabs.length) % tabs.length;

    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    tabs[idx].classList.add('active');
    panels[idx].classList.add('active');

    tabs[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

    return idx;
  };

  let current = 0;

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => { current = goToTab(i); });
  });

  panels.forEach((panel) => {
    const left  = panel.querySelector('.carousel-arrow--left');
    const right = panel.querySelector('.carousel-arrow--right');
    if (left)  left.addEventListener('click',  () => { current = goToTab(current - 1); });
    if (right) right.addEventListener('click', () => { current = goToTab(current + 1); });
  });
})();

/* ══════════════════════════════════════
   FAQ ACCORDION — no layout shift
══════════════════════════════════════ */
(function () {
  /* Measure each answer's natural height once, then animate max-height */
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const inner  = item.querySelector('.faq-answer-inner');
    const answer = item.querySelector('.faq-answer');
    const btn    = item.querySelector('.faq-question');
    if (!inner || !answer || !btn) return;

    /* Use max-height animation instead of grid rows — more reliable cross-browser */
    answer.style.overflow   = 'hidden';
    answer.style.transition = 'max-height 0.32s ease';
    answer.style.display    = 'block';

    /* Seed open item */
    if (item.classList.contains('active')) {
      answer.style.maxHeight = inner.scrollHeight + 32 + 'px';
    } else {
      answer.style.maxHeight = '0px';
    }

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      /* Close all */
      items.forEach(i => {
        i.classList.remove('active');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0px';
      });

      /* Open clicked if it was closed */
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = inner.scrollHeight + 32 + 'px';
      }
    });
  });
})();

/* ══════════════════════════════════════
   APPLICATIONS CAROUSEL (no zoom preview)
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
    const moveX = current * cardWidth;
    track.style.transform = `translateX(-${moveX}px)`;
  };

  if (nextBtn) nextBtn.addEventListener('click', () => { current = Math.min(current + 1, maxIndex()); updateTrack(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { current = Math.max(current - 1, 0); updateTrack(); });
  window.addEventListener('resize', () => { current = Math.min(current, maxIndex()); updateTrack(); }, { passive: true });
})();

/* ══════════════════════════════════════
   HERO IMAGE MAGNIFIER ZOOM
══════════════════════════════════════ */
(function () {
  const wrap      = document.getElementById('heroCarouselMain');
  const img       = document.getElementById('heroMainImg');
  const lens      = document.getElementById('zoomLens');
  const result    = document.getElementById('zoomResult');
  if (!wrap || !img || !lens || !result) return;

  const ZOOM = 2.5;

  const setResultBg = () => { result.style.backgroundImage = `url('${img.src}')`; };
  img.addEventListener('load', setResultBg);
  setResultBg();

  wrap.addEventListener('mouseenter', () => result.classList.add('active'));
  wrap.addEventListener('mouseleave', () => { result.classList.remove('active'); lens.style.display = 'none'; });

  wrap.addEventListener('mousemove', e => {
    const rect = img.getBoundingClientRect();
    const lw = lens.offsetWidth, lh = lens.offsetHeight;
    let x = e.clientX - rect.left - lw / 2;
    let y = e.clientY - rect.top  - lh / 2;
    x = Math.max(0, Math.min(x, rect.width  - lw));
    y = Math.max(0, Math.min(y, rect.height - lh));
    lens.style.left    = x + 'px';
    lens.style.top     = y + 'px';
    lens.style.display = 'block';
    result.style.backgroundSize     = `${rect.width * ZOOM}px ${rect.height * ZOOM}px`;
    result.style.backgroundPosition = `-${x * ZOOM}px -${y * ZOOM}px`;
    let rx = e.clientX + 24, ry = e.clientY - 130;
    if (rx + 340 > window.innerWidth)  rx = e.clientX - 364;
    if (ry < 0)                        ry = 0;
    if (ry + 260 > window.innerHeight) ry = window.innerHeight - 260;
    result.style.left = rx + 'px';
    result.style.top  = ry + 'px';
  });
})();