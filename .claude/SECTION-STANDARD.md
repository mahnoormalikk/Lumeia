# Editor-freedom standard for custom sections and blocks

The bar: anything we build should give the merchant the same editing freedom a good Pebble section does, not the bare minimum. The payment block's first version failed this — it was "an improved Ali block." This is the standard so it does not happen again.

## Principle 1 — native first

If a section has no special logic, build it from Pebble's own blocks (text, image, group, grid, icon-box). Those already expose every control below, so you get the freedom for free. Hand-roll a custom block only when there is logic native blocks cannot do (e.g. the payment block's Kuwait geolocation). That is the only time the rest of this file applies.

## Principle 2 — when hand-rolling, reuse Pebble's snippets (do not re-implement)

Do not invent settings, and do not re-derive padding, clamp scaling, typography, or width in bespoke CSS variables. Pebble ships the machinery as snippets; copy the schema settings verbatim and **render the snippet**. A hand-rolled `--my-pad-top` with its own `@media` is "improved Ali"; `{% render 'spacing-style' %}` + the `.spacing-style` class is native. The full copy-paste mechanism is in **"Native Pebble snippets"** below.

Which file to copy each control set from:
- Typography (type preset + custom), width, padding (mobile-scale idiom), animation, text colour/alignment → `blocks/text.liquid` + `snippets/text.liquid`
- Icon size desktop + mobile, icon image upload, heading preset, card style, colour scheme → `blocks/icon-box.liquid` + `snippets/icon-or-image.liquid`
- Columns, column/row gap, swipe-on-mobile, mobile columns, border → `blocks/grid.liquid`
- Direction, alignment, width, padding desktop/mobile via a `device` selector (the device-toggle idiom) → `blocks/group.liquid` + `snippets/group.liquid`
- Image ratio desktop/mobile, border radius, rounded → `blocks/image.liquid`
- Container full vs fixed, section padding (device-toggle idiom) → `sections/custom-section.liquid`

## Native Pebble snippets — the copy-paste mechanism

Render these snippets and add the matching class on the same wrapper. The snippet writes the CSS custom properties; the class consumes them. Verified against `assets/theme.css` and the source blocks. For a section the wrapper is the `.section` element; for a block it is the block's own outer element.

| Control | Schema settings to add (ids verbatim) | Put in the wrapper `style="…"` | Class to add to the wrapper | Source |
|---|---|---|---|---|
| Padding — device toggle (restyleable block/section) | `device` select + `padding-block-start`,`padding-block-end`,`padding-inline-start`,`padding-inline-end` (each `visible_if device == 'desktop'`) + the same four with `-mobile` (`visible_if device == 'mobile'`) | `{% render 'spacing-style', settings: x %}` | `spacing-style` | group.liquid, custom-section.liquid |
| Padding — mobile-scale (lighter, inline text) | the four desktop `padding-*` + `mobile-padding-scale` (range %, default 80) | `{% render 'spacing-style', settings: x %}` | `spacing-style` | text.liquid |
| Width (Fit/Fill, optional Custom) | `width` (`fit-content`/`fill`/`custom`) + `custom_width` (`visible_if custom`) + `width_mobile` + `custom_width_mobile` | `{% render 'size-style', settings: x %}` | `size-style` | group.liquid |
| Typography | `type_preset` (`rte`/`paragraph`/`text-subheading`/`h1`–`h6`/`custom`); when `custom`: `font`,`font_weight`,`font_size`,`font_size_mobile`,`line_height` (each `visible_if type_preset == 'custom'`) | `{% render 'typography-style', preset: x.type_preset, font_family: x.font, font_weight: x.font_weight, font_size: x.font_size, font_size_mobile: x.font_size_mobile, line_height: x.line_height %}` | `{{ preset }}` always; add `custom-typography custom-font-size` only when `preset == 'custom'` | text.liquid |
| Text colour | `text_color` (`text`/`subtext`/`gradient`) + `text_color_gradient` (type `color_background`, `visible_if gradient`) | when gradient: `--color-gradient: {{ x.text_color_gradient | default: '#000000' }};` | `color-{{ x.text_color }}` | text.liquid |
| Colour scheme | `color_scheme` (type `color_scheme`, default `scheme-1`) | — | `color-{{ x.color_scheme }}` (guard: `{% if x.color_scheme != blank %}`) | every section |
| Animation | `animation_type` (`none`/`fade-in`/`fade-up`/`slide-in-left`/`slide-in-right`) + `animation_delay` (range ms). Header + both settings carry `visible_if "{{ settings.animations_enabled == true }}"`; delay also `and animation_type != 'none'` | `data-motion="{{ type }}" data-motion-delay="{{ delay }}"` (attributes, not style) and swap the root element to `<motion-component>` when `animation_type != 'none' and settings.animations_enabled` | — | text.liquid + `assets/motion-component.js` |
| Icon / image size (desktop + mobile) | `icon_size` select incl. a `custom-size` option + `icon_width` + `icon_width_mobile` (`visible_if custom-size`) | render the image through the snippet instead of inline | `{% render 'icon-or-image', icon: x.icon, image_upload: x.icon_image_upload, icon_size: x.icon_size, width: x.icon_width, width_mobile: x.icon_width_mobile %}` | icon-box.liquid |

