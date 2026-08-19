# Specification: "Смелчовци в беда" Landing Page

*Status: Phase 1 (Hero + Bravies Intro), Phase 2 (Problem + What It
Teaches + How It Works), Phase 3 (Testimonials + Desired State), and
Phase 4 (FAQ + Wait-list Signup) complete. Phase 5 (integration pass)
next. This document reflects current, as-built behavior — not a change
history. Tech stack decision: vanilla JS (no framework needed).*

*⚠️ Phase 3 note: the actual Phase 1–2 `script.js` was not included in
the file set handed to the assistant for that phase (only
`index.html`, `style.css`, `SDD.md` were attached). The Hero-cloud
scroll-progress, reveal-on-scroll, and `initWaitlistForm()` logic
described below were reconstructed from this document's own
description of their behavior, not copied from a verified source file.
**Resolved in Phase 4**: the real `script.js` was supplied this phase
and diffed against the reconstruction — behavior matched, no
corrections needed. The open item under "Open Decisions" asking for
this verification is now closed.*

## 1. Goal

A high-converting, single-page landing page in Bulgarian to collect user emails for a waitlist for kids' board game.

## 2. Tech Stack

- HTML5 (semantic layout)
- CSS3 (Responsive, Flexbox/Grid, pure CSS)
- Vanilla JavaScript (form handling, UI interactions, scroll-driven animation)

## 3. UI/UX Requirements

### Hero Section

H1 "Смелчовци в беда", subheadline "Игра за умни действия в ситуации с (не)познати.", email input + "Запиши се за първите 100" button.

- Background `#5080BF`, text white `#F8FAFC`.
- Email input capped at `max-width: 320px` and centered alongside the button on desktop (was stretching to fill the whole hero-content width); text/placeholder centered on mobile.
- Mobile has extra top padding so the H1 isn't flush against the viewport edge.
- **Hero height is reduced at every breakpoint** (not `100vh`) so the top of the Bravies section peeks above the fold everywhere, not just desktop: mobile `230px` peek, portrait tablet `260px`, landscape tablet/desktop `300px`, ≥1440px `340px`.
- **Clouds**: 5 real supplied PNGs (not CSS shapes), varied sizes/placement so they read as scattered rather than uniform. Movement is a direct function of scroll position within the hero (one `--scroll-progress` CSS variable, 0–1) — scrolling up naturally reverses the drift. On mobile, only 2 of the 5 are shown (bottom-left and bottom-right, both small); the rest are hidden to avoid crowding the text column on a tightened mobile hero.
  - **Bug fixed**: the clouds weren't moving at all. `.hero__clouds` had `--scroll-progress: 0` declared directly on it as a "default" — but a custom property declared on an element always wins over an inherited value from a parent, regardless of specificity, even when the local declaration is meant only as a fallback. Since script.js sets the live value on `#hero` (the parent), `.hero__clouds` was permanently shadowing it with 0. Fixed by removing the local declaration and moving the fallback into the `var()` calls in `.cloud`'s transform instead (`var(--scroll-progress, 0)`), which only applies when nothing has been inherited at all. General lesson: never redeclare a custom property "just as a default" on an element that's also supposed to inherit a live value for that same property from a JS-controlled ancestor.
- Error message (shared by both waitlist forms on the page): solid white pill background with dark red (`#7F1D1D`) text — guarantees contrast regardless of the section background behind it. Only rendered when non-empty.

### Bravies Intro Section

Intro text: "Твоето дете играе и учи със Смелчовците как да:" — sized down and set to `white-space: nowrap` from 768px up so it reads as one line; wraps normally on mobile.

5 cards, `border-radius: 15px`, **3:5 aspect ratio** (physical cards are 6×10cm), uniform thick colorful border on all sides. Character portrait is real artwork (not a placeholder), filling the entire card; the caption is a bottom overlay panel with a **solid** brand-color background (not a literal CSS border — a border can only ever be a thin stripe, not a panel that holds text) containing the name (uppercase) and bio. **All text is always fully visible, at every breakpoint** — there is no hover/tap-to-expand text state.

