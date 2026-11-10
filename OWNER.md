# SD Design: owner's guide

The site is static (Astro). Every word is in three files, one per language: `src/i18n/sq.js`, `en.js`, `it.js`.

```bash
npm run dev      # the site at http://localhost:3760, reloads as you edit
npm run build    # the finished site in dist/
npm run preview  # the built site at http://localhost:3761
```

## The offer: a free working draft

The whole site is built around one offer, and it says only what was agreed on 10 Nov 2026:

- a working draft of the visitor's site, free, on a link they open on their phone;
- within 24 hours on working days (Monday to Friday), counted after a short chat on WhatsApp;
- 10 free drafts a week, only for businesses in Albania;
- the first answer on WhatsApp the same working day;
- the full build starts with a deposit agreed together.

If any of these changes, change the sentences in the three language files (search for `offer:` and for the questions
under `faq:`) and the numbers in `src/data/offer.js`.

### The weekly counter (do this each time you give a draft away)

`src/data/offer.js`:

```js
taken: 3,              // free drafts given away this week
updated: '2026-11-12', // the day you changed the number
```

The site shows "10 − taken" next to every button. When a new week begins (Monday, Albanian time) it shows all 10
again by itself, so an old number is never shown as this week's. At 0 it says this week's drafts are all taken.
After changing the file, build and publish as usual.

### Who answers

`src/data/site.js`, `SITE.person`: the name next to the button (`Stefano Doko`) and, when there is one, a square photo
(put it in `public/person/` and write its address, e.g. `'/person/stefano.webp'`). Until then the SD mark stands in its
place. The site never shows a made-up face.

### The message the button starts

Every WhatsApp button opens the chat with a request for the free draft already written (`offer.msg` in the language
files): the business name and type, Instagram or current site, what customers should do, and a line about the logo and
photos. On a page for one kind of business the type is already filled in.

## Before it goes live: what only you can fill in

The site never guesses these. While they are empty it shows a small "Draft" note instead of a wrong number.

| What | Where | What it changes |
|---|---|---|
| WhatsApp number, phone, Instagram, email | `src/data/contact.js` | Every button and link; the form (it opens WhatsApp with the message written) |
| The photo of the person who answers | `src/data/site.js`, `SITE.person.photo` | The small picture next to every button |
| An inbox for the form (optional) | `src/data/contact.js`, `formEndpoint` | The form posts there instead of opening WhatsApp. Works with Formspree, Web3Forms or your own endpoint |
| The domain | `src/data/site.js`, `SITE.url` | Removes "noindex", fills `sitemap.xml`, makes the canonical, hreflang and share-image addresses absolute |
| Registered name, NIPT, address | `src/data/site.js`, `SITE.legal` | The "Who runs the site" block on the privacy page |
| Search Console and Bing codes | `src/data/site.js`, `SITE.verify` | The verification tags in the head |

**The site is a draft until `SITE.url` is set.** A draft says "noindex" on every page and "Draft" in the footer, so a
test address can never end up in Google.

Sentences to confirm, because they speak for the studio:
- the offer, as listed above (the first screen, the three numbers, the four steps, the terms, the questions);
- the privacy page says what is received (name, number, message, logo, photos) "is used to answer you and to make your draft";
- the service pages say what each kind of site includes (each point is something already built for a client);
- nothing states a price. The questions say the price is given on WhatsApp after the draft.

## The pages

- Home (`/`, `/en/`, `/it/`): the offer, how it works step by step, the six sites, the three levels of difficulty and
  the four kinds of business, why, the questions.
- The offer on its own (`/draft-falas/`, `/en/free-draft/`, `/it/bozza-gratis/`): a short page for the Instagram bio
  and for adverts.
- One page per kind of business (restaurants, hotels, shops, clinics) in each language, and the privacy page.

## What moves, and how to stop it