**Repeatable items are child blocks, not fixed slots.** When a section/block holds a list of the same thing (logos, badges, feature rows, cards), do NOT hand-roll N fixed `logo_1..8` settings. Define a private child block (`blocks/_my-item.liquid`, `"tag": null`) and render the list with `{% content_for 'blocks' %}`, declaring `"blocks": [ { "type": "_my-item" } ]` in the parent schema — exactly how `group.liquid` holds its children. The merchant then adds, removes and reorders items by drag, and seed defaults via the parent preset's `"blocks": [ ... ]` array. Each child block can run its own logic (e.g. a per-logo geolocation check reading `localization.country.iso_code`); show all children when `request.design_mode` so the editor stays usable. Migrating an existing fixed-slot instance: move each `logo_N` setting into a child block under the instance's `"blocks": { }` with a matching `"block_order"`, and delete the old `logo_*` settings (a saved-instance migration — see the rename gotcha). This is strictly more flexible than fixed slots and is how Pebble does every repeatable list.

Literal schema blocks (paste, then prefix ids if a block has more than one of the same group, e.g. `guarantee_type_preset`):

```json
{ "type": "header", "content": "Padding" },
{ "type": "select", "id": "device", "label": "Device", "default": "desktop",
  "options": [ {"value":"desktop","label":"Desktop"}, {"value":"mobile","label":"Mobile"} ] },
{ "type": "range", "id": "padding-block-start", "label": "Top", "min": 0, "max": 100, "step": 1, "unit": "px", "default": 0, "visible_if": "{{ block.settings.device == 'desktop' }}" },
{ "type": "range", "id": "padding-block-end",   "label": "Bottom", "min": 0, "max": 100, "step": 1, "unit": "px", "default": 0, "visible_if": "{{ block.settings.device == 'desktop' }}" },
{ "type": "range", "id": "padding-inline-start","label": "Left", "min": 0, "max": 100, "step": 1, "unit": "px", "default": 0, "visible_if": "{{ block.settings.device == 'desktop' }}" },
{ "type": "range", "id": "padding-inline-end",  "label": "Right", "min": 0, "max": 100, "step": 1, "unit": "px", "default": 0, "visible_if": "{{ block.settings.device == 'desktop' }}" },
{ "type": "range", "id": "padding-block-start-mobile", "label": "Top", "min": 0, "max": 100, "step": 1, "unit": "px", "default": 0, "visible_if": "{{ block.settings.device == 'mobile' }}" },
{ "type": "range", "id": "padding-block-end-mobile",   "label": "Bottom", "min": 0, "max": 100, "step": 1, "unit": "px", "default": 0, "visible_if": "{{ block.settings.device == 'mobile' }}" },
{ "type": "range", "id": "padding-inline-start-mobile","label": "Left", "min": 0, "max": 100, "step": 1, "unit": "px", "default": 0, "visible_if": "{{ block.settings.device == 'mobile' }}" },
{ "type": "range", "id": "padding-inline-end-mobile",  "label": "Right", "min": 0, "max": 100, "step": 1, "unit": "px", "default": 0, "visible_if": "{{ block.settings.device == 'mobile' }}" }
```

