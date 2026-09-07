# Specification: "Смелчовци в беда" Landing Page

*Status: Phases 1–5.9 complete; Phase 5 (integration pass) next. Phase 5.9
compressed this document: constraints and current state kept, history and
rationale cut. It reflects current, as-built behaviour — not a change history.
Tech stack: vanilla JS, no framework.*

## 1. Goal

A high-converting, single-page Bulgarian landing page collecting waitlist
emails for a kids' board game.

## 2. Tech Stack

- HTML5 (semantic layout)
- CSS3 (responsive, Flexbox/Grid, pure CSS)
- Vanilla JavaScript (form handling, UI interactions, scroll-driven animation)

## 3. UI/UX Requirements

### Hero Section

H1 "Смелчовци в беда"; subheadline "Игра за безопасни действия в ситуации с
(не)познати."; tagline "**Спокойствие** за теб. **Увереност** за детето.";
email input + "Запиши се за първите 100" button.

- Background `#436BA0`, text white `#F8FAFC`. `--color-yellow-light` reaches
  4.58:1 and `--color-hero-text` 5.21:1 against it — both clear AA for normal
  text. Do not lighten the background without re-measuring both.
- Subtitle and tagline are `nowrap` from 768px up (plain `min-width`, so it
  applies in both tablet orientations); they wrap on mobile. The subtitle is
  52 chars and has 154.2px of slack at its tightest fit (920px).
- `.hero__tagline` is deliberately NOT given the subtitle's `opacity: 0.92` —
  opacity dims the whole subtree in one compositing step and would dilute the
  highlight spans' contrast along with the text.
- Email input capped at `max-width: 320px`, centred beside the button on
  desktop; text/placeholder centred on mobile. Extra top padding on mobile.
- **Hero height is reduced at every breakpoint** (not `100vh`) so the top of
  the Bravies section peeks above the fold: mobile `230px`, portrait tablet
  `260px`, landscape tablet/desktop `300px`, ≥1440px `340px`.
- **Clouds**: real supplied PNGs, varied sizes/placement. Movement is a direct
  function of scroll position within the hero — one `--scroll-progress`
  variable (0–1) set by JS on `#hero`, so scrolling up reverses the drift
  naturally. Only the two small bottom-corner clouds show on mobile.
  - **Never redeclare `--scroll-progress` on `.hero__clouds`**, even as a
    "default": a custom property declared on an element always beats an
    inherited value regardless of specificity, which permanently pins every
    cloud to 0. The fallback lives in `var(--scroll-progress, 0)` inside
    `.cloud`'s transform instead.
- Error message (shared by both waitlist forms): solid white pill, dark red
  (`#7F1D1D`) text, so contrast holds on any section background. Rendered only
  when non-empty.
- Success text (shared, both forms): "Благодарим! Вече си записан. Ще се
  свържем с теб за първия тираж!" — informal "ти" voice, as sitewide.

### Bravies Intro Section

Intro: "Твоето дете играе и учи със Смелчовците как да:" — `nowrap` from 768px
up, wraps on mobile.

5 cards, `border-radius: 15px`, **3:5 aspect ratio** (physical cards 6×10cm),
uniform thick colourful border. Real character portrait fills the whole card;
the caption is a bottom overlay panel with a **solid** brand-colour background
— not a CSS border, which can only be a thin stripe, not a panel holding text.
Name (uppercase) + bio are always fully visible at every breakpoint; there is
no expand/collapse state.

Portrait size:
- **Desktop / landscape tablet** (`≥1024px`, or `≥768px` landscape): portraits
  render enlarged by default, `scale(1.16) / translateY(-14%)`. Hover adds a
  1s pulse (grows and settles back), not a persistent size change.
- **Mobile / portrait tablet**: portraits stay small and contained. Each card
  pulses once, 1.2s, the first time it scrolls into view — hover isn't a real
  interaction on touch. One-shot IntersectionObserver
  (`initBraveCardScrollPulse()`), own class `.is-pulsing`.
  - `.is-pulsing` sets `transform-origin: 50% 100%` so the pulse grows upward
    from the character's feet. With the default `50% 50%` origin, `scale(1.08)`
    pushes the bottom edge down ~4% of its own height (~18px at 375px) against
    ~8px of padding, and nothing clips below the card — `.brave-card` and
    `.brave-card__portrait` are both deliberately `overflow: visible`. A bottom
    origin means the bottom edge does not move at all, which holds for any
    artwork proportions.
  - **The desktop breakpoint neutralises `.is-pulsing` entirely, and that rule
    is a full neutralisation point.** The IntersectionObserver is not
    breakpoint-aware — JS still adds the class at desktop widths; CSS decides
    what it does. Any property added to the mobile `.is-pulsing` rule needs a
    matching reset there, or it silently applies at desktop, where the resting
    transform is `translateY(-14%) scale(1.16)`.
  - The hover pulse is keyed to `:hover` only, **not** `.is-active` — Неда's
    card carries `is-active` statically from page load, so coupling the
    animation to it meant the computed value never changed and the pulse fired
    once on load and never again.

Each card has a 1.5°–2.5° tilt, alternating direction, at every breakpoint.