The page changes ground as it is scrolled (dark, red, each client's colour, light), the story of the draft plays in a
phone, the gallery of client sites moves sideways (on a touch screen it is a strip to swipe), headings rise word by
word and three numbers count. No animation library and no 3D: one small script (`src/scripts/scroll.js`) reads how far
the page has scrolled. The "Stop animations" switch in the rail, the system's "reduce motion" setting, or a browser
without JavaScript all give the same plain page: a list of steps beside a picture, and a strip of phones.

The example conversation in the story's phone behaves like a real chat: each message arrives under the one before it,
and when the screen is full the conversation moves up under the chat's header. Its words are in the language files
(`offer.chat`), and the moments at which each message arrives are the `CHAT_AT` list at the top of
`src/scripts/scroll.js` (0 is the start of the story, 1 its end).

Spacing follows one rule: every section starts one `--pad` (set at the top of `src/styles/site.css`) after the one
before it, and the left and right margins are the same (`--m`).

## When something changes

| You changed | Run |
|---|---|
| A headline, or a client's screenshot | `node tools/assets.mjs` (share images, icons, small screenshots) |
| Any headline or button text, in any language | `node tools/hero-fit.mjs` (it must print 0 failures: nothing under the glass phone, no word cut off on a phone) |
| The home headline | `node tools/measure-h1.mjs` first: it prints the size each language allows (`--h1` in `src/styles/site.css`) |
| A client's site (to record it again) | `node tools/record-phone.mjs <id>`, `node tools/tall-shots.mjs <id>` (the tall picture in the gallery), then `node tools/client-facts.mjs <id>` to re-read its facts |
| Anything, before publishing | `npm run build && npm run preview`, then the checks below, all against `http://localhost:3761` |

### The checks (each prints "0 failures" when all is well)

| Check | What it proves |
|---|---|
| `node tools/check-site.mjs ../sd-check http://localhost:3761` | Every page on desktop and phone: no script errors, images with sizes and alt text, tap targets; then what a search engine reads (titles, descriptions, canonical, languages, structured data, links, sitemap) |
| `node tools/states.mjs ../sd-states http://localhost:3761` | The interactions: the menu, the rows, the form, the stop switch, the keyboard in the gallery, an example under a level opening its row, a reload in the middle of the page coming back to the same place |
| `node tools/scenes.mjs ../sd-scenes http://localhost:3761` | What the scroll moves: the counter, the grounds, the numbers, the story step by step, the gallery; and the plain page with the switch, with "reduce motion", without animation frames and without JavaScript |
| `node tools/motion.mjs http://localhost:3761` | Frame by frame, at 12 screen sizes and in the 3 languages, scrolling down and back up: no message of the example conversation over another or out of the chat, nothing moving against the scroll |
| `node tools/hero-fit.mjs http://localhost:3761` | The headline never under the glass phone, no word of any heading cut off on a phone, the button's line on one line on a desktop |
| `node tools/webkit.mjs ../sd-webkit http://localhost:3761` | The same pages in Safari's engine (iPhone): scripts, pinned scenes, grounds, the halftone. Needs Playwright, which is installed in `../holdings` |
| `node tools/spacing.mjs http://localhost:3761 /` | Prints the space above and below every section and its left and right margins, to check they are even (in Git Bash put `MSYS_NO_PATHCONV=1` in front, or the `/` is rewritten) |
| `node tools/strip.mjs ../sd-strip .story-scene .mock 390x844 0 1 16` | A film strip of one moving part (here: the phone of the story on a phone screen, 16 frames), to look at a transition frame by frame |

A client's colour is written twice (`src/data/sites.js` and the top of `src/styles/site.css`); the check fails if they differ.

## What is already done for search engines and AI assistants

- One page per search intent and language (the home, the offer, four kinds of business: 18 pages, plus privacy), each
  with its own title, description, canonical address, language alternates, share image and structured data
  (Organization, WebSite, WebPage, Service, the free draft as an Offer, the questions as a FAQPage, breadcrumbs, the
  list of work).
- Every word is in the HTML: the pages read the same with JavaScript off, which is how the AI crawlers read them.
- `robots.txt` lets everyone in and names the AI crawlers on purpose; `sitemap.xml` lists every page with its
  translations; `llms.txt` is the site as plain text (Google ignores that file, a few other tools read it).
- No cookies, no tracker, nothing loaded from other sites: no consent banner is needed.
- A content security policy in every page, and `public/_headers` for Netlify or Cloudflare Pages.

## After launch, in your own accounts

1. Google Search Console and Bing Webmaster Tools: add the site, put the codes in `SITE.verify`, submit `/sitemap.xml`.
   Bing matters more than it looks: ChatGPT and Copilot read Bing.
2. A Google Business Profile for the studio, complete, with the same name, phone and address as the site.
3. Mentions on other sites: client sites linking back ("Site by SD Design"), local directories, a few lists. For AI
   answers, being mentioned counts more than links.
4. If you add analytics, taps on WhatsApp, the phone, Instagram and the form are already sent as events named
   `whatsapp`, `phone`, `instagram`, `form` (to Plausible or Google Analytics if either is on the page). Adding a
   tracker means adding its address to the content security policy in `astro.config.mjs`, and a consent banner if it
   uses cookies.
5. Once a month: Search Console (which searches show the site, which pages are indexed), and the same five
   questions asked to ChatGPT and Perplexity, to see whether the studio is named.

## Not part of the site that ships

The 3D studio page is parked: it opens at `/studio` while developing, and its models are left out of the build
(`STUDIO=1 npm run build` includes it). The earlier home without the offer is commit 653ded1 on the `glass-site`
branch; the two designs that were not chosen are on the `redesign-options` branch.
