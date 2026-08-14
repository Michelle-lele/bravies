# Specification: "Смелчовци в беда" Landing Page

*Status: Phase 1 (Hero + Bravies Intro) and Phase 2 (Problem + What It
Teaches + How It Works) complete. Phase 3 (Testimonials + Desired
State) next, then Phase 4 (FAQ + Wait-list Signup), then Phase 5
(integration pass). This document reflects current, as-built behavior
— not a change history. Tech stack decision: vanilla JS (no framework
needed).*

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
- Error message (shared by both waitlist forms on the page): solid white pill background with dark red (`#7F1D1D`) text — guarantees contrast regardless of the section background behind it. Only rendered when non-empty.

### Bravies Intro Section

Intro text: "Твоето дете играе и учи със Смелчовците как да:" — sized down and set to `white-space: nowrap` from 768px up so it reads as one line; wraps normally on mobile.

5 cards, `border-radius: 15px`, **3:5 aspect ratio** (physical cards are 6×10cm), uniform thick colorful border on all sides. Character portrait is real artwork (not a placeholder), filling the entire card; the caption is a bottom overlay panel with a **solid** brand-color background (not a literal CSS border — a border can only ever be a thin stripe, not a panel that holds text) containing the name (uppercase) and bio. **All text is always fully visible, at every breakpoint** — there is no hover/tap-to-expand text state.

Portrait size:
- **Desktop / landscape tablet only** (`min-width: 1024px`, or `min-width: 768px` + landscape): portraits render enlarged by default for every card (not just on hover), `scale(1.16) / translateY(-14%)`. Hovering or activating a card adds a brief "pulse" (grows slightly further and settles back via `@keyframes`, not a persistent size change).
- **Mobile / portrait tablet**: portraits stay at the small, contained size; no enlarge, no pulse.

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

- Background: solid `#E5E1D6` (Мишо's beige — was Веста's green; changed per feedback). Being light rather than dark, this drove several follow-on color changes: body text is dark (`--color-text-dark`, was white), the step-number badge is a solid purple (`--color-zaki`) circle with a white number (was a translucent-white ring, which nearly disappeared on a light background), and each step's title accent is purple (`--color-zaki`, was yellow — yellow had too little contrast against light beige; purple also now visually matches the number badge).
- Each step's **first sentence is its title** — uppercase, accent color, own line; the rest of that step's sentences follow as one normal paragraph below it.
- Zigzag: step 1 text-left/card-right, step 2 text-right/card-left, step 3 text-left/card-right (via `row-reverse` on step 2 only — DOM/reading order is always text-before-card regardless of visual side).
- Cards: small (`width: min(130px, 36vw)`), 3:5 ratio, individually tilted (same technique as the Bravies cards). **Card size was deliberately shrunk** to keep the whole section's height to ≤1.5 screens on desktop (was running 2+). Steps 1 and 2 now use real supplied card art (situation card → step 1, "Не!" reaction card → step 2); step 3 still has no art, stays a dashed-border white placeholder box.
  - Real card `<img>`s must NOT be sized with `width/height:100%` here — unlike the Bravies-portrait pattern, this element defines its own box directly (width + aspect-ratio from the base `.how-it-works__card` rule), so `100%` resolves against the flex parent instead and blows the image up far past its intended size. Only `object-fit` is needed on the image itself.
  - On mobile, `.how-it-works__card-wrap` needs `min-height: auto` (not the `0` used for the desktop row layout) — in the mobile column layout, `flex:1 1 0` with `min-height:0` collapses the item toward zero height instead of sizing to the image's aspect ratio, since there's no automatic content minimum left to fall back on.
- Mobile: each step's card stacks above its related text (visual-only reorder).
- Scroll-triggered slide-in-up animation, per-element (each step's text block and card reveal independently, not the whole section at once), one-time (doesn't repeat), skipped under `prefers-reduced-motion`.

### Testimonials Section *(not yet built)*

H2: "Какво казват децата и родителите?" Quoted text: "Това е най-яката игра, на която съм играл." — Анди на 5.5 години. Left-right sliding slider, only this one quote for now.

### Desired State Section *(not yet built)*

H2: "Представете си този момент…" + body text (unchanged from original spec). 2×2 text-box grid on desktop/tablet, 1 per row on mobile, each with a distinct icon (placeholder — source not yet decided). CTA button "Искам това спокойствие" scrolling to the bottom signup section.

### FAQs Section *(not yet built)*

Standard vertically-unfolding FAQ layout, questions always visible, arrow to unfold each answer. Two dummy Q&As.

### Wait-list Signup Section *(not yet built)*

H2: "Записването е отворено". Same form as the hero section — `script.js` already supports this via a reusable `initWaitlistForm()` called once per `[data-waitlist-form]` element, so this section just needs the matching markup + attribute, no JS changes.

### Design System

- Fonts: Baloo 2 (display/headings) + Nunito Sans (body/UI) — not specified in the original brief, chosen to fit "bright, colorful, kids-friendly."
- Brand colors: Заки `#725598`, Вихрен `#F68044`, Неда `#FDD43B`, Веста `#278C5D`, Мишо `#E5E1D6`, Buddy/joker `#2FB6B0` (turquoise, new — not one of the original 5 Bravies). Deep-toned icon-only variants: burnt orange `#A8501A`, deep red `#7A2020`, deep teal `#0E4749` (used for colorful icon glyphs where plain white/dark wouldn't do).
- Section backgrounds, in the spec's alternation order: Hero `#5080BF` → Bravies white → Problem `#725598` (Заки purple) → What It Teaches white → How It Works `#E5E1D6` (Мишо beige) → **Testimonials / Desired State / FAQ / Wait-list Signup: still undecided**, continue the alternation with bold brand colors.
- Responsiveness: mobile (375px), tablet (768px portrait + landscape), desktop (1440px). Portrait vs. landscape tablet is distinguished via `orientation` media queries where the layout actually differs (Bravies section).

## 4. Functional Requirements (JS)

- Validate email format before submission; show an inline error message if invalid (see error message styling above).
- On valid submission: hide the form, fade in "Благодарим Ви! Вече сте записани. Ще се свържем с Вас за първия тираж!"
- Validation applies identically to both waitlist forms (hero + bottom signup) via the shared `[data-waitlist-form]` pattern.
- Storage: log the collected email to the console (mock API POST).

## 5. Constraints

- All CSS in `style.css`; all JS in `script.js`.

## Open Decisions

- Section background colors for Testimonials, Desired State, FAQ, and Wait-list Signup.
- Icon source for the Desired State section's 2×2 grid.
- Мишо's "What It Teaches" icon — placeholder until a same-style replacement is picked.
- Buddy tile copy (What It Teaches) — first draft, not yet reviewed.
- Desktop Bravies card tab-order vs. visual-order mismatch — no decision yet on whether to address it.