Card order: DOM order is the mobile/portrait reading order (Неда, Вихрен,
Веста, Заки, Мишо; Неда default-active). Desktop/landscape tablet reorders
**visually only** via CSS `order` to Заки, Вихрен, Неда, Веста, Мишо. *(Known
accessibility trade-off: desktop tab order still follows DOM order.)*

Layout: desktop/landscape tablet single row; portrait tablet 3 rows (Неда
alone, Вихрен+Веста, Заки+Мишо); mobile 1 per row.

### The Problem Section

H2: "Обяснявам хиляди пъти, но тя е толкова доверчива…" + 3 paragraphs.

- Background solid `#725598` (Заки purple), white text.
- Heading is wrapped in large `--color-neda` quotation marks („…“), styled as a
  visible pull-quote.
- `.problem__inner` is a fixed `920px`, **not a `ch` value** — `ch` resolves
  against this container's Nunito Sans, not the heading's much wider Dela
  Gothic One, so it doesn't track the heading's real rendered width. 920px
  measures ~76.8 characters of capacity at 1440px, meeting the 75-character
  minimum.
- Body paragraphs are left-aligned; the block still centres via `margin: 0
  auto`. The heading stays centred.

### What It Teaches Section

H2: "На какво учи играта?" + intro paragraph. Closes with a `.cta-button`
"Хайде да играем!" linking to `#how-it-works`.

- Background white `#F8FAFC`, dark text.
- **6 icon+colour point tiles**, not a bulleted list — 5 tied to a Bravie's
  brand colour, plus a 6th turquoise (`--color-buddy: #2FB6B0`) for the
  Help/Buddy "joker" cards. **No Bravie names appear here**; the colour/icon
  pairing alone is the callback to the Bravies Intro.
- Tile: white interior, 3px solid brand-colour border. Icon badge: 84px circle,
  solid brand-colour fill, straddling the top edge (2/3 above, 1/3 inside).
- Icons are single-colour PNGs with real alpha, tinted per tile via CSS
  `mask-image`. **`mask-image` is blocked under `file://` by a Chromium CORS
  quirk that doesn't affect `<img>` — always verify icon changes over a local
  HTTP server.** Glyph colours: Неда, Вихрен and Buddy white; Веста and Заки
  white; Мишо `--color-misho-trim` `#8B5E3C`.
- Grid: 3 columns desktop, 2 tablet, 1 mobile. Each tile scroll-reveals
  independently.
- Intro paragraph is a fixed `920px` and left-aligned, same reasoning as
  `.problem__inner`. Tile copy stays centred — compact card UI, not a reading
  column.

Tile copy, transcribed from the live markup (each tile is one or more `<p>`
lines; the intro sentence above the grid is "Играта учи детето:"):

1. **Неда** — Да се доверява на интуицията си, когато нещо не му се струва наред. / Да казва ясно и без вина "Не!" / Да пита родителите си преди да предприеме каквото и да е.
2. **Вихрен** — Да разпознава безопасни места и безопасни възрастни, към които да се обърне, когато близките му не са наблизо. / Че може просто да си тръгне от опасна ситуация, без да е длъжно да обяснява или да бъде учтиво.
3. **Веста** — Да споделя с близките си всяка ситуация, която го е накарала да се почувства неудобно - без значение колко малка изглежда.
4. **Заки** — Да познава конкретни принципи за безопасност - семейна парола, правилото "само възрастни помагат на възрастни" и защо никой доверен човек никога не иска от дете да пази тайна.
5. **Мишо** — Да е осъзнато за реакциите, които му пречат в реална ситуация - замръзване, прекалена любезност, разсеяност. Не за да се срамува, а за да ги преодолява с практика.
6. **Buddy** — Че да поиска помощ не е слабост, а разумен избор. / Че при беда е предимство да не e сам и че приятелите си помагат взаимно и се пазят.

*Вихрен's point is deliberately distinct from Веста's — Вихрен covers
recognising safe **unfamiliar** adults/places in the moment; Веста covers
sharing **afterward** with people the child already knows.*

### How It Works Section

H2: "Как работи играта?" with a one-line subtitle `.how-it-works__meta`:
"2 - 5 играчи, 10 минути, 5 - 9 години + семейство и приятели" — at
`--font-size-body`, weight 600, opacity 0.75. The heading's `margin-bottom`
lives on this element so the pair reads as one unit.

Step copy:
1. Изтегляте ситуация. (Не)познат иска помощ. Предлага изкушение. Кара те да пазиш тайна. Какво правиш?
2. Всеки избира карта от ръката си. Кажи НЕ. Бягай. Кажи на близък. Правилната реакция, в точния момент.
3. Играчите си помагат и обсъждат заедно. Всички отговарят правилно - всички споделят наградата.

- Background solid `#E5E1D6` (Мишо beige). Because it is light rather than
  dark: body text is `--color-text-dark`, and the H2, step titles and
  step-number badges are all `--color-misho-trim` (`#8B5E3C`) — brown from
  Мишо's own palette, so they read as part of the character rather than an
  unrelated accent.
- Each step's **first sentence is its title** — uppercase, accent colour, own
  line; remaining sentences follow as one paragraph.
- Zigzag: step 1 text-left, step 2 flipped via `row-reverse`, step 3 text-left.
  **Visual only — DOM order is always text-before-card.**