```json
{ "type": "header", "content": "Typography" },
{ "type": "select", "id": "type_preset", "label": "Text style", "default": "paragraph",
  "options": [ {"value":"rte","label":"Default"}, {"value":"paragraph","label":"Paragraph"}, {"value":"text-subheading","label":"Subheading"}, {"value":"h1","label":"H1"}, {"value":"h2","label":"H2"}, {"value":"h3","label":"H3"}, {"value":"h4","label":"H4"}, {"value":"h5","label":"H5"}, {"value":"h6","label":"H6"}, {"value":"custom","label":"Custom"} ] },
{ "type": "select", "id": "font", "label": "Font", "default": "var(--font-body--family)",
  "options": [ {"value":"var(--font-body--family)","label":"Body"}, {"value":"var(--font-heading--family)","label":"Heading"} ], "visible_if": "{{ block.settings.type_preset == 'custom' }}" },
{ "type": "select", "id": "font_weight", "label": "Font weight", "default": "",
  "options": [ {"value":"","label":"Inherit"}, {"value":"300","label":"Light"}, {"value":"400","label":"Regular"}, {"value":"500","label":"Medium"}, {"value":"600","label":"Semi-bold"}, {"value":"700","label":"Bold"}, {"value":"800","label":"Extra bold"}, {"value":"900","label":"Black"} ], "visible_if": "{{ block.settings.type_preset == 'custom' }}" },
{ "type": "range", "id": "font_size", "label": "Font size (desktop)", "min": 12, "max": 100, "step": 1, "unit": "px", "default": 15, "visible_if": "{{ block.settings.type_preset == 'custom' }}" },
{ "type": "range", "id": "font_size_mobile", "label": "Font size (mobile)", "min": 12, "max": 60, "step": 1, "unit": "px", "default": 15, "visible_if": "{{ block.settings.type_preset == 'custom' }}" },
{ "type": "select", "id": "line_height", "label": "Line height", "default": "normal",
  "options": [ {"value":"tight","label":"Tight"}, {"value":"normal","label":"Normal"}, {"value":"loose","label":"Loose"} ], "visible_if": "{{ block.settings.type_preset == 'custom' }}" },
{ "type": "select", "id": "text_color", "label": "Text colour", "default": "text",
  "options": [ {"value":"text","label":"Text"}, {"value":"subtext","label":"Subtext"}, {"value":"gradient","label":"Gradient"} ] },
{ "type": "color_background", "id": "text_color_gradient", "label": "Gradient colour", "visible_if": "{{ block.settings.text_color == 'gradient' }}" }
```

```json
{ "type": "header", "content": "Animation", "visible_if": "{{ settings.animations_enabled == true }}" },
{ "type": "select", "id": "animation_type", "label": "Type", "default": "none",
  "options": [ {"value":"none","label":"None"}, {"value":"fade-in","label":"Fade in"}, {"value":"fade-up","label":"Fade up"}, {"value":"slide-in-left","label":"Slide in left"}, {"value":"slide-in-right","label":"Slide in right"} ], "visible_if": "{{ settings.animations_enabled == true }}" },
{ "type": "range", "id": "animation_delay", "label": "Delay", "min": 0, "max": 2000, "step": 50, "unit": "ms", "default": 250, "visible_if": "{{ block.settings.animation_type != 'none' and settings.animations_enabled == true }}" }
```

Liquid wiring for typography + animation (a block; for a section read `section.settings` and `section`):

