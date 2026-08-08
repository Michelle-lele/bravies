# Specification: "Смелчовци в беда" Landing Page

## ***1\. Goal***

A high-converting, single-page landing page in Bulgarian to collect user emails for a waitlist for kids' board game.

## ***2\. Tech Stack***

- HTML5 (semantic layout)  
- CSS3 (Responsive, Flexbox/Grid, pure CSS)  
- Vanilla JavaScript or other suitable JS framework (Form handling and UI interactions, animation effects such as parallax)

## ***3\. UI/UX Requirements***

- **Hero Section**: 

H1 headline (Смелчовци в беда"),  subheadline ("Игра за умни действия в ситуации с (не)познати."), and a prominent Email Input \+ "Запиши се за първите 100" button. 

- **Bravies Intro Section** \- 

Intro text: "Твоето дете играе и учи със Смелчовците как да:"

5 horizontal elements representing playing cards with round corners (15px). The elements should be in a 3:5 aspect ratio (real cards will be 6x10cm). Each card should have a thick, colourful border and a rectangular placeholder for the character image inside the card. The bottom border should be thicker to show text including the character name and a brief intro. 

Responsive layouts: On desktop and tablet (landscape), only the character name is shown by default, plus half a row of the following brief intro text. 

On hover/tap on each card, the text section increases in height to fill more of the card height and show the full text (e.g., expands up). The character placeholder is enlarged and is extended outside the card. By default, the middle card (Неда) is in that state until another card is activated.

At least the top half of the cards in this section are visible above the fold (first screen) on desktop resolution.

* On desktop and landscape tablet \- All cards should be on a single row,   
* on portrait tablet \- 3 rows (1 \- Неда, 2 \- Вихрен и Веста, 2 \- Заки и Мишо cards per row) and,   
* on mobile \- 1 card per row.

Text for cards in the following order for desktop:

1. Заки \- знае всички хитрини на хората с лоши намерения.  
2. Вихрен \- бяга от опасностите като вихър.  
3. Неда \- слуша вътрешния си глас си и казва “Не\!”.  
4. Веста \- споделя всичко на близките си.  
5. Мишо \- се сеща винаги точно навреме какво трябва да направи.

The order for tablet (portrait) and mobile is as follows: Неда, Вихрен, Веста, Заки, Мишо.

- **The problem section**:

H2: "Обяснявам хиляди пъти, но тя е толкова доверчива…”

Text: “Детето знае, че не трябва да взема бонбони от непознати и че не трябва да се качва в чужда кола. 

Но в реална ситуация \- когато е само и объркано, когато (не)познатият е усмихнат и любезен или изглежда безпомощен \- ще разпознае ли опасността? И по-важното \- ще съумее ли да действа правилно? А може би ще замръзне от любезност или страх?

Теорията помага, но умението за действие се изгражда само с повторение \- и то много преди да е нужно.”

- **What the game teaches? Section**

H2: “На какво учи играта?”  
Text: ‘“Смелчовци в беда” е изградена върху съвременните препоръки за детска безопасност \- включително разграничението между "непознат" и "човек с лоши намерения", което е много по-полезно за децата от простото "не говори с непознати."  
Чрез играта децата се учат да:

* вярват на интуицията си когато нещо не им се струва наред  
* казват НЕ ясно и без вина  
* питат родителите си преди да направят каквото и да е  
* разпознават кога могат просто да си тръгнат \- без да са задължени да обясняват или да са учтиви  
* споделят с близките си всяка ситуация която ги е накарала да се почувстват неудобно


Играта въвежда и конкретни принципи за безопасност \- семейна парола, правилото "само възрастни помагат на възрастни", и защо никой доверен човек никога не иска от дете да пази тайна.

Децата се запознават и с реакциите, които им пречат в реална ситуация \- замръзване, прекалена учтивост, разсеяност. Не за да се срамуват, а за да ги разпознават и преодоляват с практика.  
Всичко това не се преподава \- изиграва се. Всеки играч взима решение, после цялото семейство обсъжда заедно.’

- **How it works section**:

H2: “Как работи играта?”

Texts: “1. Изтегляте ситуация. (Не)познат иска помощ. Предлага изкушение. Кара те да пазиш тайна. Какво правиш?

2\. Всеки избира карта от ръката си \- Всеки избира карта от ръката си. Кажи НЕ. Бягай. Кажи на близък. Правилната реакция, в точния момент. 

3\. Играчите си помагат и обсъждат заедно. Всички отговарят правилно \- всички споделят наградата.”

Each step should be located on the screen as follows: left \- right \- left side. In the remaining space (right-left-right), put a placeholder for a card image (3:5 ratio, slightly tilted as if a played card on the table)

On scroll within that section, the cards and the separate steps should have a slide-in-up animation. 

Responsive Layout: On mobile each card should be stacked above the text box relevant to it.

- **Testimonials section**:

H2: “Какво казват децата и родителите?”

Quoted text: “Това е най-яката игра, на която съм играл.”  
\- Анди на 5.5 години

Make it a slider (left \- right sliding) for now only with this quote. 

- **Desired state section**:

H2: “Представете си този момент…”  
Text: “На площадката сте. Заговаряте се с друга майка и за секунда изпускате детето си от поглед. Когато се обръщате, виждате непознат да говори с него. Но вместо вълна на паника, вие усещате... спокойствие.  
Наблюдавате как детето ви прави крачка назад, казва нещо кратко, но уверено, обръща се и с бързи крачки идва при вас, за да ви разкаже какво се е случило. Без страх, без объркване, без колебание.  
Това е усещането за истинска увереност. Това е моментът, в който осъзнавате, че:”  
The following text in text boxes 2x2 on desktop and tablet and 1 per row on mobile. Each item also has a distinct icon related to the content (leave as a placeholder only for now).

1. Вашето дете знае как да се пази самостоятелно.  
2. Изградили сте невидима броня от умения и инстинкти.  
3. Постоянната тревожност е заменена с дълбоко вътрешно спокойствие.  
4. Най-накрая можете да си отдъхнете, знаейки, че сте му дали най-ценния подарък.

CTA button with text: “Искам това спокойствие” that leads to the sign-up section at the bottom. 

- **FAQs section**

Standard FAQ layout with vertically unfolding answers and questions always visible, as well as an arrow to unfold each answer. Add two dummy texts.

- **Wait-list signup section**

H2: “Записването е отворено”  
Same form for email and submit button as in the hero section.

-  **Design System**: Bright and colorful, kids-friendly.

Bravies intro cards, brand colors: 

* Заки: \#725598  
* Вихрен: \#F68044  
* Неда: \#FDD43B  
* Веста: \#278C5D  
* Мишо: \#E5E1D6

Background:   
Hero section: \#5080BF, Text: White (\#F8FAFC).  
White clouds that are moving from inside to the outside of the page on scroll down and the opposite movement on scroll up. 

Bravies intro section: White (\#F8FAFC).

The remaining sections should alternate colorful/white background in this fixed order per section: Problem, What it teaches?, How it works, Testimonials, Desired state, FAQ, Wishlist Sign-up. The colourful backgrounds should be complementary to the Bravies/brand card colours above.

-  **Responsiveness**: Must look flawless on mobile (375px), tablet (768px, 1024px) and desktop (1440px).

## ***4\. Functional Requirements (JS)***

- **Validation**: Validate email format before submission. Show an error message if invalid.

On valid submission, hide the form and show a smooth fade-in message: "Благодарим Ви\! Вече сте записани. Ще се свържем с Вас за първия тираж\!"

The validation rules apply for both forms: in the hero section and the bottom wait-list section.

-  **Storage**: For now, log the collected email to the browser console (or mock an API post request).

## ***5\. Constraints***

- All CSS must live in a separate \`style.css\` file.  
- All JS must live in a separate \`script.js\` file.

- **Success State** 

Act as a precise, senior frontend engineer executing a Spec-Driven Development (SDD) contract. 

I am providing my project specification document here. Do not guess, improvise, or shortcut any features. Your task is to write clean, fully commented, production-ready code that strictly matches all the rules, breakpoints, and states outlined in this specification.

Please generate the code for the following three files separately:  
1\. \`index.html\` (Semantic structure, linked CSS/JS assets)  
2\. \`style.css\` (Mobile-first styles, explicit tablet/desktop breakpoints, design variables)  
3\. \`script.js\` (Form validation, event handlers, mock API states)  

---

## 6. Implementation Decisions Log

This section records decisions made during the build that the spec above
left ambiguous, plus changes made in response to review feedback. It is
maintained continuously as the project progresses — treat it as the
source of truth where it's more specific than the sections above.

### Build approach
- Built in 5 phases: (1) Hero + Bravies Intro, (2) Problem + What It
  Teaches + How It Works, (3) Testimonials + Desired State, (4) FAQ +
  Wait-list Signup, (5) integration pass. **Currently in Phase 1.**
- Tech stack: vanilla JS confirmed as sufficient — no framework needed
  (no shared state across components, no routing, no dynamic data
  fetching; a framework's runtime weight works against a
  conversion-focused landing page).

### Design tokens
- Brand hex values corrected from the original spec: Веста `#278C5D`
  (was `#278CSD`), Мишо `#E5E1D6` (was `#ESE1D6`).
- Fonts: Baloo 2 (display/headings — rounded, playful) + Nunito Sans
  (body/UI text), chosen to fit the "bright, colorful, kids-friendly"
  design brief; not specified in the original spec.
- Section background colors for Problem / What It Teaches / How It
  Works / Testimonials / Desired State / FAQ / Wait-list Signup are
  **still undecided** — the spec fixes the alternation order but not
  actual hex values. Placeholder tokens are stubbed in `style.css` under
  a `TODO (Phase 2)` comment; real values needed before those sections
  are built.

### Hero section
- "15 degrees" corner rounding (from an earlier spec draft) was
  interpreted as `border-radius: 15px`; current spec already states
  `15px` directly, so this is resolved.
- Hero "peek" behavior: the hero's height is intentionally reduced
  (rather than 100vh) at every breakpoint so the top of the Bravies
  section — heading + start of the first card — is visible above the
  fold, not just on desktop. Peek amounts (tunable via CSS variables):
  mobile `230px`, portrait tablet `260px`, landscape tablet/desktop
  `300px`, ≥1440px `340px`. This was an explicit request to prioritize
  character-preview visibility over keeping the hero comfortable on
  short viewports.
- Clouds: implemented with the 5 real PNGs supplied (not CSS shapes).
  Movement is a direct function of scroll position within the hero (one
  `--scroll-progress` CSS variable, 0–1), so scrolling back up naturally
  reverses the drift — no separate "scroll up" logic needed. Clouds are
  intentionally varied in size or placement (large one bottom-right,
  the previously-too-small bottom-left one enlarged) so they read as
  naturally scattered rather than four uniform copies. On mobile, three
  of the four clouds are hidden entirely and the fourth (bottom-right)
  is shown small, since the tightened mobile hero leaves little safe
  room without risking overlap with the text/form column.

### Bravies Intro section
- Card aspect ratio: `3:5` (width:height), matching "cards are 6cm x
  10cm" literally — this replaced an earlier `1:6` misreading from a
  draft spec that produced impractically tall cards.
- Character image placeholders were rectangular (not circular), per
  spec wording, and have since been **replaced with the real supplied
  character artwork** (`assets/characters/{zaki,vihren,neda,vesta,misho}.png`).
- The "thicker bottom border" is implemented as the caption's own solid
  background (colored with the card's brand accent), not a literal CSS
  border — a border can only ever render as a thin stripe, not a
  readable panel holding name + bio text.
- Per-character caption text color is chosen for contrast against that
  character's accent (white text on Заки/Веста's darker colors, dark
  text on Вихрен/Неда/Мишо's lighter colors) — not specified in the
  spec, needed for legibility.
- Character names render in all caps (`text-transform: uppercase`).
- Card activation (hover/tap/default-active Неда): expands the caption
  and enlarges the portrait; the card itself does **not** scale up
  (an earlier version did — removed per feedback as one effect too
  many). Expanded caption height is roughly half of an earlier, overly
  tall first attempt.
- All cards render at the same size regardless of which is active —
  card width is controlled once by a shared `.brave-card` rule, not
  overridden per character.
- Mobile has no tap-to-expand: since every card is already full-width
  in a single column, the collapsed/expanded distinction doesn't apply.
  All captions show full text by default and portraits stay at base
  scale, regardless of the `.is-active` class (which JS still toggles,
  but which no longer changes anything visually below 768px).
- Card DOM order matches the spec's mobile/tablet-portrait order
  (Неда, Вихрен, Веста, Заки, Мишо); the desktop/landscape-tablet order
  (Заки, Вихрен, Неда, Веста, Мишо) is applied via the CSS `order`
  property rather than reordering the DOM. **Known trade-off:** desktop
  keyboard/tab order won't match left-to-right visual order. Flagged,
  not yet resolved with a final decision.
- Portrait vs. landscape tablet is detected with a combination of
  `min-width` and `orientation` media queries (not just width), so an
  iPad in portrait gets the 3-row layout and the same device rotated to
  landscape gets the single row.
- Intro heading (`"Твоето дете играе и учи..."`) is sized down and set
  to `white-space: nowrap` from 768px upward so it reads as one line
  and doesn't compete with the card row for vertical space — the
  original fluid heading scale left it too large relative to the cards.
- Bio text size increased from an initial `0.8rem` to `0.95rem` for
  readability, per feedback.

### Bug fix: card image overflow + non-working caption expand
- Root cause found by rendering the page and inspecting computed layout
  directly (not guessed from a screenshot): `.brave-card__portrait` was
  a flex item with the browser's default `min-height: auto`, which
  ignores `max-height` on the image inside and sizes the item to the
  image's natural aspect-fitted height instead. This mostly went
  unnoticed because most characters' art happened to roughly fit, but
  Заки's narrower/taller art (240×700 vs. ~395×700 for the others)
  exposed it clearly — his portrait area rendered at ~431px tall inside
  a 300px card. The same underlying instability is what made the
  caption's percentage-based height unreliable (no stable space to
  compute against), which is why it never visibly expanded on hover.
- Fix: rebuilt the card's internal layout on CSS Grid
  (`grid-template-rows: minmax(0, 1fr) auto`) with an explicit
  `min-height: 0` on the portrait, and switched the caption from a
  percentage height to fixed pixel values (`70px` collapsed / `128px`
  expanded) instead of relying on percentage-of-flex-content sizing.
  Verified after the fix, across all 5 cards, that no portrait overflows
  its card and that hover/active reliably resizes the caption.
- Also reduced the activation enlarge amount (`scale(1.22)` →
  `scale(1.1)`, `translateY(-18%)` → `translateY(-10%)`) and added
  margin below the section heading, since the previous amount let an
  enlarged/active portrait (including Неда's default-active state)
  reach up into the heading text above the card row.

### Bug fix: caption/portrait sizing coupling caused hover to shrink instead of enlarge
- After the previous grid-based fix, a new issue surfaced: portrait and
  caption shared a grid track, so growing the caption on hover
  (70px→128px) shrank the portrait's own track — and since the image's
  rendered size was computed from that shrinking box (max-height:100%
  of it), the underlying shrink sometimes outweighed the `scale()`
  transform meant to enlarge it. Net visible effect: characters looked
  like they were shrinking on hover instead of growing.
- Fix: restructured so the portrait fills the entire card at all times
  (`position: absolute; inset: 0`) and the caption is a bottom overlay
  on top of it (`position: absolute; left/right/bottom: 0`), rather than
  the two sharing a row/track. The portrait's box is now constant
  regardless of caption state, so `scale()`/`translateY()` are the only
  thing changing on hover — reliable by construction, not just by
  tuned values. Verified numerically (not just visually) that Заки's
  rendered image height increases on hover (276px → 320px).
- Same fix incidentally gives characters more visible room by default
  (portrait no longer gives up a fixed share of the card to the caption
  whether the caption needs it or not), which also addressed a separate
  "too much blank space at the bottom" complaint once the expanded
  caption height was reduced (128px → 100px) at the same time.
- Applied the identical `min-height: 0` fix one level up, to
  `.brave-card` itself — it's a flex item of `.card-row`, so without
  this override its default content-based minimum height could make
  cards render at different heights depending on content, overriding
  the `aspect-ratio`. Verified all 5 cards report identical heights at
  both mobile (506.97px) and desktop (300px) widths.
- Hover/active enlarge amount tuned to `scale(1.16) / translateY(-14%)`
  — smaller than an earlier `1.22/-18%` attempt (which reached into the
  heading above) but restored to a genuinely-enlarging effect (an
  intermediate `1.1/-10%` attempt was the one that exposed the
  shrink bug above).

### Hero section — mobile/desktop spacing
- Mobile: increased top padding so the H1 isn't flush against the
  viewport edge.
- Desktop/landscape-tablet: the email input was stretching to fill the
  full hero-content width (~700px) via `flex: 1` with no cap — capped
  at `max-width: 320px` and the form row centered, rather than
  letting it fill all available space.

### Card text: removed the hover/tap expand-collapse entirely
- Per feedback, the "collapsed name + peek of bio, expands on
  hover/tap" behavior from the original spec was removed — every card
  now shows its full name + bio at all times, at every breakpoint (no
  more distinction between mobile's always-expanded state and
  desktop's hover-to-expand state; they're now the same behavior
  everywhere). The caption's height is a fixed `130px` with no
  transition or toggle.
- The portrait enlarge-on-hover/tap effect was **not** removed — only
  the text-sliding behavior was. Неда still renders enlarged by default
  (`.is-active`), other cards enlarge on hover, and mobile still
  disables the portrait enlarge specifically (per the earlier "no
  tap-to-enlarge on mobile" decision).
- While verifying this change, found (via actual computed
  `scrollHeight`, not just eyeballing) that Мишо's bio — the longest of
  the five, wrapping to 3 lines — was being clipped by the caption's
  `overflow: hidden` at the height that fit everyone else's shorter,
  2-line bios. Increased the fixed caption height (100px → 130px) to
  fit the longest one; verified afterward that all 5 cards' content now
  fits without clipping.

### Error message contrast
- The error message's light-red text color read as too low-contrast
  against the hero's blue background. Rather than just picking a
  different text color (which would need re-tuning again once later
  sections put this same form on unknown background colors), gave it a
  solid white pill background with dark, saturated red text
  (`#7F1D1D`) — contrast is now guaranteed regardless of what's behind
  it. Only renders when there's actually an error to show, via the
  `:not(:empty)` selector (script.js sets/clears this element's
  `textContent` directly, so this needs no JS changes).

### Minor polish
- Mobile: email input placeholder/text centered (was left-aligned).
- Bottom-right cloud repositioned — moved up and further toward center
  at every breakpoint (was tucked hard into the corner).

### Open items carried forward (not yet resolved)
- Two invalid hex codes in early spec drafts are now fixed in this
  version's Design System section — no longer open.
- Section background colors (Problem → Wait-list Signup) — still TBD.
- Icon source for the Desired State section's 2×2 grid (custom SVG vs.
  icon library) — not yet decided, relevant when Phase 3 is built.
- Bottom-of-page Wait-list Signup section confirmed to reuse the exact
  same form/copy pattern as the hero form (per spec: "Same form for
  email and submit button as in the hero section") — `script.js`
  already supports this via a reusable `initWaitlistForm()` called once
  per `[data-waitlist-form]` element, so Phase 4 just needs to add the
  markup with that attribute.
- Desktop card tab-order vs. visual-order mismatch (see above) — no
  decision made yet on whether to address it (e.g. via a JS-based DOM
  reorder) or accept it.

