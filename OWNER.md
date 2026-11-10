# SD Design: owner's guide

The site is static (Astro). Every word is in three files, one per language: `src/i18n/sq.js`, `en.js`, `it.js`.

```bash
npm run dev      # the site at http://localhost:3760, reloads as you edit
npm run build    # the finished site in dist/
npm run preview  # the built site at http://localhost:3761
```

## Before it goes live: what only you can fill in

The site never guesses these. While they are empty it shows a small "Draft" note instead of a wrong number.

| What | Where | What it changes |
|---|---|---|
| WhatsApp number, phone, Instagram, email | `src/data/contact.js` | Every button and link; the form (it opens WhatsApp with the message written) |
| An inbox for the form (optional) | `src/data/contact.js`, `formEndpoint` | The form posts there instead of opening WhatsApp. Works with Formspree, Web3Forms or your own endpoint |
| The domain | `src/data/site.js`, `SITE.url` | Removes "noindex", fills `sitemap.xml`, makes the canonical, hreflang and share-image addresses absolute |
| Registered name, NIPT, address | `src/data/site.js`, `SITE.legal` | The "Who runs the site" block on the privacy page |
| Search Console and Bing codes | `src/data/site.js`, `SITE.verify` | The verification tags in the head |

**The site is a draft until `SITE.url` is set.** A draft says "noindex" on every page and "Draft" in the footer, so a
test address can never end up in Google.

Sentences to confirm, because they speak for the studio:
- the privacy page says what is received "is used to answer you";
- the service pages say what each kind of site includes (each point is something already built for a client);
- nothing states a price, a deadline or who the people are. Add them to the language files if you want them shown.

## When something changes

| You changed | Run |
|---|---|
| A headline, or a client's screenshot | `node tools/assets.mjs` (share images, icons, small screenshots) |
| The home headline in any language | `node tools/measure-h1.mjs`, then `node tools/hero-fit.mjs` (it must print 0 failures) |
| A client's site (to record it again) | `node tools/record-phone.mjs <id>`, then `node tools/client-facts.mjs <id>` to re-read its facts |
| Anything, before publishing | `node tools/check-site.mjs ../sd-check http://localhost:3761` and `node tools/states.mjs ../sd-states http://localhost:3761` |

A client's colour is written twice (`src/data/sites.js` and the top of `src/styles/site.css`); the check fails if they differ.

## What is already done for search engines and AI assistants

- One page per kind of business and language (15 pages plus privacy), each with its own title, description,
  canonical address, language alternates, share image and structured data (Organization, WebSite, WebPage, Service,
  breadcrumbs, the list of work).
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
(`STUDIO=1 npm run build` includes it). The two designs that were not chosen and the earlier home are on the
`redesign-options` branch.