```liquid
{%- liquid
  assign x = block.settings
  assign root_element = 'div'
  if x.animation_type != 'none' and settings.animations_enabled
    assign root_element = 'motion-component'
  endif
-%}
<{{ root_element }}
  class="my-block spacing-style size-style{% if x.color_scheme != blank %} color-{{ x.color_scheme }}{% endif %}"
  style="{% render 'spacing-style', settings: x %}{% render 'size-style', settings: x %}"
  {% if x.animation_type != 'none' %}data-motion="{{ x.animation_type }}" data-motion-delay="{{ x.animation_delay }}"{% endif %}
  {{ block.shopify_attributes }}
>
  <span
    class="my-block__text {{ x.type_preset }}{% if x.type_preset == 'custom' %} custom-typography custom-font-size{% endif %} color-{{ x.text_color }}"
    style="{% render 'typography-style', preset: x.type_preset, font_family: x.font, font_weight: x.font_weight, font_size: x.font_size, font_size_mobile: x.font_size_mobile, line_height: x.line_height %}{% if x.text_color == 'gradient' %}--color-gradient: {{ x.text_color_gradient | default: '#000000' }};{% endif %}"
  >{{ x.text }}</span>
</{{ root_element }}>
```

Gotchas, each learned from a real build:
- **Pick one padding idiom.** In `spacing-style`, a present `*-mobile` value beats `mobile-padding-scale`. So a scale beside the device-toggle's explicit mobile ranges is a dead control. Use the device toggle for restyleable blocks/sections (group, custom-section), the scale for lightweight inline text (text). Never both.
- **`typography-style` does not emit `--color-gradient`.** Only `snippets/text.liquid` does. If you render `typography-style` directly, emit `--color-gradient` yourself on the same element, or `.color-gradient` makes the text transparent (invisible).
- **Typography classes go on the text element only**, never a flex row that also holds an icon — `.paragraph > *`, `.custom-typography > *`, `.color-gradient > *` target direct children and will style the icon.
- **The preset classes work standalone** (`.h2`, `.paragraph`, `.text-subheading`, `.rte`, `.custom-typography`, `.custom-font-size`, `.color-*` all have bare-class selectors in `theme.css`); you do not need a `.text-block` wrapper. But `.text-block` is what owns width/alignment, so drive those via `size-style` and your own flex classes, not the preset class.
- **`motion-component` defaults to `display:block`** (a bare element selector in critical-css). Set your layout with a class (`.my-block { display:flex }`) — a class beats the element selector, so the layout holds whether the root is `div` or `motion-component`.
- **Renaming a setting id on a block/section that already has a saved instance** drops that control to its schema default in the saved instance (Shopify keeps the old key but ignores it). Image uploads are safe only if you keep the `image_picker` ids unchanged. Flag a saved-instance re-set at ship (rule 13).
- **Adding a nested-block schema and the instances that use it in ONE commit can fail the sync on a race.** If the same commit adds `"blocks"` to a block's schema AND a template instance that nests those child blocks, the GitHub→theme sync may validate the template before the updated block schema registers, and reject it with "Blocks are not allowed in this context" — even though nesting is fully supported (private child blocks already nest in `product-details`: `_buy-buttons` → `_add-to-card-button`, `accordion` → `_accordion-row`). The block file usually succeeds while the template fails. Recovery: the schema is now live, so re-touch the template (a one-line change to its header comment) in a follow-up commit and it re-validates and applies. Safer still: land the block-schema change first, then the template instances in a second commit. Read the sync log to catch it.
- **Reusing an id but tightening its constraint breaks existing saved instances.** If you keep a `range` id but raise its `min` (e.g. a font size from `min: 9` to `min: 12` to match `text.liquid`), any saved instance still holding the old smaller value fails Shopify's validation on the GitHub→theme sync ("Setting X can't be less than 12") and that whole template is rejected and not applied. Two traps make this silent: (1) **Theme Check does NOT catch it** — it validates the schema and Liquid, not saved-instance values against the schema ranges, so the file looks clean locally; only the sync log shows the failure. (2) The failure only surfaces when something else in that *template* changes (the sync re-validates changed files), so a schema change in the block file can lie dormant until a later template edit triggers re-validation. Fix: when you tighten a constraint on a reused id, either keep the old min, or clean every saved instance of that block to a valid value (and check the sync log, not just Theme Check).

## Baseline checklist (every custom block/section)

Include all that apply to the section; default to MORE freedom, case by case like Pebble.