- Cards: `width: min(130px, 36vw)`, 3:5, individually tilted. Size is
  deliberately small: the 3:5 ratio turns every pixel of width into 1.67px of
  height, making this the biggest lever on the section's total height. All
  three use real supplied art.
  - The three card images are **content, not decoration**: real alt text, and
    **no `aria-hidden`** — card art is what image search surfaces. Character
    portraits elsewhere stay `alt=""`.
  - Card `<img>`s must NOT be sized `width/height: 100%`. Unlike the
    Bravies-portrait pattern, this element defines its own box (width +
    aspect-ratio from the base `.how-it-works__card` rule), so `100%` resolves
    against the flex parent and blows the image far past its intended size.
    Only `object-fit` is needed.
  - On mobile, `.how-it-works__card-wrap` needs `min-height: auto`, not the `0`
    used for the desktop row: in a column flex layout `flex: 1 1 0` with
    `min-height: 0` collapses toward zero height instead of sizing to the
    image's aspect ratio.
- Mobile: each card stacks above its text (visual-only reorder).
- Per-element scroll-triggered slide-in-up, one-time, skipped under
  `prefers-reduced-motion`.

### Testimonials Section

H2: "Какво казват семействата?" Two quotes: slide 1 — "Това е най-яката игра,
на която съм играл." — Анди на 5.5 години; slide 2 — "Още същия ден малкият
искаше да играем отново. Играхме пак на следващата сутрин и оттогава не спира
да говори за играта и наградите." — Христина И., майка на Анди.

- Placed after How It Works, before Desired State. Background white `#F8FAFC`.
- Real left-right slider (track + `translateX`), built for N ≥ 1 slides:
  adding a `.testimonials__slide` `<li>` with its own inline `--slide-accent`
  needs no JS or CSS change. No fixed height anywhere in the chain, so the
  track sizes to its tallest slide and switching slides causes no layout jump.
- **No card or border.** Quotation marks flank the quote left/right (stacking
  ate too much vertical height), open mark at the top of the block, close mark
  at the bottom. Each slide's `--slide-accent` colours both its marks and its
  dot; the cycle is Веста green → Вихрен orange → Неда yellow → Заки purple →
  Мишо beige.
- **Dots are the only nav control**, always visible even with one quote, so the
  mechanism reads as alive before quote #2 exists.
- Every interaction — dot click, `ArrowLeft`/`ArrowRight`, touch swipe —
  replays the quote's entrance animation, including when it loops back to the
  same slide. This is a forced-reflow restart in `initTestimonialsSlider()`;
  re-applying an unchanged class won't replay a CSS animation on its own.
- The dot wrapper `[data-slider-dots]` is a **sibling** of
  `.testimonials__slider`, not nested inside it — the JS scopes its
  `querySelector` to the shared `.testimonials__inner` ancestor for this reason.
- `.testimonials__inner` is `980px` so the heading fits one line; the slider
  shares this container.
- `prefers-reduced-motion` disables both the track transition and the entrance
  animation.

### Desired State Section

H2: "Представи си този момент…" Body is 3 short paragraphs walking through a
reassurance scenario, ending on "Това е моментът, в който осъзнаваш, че:".
Written in informal "ти" voice.

List copy (checkmark bullets):
1. Детето ти знае как да се пази самостоятелно.
2. Изградила си невидима броня от умения и инстинкти.
3. Твоята тревожност е заменена с дълбоко вътрешно спокойствие.
4. Най-накрая можеш да си отдъхнеш, знаейки, че си му дала ценен подарък.

*Items 2 and 4 use feminine singular forms ("Изградила", "дала"), i.e. this
section specifically addresses a mother, while the rest of the site stays
gender-neutral. The body's opening "На площадката сте." is formal/plural,
inconsistent with every other verb here — both carried over verbatim from the
supplied copy document; see Open Decisions.*

- Position: after Testimonials, before FAQ.
- Background `--color-vesta` green + white text. White reaches 4.02:1 against
  this green, dark text only 3.69:1. Green also matches the section's own
  checkmark ticks and the white-on-saturated pattern the Problem section uses.
  - Ticks are white circle + green check (`stroke="currentColor"`); a green
    circle would be invisible on this background.
- **Checkmark bullet list, not an icon-box grid** — a card/box grid was tried
  and rejected as too heavy. Each item: solid white circular tick + bold
  (700) Nunito Sans text, left-aligned.
- Body paragraphs are `920px`, left-aligned; heading stays centred.
  `.desired-state__inner` is `940px` — it must stay wider than the child's
  920px or it silently bottlenecks the character-capacity measurement.
- 2×2 grid at `≥1024px` or `≥768px` landscape (from a 4-row stack), roughly
  halving the list's height. **Still plain tick+text pairs — no boxes, borders
  or per-item backgrounds.** Single column below that: two columns of
  full-sentence bullets have no room on a phone.
- Each bullet animates in individually via a per-item `transition-delay`
  stagger (0 / 0.12 / 0.24 / 0.36s) on top of `.reveal`. Grid auto-flow fills
  in that same 1-2-3-4 order. Forced to 0s under `prefers-reduced-motion`.
