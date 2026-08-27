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

/* One JSONP request needs one global callback that MailerLite's
   response invokes by name.

   IMPORTANT CORRECTION (this took a live-debugging round to find):
   the first version of this function generated a fresh random callback
   name per request, on the assumption that MailerLite's backend was a
   generic JSONP endpoint that would happily echo back whatever name we
   sent — reasonable for textbook JSONP, but not what actually happens
   here. Reading the *complete* unminified `webforms.min.js` (an
   earlier read only surfaced a fragment) shows their real ajax call is:
   `window.ml_jQuery.ajax({..., jsonpCallback: "mlWebformSubmitted",
   dataType: "jsonp", ...})` — every real MailerLite embed anywhere
   uses that one exact, hardcoded, literal callback name. Nothing
   randomly generated.

   That's almost certainly why the earlier `ajax=1`/`guid` fix alone
   didn't resolve the empty-response symptom: this backend's JSONP
   wrapping appears to depend on the callback name it was actually
   built and tested against, not an arbitrary caller-supplied one.
   Switching to the same fixed name is the direct fix for that.

   The trade-off this reintroduces: a single shared global callback
   name across two independent forms on one page. MailerLite's own
   script has this exact same property — it's how every site with
   multiple MailerLite forms already works, not a design flaw. We
   handle it the same pragmatic way real usage does: guard against two
   submissions genuinely overlapping by serializing requests through a
   small queue below, rather than trying to invent per-request callback
   identity their backend doesn't actually support. */
const MAILERLITE_JSONP_CALLBACK = 'mlWebformSubmitted';

// Serializes mailerliteSubscribe() calls so two near-simultaneous
// submissions (hero + bottom form) never have two in-flight requests
// racing to define/overwrite the one shared MAILERLITE_JSONP_CALLBACK
// at once. Each call waits for the previous one to fully settle
// (success, server error, or timeout) before its own request goes out.
let mlSubscribeQueue = Promise.resolve();

function mailerliteSubscribe(email) {
  const runRequest = () =>
    new Promise((resolve, reject) => {
      let settled = false;

      const cleanup = () => {
        clearTimeout(timeoutId);
        delete window[MAILERLITE_JSONP_CALLBACK];
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

      window[MAILERLITE_JSONP_CALLBACK] = (response) => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(response);
      };

      const params = new URLSearchParams({
        callback: MAILERLITE_JSONP_CALLBACK,
        'fields[email]': email,
        'ml-submit': '1',
        anticsrf: 'true',
        ajax: '1',
        guid: getOrCreateMlGuid(),
        // Cache-buster. `assets.mailerlite.com` is a CDN domain, and once
        // the callback name became a fixed literal (see the comment on
        // MAILERLITE_JSONP_CALLBACK above), a repeat submission with the
        // same email + persisted guid produces an identical URL — which
        // browsers are free to serve from cache instead of re-requesting.
        // Diagnosed live: an early empty-body response got cached, and
        // every identical retest after that was silently served the
        // stale cached copy rather than hitting MailerLite again at all
        // — explaining why changing the request params earlier didn't
        // seem to change the outcome, and why disabling browser
        // extensions "fixed" it (forced a fresh, uncached reload) even
        // though the extensions themselves were never the actual cause.
        _: `${Date.now()}${Math.floor(Math.random() * 1e6)}`,
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

  // Chain onto the queue regardless of how the previous request settled
  // (.then(fn, fn), not just .then(fn)) so one server error or timeout
  // doesn't permanently wedge every submission after it. The queue
  // variable itself is swallowed to "always resolves" so it never
  // becomes a rejected promise that later .then() calls skip over.
  const result = mlSubscribeQueue.then(runRequest, runRequest);
  mlSubscribeQueue = result.then(
    () => {},
    () => {}
  );
  return result;
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