- [ ] **Colour scheme** — `{ "type": "color_scheme", "id": "color_scheme", "default": "scheme-1" }`, and render the wrapper with `color-{{ block.settings.color_scheme }}` so text colour follows it.
- [ ] **Typography per text element** — `type_preset` (rte / paragraph / subheading / h1–h6 / custom); when custom, expose font, font_weight, font_size + font_size_mobile, line_height.
- [ ] **Text colour** — `text_color` (text / subtext / gradient), not a hardcoded hex.
- [ ] **Text alignment** — `text_alignment` + `text_alignment_mobile`.
- [ ] **Width** — `width` + `custom_width`, and `width_mobile` + `custom_width_mobile` (fit / fill / custom).
- [ ] **Padding** — `padding-block-start/-end`, `padding-inline-start/-end`, plus mobile: either a `mobile-padding-scale` (%) or explicit `*-mobile` values behind a `device` selector.
- [ ] **Animation** — `animation_type` + `animation_delay`, both wrapped in `visible_if: "{{ settings.animations_enabled == true }}"`.
- [ ] **Images/icons** — size desktop + mobile (the `icon_width` / `icon_width_mobile` pattern with a `custom-size` option), ratio where relevant, border radius.
- [ ] **Multi-item layout (grids/rows)** — columns (desktop) + `columns_mobile` (1/2), `column_gap` + `row_gap` (+ mobile), `enable_swipe_on_mobile` and swipe width.
- [ ] **Border (optional)** — `border` (none/solid) + width + opacity + radius.

## Mechanics

- Desktop id is the base; mobile id is the same with `_mobile`.
- Use `visible_if` to hide dependent controls (e.g. show `custom_width` only when `width == 'custom'`, show custom typography only when `type_preset == 'custom'`).
- `color_scheme` is its own setting type, never a select of hardcoded options.
- Group related settings under `{ "type": "header", "content": "..." }`.
- A custom block in `blocks/` uses `block.settings` and `{{ block.shopify_attributes }}` (not `section.settings`).

## Case by case

Not every control belongs in every section, just as Pebble varies them. Include what fits the section's job, but the test is: could the merchant restyle and re-space this for desktop and mobile without a developer? If not, it is below standard.

## Freedom by section type (the map)

Pick the control set by what you are building and mirror the named Pebble file. Default to more freedom, but go minimal where noted — it is case by case, not "max everything." Each control in the Expose column has a paste-ready snippet in "Native Pebble snippets" above — reuse it, do not re-implement.

| Build type | Mirror file(s) | Expose | Go minimal when |
|---|---|---|---|
| Text / content | `blocks/text.liquid` | typography preset + custom (d/m), colour, width (d/m), padding (d/m) | — |
| Media / image, hero | `sections/hero-banner.liquid`, `blocks/image.liquid` | image + ratio (d/m), container, height (d/m), overlay, padding | the image is system data (a product photo) |
| Multi-item grid / cards | `sections/featured-collection.liquid` | columns (d/m + custom breakpoints), gap (d/m), grid-vs-carousel, swipe, colour scheme | order/count is data-driven |
| Icon-with-text row (trust badges, feature/benefit list) | `blocks/icon-list.liquid`, `sections/icon-boxes.liquid` | icon upload + size (d/m), gap (d/m), alignment, per-item text typography + colour, padding (d/m), colour scheme | the icon logic is special (geolocation) — then expose the editable bits, keep the logic in code |
| Single custom block with logic (geolocation, calculators) | `blocks/payment-icons-pdp.liquid` pattern | colour scheme + the genuinely editable bits (text, images, sizes); the logic stays in code | always mostly code-driven |
| Accordion / FAQ | `blocks/accordion.liquid` | open behaviour, style (standard/card), icon, heading preset, spacing (d/m), border, colour scheme | rows are data-driven (product specs) |
| Testimonial / review | `sections/testimonials.liquid`, `blocks/_testimonial-slide.liquid` | columns (d/m), gap, carousel, image ratio (d/m), colour scheme | data piped from a reviews app |
| Comparison table | `sections/comparison-table.liquid` | container, colour scheme, border, background image (d/m), padding | column widths (horizontal scroll handles it) |

Golden rule: if a control is visible in the editor and affects layout or styling, expose it; if it is code logic, a data source, or a brand/legal constant, hardcode it and expose only the colour scheme. Pebble's own minimal-by-design examples: payment/geolocation blocks, product cards, and cart/account/search sections.