- CTA: "Искам това спокойствие", reuses `.cta-button`, links to
  `#waitlist-signup`.

### FAQs Section

H2: "Въпроси и отговори". **Multiple items can be open at once** (not a
single-open accordion) and all start closed — nothing here is mutually
exclusive, and single-open would re-collapse an answer a parent is still
reading.

**7 Q&As:**
1. Кой може да играе?
2. А ако детето ми е на 4 или на 10 години?
3. Как учат децата чрез играта?
4. Могат ли децата да играят сами?
5. Ситуациите страшни ли са?
6. Няма ли да омръзне след няколко пъти?
7. Кога ще е готова играта?

- Background white (`--color-surface-white`), dark text.
- The FAQ copy is mirrored **verbatim** in the JSON-LD `FAQPage` block. If an
  answer changes here, that block must change with it — Google treats a
  visible-copy/markup mismatch as a structured-data violation.
- Markup: `<h3>` wrapping the trigger `<button>` (WAI-ARIA accordion pattern),
  answer `<div>` as its sibling inside the `<li>`. Trigger carries
  `aria-expanded` + `aria-controls`; answer carries `role="region"` +
  `aria-labelledby`.
- **Expand/collapse is CSS-only** — animatable `grid-template-rows` (`0fr` →
  `1fr`) on `.faq__answer`, with `overflow: hidden` on the inner wrapper so the
  row can clip to zero. JS (`initFaqAccordion()`) only toggles `.is-open` and
  mirrors `aria-expanded` — the same "JS decides state, CSS animates it" split
  as `.reveal` and `.is-pulsing`. No JS height measurement.
  - This `grid-template-rows` + child-`overflow: hidden` technique is a
    *different* mechanism from the flex `min-height: 0` issue documented
    elsewhere in this file; don't conflate them when debugging either.
- Chevron rotates 180° on open; disabled under `prefers-reduced-motion` along
  with the row-height transition.
- Accent reuses `--color-zaki`, already the sitewide `:focus-visible` colour.
- `.faq__answer-list` is currently unused; left in `style.css` in case a future
  answer needs a list.
- **`.faq` carries 148px of `padding-bottom`**, well beyond its shared
  `var(--space-5)`. This is the room the Wait-list Signup section's top-left
  clouds bleed up into. Do not reduce it: a fine-interval sweep found the cloud
  edge grazing the last question's line box by 1px between 960 and 1280px.

### Wait-list Signup Section

H2: "Записването е отворено". Reuses the hero form's exact markup pattern
(`waitlist-form` + `data-waitlist-form`); `script.js` binds every matching
element automatically, so this needs zero JS changes. **Form and
success-message markup must be siblings under a shared wrapper**
(`.waitlist-signup__inner`), because `initWaitlistForm()` finds the success
element via `form.parentElement.querySelector('.success-message')`.

- Background `--color-neda`. Order is heading → badge → form.
- **Heading**: white, forced to one line via `white-space: nowrap` +
  `clamp(1.35rem, 6vw, 2.5rem)`, tuned to fit down to 375px. Verify below 340px
  if you test a smaller device.
- **Badge**: two pills (`.waitlist-signup__badge-line`), each holding its
  connector text and its highlighted phrase (bold `<strong>`) inside one
  rounded box. White background, `--color-zaki` text. Second phrase reads "за
  първите 100", echoing the button. Centred.
  - `.waitlist-signup__badge-wrap` is a flex container in **both** directions —
    `column` on mobile, `row` at the row-layout breakpoint. `flex-wrap: nowrap`
    is what guarantees one line there: the pills' combined ~500–580px exceeds
    `.waitlist-signup__inner`'s 480px, and neither element sets `overflow`, so
    the row is allowed to render wider than the column around it. That is
    intended. `flex-shrink: 0` keeps the pills from being squeezed instead.
- **Button**: `--color-zaki` background, white text. Deliberately left solid
  purple while the badge pills are white, so it still reads as the call to
  action; settled, not pending.
- **Input**: solid white background, `--color-zaki` text, plus `min-width:
  190px` at the row-layout breakpoint. CSS cannot size an element as a
  percentage of a *sibling*, so this is a px value calibrated against the
  button's measured ~273px (≈70%). Re-measure if the button's label changes.
  Not applied below that breakpoint, where the input already stacks at 100%.
  - Two interactive-state rules that must not be removed:
    1. This section's `:focus` rule pins `background: var(--color-surface-white)`.
       Without it the sitewide `:focus` rule (translucent, tuned for the hero's
       dark blue) makes the input visibly shift from solid to translucent.
    2. A combined `.is-invalid:focus` selector. `script.js` calls
       `input.focus()` immediately after adding `.is-invalid` on a failed
       submit, so both are active at once; they tie at equal specificity and
       `:focus` sits later in the file, so the error border silently lost to
       the focus border exactly when it was needed.
- `.success-message--on-light` (dark text, `--color-vesta` icon) — the default
  success state assumes a dark section and is unreadable on yellow.
- `.success-message[hidden] { display: none; }` is required: the element's own
  `display: flex` outranks the browser's built-in `[hidden]` rule, so without
  it the hidden success message reserves its full height. Affects the hero form
  too.