Portrait size:
- **Desktop / landscape tablet only** (`min-width: 1024px`, or `min-width: 768px` + landscape): portraits render enlarged by default for every card (not just on hover), `scale(1.16) / translateY(-14%)`. Hovering adds a brief "pulse" (grows slightly further and settles back via `@keyframes`, not a persistent size change).
- **Mobile / portrait tablet**: portraits stay at the small, contained size. **Each card now pulses individually, once, the first time it scrolls into view** — added because hover isn't a real interaction on touch devices. Same one-shot IntersectionObserver pattern as the sitewide `.reveal` system (`initBraveCardScrollPulse()` in script.js), but its own class (`.is-pulsing`) and animation, since it's a different element/effect than a simple fade-in. The CSS rule is explicitly neutralized inside the desktop breakpoint so it can never layer with the hover pulse there.
  - **Bug fixed**: Неда's card pulsed once on page load and then never again on hover, while every other card's hover worked fine. Root cause: Неда's `<li>` carries a static `is-active` class from page load (see `index.html`), and the pulse animation used to be wired to fire on *either* `.is-active` *or* `:hover`. Because `is-active` never toggles, the browser had no "fresh" trigger to replay the animation on subsequent hovers — the computed animation value never actually changed, since the `is-active` rule was already supplying the exact same animation continuously. Fixed by dropping the `.is-active` half of that selector; the pulse is hover-only now, consistent across all 5 cards. `is-active`/`aria-expanded="true"` stay on Неда's markup for their original (unrelated) purpose — only the animation coupling was removed.

Each card has a small individual tilt (1.5°–2.5°, alternating direction per character) at every breakpoint, so the row reads like playing cards set down on a table rather than a stiff grid.

Card order: DOM order matches the mobile/portrait-tablet reading order (Неда, Вихрен, Веста, Заки, Мишо — Неда is default-active). Desktop/landscape-tablet reorders **visually only** via CSS `order` to Заки, Вихрен, Неда, Веста, Мишо. *(Known accessibility trade-off, not yet resolved: desktop tab/keyboard order still follows DOM order, not the visual left-to-right order.)*

Layout:
- Desktop / landscape tablet: single row.
- Portrait tablet (`≥768px` + portrait orientation): 3 rows — Неда alone, Вихрен + Веста, Заки + Мишо.
- Mobile: 1 card per row.

Brand colors (corrected from early spec typos): Заки `#725598`, Вихрен `#F68044`, Неда `#FDD43B`, Веста `#278C5D`, Мишо `#E5E1D6`.

### The Problem Section

H2: "Обяснявам хиляди пъти, но тя е толкова доверчива…" + 3 unchanged paragraphs.

