# RevenueHunt Product Recommendation Quiz — setup & bilingual process

The Lumeia "Find your Lumeia match" quiz runs on the **RevenueHunt** app (Product Recommendation Quiz), not in this theme. This doc records how it is wired and, importantly, how the **Arabic / RTL** version was made to work, because that lives entirely inside the RevenueHunt app and is easy to get wrong.

## Where the quiz lives

Built and configured in the RevenueHunt app (Shopify admin → Apps → Product Recommendation Quiz). It is **not** theme code, so it cannot live in this Git repo — only the entry-point links (below) and this doc do. Store admin handle: `lumeia-5`.

## Entry points (in this theme)

RevenueHunt's **"Link Popup Quiz"** theme app embed is enabled (Online Store → Themes → Customize → App Embeds). With it on, any link whose href is `#quiz` opens the quiz as a full-screen popup, site-wide. So every "Take the quiz" CTA is just a link to `#quiz`:

- Homepage "Better together" button → `#quiz`
- Homepage FAQ answer ("take our quiz here") → `#quiz`
- Our Story CTA ("Take the quiz") → `#quiz`
- Announcement bar, both slides ("Take our quiz") → `#quiz`

The owner also added a "Link Popup Quiz" block (an `apps` section) in the theme editor; it coexists with the embed and is left in place.

Future (Perelel-style): a dedicated `/pages/take-our-quiz` page holding the quiz, which the announcement bar and a nav link point to. Better home for a long, multi-route funnel than a popup. When that lands, update the `#quiz` references here.

## Bilingual (EN + AR) — the important part

RevenueHunt bilingual is **two separate quizzes**, not one quiz with translations. The Arabic is done **inside RevenueHunt**, **NOT** via Shopify Translate & Adapt. (Translate & Adapt still handles the rest of the *site's* Arabic; the quiz is self-contained in the app.)

Quizzes:

- English — "Find your Lumeia match" — id `KhskjY`
- Arabic — "Find your Lumeia match (Arabic)" — id `8qnK1S`

### Who did what (so it can be repeated)

**RevenueHunt Copilot did:**
- Drafted the quiz structure from a prompt.
- Translated the questions, answer choices, and result outcomes to Arabic.
- Ran some batch alignment fixes (e.g. shifting headings toward the right).
- Basic design changes (colours, unifying the button hover that was showing black).

**Owner did by hand (this is what made RTL reliable):**
- Turned on the app's **native RTL** setting (buttons, progress bar, flow orientation).
- Manually set **text-alignment = Right** on *every* heading/description block. This is the key step: it stops the layout relying on the browser's RTL "guesswork", so headings and descriptions sit against the right margin correctly even if a browser is slow to pick up RTL.
- Updated the **system text** (Next, Progress) to Arabic in Quiz Content settings (e.g. Next = `التالي`).
- Verified the Arabic renders correctly on the live site.

Gotcha (per RevenueHunt's Erik): the Copilot can translate *without* applying the RTL orientation, and RTL changes can take a moment / need a refresh to show. If the language displays correctly, it is working. The explicit per-block Right alignment is what removes the flakiness.

### Auto-switching by language (Shopify Markets)

App Settings → Shopify Markets → "Show all locales", then map locales to quizzes:

- English locale → English quiz `KhskjY`
- Arabic locale → Arabic quiz `8qnK1S`

When a visitor toggles the site to Arabic, RevenueHunt detects the locale and serves the Arabic quiz automatically. Design is kept in sync across both quizzes (brand colours: tangerine `#FFA440`, dark brown text `#44190E`). **All of this works on the FREE plan** — no paid Custom CSS is required as long as the native alignments are kept.

## Plans / billing notes

- Free plan: 100 responses/month; **Klaviyo and other 3rd-party integrations require the trial or a paid plan** (not free).
- Klaviyo connection is **OAuth**, not an API key. Quiz answers + recommendations + contact sync to Klaviyo as custom properties (incl. `ANSWERS_BY_BLOCK`). Also writes name/phone/email/tags to the Shopify customer (not metafields).
- Custom CSS/JS is paid-tier only; the built-in Quiz Design tab (colours, fonts, background) is free and enough for brand styling. The quiz renders in a shadow DOM, so theme CSS cannot reach inside it — style it via the app's design tab.
- Result page: set the product block to **"Link to product"** and turn off **"Group product variants"** (Advanced) so results link to the PDP instead of add-to-cart (keeps the PDP quantity-breaks and gift tiers intact). *(Still pending.)*

## Working with the Copilot

RevenueHunt's team: the Copilot works best with **small prompts, one action per prompt**. A single long "build the whole quiz" prompt can produce hiccups (e.g. translating without applying RTL — which is what happened on the first build). Draft the structure, then apply changes in small steps.

## Reference

Perelel (a bilingual women's-health brand we benchmark) runs **Octane AI** for their quiz + **Rebuy** (cross-sell) + Klaviyo + Okendo, and redirects to a dedicated `/pages/take-our-quiz` page. We stay on RevenueHunt and borrow their funnel structure, not the tool.
