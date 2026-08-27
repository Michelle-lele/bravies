/* =====================================================================
   СМЕЛЧОВЦИ В БЕДА — Landing Page Script
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroClouds();
  initRevealOnScroll();
  document.querySelectorAll('[data-waitlist-form]').forEach(initWaitlistForm);
  initTestimonialsSlider(); // Phase 3
  initBraveCardScrollPulse(); // mobile/tablet scroll-triggered card pulse
  initFaqAccordion(); // Phase 4
  initWaitlistClouds(); // Phase 4 (later addition — clouds reused on the Wait-list Signup section)
});

/* ---------------------------------------------------------------------
   PHASE 1–2
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

/* Bravies cards, mobile + portrait tablet: desktop uses :hover (see
   style.css), but hover isn't a real interaction on touch devices, so
   each card instead pulses once, individually, the first time it
   scrolls into view — same one-shot IntersectionObserver pattern as
   initRevealOnScroll() above, kept separate because it targets a
   different element (.brave-card__portrait-img) and class (.is-pulsing,
   not .is-visible) with its own CSS-defined animation rather than a
   simple opacity/transform reveal. The corresponding CSS rule is
   neutralized inside the desktop breakpoint, so this never double-fires
   alongside hover on larger screens even though the class gets added
   there too. */
function initBraveCardScrollPulse() {
  const portraits = document.querySelectorAll('.brave-card__portrait-img');
  if (!portraits.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-pulsing');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  portraits.forEach((img) => {
    observer.observe(img);
    // Clean up after the animation finishes rather than leaving the
    // class sitting on the element indefinitely.
    img.addEventListener('animationend', () => img.classList.remove('is-pulsing'));
  });
}


/* ---------------------------------------------------------------------
   PHASE 5.1 — MailerLite email collection (real submission)

   Hand-rolled JSONP rather than MailerLite's own bundled
   webforms.min.js. This was a real fork, investigated before choosing
   a side (see SDD.md "Wait-list Signup Section" for the full
   reasoning): that script only binds to forms matching the selector
   `.ml-subscribe-form form, .ml-contact-form form,
   .ml-preferences-form form`, then locates its own
   `.ml-block-success` / `.ml-block-form` pair and `data-id`/`data-code`
   attributes *inside that specific wrapper* to do anything at all — it
   doesn't key off the form's `action` URL or field names. Since this
   project's forms are custom-styled and don't use MailerLite's wrapper
   markup, the bundled script would simply never bind to them; loading
   it would be dead weight, not a working integration. The JSONP
   request format below (action URL + querystring, `ml-submit`/
   `anticsrf` params, `callback=` param invoking a temporary global
   function) mirrors exactly what that script does internally
   (`window.ml_jQuery.ajax({..., dataType: "jsonp", ...})`), so this is
   the same request MailerLite's own script would have sent — just
   triggered directly instead of through their DOM-detection layer. */

const MAILERLITE_FORM_ACTION =
  'https://assets.mailerlite.com/jsonp/2598792/forms/196895404753684115/subscribe';

/* MailerLite's own webforms.min.js appends two params to every request
   beyond the documented form fields — `ajax=1` and a per-browser
   `guid`, generated once and cached in localStorage (see the fetched
   source: `e=(e=l.serialize())+"&ajax=1&guid="+w`). We initially left
   both out, going only off the documented hidden-field snippet.

   Real-world symptom this caused, diagnosed via live DevTools: the
   subscribe request returned 200 in ~160ms with an EMPTY body — no
   `callbackName(...)` call, so our JSONP promise had nothing to
   resolve against and eventually hit its own timeout — while the
   subscriber was still created server-side. That pattern (accepted +
   processed, but nothing handed back to render) fits a server that,
   without `ajax=1`, falls back to a legacy plain-form-submit path
   expecting a real page redirect rather than a JSONP-wrapped response.
   Adding both params to match their own script's request shape
   exactly, rather than only the documented field list, is the fix. */
function getOrCreateMlGuid() {
  const randomSegment = () =>
    Math.floor(65536 * (1 + Math.random()))
      .toString(16)
      .substring(1);
  const generate = () =>
    `${randomSegment()}${randomSegment()}-${randomSegment()}-${randomSegment()}-${randomSegment()}-${randomSegment()}${randomSegment()}${randomSegment()}`;

  try {
    if (window.localStorage) {
      const existing = window.localStorage.getItem('ml_guid');
      if (existing) return existing;
      const fresh = generate();
      window.localStorage.setItem('ml_guid', fresh);
      return fresh;
    }
  } catch (e) {
    // localStorage can throw in private-browsing/blocked-storage modes —
    // fall through to a session-only value rather than failing the
    // submission over a non-essential identifier.
  }
  return generate();
}

/* One JSONP request = one uniquely-named temporary global callback.
   Deliberately NOT reusing MailerLite's own `ml_webform_success_{id}`
   naming convention — that convention bakes in a single numeric form
   ID because MailerLite's own embeds assume one wrapper per page. This
   page has two independent forms (hero + bottom) submitting to the
   same MailerLite list; a shared/fixed callback name would let a
   second submission racing the first overwrite or prematurely resolve
   it. A fresh name per call sidesteps that entirely — this is a
   non-issue once hand-rolled, not something that needed a workaround. */