- Background: solid `#725598` (Заки's purple), white text.
- Single centered text column (max `62ch`) at every breakpoint — no section-specific mobile layout needed, it's plain prose.
- Heading is wrapped in large, yellow (`--color-neda`)-accented quotation marks (`„...“`), styled as a visible pull-quote rather than plain unmarked text.

### What It Teaches Section

H2: "На какво учи играта?" + intro paragraph (unchanged). Closing paragraph ("Всичко това не се преподава - изиграва се...") was **replaced with a CTA button**: "Хайде да играем!", scroll-links to the How It Works section (`#how-it-works`). Uses the reusable `.cta-button` component (yellow, same color as the hero form's submit button — the Desired State section's later CTA should reuse this same component rather than a new one-off style).

- Background white `#F8FAFC`.
- Middle content is **6 icon+color point tiles** (not a bulleted list) — 5 tied to a Bravie's brand color, plus a 6th turquoise (`--color-buddy: #2FB6B0`) tile for the Help/Buddy "joker" cards, which aren't tied to any single Bravie. **No Bravie names are shown here** — only the color/icon pairing calls back to the Bravies Intro section above.
- Tile style: white interior, solid full-strength brand-color border (3px). Icon badge: 84px circle, solid brand-color fill, straddling the tile's top edge (2/3 above, 1/3 inside).
- Icons: real assets wired for 5 of 6 (resist→Неда, running_away→Вихрен, tell→Веста, keyword→Заки, help→Buddy), tinted per-tile via CSS `mask-image` (one white source PNG, recolored via `background-color` per tile — works because `mask-image` is blocked under `file://` by a Chromium CORS quirk that doesn't affect `<img>`, so always verify icon changes over a local HTTP server, not by opening the file directly). Glyph colors are chosen to be **colorful**, not just dark-for-contrast: Неда's hand is burnt orange (`--color-icon-burnt-orange: #A8501A`), Вихрен's runner is deep red (`--color-icon-deep-red: #7A2020`), Buddy's shield+heart is deep teal (`--color-icon-deep-teal: #0E4749`); Веста's megaphone and Заки's key stay plain white (confirmed good as-is). **Мишо's icon is still an empty placeholder** — the supplied `face.png` was rejected (style + resolution mismatch with the other 5 flat single-color glyphs); needs a same-style replacement (search "confused/frozen/distracted," not "face"/"emoji" — suggested libraries: Phosphor Icons, Material Symbols Filled/Rounded, Font Awesome Solid).
- Grid: 3 columns on desktop (settles into a 3+3 layout for 6 tiles), reflows to 2 columns on tablet, 1 on mobile. Each tile scroll-reveals independently (not all at once).

Point copy (final, except Buddy — see note):

1. **Неда**: Учи детето да се доверява на интуицията си, когато нещо не му се струва наред, да казва ясно и без вина „Не!“, и да пита родителите си преди да предприеме каквото и да е.
2. **Вихрен**: Учи детето да разпознава безопасни места и безопасни възрастни, към които да се обърне при нужда - например униформен служител или продавач, не непременно познат човек. И че може просто да си тръгне от опасна ситуация, без да е длъжно да обяснява или да бъде учтиво.
3. **Веста**: Учи детето да споделя с близките си всяка ситуация, която го е накарала да се почувства неудобно - без значение колко малка изглежда.
4. **Заки**: Играта въвежда и конкретни принципи за безопасност - семейна парола, правилото „само възрастни помагат на възрастни“, и защо никой доверен човек никога не иска от дете да пази тайна.
5. **Мишо**: Децата се запознават и с реакциите, които им пречат в реална ситуация - замръзване, прекалена учтивост, разсеяност. Не за да се срамуват, а за да се сещат навреме какво да направят и да ги преодоляват с практика.
6. **Buddy** *(first draft, not yet reviewed by the person)*: Учи детето, че да поискаш помощ не е слабост, а разумен избор. И че когато сте заедно с приятел, е достатъчно поне един от двамата да познае правилната реакция - защото да си в екип също означава да се пазите взаимно.

*Note: Вихрен's point is deliberately distinct from Веста's — Вихрен covers recognizing safe **unfamiliar** adults/places to turn to in the moment; Веста covers sharing **afterward** with people the child already knows.*

### How It Works Section

H2: "Как работи играта?"

Step copy (spec's original step 2 had a duplicated clause — fixed, used once):
1. Изтегляте ситуация. (Не)познат иска помощ. Предлага изкушение. Кара те да пазиш тайна. Какво правиш?
2. Всеки избира карта от ръката си. Кажи НЕ. Бягай. Кажи на близък. Правилната реакция, в точния момент.
3. Играчите си помагат и обсъждат заедно. Всички отговарят правилно - всички споделят наградата.

- Background: solid `#E5E1D6` (Мишо's beige — was Веста's green; changed per feedback). Being light rather than dark, this drove several follow-on color changes: body text is dark (`--color-text-dark`, was white). **Step titles AND step-number badges are `--color-misho-trim` (`#8B5E3C`, brown)** — both were purple (`--color-zaki`) until now, which clashed against the Мишо-colored card art in this section; the brown comes from Мишо's own character palette (her shoes/trim color) so both elements read as part of the same character instead of an unrelated accent color.
- Each step's **first sentence is its title** — uppercase, accent color, own line; the rest of that step's sentences follow as one normal paragraph below it.
- Zigzag: step 1 text-left/card-right, step 2 text-right/card-left, step 3 text-left/card-right (via `row-reverse` on step 2 only — DOM/reading order is always text-before-card regardless of visual side).
- Cards: small (`width: min(130px, 36vw)`), 3:5 ratio, individually tilted (same technique as the Bravies cards). **Card size was deliberately shrunk** to keep the whole section's height to ≤1.5 screens on desktop (was running 2+). Steps 1 and 2 now use real supplied card art (situation card → step 1, "Не!" reaction card → step 2); step 3 still has no art, stays a dashed-border white placeholder box.
  - Real card `<img>`s must NOT be sized with `width/height:100%` here — unlike the Bravies-portrait pattern, this element defines its own box directly (width + aspect-ratio from the base `.how-it-works__card` rule), so `100%` resolves against the flex parent instead and blows the image up far past its intended size. Only `object-fit` is needed on the image itself.
  - On mobile, `.how-it-works__card-wrap` needs `min-height: auto` (not the `0` used for the desktop row layout) — in the mobile column layout, `flex:1 1 0` with `min-height:0` collapses the item toward zero height instead of sizing to the image's aspect ratio, since there's no automatic content minimum left to fall back on.
- Mobile: each step's card stacks above its related text (visual-only reorder).
- Scroll-triggered slide-in-up animation, per-element (each step's text block and card reveal independently, not the whole section at once), one-time (doesn't repeat), skipped under `prefers-reduced-motion`.

### Testimonials Section

H2: "Какво казват децата и родителите?" One quote live today: "Това е най-яката игра, на която съм играл." — Анди на 5.5 години.

- Placement: after How It Works, at the bottom of the page content (before FAQ/Wait-list in Phase 4). **Corrected in a follow-up pass** — the first Phase 3 build inserted this section right after Bravies by mistake (it was placed at the literal `NEXT-PHASE-INSERT-POINT` marker without checking that the marker itself sat before Phase 2's sections, not after them). Flagging so the same slip doesn't repeat: always confirm an insert-point marker's actual position in the file, not just its existence.
- Background white `#F8FAFC`, same surface as Bravies/What It Teaches.
- Built as a real left-right slider (track + `translateX`), not a static single card, even though only one slide exists — adding a second testimonial later is a markup-only change (append another `.testimonials__slide` `<li>` with its own `--slide-accent` inline style), no JS or CSS edits needed.
- **No card/border.** Quotation marks flank the quote **left/right** (not stacked above/below — stacking ate too much vertical height, per feedback), vertically centered against the whole quote-plus-citation block. Each slide carries a `--slide-accent` custom property that colors both its quotation marks and its dot; the palette cycles through the 5 brand colors in this order: Веста green (default/first) → Вихрен orange → НЕда yellow → Заки purple → Мишо beige. Мишо's beige will read faint against the white background once the cycle reaches it — flagged, not yet resolved.
- **Arrows removed — dots are the only nav control now**, per feedback. Dots stay visible even with today's single quote (colored per-slide, always shown — not hidden via an `.is-single` class like an earlier version did) so the mechanism reads as "alive" before quote #2 exists.
- Every interaction — dot click, `ArrowLeft`/`ArrowRight` (keyboard nav still works even without visible arrow buttons), touch swipe — replays the quote's fade/rise entrance animation, even when it loops back to the same single slide. This is a forced-reflow restart in JS (`initTestimonialsSlider()`; the CSS animation alone won't replay just by re-applying an unchanged class), not a CSS-only trick.
- `prefers-reduced-motion` disables both the track's slide transition and the quote's entrance animation.
- **Implementation note carried over from the first pass**: the dot-pagination wrapper (`[data-slider-dots]`) sits as a sibling of `.testimonials__slider` in the DOM, not nested inside it — the JS scopes its `querySelector` to the shared `.testimonials__inner` ancestor rather than to `slider` itself for this reason.

### Desired State Section

H2: "Представете си този момент…"

Body (3 short paragraphs) walks through a specific reassurance scenario — child briefly out of sight at a playground, a stranger approaches, but instead of panic the parent feels calm because the child handles it correctly and reports back. Ends on "Това е моментът, в който осъзнавате, че:" leading into the list.

List copy (checkmark bullets, one line each):
1. Вашето дете знае как да се пази самостоятелно.
2. Изградили сте невидима броня от умения и инстинкти.
3. Постоянната тревожност е заменена с дълбоко вътрешно спокойствие.
4. Най-накрая можете да си отдъхнете, знаейки, че сте му дали най-ценния подарък.

- Background: `--color-vihren` (Вихрен's orange, `#F68044`) — proposed, not locked; see Open Decisions. Dark text (`--color-text-dark`) on it, same contrast logic as the beige How It Works background.
- **Checkmark bullet list, not a 2×2 icon-box grid** (replaced per feedback — the boxes+icons read as too heavy/cluttered). Each item: a solid Веста-green circular tick + bold (weight 700) Nunito Sans text, left-aligned, stacked in a single column at any screen width (no separate mobile/desktop layout needed anymore, since a vertical list already works at every width).
- **Each bullet still animates in individually** — a per-item `transition-delay` stagger (0s / 0.12s / 0.24s / 0.36s via `:nth-child`) layered on top of the shared `.reveal` mechanism, so items cascade in one after another rather than popping in as one block. Disabled under `prefers-reduced-motion` (delay forced to 0s).
- CTA: "Искам това спокойствие", reuses the `.cta-button` component (same yellow as the What It Teaches CTA); links to `#waitlist-signup`. That target doesn't exist until Phase 4 — expected no-op scroll until then. Text is explicitly centered (`text-align: center` added alongside the existing flex centering, defensively — it already rendered centered in testing, but this guards against any future content change inside the button).

### FAQs Section

H2: "Въпроси и отговори". Standard vertically-unfolding layout — questions always visible, arrow icon unfolds each answer. **Multiple items can be open at once** (not a single-open/accordion-radio) — no content-level reason found to force mutual exclusivity, and single-open would re-collapse an answer a parent is still reading if they open a second question; flagged as a judgment call, not re-litigated since.

**7 real Q&As** (final copy, not dummy — a duplicate 8th question was cut, see below):
1. Кой може да играе?
2. А ако детето ми е на 4 или на 10 години?
3. Как учат децата чрез играта?
4. Могат ли децата да играят сами?
5. Ситуациите страшни ли са?
6. Няма ли да омръзне след няколко пъти?
7. Кога ще е готова играта?

- **"На какво учи играта?" was removed** — it duplicated the standalone "What It Teaches" section higher up the page (same content, including the bullet list of what the game teaches), so it's redundant here. IDs were renumbered sequentially 1–7 after the cut; no gaps.
- Background white (`--color-surface-white`), dark text — continues the alternation after Desired State's orange.
- Markup: `<h3>` wrapping the trigger `<button>` (WAI-ARIA accordion pattern), answer `<div>` as the `<h3>`'s sibling inside the `<li>`. Trigger carries `aria-expanded` + `aria-controls`; answer carries `role="region"` + `aria-labelledby` pointing back at the question.
- **Expand/collapse is CSS-only** — animatable `grid-template-rows` (`0fr` collapsed → `1fr` open) on `.faq__answer`, with `overflow: hidden` on the inner wrapper so the row can actually clip to zero. JS (`initFaqAccordion()` in `script.js`) only toggles `.is-open` on `.faq__item` and mirrors it onto the trigger's `aria-expanded` — same "JS decides state, CSS animates it" split already used for `.reveal`/`.is-visible` and the Bravies-card `.is-pulsing` pulse. No JS height measurement needed.
  - Note for future reference: this `grid-template-rows` + child-`overflow:hidden` technique is a *different* mechanism than the flex `min-height: 0` issue documented elsewhere in this file (that one's about a flex child's main-axis min-size; this is a grid row track collapsing) — don't conflate the two if debugging either.
- Chevron icon rotates 180° on open (CSS transition off the same `.is-open` state), disabled under `prefers-reduced-motion` along with the row-height transition.
- Icon/hover accent reuses `--color-zaki` (purple) — already the sitewide `:focus-visible` outline color, so it reads as the established "interactive" accent rather than introducing a new one.
- `.faq__answer-list` (bullet-list styling inside an answer) is currently unused now that the only answer using it was cut — left in `style.css` rather than deleted, in case a future FAQ answer needs a list again.

### Wait-list Signup Section

H2: "Записването е отворено". Reuses the hero form's exact markup pattern (`waitlist-form` structure + `data-waitlist-form` attribute) — `script.js`'s `document.querySelectorAll('[data-waitlist-form]').forEach(initWaitlistForm)` binds every matching element automatically, so this needed **zero JS changes**, confirmed against the real `script.js` before building. Form and success-message markup are siblings under a shared wrapper (`.waitlist-signup__inner`), same structural requirement as `.hero__content`, since `initWaitlistForm()` finds the success element via `form.parentElement.querySelector('.success-message')`.

- Background `--color-neda` (Неда's yellow).
- **Heading**: white (`--color-surface-white`), forced to a single line via `white-space: nowrap` + a `clamp(1.35rem, 6vw, 2.5rem)` font-size tuned to still fit "Записването е отворено" on one line down to a 375px viewport — the section's shared dark-text default (used elsewhere on light/pale sections) read weak against this saturated a yellow at H2 size, and two-line wrap looked cramped over the short form beneath it. Verify this still holds at any width narrower than 340px if you test on a smaller device.
- **Button**: `--color-zaki` (Заки purple) background, white text — direct request, replacing an earlier dark-inverse (`--color-text-dark`) treatment from the first pass. Purple-on-yellow reads clearly without needing an inverse workaround; modifier stayed named `.waitlist-form--on-neda` (distinct from `.waitlist-form--on-light`, which assumes a white/pale surface) since the input's contrast tweak from the first pass is unchanged, only the button's fill color moved.
- A `.success-message--on-light` modifier (dark text, `--color-vesta` green icon) is still in place from the first pass — the default success state assumes a dark section (white text, pale mint icon), unreadable on yellow.
- **Section height, cut roughly in half per direct request** (was ~446px on desktop, now ~220px). Three separate things contributed, only one of which was "just reduce padding":
  1. **Real bug fix, not just a style tweak**: `.success-message`'s own `display: flex` was outranking the browser's built-in `[hidden] { display: none }` rule in CSS specificity (a class beats a bare attribute selector), so the hidden success message was still reserving its full height in the layout — invisible but taking up ~98px of space. Added `.success-message[hidden] { display: none; }` (higher specificity, wins correctly) to fix this globally — it was quietly affecting the hero form too, just harder to notice there against more surrounding whitespace.
  2. Removed a redundant double gap: `.waitlist-form` carries its own `margin-top` (sized for the hero's plain-block layout), which was stacking on top of `.waitlist-signup__inner`'s own flex `gap` — zeroed out via `.waitlist-signup__inner .waitlist-form { margin-top: 0; }`.
  3. Padding itself trimmed from `var(--space-5) var(--space-2) var(--space-6)` (64px/96px) to `var(--space-3) var(--space-2) var(--space-4)` (24px/40px).
- **Clouds — bigger, per direct request**: sizes bumped ~1.4× from the first pass (e.g. the back top-left cloud's max width went from 320px to 460px). This is a pure CSS change against the *same* four PNGs — no new image files needed to see the size increase. Whether they stay crisp at the larger size depends on the source PNGs' own native pixel dimensions, which this project can't verify (no cloud assets in this file set — these are CSS boxes with `background-size: contain`, so a low-res source will visibly soften when upscaled). Rule of thumb if checking: for a sharp render at up to ~460px CSS width on a retina (2×) screen, the source PNG should be at least ~920px wide natively. Worth a visual check once real assets are swapped in — if they look soft, that's a resolution issue, not a CSS one, and the fix is re-exporting larger source files, not further CSS changes.
- **Clouds, positioning — went through three iterations to get right, worth understanding if this needs further adjustment**: reuses the hero's four cloud PNGs as two overlapping pairs — `.cloud--wl-1`/`.cloud--wl-2` stacked top-left, `.cloud--wl-3`/`.cloud--wl-4` stacked bottom-right — each pair using a different `--cloud-distance` so the front cloud drifts further than the back one on scroll (parallax depth cue). Section has `position: relative; overflow: hidden` (same pattern as `.hero`) so the artwork can bleed past its edges without a horizontal scrollbar.
  - **Attempt 1** (percentage `top`/`bottom`, matching the hero's own approach) broke as soon as the height fix above landed — the same percentages now resolved much closer to the heading text, overlapping it (white text over a pale cloud shape = unreadable where they crossed).
  - **Attempt 2** (fixed-px `top`/`bottom`) fixed that, but testing beyond the usual three breakpoints (768/900/1000/1200px, not just mobile/tablet/desktop) turned up a second, wider problem: the cloud *width* clamps scale continuously with `vw`, and the heading text width also grows with viewport, so the two kept colliding across most of the tablet/small-desktop range — only clearing up around ~1330px+, well above typical laptop screens.
  - **Attempt 3, shipped**: a new `--cloud-y-offset` custom property, folded into the shared `.cloud` transform (`translate(<parallax-x>, var(--cloud-y-offset, 0%))` — hero clouds don't set it, so they default to 0% and are completely unaffected). Each waitlist cloud anchors at `top: 0` / `bottom: 0` and uses `--cloud-y-offset: calc(-100% + 28px)` (or the mirrored `calc(100% - 28px)` for the bottom pair) — this moves the cloud by its own full height, then back by a flat pixel amount, so a *fixed* ~28–34px sliver shows at the section edge **regardless of the cloud's resolved size** at any viewport. This sidesteps the horizontal collision question entirely, since only a shallow, constant-height strip near the very top/bottom edge is ever visible, well clear of both the heading and the button row. Verified clean (no text overlap) at 375/768/900/1000/1200/1440px.
  - Parallax itself is driven by a **separate** function, `initWaitlistClouds()` in `script.js`, not a shared/generalized version of `initHeroClouds()` — the hero is always page-top (`window.scrollY / heroHeight`), this section can sit anywhere further down (`getBoundingClientRect()`-based instead). Verified directly: swapped in placeholder cloud art, scrolled through the section programmatically, confirmed via computed `transform` values that the front-layer cloud in each pair moves ~2.4× further than its back-layer partner, and that `--scroll-progress` stays at 0 until the section approaches the viewport.
- The `NEXT-PHASE-INSERT-POINT` marker comment has been removed — Phase 5 is an integration pass only, no new sections to insert.

### Design System

- **Typography — Dela Gothic One (display/headings) + Nunito Sans (body/UI).** Not in the original brief; chosen after a dedicated typography pass (see below), replacing the initial Baloo 2 choice.
  - **Fonts are self-hosted** from `/assets/fonts` via `@font-face` in `style.css`, not loaded from Google Fonts' CDN. Deliberate choice, not a default: this is an EU/Bulgaria-facing site collecting emails, and loading `fonts.gstatic.com` directly sends every visitor's IP to Google before any consent — the exact pattern a 2022 Munich court ruling found to violate GDPR. Self-hosting sidesteps it entirely and drops two DNS/TLS round-trips as a bonus. `index.html`'s `<head>` still has the (now-unused) `preconnect` tags for Google Fonts — harmless, safe to delete later.
  - **Baloo 2 was dropped for a real reason, not just taste**: verified directly (pulled the actual font package, not just its Google Fonts description page) that Baloo 2 ships zero Cyrillic glyphs — only Devanagari, Latin, Latin Extended, and Vietnamese. Every Bulgarian heading was silently falling back to the browser's system font this whole time. Lesson applied going forward: check actual subset/glyph coverage in the font files themselves before adopting any typeface for this project, not just a description page — a font can be "on Google Fonts" and still not cover the language you need.
  - **Dela Gothic One has exactly one real weight (400, static, not variable).** Every heading/display-font rule in `style.css` is pinned to `font-weight: 400` for this reason — requesting 700/800/900 against a single-weight face makes the browser synthetic-bold it, which looks blobby on an already-heavy display font. If you ever want a lighter or heavier display option later, that requires a different typeface, not a different weight of this one.
  - **One deviation from a literal 1:1 swap, flagged for your review**: the Testimonials quote sentence itself (`.testimonials__quote p`) is set in Nunito Sans (weight 600), not Dela Gothic One, even though it's inside an otherwise Dela-Gothic-One-only section. Reasoning: Dela Gothic One is a poster/headline face meant for a few words at a time; a full sentence set in it at `--font-size-h2` read as shouty rather than warm when tested. The giant opening/closing quotation-mark glyphs around it stayed in Dela Gothic One (400) since those are just 1–2 characters, which is exactly what the face is good at. Happy to revert this specific choice if you'd rather the whole quote block match.
  - Body text default weight is now 300 (light), per your original "thick childlike titles / light non-serif paragraphs" direction — explicit `font-weight` overrides (buttons, labels, citations) are unaffected since they set their own weight already.
  - **Cyrillic-quality caveat, for the record**: a specialist Cyrillic type-review source (type.today) flags Dela Gothic One's Cyrillic extension as technically complete but lower design quality than its Latin set — likely subtle stroke/proportion inconsistencies a trained eye would catch. Nothing looked broken in our own rendered tests (see the headline/pairing screenshots from this pass), so treating this as a "know before you scale up" note rather than a blocker.
- Brand colors: Заки `#725598`, Вихрен `#F68044`, Неда `#FDD43B`, Веста `#278C5D`, Мишо `#E5E1D6`, Buddy/joker `#2FB6B0` (turquoise, new — not one of the original 5 Bravies). Deep-toned icon-only variants: burnt orange `#A8501A`, deep red `#7A2020`, deep teal `#0E4749` (used for colorful icon glyphs where plain white/dark wouldn't do). Мишо's full character palette (for accenting content near her beige without clashing): `--color-misho-accent` sky blue `#4FA6E0` (cap/backpack), `--color-misho-trim` brown `#8B5E3C` (shoes/trim, currently used for How It Works' step titles), `--color-misho-hair` sandy blonde `#D4B483` (not yet used anywhere).
- Section backgrounds, in the spec's alternation order: Hero `#5080BF` → Bravies white → Problem `#725598` (Заки purple) → What It Teaches white → How It Works `#E5E1D6` (Мишо beige) → Testimonials white (`#F8FAFC`) → Desired State `#F68044` (Вихрен orange, **proposed, not locked** — the only warm brand color not yet used as a full section background; flagging for confirmation) → FAQ white (`#F8FAFC`) → Wait-list Signup `#FDD43B` (Неда yellow, **now set** — see FAQ/Wait-list Signup sections above for the button-contrast follow-on this required).
- Responsiveness: mobile (375px), tablet (768px portrait + landscape), desktop (1440px). Portrait vs. landscape tablet is distinguished via `orientation` media queries where the layout actually differs (Bravies section).

## 4. Functional Requirements (JS)

- Validate email format before submission; show an inline error message if invalid (see error message styling above).
- On valid submission: hide the form, fade in "Благодарим Ви! Вече сте записани. Ще се свържем с Вас за първия тираж!"
- Validation applies identically to both waitlist forms (hero + bottom signup) via the shared `[data-waitlist-form]` pattern.
- Storage: log the collected email to the console (mock API POST).

## 5. Constraints

- All CSS in `style.css`; all JS in `script.js`.

## Open Decisions

- Icon source for Мишо's "What It Teaches" replacement icon — still placeholder.
- Buddy tile copy (What It Teaches) — first draft, not yet reviewed.
- Desktop Bravies card tab-order vs. visual-order mismatch — no decision yet on whether to address it.
- Testimonials' 5-color accent cycle reaches Мишо's pale beige as a 5th option — confirm it's acceptable at low contrast against the white section background, or swap it for something darker once there are enough quotes to reach it.
- Desired State's orange background (`--color-vihren`) is still a proposal, not locked — carried over, unaddressed this phase.
- **Resolved**: Wait-list Signup's button now uses `--color-zaki` (Заки purple) + white text.
- **Resolved**: the duplicate "На какво учи играта?" FAQ question was cut — 7 questions ship, not 8.
- **Resolved**: Wait-list Signup's height, cut roughly in half (~446px → ~220px on desktop) — see Wait-list Signup Section above for the three separate contributors, including a genuine cross-cutting CSS bug fix (`[hidden]` on `.success-message` wasn't actually hiding it from layout).
- **Resolved**: Wait-list Signup's clouds are bigger (~1.4×, same source images) and their positioning is now resolved with a technique (`--cloud-y-offset` + `calc()`) that stays correct regardless of section height or viewport width, rather than the breakpoint-specific values from the first two attempts.
- **Still open**: FAQ's multiple-open (non-accordion-radio) behavior was chosen without a strong signal either way — flagging in case single-open is actually preferred once you see it live.
- **New, worth a look**: cloud sharpness at the larger size depends on the source PNGs' native resolution, which couldn't be checked (no cloud assets in this file set). See the "Clouds — bigger" note under Wait-list Signup Section for the rule of thumb on what resolution is needed to stay crisp.
