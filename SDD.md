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