let mlCallbackCounter = 0;

function mailerliteSubscribe(email) {
  return new Promise((resolve, reject) => {
    const callbackName = `mlWaitlistCallback_${Date.now()}_${mlCallbackCounter++}`;
    let settled = false;

    const cleanup = () => {
      clearTimeout(timeoutId);
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    // MailerLite's JSONP endpoint has no built-in delivery guarantee we
    // can observe from here (no XHR, so no onerror for e.g. a CORS-free
    // 4xx/5xx — the browser just loads whatever the endpoint returns as
    // executable JS). A timeout is the only way to avoid hanging the
    // button forever if the callback never fires (dropped request, ad
    // blocker, MailerLite outage, etc.).
    const timeoutId = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('timeout'));
    }, 8000);

    window[callbackName] = (response) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(response);
    };

    const params = new URLSearchParams({
      callback: callbackName,
      'fields[email]': email,
      'ml-submit': '1',
      anticsrf: 'true',
      ajax: '1',
      guid: getOrCreateMlGuid(),
    });

    const script = document.createElement('script');
    script.src = `${MAILERLITE_FORM_ACTION}?${params.toString()}`;
    script.async = true;
    // Covers script-tag-level failures (network down, domain blocked,
    // etc.) — a real HTTP error from MailerLite's endpoint that still
    // returns valid JS would instead resolve via the callback above
    // with whatever payload they sent, not hit this path.
    script.onerror = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('network'));
    };
    document.head.appendChild(script);
  });
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

    mailerliteSubscribe(email)
      .then((response) => {
        if (submitBtn) submitBtn.classList.remove('is-loading');

        // MailerLite's own success handler treats `response.success`
        // as the actual pass/fail signal (see webforms.min.js) — a
        // 200-shaped JSONP payload can still carry field-level errors,
        // e.g. their own server-side email re-validation. Mirror that
        // check rather than assuming "the callback fired" means "it
        // worked".
        if (response && response.success) {
          form.hidden = true;
          if (successEl) {
            successEl.hidden = false;
            successEl.classList.add('is-visible');
          }
        } else {
          showError('Нещо се обърка. Моля, опитайте отново.');
        }
      })
      .catch(() => {
        if (submitBtn) submitBtn.classList.remove('is-loading');
        showError('Нещо се обърка. Моля, проверете връзката си и опитайте отново.');
      });
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
  // Arrow buttons were removed from the DOM per feedback (dots-only nav);
  // keyboard arrows and swipe still work below regardless.
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

/* ---------------------------------------------------------------------
   PHASE 4 — FAQ accordion
   Multiple items can be open at once (not single-open/accordion-radio)
   — see index.html comment for reasoning. JS only ever toggles a class
   (`.is-open` on `.faq__item`) plus the trigger's `aria-expanded`; the
   actual expand/collapse animation is done in CSS via an animatable
   grid-template-rows on `.faq__answer` (see style.css), same
   "JS decides state, CSS animates it" split already used for
   .reveal/.is-visible and the Bravies-card .is-pulsing effect above.
--------------------------------------------------------------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector('.faq__question');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
}

/* ---------------------------------------------------------------------
   PHASE 4 (later addition) — Wait-list Signup clouds
   Reuses the hero's four cloud PNGs on the Wait-list Signup section,
   with their own independent parallax. Deliberately a SEPARATE function
   from initHeroClouds() rather than a generalized/shared one: the hero
   is always at the top of the page, so its progress is a simple
   window.scrollY / heroHeight ratio. This section can sit anywhere
   further down the page, so progress instead has to be derived from
   the section's own position relative to the viewport (via
   getBoundingClientRect()) — a different formula, not just a different
   element reference. Same output contract either way: writes
   --scroll-progress (0–1) onto the section element, which .cloud's
   shared transform rule already reads via var(--scroll-progress, 0),
   so no CSS-side special casing was needed.
   Progress reaches 1 once the section's top has scrolled up to meet
   the top of the viewport (i.e. the section has fully "entered").
   This is deliberately NOT the same formula as "entered AND then
   fully exited past the top" (which would divide by
   `window.innerHeight + sectionHeight` instead of just
   `window.innerHeight`) — that version was tried first and had a real
   problem: this section is always the LAST thing on the page, so
   there's no more content below it to keep scrolling through once it
   arrives. On a tall page with a comparatively short section (the
   common case here) and a tall mobile viewport, the page simply runs
   out of scrollable distance before the "fully exited" version could
   ever reach much past ~0.3–0.5, which read as "the clouds barely
   move" even though the code was working exactly as written. Ending
   the range at "fully entered" instead reaches 1.0 reliably regardless
   of how much (or little) scroll room exists past that point. */
function initWaitlistClouds() {
  const section = document.getElementById('waitlist-signup');
  if (!section) return;

  const setProgress = () => {
    const rect = section.getBoundingClientRect();
    const progress = Math.min(Math.max((window.innerHeight - rect.top) / window.innerHeight, 0), 1);
    section.style.setProperty('--scroll-progress', progress.toFixed(4));
  };

  setProgress();
  window.addEventListener('scroll', setProgress, { passive: true });
  window.addEventListener('resize', setProgress);
}
