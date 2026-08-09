/* =====================================================================
   СМЕЛЧОВЦИ В БЕДА — Landing Page Behavior
   PHASE 1 of 5: Hero + Bravies Intro only.

   initWaitlistForm() is written to be reusable: it's called once per
   form matching [data-waitlist-form], so when Phase 4 adds the bottom
   Wait-list Signup section (which the spec says reuses "the same form
   for email and submit button as in the hero section"), that form only
   needs the `data-waitlist-form` attribute + the same internal markup —
   no changes needed here.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAllWaitlistForms();
  initBravieCards();
  initHeroClouds();
  initScrollReveal();
});

/* ---------------------------------------------------------------------
   1. WAITLIST FORM(S)
   - Validates email format client-side before "submitting".
   - Shows an inline error message for invalid input.
   - On valid submission: disables the button, shows a loading state,
     mocks an API POST, then hides that specific form and fades in its
     success message. Applies identically to every [data-waitlist-form]
     on the page (spec: "validation rules apply for both forms").
--------------------------------------------------------------------- */
function initAllWaitlistForms() {
  document.querySelectorAll('[data-waitlist-form]').forEach(initWaitlistForm);
}

function initWaitlistForm(form) {
  const input = form.querySelector('.waitlist-form__input');
  const errorEl = form.querySelector('.waitlist-form__error');
  const button = form.querySelector('.waitlist-form__button');
  // The success message is a sibling element right after the form,
  // sharing the same parent wrapper (see index.html structure).
  const successEl = form.nextElementSibling;

  if (!input || !errorEl || !button || !successEl || !successEl.classList.contains('success-message')) {
    console.warn('[waitlist-form] Expected structure not found for', form);
    return;
  }

  // Standard, pragmatic email pattern (not RFC-5322-exhaustive, but
  // catches the vast majority of real-world typos and malformed input).
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = input.value.trim();

    if (!EMAIL_PATTERN.test(email)) {
      showError('Моля, въведи валиден имейл адрес (напр. име@пример.бг).');
      input.classList.add('is-invalid');
      input.focus();
      return;
    }

    clearError();
    submitEmail(email);
  });

  // Clear the error as soon as the user starts correcting the field.
  input.addEventListener('input', () => {
    if (input.classList.contains('is-invalid')) clearError();
  });

  function showError(message) { errorEl.textContent = message; }

  function clearError() {
    errorEl.textContent = '';
    input.classList.remove('is-invalid');
  }

  function setLoading(isLoading) {
    button.disabled = isLoading;
    button.classList.toggle('is-loading', isLoading);
  }

  function submitEmail(email) {
    setLoading(true);

    mockApiPost('/api/waitlist', { email, source: form.id || 'waitlist-form' })
      .then(() => {
        setLoading(false);
        revealSuccess();
      })
      .catch(() => {
        // Defensive fallback: the mock never actually rejects today, but
        // a real API call could fail (network/server error).
        setLoading(false);
        showError('Възникна проблем при записването. Моля, опитай отново.');
      });
  }

  function revealSuccess() {
    form.hidden = true;
    successEl.hidden = false;
    // Trigger the CSS transition on the next frame so the browser
    // registers the [hidden] -> visible change before animating opacity.
    requestAnimationFrame(() => successEl.classList.add('is-visible'));
  }
}

/**
 * Simulates a backend call. Logs the request to the console (per spec:
 * "log the collected email to the browser console") and resolves after
 * a short delay to mimic real network latency.
 * @param {string} endpoint
 * @param {object} payload
 * @returns {Promise<void>}
 */
function mockApiPost(endpoint, payload) {
  console.log(`[mock API] POST ${endpoint}`, payload);
  return new Promise((resolve) => setTimeout(resolve, 900));
}

/* ---------------------------------------------------------------------
   2. BRAVIES CARDS
   - Exactly one card is "active" (expanded) at a time.
   - Неда is active by default on load (already marked in the HTML).
   - Hover activates a card on pointer devices; click/tap toggles it on
     touch devices (which fire click but have no hover state).
   - Keyboard users get the same behavior via click/Enter on the button.
--------------------------------------------------------------------- */
function initBravieCards() {
  const cards = Array.from(document.querySelectorAll('.brave-card'));
  if (cards.length === 0) return;

  cards.forEach((card) => {
    const trigger = card.querySelector('.brave-card__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => activateCard(card, cards));
    // Additive, not a replacement for click: touch devices don't fire
    // mouseenter, so click-based activation still covers them.
    card.addEventListener('mouseenter', () => activateCard(card, cards));
  });
}

function activateCard(activeCard, allCards) {
  allCards.forEach((card) => {
    const isActive = card === activeCard;
    card.classList.toggle('is-active', isActive);
    const trigger = card.querySelector('.brave-card__trigger');
    if (trigger) trigger.setAttribute('aria-expanded', String(isActive));
  });
}

/* ---------------------------------------------------------------------
   3. HERO CLOUDS (scroll-driven parallax)
   Spec: clouds move from inside toward the outside of the page on
   scroll down, and reverse on scroll up. Implemented as a direct
   function of scroll position (not a one-shot animation), so scrolling
   back up naturally reverses the effect — no separate "scroll up" logic
   needed.
   Progress is measured across the hero's own height: 0 at the top of
   the page, 1 once the user has scrolled past the hero. Skipped for
   users who prefer reduced motion.
--------------------------------------------------------------------- */
function initHeroClouds() {
  const hero = document.getElementById('hero');
  const cloudsContainer = hero ? hero.querySelector('.hero__clouds') : null;
  if (!hero || !cloudsContainer) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const updateProgress = () => {
    const heroHeight = hero.offsetHeight || 1;
    const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);
    cloudsContainer.style.setProperty('--scroll-progress', progress.toFixed(3));
  };

  // rAF-throttled scroll handler to avoid layout thrashing on fast scrolls.
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateProgress();
      ticking = false;
    });
  });

  window.addEventListener('resize', updateProgress);
  updateProgress();
}

/* ---------------------------------------------------------------------
   4. SCROLL REVEAL (Phase 2 — Problem / What It Teaches / How It Works)
   Any element with the `.reveal` class starts hidden/offset via CSS and
   animates in once it scrolls into view, using IntersectionObserver
   rather than a scroll listener (cheaper — no per-frame math needed).
   Each element reveals once and is then unobserved: the intent is a
   one-time "this content is arriving" entrance, not a repeating effect
   every time the user scrolls past it again.
--------------------------------------------------------------------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // CSS already shows these at full opacity/position with no transition
    // under prefers-reduced-motion, so there's nothing for the observer
    // to do — skip creating it entirely.
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px', // trigger slightly before the element
      // fully reaches the bottom edge of the viewport, so it doesn't feel
      // like it's arriving at the very last possible moment
  });

  revealEls.forEach((el) => observer.observe(el));
}