- `.waitlist-form`'s own `margin-top` is zeroed here — it is meant for the
  hero's non-gap layout and otherwise stacks on top of this section's flex
  `gap`.
- Padding: `var(--space-4) var(--space-2) var(--space-3)` (40px top, 24px
  bottom). **The bottom is small because the footer row now supplies that
  height — this space is occupied, not spare.** The bottom-right cloud pair is
  anchored to this section's bottom edge, so a large height change moves it.

**Clouds**

- Two overlapping pairs reusing the hero's four PNGs: `--wl-1`/`--wl-2`
  top-left, `--wl-3`/`--wl-4` bottom-right, each pair with a different
  `--cloud-distance` so the layers drift at different rates.
- Parallax runs through `initWaitlistClouds()`, **separate from**
  `initHeroClouds()`: the hero is always page-top (`window.scrollY /
  heroHeight`), while this section's progress comes from
  `getBoundingClientRect()`. The denominator is `window.innerHeight` alone, not
  `innerHeight + sectionHeight` — this is always the last section on the page,
  so an entrance-plus-exit model can never complete and progress would cap at
  roughly `1 − sectionHeight/viewportHeight`.
- **`.waitlist-signup__clouds--top` and `--bottom` are two separate containers
  with the same `inset: 0` but opposite `overflow`.** The top pair is unclipped
  so it bleeds up over the FAQ. The bottom pair must stay clipped: unclipped,
  it stretched the page's real scrollable height into blank space past the last
  section. Trailing scroll is verified at 0px.
- `html` needs `overflow-x: hidden` as well as `body` — `html` is the real
  scrolling root once `body` has its own overflow, and it became load-bearing
  once the unclipped section stopped catching the wide cloud content.
