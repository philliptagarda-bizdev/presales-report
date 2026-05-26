# Sales Enablement — Project Conventions

This project is a series of **interactive narrated training decks** for the Holiday.com presales team. Adding to or remixing these decks must follow the rules below — they encode user preferences confirmed over many turns and a few painful refactors.

---

## 1. Brand & audience

**Product:** Holiday.com sells **eSIMs / data plans** for international travel. Never call them "bookings," "rooms," "trips," "hotels," or "tickets." The competitor set is **Airalo, Holafly, Saily, Nomad** and similar consumer eSIM brands.

**Audience hierarchy (top → bottom):**
1. **Managers** — strategy
2. **Shift managers** — in-the-moment quality, transcript reviews, coaching
3. **Presales agents** — *the people being trained.* Inbound chat. Sit at the conversion point between exploration and activation.
4. **BAU agents** — day-to-day support flow for existing customers

The training is **for presales agents.** Address them as "you." Reference the other layers where natural (e.g. "shift managers, this is a coaching point"). **Never** use B2B / business-development terms: no "deal," "pipeline," "discovery call," "demo," "AE," "SDR," "MEDDPICC," "SPIN," "Challenger," "quota," "prospect" *as the primary noun* (it's fine inside the Eden narrative). Instead: "customer," "traveller," "chat," "conversation," "purchase," "activation."

---

## 2. Files in this project

| File | Role |
|---|---|
| `Sales Training.html` | The deck. Static slides + activity slides as `<section>` children of `<deck-stage>`. |
| `deck-stage.js` | Starter slide-deck shell — handles scaling, kbd nav, print-to-PDF. Don't edit. |
| `narration.js` | Narration engine. Owns the `<button>` bar (Home / Back / Play / Restart), the base64-encoded scripts, voice locking, auto-advance, activity gating. |
| `activities.js` | Renders interactive activity slides. Looks for `<section data-activity="...">` and inits each kind. Continue button advances deck + resumes narration. |
| `activities.css` | Visual treatment for activity slides (different look from content slides — gold accents, card layout). |
| `assets/image{1..9}.png` | Imagery used on the 9 content slides. |
| `Trainer Notes.html` | **Private trainer notes — never publish.** Mirrors narration content + cues. |
| `Sales Training (bundle source).html` + `Sales Training (standalone).html` | Outputs of "export html". Don't hand-edit the standalone — regenerate via `super_inline_html` when content changes. |

---

## 3. Narration engine — invariants

These are **locked** by user request. Do not expose them as UI controls.

- **Voice:** **American English** — Google US English (Chrome) preferred, with fallbacks for Microsoft Aria/Jenny (Edge), Apple Samantha (macOS), and any en-US voice. Picker in `pickLockedVoice()` in `narration.js`.
- **Speed:** `LOCKED_RATE = 0.90`
- **Total deck runtime target: ~25 minutes max.** Each deck should land at roughly 2700–3000 narrated words across all slides + activities (130 wpm × 22-23 min, with a few minutes buffer for activity time and natural pause overhead). When adding or expanding narration, keep this budget in mind. Per-slide word counts logged in `_S` should land around 250–400 words for content slides; activities 60–100 words.
- **Captions:** off (no on-screen text caption rail)
- **Auto-advance:** on (narration end → next slide), **except** for slides marked `data-noadvance` (see §5)
- **Visible controls only:** Home (⏮), Back (◀), Play/Pause (▶/⏸), Restart slide (↻). No speed slider, voice picker, caption toggle, or forward/skip button.
- **Narration text is base64-encoded** inside `narration.js` `_S` array. **Never** put narration plaintext in:
  - The HTML source
  - The `#speaker-notes` JSON block (it stays an array of empty strings, one per slide, just to satisfy the deck-stage notes API)
  - Anywhere in the DOM
- The decoder (`_dec` / `SCRIPTS` Proxy) feeds strings **straight to SpeechSynthesis** without ever inserting them into the DOM.

---

## 4. Writing narration — voice & pacing rules

The narrator is a senior trainer addressing a room of presales agents.

- **Lots of short sentences.** Each `.` is a TTS pause. Prefer "He used the science. He used the art. Not one. Or the other." over "He used both the science and the art, not one or the other."
- **Commas for breath.** "Welcome, team." not "Welcome team."
- **Em dashes ` — ` for rhetorical breaks.** Most en-GB voices handle them as a held pause.
- **Spell dotted acronyms** the way TTS reads them best: `A.I.`, `R.O.I.`, `F.O.M.O.`, `S.K.U.`, `C.F.O.`, `S.D.R.s`, `B.A.N.T.`, `F.A.Q.` Periods between letters force the engine to spell, not pronounce as a word.
- **Numbers in words.** "Sixty percent" not "60%". "Five dollars" not "$5".
- **Domain in words.** "Holiday dot com" not "Holiday.com" (TTS reads `.com` literally otherwise).
- **No ellipses (`…` / `...`).** Browser TTS handles them inconsistently. Use two short sentences instead.
- **Each script per slide is a single concatenated string** built from sentence fragments joined by spaces. The pattern in code is:
  ```js
  [
    "First fragment.",
    "Second fragment.",
    "Third fragment.",
  ].join(" ")
  ```
- **Sources to cite (already established in this deck):** Forrester CX index, Zendesk CX Trends, Bain & Co consumer service research, Apple Genius Bar / Apple Care, Disney cast-member training, Ritz-Carlton "Three Steps of Service," Pixar story-beat structure, Princeton/Uri Hasson neural mirroring, Stanford consumer-decision pain research, McKinsey CX studies, Kahneman loss aversion, David Maister trust equation, Feel-Felt-Found (Xerox 1970s), Wise customer support reframes. Reuse these — don't invent new ones unless verified.

---

## 5. Slide structure

### Content slides
Each is a `<section>` directly inside `<deck-stage>`, sized 1920×1080. They reproduce the original PPTX layout pixel-by-pixel. Key attributes:

- `class="sN"` where N matches the slide CSS rules in `Sales Training.html` `<style>`
- `data-label="NN Short Name"` — surfaces in comment context
- May have `data-omelette-chrome` / `data-omelette-validate` from deck-stage tagging (auto)

### Activity slides
After (a subset of) content slides. Two per deck is the agreed cadence. Structure:

```html
<section class="activity" data-activity="KIND" data-label="A1 Match the Move">
  <div class="brand">holiday.com</div>
  <div class="activity-root"></div>
</section>
```

- `data-activity="KIND"` — pick a handler in `activities.js` (`match-the-move`, `pledge`, or a new one you write)
- **No `data-noadvance`.** Activities use the same 4-button narration palette as content slides (Home / Back / Play / Restart). Progression happens via natural narration auto-advance — never via a Continue button on the activity itself.
- Activity intro narration should be long enough (~120–180 words, ≈ 60–90 sec at 0.90×) to give the user time to interact before the deck auto-advances. The hint "pause the narration on the right side" should appear in the on-screen instructions for activities that need more time.
- `.activity-root` is where the activity's JS injects its UI.

### Adding a new activity kind
1. Add a `init<Kind>(root)` function in `activities.js`. Use `data-inited` guard.
2. **No Continue button.** Just render the interactive UI + a status/footer area. Auto-advance carries the user forward when the activity narration ends.
3. Reuse the `.act-*` CSS classes in `activities.css` for visual consistency (gold accent `#e8c87a`, rounded cards, big Oswald title). If you need a wildly different shape, add new classes but keep the chrome (`.act-shell`, `.act-eyebrow`, `.act-title`, `.act-sub`, `.act-footer`).
4. Update `narration.js` `_S` with the activity's intro narration at the right index — long enough that auto-advance won't fire mid-interaction.

Two activities the user has approved:
- **Match the Move** — match 4 chat snippets to the 4 anatomy moves (pain / reframe / R.O.I. / F.O.M.O.). Used after Slide 6. No gate; auto-advance via narration.
- **Your Pledge** — three commitment textareas, saves to `localStorage`, prints. Used as the closing slide. No advance needed (it's last).

---

## 6. When adding a new content slide

For each new content slide, **all of these must stay in sync:**
1. New `<section>` in `Sales Training.html` (correct position, class, layout CSS in the head)
2. New entry in `narration.js` `_S` at the same index — base64-encoded, follow §4 voice rules
3. Update `Trainer Notes.html` with the slide's narration + 3 elaboration cues (this file is private; safe to put narration in plaintext)
4. Encode the script via the existing pattern:
   ```js
   const utf8 = new TextEncoder().encode(scriptString);
   let bin = ''; for (const b of utf8) bin += String.fromCharCode(b);
   btoa(bin);  // → base64 entry
   ```

---

## 7. UI control invariants — DO NOT add unless explicitly asked

- ❌ No forward / next-slide skip button on the toolbar (user explicitly removed it — they want presales agents to listen to the full narration, not skip ahead). Activity Continue buttons are the only forward navigation surface.
- ❌ No middle-of-screen deck chrome (prev/next arrows, reset button, slide counter overlay). `narration.js` injects a `<style>` block that hides any `.overlay / .rail / .ctxmenu / .confirm-backdrop` from deck-stage.
- ❌ No "Tweaks" panel for this deck. Style/voice/speed are locked.
- ❌ No speaker-notes UI exposed to the audience.

---

## 8. Re-bundling for distribution

When the user says "export html" or "Save as standalone HTML":
1. Copy `Sales Training.html` → `Sales Training (bundle source).html`
2. Inject the `<template id="__bundler_thumbnail">` block (large dark-bg SVG, two-line bold title) after `<body>`
3. Run `super_inline_html` to produce `Sales Training (standalone).html`
4. Present the standalone file for download

The thumbnail template is required by `super_inline_html`. Pattern:
```html
<template id="__bundler_thumbnail" data-bg-color="#000000">
  <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="800" fill="#000000"/>
    <g fill="#ffffff" font-family="Oswald, Arial, sans-serif" font-weight="700" text-anchor="middle">
      <text x="600" y="380" font-size="120">THE GENESIS</text>
      <text x="600" y="500" font-size="120">OF SALES</text>
    </g>
    <text x="600" y="600" fill="#e8c87a" font-family="Oswald, Arial, sans-serif" font-size="28" letter-spacing="8" text-anchor="middle">TRAINING · LOADING</text>
  </svg>
</template>
```

---

## 9. Project trajectory

The user is building a **series of decks** under the "Sales Enablement" project umbrella. This first deck is "The Genesis of Sales." Future decks (discovery deep-dives, objection clinics, demo storytelling, etc.) should:
- Share the same chrome, narration engine, voice, controls
- Include **two activities each** (one mid-deck reinforcement, one closing pledge or recap)
- Reuse `activities.js` / `activities.css` — extend with new activity kinds rather than re-styling
- Keep the audience and brand framing identical (eSIMs, presales agents, BAU/shift/manager hierarchy)
