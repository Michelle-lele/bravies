/* =====================================================================
   СМЕЛЧОВЦИ В БЕДА — Landing Page Script

   ⚠️ FLAG FOR MICHELLE: the actual Phase 1–2 script.js was not included
   in this upload (only index.html, style.css, SDD.md were attached).
   Everything below the "PHASE 1–2" marker is a *reconstruction* from
   SDD.md §"Functional Requirements (JS)" plus the behavior described
   throughout the spec (scroll-driven clouds via --scroll-progress,
   reveal-on-scroll via IntersectionObserver + .reveal/.is-visible,
   reusable initWaitlistForm() per [data-waitlist-form]). It matches the
   spec's documented behavior, but if your real script.js differs in
   implementation detail (variable names, debounce strategy, etc.), diff
   this against it before shipping — don't assume it's byte-for-byte
   identical to what you already have. Only the Phase 3 section at the
   bottom (testimonials slider) is newly written for this phase.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroClouds();
  initRevealOnScroll();
  document.querySelectorAll('[data-waitlist-form]').forEach(initWaitlistForm);
  initTestimonialsSlider(); // Phase 3
});

/* ---------------------------------------------------------------------
   PHASE 1–2 (reconstructed — see flag above)
--------------------------------------------------------------------- */

/* Clouds: --scroll-progress (0–1) reflects scroll position within the
   hero only, so it naturally reverses on scroll-up and settles once the
   hero has scrolled fully past. */
function initHeroClouds() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const setProgress = () => {
    const heroHeight = hero.offsetHeight || 1;
    const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);
    hero.style.setProperty('--scroll-progress', progress.toFixed(4));
  };

  setProgress();
  window.addEventListener('scroll', setProgress, { passive: true });
  window.addEventListener('resize', setProgress);
}

/* Reveal-on-scroll: one-time slide/fade-in per .reveal element, skipped
   entirely under prefers-reduced-motion (CSS already neutralizes the
   transition in that case, but we also avoid doing the observation work). */
function initRevealOnScroll() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* Reusable waitlist form handler — bound to every [data-waitlist-form]
   element (hero instance now; bottom Wait-list Signup instance in
   Phase 4 reuses this unchanged, per SDD.md). */
function initWaitlistForm(form) {
  const input = form.querySelector('.waitlist-form__input');
  const errorEl = form.querySelector('.waitlist-form__error');
  const successEl = form.parentElement
    ? form.parentElement.querySelector('.success-message')
    : null;
  const submitBtn = form.querySelector('.waitlist-form__button');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showError = (message) => {
    if (errorEl) errorEl.textContent = message;
    input.classList.add('is-invalid');
  };

  const clearError = () => {
    if (errorEl) errorEl.textContent = '';
    input.classList.remove('is-invalid');
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = input.value.trim();

    if (!email || !emailPattern.test(email)) {
      showError('Моля, въведете валиден имейл адрес.');
      input.focus();
      return;
    }

    clearError();
    if (submitBtn) submitBtn.classList.add('is-loading');

    // Mock API POST — real submission endpoint TBD.
    console.log('[waitlist] collected email:', email);

    window.setTimeout(() => {
      if (submitBtn) submitBtn.classList.remove('is-loading');
      form.hidden = true;
      if (successEl) {
        successEl.hidden = false;
        successEl.classList.add('is-visible');
      }
    }, 400);
  });

  input.addEventListener('input', () => {
    if (input.classList.contains('is-invalid')) clearError();
  });
}

/* ---------------------------------------------------------------------
   PHASE 3 — Testimonials slider
   Built for N ≥ 1 slides even though only one quote exists today, so
   adding future testimonials is a markup-only change (append another
   .testimonials__slide + .testimonials__dot, no JS edits needed).
   Arrow buttons and dot pagination are hidden via CSS when there's only
   one slide (see .testimonials__nav / .testimonials__dots in style.css),
   but the JS itself doesn't special-case count === 1.
--------------------------------------------------------------------- */
function initTestimonialsSlider() {
  const slider = document.querySelector('[data-testimonials-slider]');
  if (!slider) return;

  const track = slider.querySelector('[data-slider-track]');
  const slides = Array.from(slider.querySelectorAll('.testimonials__slide'));
  const prevBtn = slider.querySelector('[data-slider-prev]');
  const nextBtn = slider.querySelector('[data-slider-next]');
  // Dots live as a sibling of .testimonials__slider (below it, outside the
  // arrows row) rather than inside it — scope the lookup to the shared
  // .testimonials__inner ancestor instead of `slider` itself, or this
  // silently finds nothing and dots never render.
  const wrapper = slider.closest('.testimonials__inner') || document;
  const dotsWrap = wrapper.querySelector('[data-slider-dots]');
  if (!track || !slides.length) return;

  let current = 0;
  let dots = [];

  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    dots = slides.map((slide, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'testimonials__dot';
      // Each dot picks up its slide's brand-color accent (set inline as
      // --slide-accent in index.html) so the dot row previews the same
      // color cycle the quotation marks use.
      const accent = slide.style.getPropertyValue('--slide-accent');
      if (accent) dot.style.setProperty('--dot-accent', accent);
      dot.setAttribute('aria-label', `Отзив ${i + 1} от ${slides.length}`);
      dot.addEventListener('click', () => goTo(i, { force: true }));
      dotsWrap.appendChild(dot);
      return dot;
    });
  }

  function render() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.style.transition = prefersReducedMotion ? 'none' : '';
    track.style.transform = `translateX(-${current * 100}%)`;

    slides.forEach((slide, i) => {
      const isActive = i === current;
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      slide.querySelectorAll('a, button').forEach((el) => {
        el.tabIndex = isActive ? 0 : -1;
      });
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
      dot.setAttribute('aria-current', i === current ? 'true' : 'false');
    });

    // Controls stay visible and enabled even with a single slide — see
    // index.html note. No is-single hiding anymore.
  }

  // Restarts the quote's entrance animation (fade/rise) on every
  // interaction — including the single-slide case where `current`
  // doesn't actually change. Toggling a class isn't enough on its own
  // (the browser won't replay a still-applied animation), so this
  // forces a reflow between removing and re-adding it.
  function replayQuoteAnimation() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const activeQuote = slides[current] && slides[current].querySelector('.testimonials__quote');
    if (!activeQuote) return;
    activeQuote.style.animation = 'none';
    void activeQuote.offsetWidth; // force reflow
    activeQuote.style.animation = '';
  }

  function goTo(index, options = {}) {
    const next = (index + slides.length) % slides.length;
    const moved = next !== current;
    current = next;
    render();
    // Always replay the animation on explicit interaction (arrows, dots,
    // keys, swipe) even if we looped back to the same slide; skip only
    // for silent/internal calls that don't pass { force: true } and
    // didn't actually move.
    if (moved || options.force) replayQuoteAnimation();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1, { force: true }));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1, { force: true }));

  // Keyboard nav when the slider region has focus.
  slider.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(current - 1, { force: true }); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); goTo(current + 1, { force: true }); }
  });

  // Basic touch swipe support.
  let touchStartX = null;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) goTo(delta < 0 ? current + 1 : current - 1, { force: true });
    touchStartX = null;
  });

  render();
}