- Vertical placement comes from `--cloud-y-offset`, not `top`/`bottom` (those
  are anchor points only). **The top-left pair uses `calc(-100% + Npx)`**, a
  fixed-pixel sliver, because it must clear the heading *inside* this section
  and that clearance is a fixed pixel budget (the section's own `padding-top`),
  not a proportion. **The bottom-right pair uses a plain percentage** (40%
  offset, ~60% visible) because the requirement there is "at least 50% visible", a
  proportion that must hold at any resolved size.
- **Mobile top-left sliver is 26px/30px** — a two-sided constraint, hence the
  exact values. Pulling the clouds up to clear the heading pushes them further
  into the FAQ; at 736–767px a 20px sliver left only 7.5px above the last FAQ
  question's text. The heading's top edge sits a constant 40px below the
  section's top (that's `padding-top`, so it doesn't move with width), leaving
  14px/10px below it, with FAQ-side clearance back to 13.5–36px.
  - Measured against the question's **text ink** via a `Range` over the text
    node. The `.faq__item` box carries 17px of padding below its text, so a
    box-level check reports a collision when nothing visible is touching.
- Bottom-right pair is larger and more visible on mobile (~78–82%, up from the
  base 60–65%) — the base proportion read as thin against the empty yellow
  below the button on a tall phone.
- `@media (max-height: 500px)` pulls the bottom-right pair back to ~25–28% so
  it can't crowd the form in phone landscape or a shallow window. It sits later
  in the file at the same specificity as the mobile rule, so it wins when both
  apply.
- `--wl-1`'s max width is `360px`, not 460px: at 460 its resolved height
  (~204px) overran the FAQ's bottom padding and crossed the FAQ text column at
  tablet widths.
- Sharpness depends on the source PNGs' native resolution — these are
  `background-size: contain` boxes, so a low-res source visibly softens when
  upscaled. Rule of thumb: ~920px native for a sharp ~460px render at 2×.

**Footer link row**

Three links at the section's bottom: Facebook
(`https://www.facebook.com/smelcho`), Instagram
(`https://www.instagram.com/smelcho.bg/`), and "Политика за поверителност".
Markup is `<nav class="waitlist-signup__footer" aria-label="Социални мрежи и
правила">` holding a `<ul>`, added as a **sibling of
`.waitlist-signup__inner`**, not a child.

- **It lives inside this section, not as a page-level `<footer>` after
  `</main>`.** The bottom-right cloud pair is anchored to this section's bottom
  edge inside an `overflow: hidden` container, and the page's `scrollHeight`
  matches that edge to 0px. A separate footer beneath the section would push
  those clouds off the page's bottom edge and undo that.
- **`<nav>`, not `<footer>`**: a `<footer>` nested in a `<section>` scopes to
  that section in the document outline, which misstates a site-wide privacy
  link. Class naming follows this section's BEM prefix rather than opening a
  global `.site-footer` namespace.
- **Centred at every width**, with no alignment media query.
  `margin-inline-start` is `0`: the −0.5rem the left-aligned version used
  existed only to cancel the links' tap-target padding, and once centred it
  just shifts the row 8px off-centre. Left and right gaps match within 0.1px
  from 320px to 2560px.
- **Mobile (≤767px) splits into two rows**: the two social icons share the
  first, the policy link takes its own, via `flex-basis: 100%` on the last item
  — not `flex-direction: column`, which would stack all three. The list already
  has `flex-wrap: wrap`; the row gap separates the lines. `flex-wrap` is
  otherwise a safety valve, not the layout — all three fit on one line down to
  375px.
- **Cloud clearance is uniform (136px) at every width**, set on
  `.waitlist-signup`'s `padding-bottom`, not as a breakpoint override. Worst
  case is 113.6px on mobile (620–699px, where the bottom pair's vw-driven width
  hits its 320px clamp and their height plateaus) and ~112px on desktop (the
  560px clamp at a 40% y-offset leaves ~60% of a 186px-tall cloud above the
  bottom edge). `calc(var(--space-6) + var(--space-4))` = 136px clears both with ~22px to
  spare, composed from existing tokens rather than a new literal. **Do not
  convert this back to a breakpoint override** — the row's horizontal position
  moved three times and each move landed it in the clouds at a new band.
  `margin-top` still drops one step below 1024px.
  - Cost: the section is ~105px taller on a phone and ~112px on desktop than
    before the footer row existed. That strip is the band the clouds occupy,
    not empty space. If it ever needs to come down, the lever is the clouds'
    mobile size, not the clearance.
  - `z-index` does not solve the collision this fixes: the text link is white
    and so are the clouds, so white-on-white is worse than the 1.37:1 it
    already has against the yellow.
- **Icons are plain `<img>`, deliberately NOT the `mask-image` tinting used by
  `.teaches__point-icon`.** That pattern recolours *single-colour* glyphs.
  These are multi-colour brand marks — `facebook.png` measures 264 distinct RGB
  values, `instagram.png` 2,631 (a full gradient) — and masking would flatten
  either to one silhouette, destroying Instagram's gradient. Both marks also
  carry brand-usage rules assuming their real colours. Assets are 512×512 with
  real alpha at `assets/social/`.
- **Optical size correction**: `facebook.png` fills its 512×512 canvas edge to
  edge; `instagram.png` is inset 31px per side (450 of 512), so in the same
  28px box it would render ~12% smaller. Corrected with `transform:
  scale(calc(512 / 450))` on an `--inset` modifier — `transform` rather than a
  larger `width`/`height` so the **layout** box stays identical and the flex
  gaps and 44px tap targets stay even.
- Icon hit area is 28px icon + 8px padding per side = 44px.
- **Focus states reuse the sitewide `a:focus-visible`** (3px `--color-zaki`,
  3px offset). No per-component focus style was added.
- All three links use `target="_blank" rel="noopener"`. `noreferrer` was
  deliberately **not** added — it would strip the referrer, so Facebook and
  Instagram wouldn't see traffic as originating from smelcho.bg.
- Privacy policy URL is a deliberate placeholder:
  `href="PLACEHOLDER-privacy-policy"` plus `data-placeholder-href="true"`,
  chosen to 404 loudly rather than something real-looking that could ship
  unnoticed.
- Text link colour is white — 1.37:1 against `--color-neda`. An accepted risk,
  decided; see Open Decisions.

### Design System

- **Typography — Dela Gothic One (display/headings) + Nunito Sans (body/UI).**
  - **Fonts are self-hosted** from `/assets/fonts` via `@font-face`, not from
    Google's CDN: this is an EU-facing site collecting emails, and loading
    `fonts.gstatic.com` sends every visitor's IP to Google before consent — the
    pattern a 2022 Munich ruling found to violate GDPR. Do not add `preconnect`
    tags for Google Fonts back.
  - **Dela Gothic One has exactly one real weight (400, static).** Every
    display-font rule is pinned to `font-weight: 400` — requesting 700/800/900
    against a single-weight face makes the browser synthetic-bold it, which
    looks blobby. A lighter or heavier display option needs a different
    typeface, not a different weight.
  - **Check actual glyph coverage before adopting any typeface here.** Baloo 2
    was dropped because it ships zero Cyrillic glyphs, so every Bulgarian
    heading was silently falling back to a system font. Being "on Google Fonts"
    doesn't mean it covers the language.
  - The Testimonials quote sentence is Nunito Sans 600, not Dela Gothic One — a
    full sentence in a single-weight poster face at h2 size reads as shouty.
    The flanking quotation-mark glyphs stay in Dela Gothic One.
  - Body text default weight is 300; buttons, labels and citations set their
    own.
  - *Caveat: type.today flags Dela Gothic One's Cyrillic extension as
    technically complete but lower design quality than its Latin set. Nothing
    looked wrong in rendered tests — a "know before you scale up" note.*
- Brand colours: Заки `#725598`, Вихрен `#F68044`, Неда `#FDD43B`, Веста
  `#278C5D`, Мишо `#E5E1D6`, Buddy/joker `#2FB6B0`. Deep-toned icon-only
  variants: burnt orange `#A8501A`, deep red `#7A2020`, deep teal `#0E4749`.
  Мишо's full palette: `--color-misho-accent` `#4FA6E0`, `--color-misho-trim`
  `#8B5E3C`, `--color-misho-hair` `#D4B483` (unused).
  - **`--color-yellow-light` (`#FEEBA4`)** — for inline TEXT highlights,
    deliberately distinct from `--color-neda`, which is a button fill; one
    value in both roles makes the highlight read as another button. 4.58:1
    against `--color-hero-bg`.
- Section backgrounds in order: Hero `#436BA0` → Bravies white → Problem
  `#725598` → What It Teaches white → How It Works `#E5E1D6` → Testimonials
  white → Desired State `#278C5D` → FAQ white → Wait-list Signup `#FDD43B`.
- Responsiveness: mobile (375px), tablet (768px portrait + landscape), desktop
  (1440px). Portrait vs landscape tablet is distinguished via `orientation`
  media queries only where the layout actually differs (Bravies).

## 4. Functional Requirements (JS)

- Validate email format before submission; show an inline error if invalid.
- On valid format, submit to MailerLite. On success, hide the form and fade in
  the success message. On server rejection or network/timeout failure, the form
  stays visible and shows a generic Bulgarian retry message — **the typed email
  is not lost**.
- Both forms share the `[data-waitlist-form]` pattern and the same
  `mailerliteSubscribe()` helper.
- **Submission is hand-rolled JSONP**, not MailerLite's `webforms.min.js`: that
  script only binds to `.ml-subscribe-form form` (and siblings) and depends on
  its own `.ml-block-success`/`.ml-block-form` wrapper markup, none of which
  this project uses, so it would never bind. The request shape mirrors what
  that script sends internally.
- Request URL:
  `https://assets.mailerlite.com/jsonp/2598792/forms/196895404753684115/subscribe`
  with `callback`, `fields[email]`, `ml-submit=1`, `anticsrf=true`, plus an 8s
  timeout fallback. Three parameters are load-bearing and were each found the
  hard way:
  - **`ajax=1`** — without it the endpoint falls back to a legacy plain-form
    path expecting a page redirect, and returns 200 with an **empty body**, so
    the JSONP promise never resolves. The subscriber is still created
    server-side, so this fails silently in the worst way.
  - **`guid`** — a per-browser random ID cached in `localStorage['ml_guid']`,
    matching MailerLite's own client so repeat visits reuse it.
  - **`_={timestamp}{random}` cache-buster** — `assets.mailerlite.com` is a CDN
    domain, and with a fixed callback name a repeat submission of the same
    email produces an identical URL that the browser may serve from cache,
    never reaching MailerLite at all.
- **The JSONP callback name must be the fixed literal `mlWebformSubmitted`** —
  that string is hardcoded in MailerLite's own `$.ajax({ jsonpCallback: ... })`
  and is what the backend was built against. A per-request generated name is
  textbook JSONP but produces an empty response here. Because that name is
  shared, `mailerliteSubscribe()` serialises calls through a promise queue
  (`mlSubscribeQueue`), so a near-simultaneous hero+bottom submission can't
  race to overwrite the one global callback.
- **The unconditional `.../takel` tracking beacon** in MailerLite's own embed
  is deliberately not replicated — see Open Decisions.
- **Double opt-in** is enabled on MailerLite's side; nothing in this
  HTML/JS touches it.

## 5. Constraints

- All CSS in `style.css`; all JS in `script.js`.
- No third-party network requests on page load.

## SEO / AEO

- **`<link rel="canonical">` → `https://smelcho.bg/`.** The site is reachable
  at the apex domain, `www`, with and without a trailing slash, *and* at its
  GitHub Pages `*.github.io` address — that last one can be indexed
  independently and split ranking signals.
- **Open Graph + Twitter Card tags.** Distribution is Bulgarian parent Facebook
  groups, an Instagram bio link and Viber forwards, so these decide how every
  share renders. `og:locale` is `bg_BG` — Facebook silently ignores a bare
  `bg`. `og:image` / `twitter:image` point at the real 1200×630
  `assets/og/og-image-1200x630.png`.
- **`theme-color` → `#FDD43B`**, a literal because `<meta>` can't read a CSS
  custom property. If `--color-neda` changes, change this with it.
- **Font preloads for exactly two faces**: Dela Gothic One 400 and Nunito Sans
  600, chosen by measuring computed styles. The other four Nunito weights are
  deliberately not preloaded — preloading faces not needed immediately competes
  with the ones that are and makes LCP worse. `crossorigin` is required even
  same-origin, or the file is fetched twice.
- **`robots.txt`** allows everything and points at the sitemap. **AI and
  answer-engine crawlers are deliberately not blocked**, recorded in the file
  itself as a choice: the point of the AEO work is to be the cited source when
  a Bulgarian parent asks an assistant about teaching children to handle
  strangers.
- **`sitemap.xml`** — one URL. Add the privacy policy page when it ships.
- **Favicons** at `assets/icons/`: `favicon-32.png`, `favicon-192.png`,
  `favicon-512.png`, `apple-touch-icon-180.png`. Built from the supplied source
  tile — the „С“ isolated by flood-filling the outer white away, rebuilt on
  `--color-neda` `#FDD43B` (**not** the source's `#FFD21F`), scaled 135%,
  optically centred. **All exports are opaque**: iOS composites alpha onto
  black. The glyph occupies 86.8% of canvas height, i.e. 6.6% margin per side —
  fine in a tab, slightly tight under iOS's squircle mask; 120–125% is the
  lever if that wants more air. No SVG entry: the source is brush artwork.
  192/512 are wired as plain `rel="icon"`; a web app manifest is their more
  standard home if one ever lands.

### Structured data (JSON-LD)

Three separate blocks rather than one `@graph`, so each can be edited or
deleted independently.

- **`FAQPage`** — extracted **verbatim** from the seven visible Q&A pairs. See
  the FAQ section above for the drift hazard this creates.
- **`WebSite`** and **`Organization`** — `Organization` carries `sameAs` for
  the Facebook and Instagram profiles.

## Open Decisions

- **Must not ship as-is**: the privacy-policy link points at
  `PLACEHOLDER-privacy-policy` and will 404. Also carries
  `data-placeholder-href="true"` for grepping.
- **Accepted risk, recorded rather than fixed**: both
  `.waitlist-signup__heading` and the footer's policy link are white on
  `--color-neda` at **1.37:1** — below every WCAG threshold, including the 3:1
  one for non-text. Implemented as asked. One-line swaps if it's ever
  revisited: `--color-zaki` gives 4.23:1, `--color-text-dark` 10.81:1. Note
  that the Phase 5.5 footer-centring work did **not** make this section
  accessible; it only moved the row off the clouds.
- **Small addition beyond the literal request**: that same link is underlined
  (`text-decoration: underline; text-underline-offset: 3px`). At 1.37:1 there
  is no colour cue left that it's clickable, but this is the site's only
  bare-text link, so it introduces a second link treatment. One line to remove.
- **Blocks measurement**: no analytics are installed. PostHog is the recorded
  choice but isn't implemented, so neither this work nor the waitlist
  conversion rate the page exists to measure can be observed. Needs an
  account/key and a cookie consent banner alongside it.
- **Decided, not implemented — waiting on a price**: `Product` + `Offer`
  schema. An `Offer` without a price won't validate. Add `availability:
  PreOrder` alongside it.
- **Decided, not implemented — after playtests**: `Person` / author-credential
  schema plus a visible "who made this" block. The strongest available E-E-A-T
  lever for a child-safety product. **The schema alone is not valid without the
  visible on-page content** — they ship together or not at all.
- **Image weight** is 2.4 MB across 8 images against a <500 KB target. Into the
  illustrator brief: WebP, uniform dimensions per set.
- **Card colours are not tokenised** — three blues in play (`#436BA0`,
  `#095ACB`, `#4FA6E0`). Pick one as the brand blue. *Note: `#095ACB` does not
  appear in `style.css`; presumably it's in the card art.*
- **Make "(не)познати" explicit in the FAQ.** That the game covers *known*
  adults is the actual differentiator, and it currently lives only inside a
  parenthetical.
- **Desired State's position in the page order — deferred.** The underlying
  concern is that most visitors won't scroll far enough to reach it. A reorder
  was tried and reverted; teaser options were drafted and none was an
  improvement. Do not move it again on argument — measure scroll depth in
  PostHog first.
- **Check the cloud source PNGs' native resolution.** Above ~1100px wide is
  fine at the current render size; below ~500px, re-export.
- **Wait-list Signup section height is accepted as-is.** If it ever needs to
  come down, the lever is the bottom-right cloud pair's height, not the footer
  clearance — that size is the result of two rounds of direct requests.
- **Worth knowing, not acted on**: at 2560px the desktop hover pulse brings the
  portrait's top to within 2.2px of the section heading's bottom. Positive, and
  the original pre-5.4 behaviour rather than anything new, but it tightens as
  width grows (28.7px at 1024px → 6.1px at 1920px → 2.2px at 2560px) and was
  measured against placeholder art. Re-measure once the real art lands; the
  lever is the hover keyframe's `scale(1.22)` peak or the heading's bottom
  margin.
- **Desktop Bravies card tab-order vs visual-order mismatch** — no decision yet
  on whether to address it.
- **Testimonials' accent cycle** reaches Мишо's pale beige as its 5th option.
  Confirm that's acceptable at low contrast against the white background, or
  swap it once there are enough quotes to reach it.
- **Buddy tile copy** (What It Teaches) — first draft, not yet reviewed.
- **Мишо's What It Teaches icon** is a noticeably more detailed illustration
  than the other five flat single-shape glyphs, and reads fainter against her
  beige. Flagged as a real inconsistency in case a simpler replacement is
  wanted.
- **Two copy items carried over verbatim from the supplied document, not
  silently corrected** — Desired State's "На площадката сте." (formal/plural,
  inconsistent with every other verb in that section; reads like it should be
  "си"), and the feminine-singular forms in list items 2 and 4, which shift
  that section's audience to a mother while the rest of the site stays
  gender-neutral. Confirm both before shipping.
- **Desired State (green) now sits later in the page than Problem (purple)** —
  not adjacent, so minor, but worth a glance in the full page flow.
- **Font-verification caveat, partially closed**: verification now runs against
  the real Dela Gothic One and Nunito Sans woff2 files from the Fontsource npm
  packages, and the Phase 4.6 heading line-break checks have been re-verified
  under them. The Phase 5.2 copy changes — specifically the How It Works meta
  line and the FAQ Q4/Q7 answers, all of which got measurably longer — have
  still not had a line-wrap check under the real fonts.
- **The `.../takel` tracking beacon is permanently omitted, not deferred.**
  PostHog covers form impressions; the beacon would add an always-on
  third-party call on load for a metric the project will already have.
