/* Presale Chat & Ticket Flow — Activity slides.
 *
 * Two activities, matching the project's activity contract:
 *  - "order-the-flow"  (mid-deck reinforcement; carries data-noadvance, has a Proceed button)
 *  - "pledge-flow"     (closing commitment; last slide, no Proceed button)
 *
 * Reuses the .act-* visual language from activities.css; a few slot-specific
 * classes are defined in the deck's own <style> block so activities.css stays shared/untouched.
 */

(function () {
  // Shared advance helper — used by the Proceed button on completed activities.
  function advance() {
    const deck = document.querySelector('deck-stage');
    if (!deck) return;
    const next = (typeof deck.index === 'number' ? deck.index + 1 : 0);
    const total = deck.children ? [...deck.children].filter(el => el.tagName === 'SECTION').length : 999;
    if (next >= total) return;
    if (typeof deck.goTo === 'function') deck.goTo(next);
    setTimeout(() => {
      if (window.__narration && typeof window.__narration.play === 'function') {
        window.__narration.play();
      }
    }, 300);
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ============================================================
  // Activity 1 — Order the Flow
  // ============================================================
  function initOrderTheFlow(root) {
    if (!root || root.dataset.inited) return;
    root.dataset.inited = '1';

    const STAGES = [
      { n: 1, label: 'Greeting & Acknowledgement' },
      { n: 2, label: 'Promotion & Expectations' },
      { n: 3, label: 'Discovery / Probing Questions' },
      { n: 4, label: 'Recommend the Best Plan' },
      { n: 5, label: 'Highlight Key Benefits' },
      { n: 6, label: 'Guide the Customer to Purchase' },
      { n: 7, label: 'Offer Continued Support' },
      { n: 8, label: 'Close the Interaction' },
    ];

    // Ensure the shuffled pool isn't already in order.
    let pool = shuffle(STAGES);
    let tries = 0;
    while (tries++ < 20 && pool.every((s, i) => s.n === i + 1)) pool = shuffle(STAGES);

    root.innerHTML = `
      <div class="act-shell">
        <div class="act-eyebrow">Activity — lock it in</div>
        <h2 class="act-title">Order the Flow</h2>
        <p class="act-sub">Tap a stage, then tap the slot where it belongs — first hello to final close. Wrong spots gently shake. No timer; pause the narration on the right if you need more time.</p>

        <div class="act-board">
          <div class="act-col">
            <div class="act-col-h">Stages (shuffled)</div>
            <div class="act-snippets" data-pool>
              ${pool.map(s => `
                <button class="act-snip flow-chip" data-correct="${s.n}">
                  <span class="act-snip-text">${s.label}</span>
                </button>
              `).join('')}
            </div>
          </div>
          <div class="act-col">
            <div class="act-col-h">The flow, in order</div>
            <div class="act-snippets" data-slots>
              ${STAGES.map(s => `
                <div class="flow-slot" data-slot="${s.n}">
                  <span class="flow-slot-n">${s.n}</span>
                  <span class="flow-slot-label" data-label>—</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="act-footer">
          <div class="act-status" data-status>Tap a stage to begin.</div>
          <button class="act-continue" data-proceed hidden>Proceed to next slide →</button>
        </div>
      </div>
    `;

    const status = root.querySelector('[data-status]');
    const proceedBtn = root.querySelector('[data-proceed]');
    const chips = () => Array.from(root.querySelectorAll('.flow-chip:not(.is-placed)'));
    let selected = null;
    let placed = 0;

    proceedBtn.addEventListener('click', () => advance());

    root.querySelectorAll('.flow-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (chip.classList.contains('is-placed')) return;
        chips().forEach(c => c.classList.remove('is-selected'));
        chip.classList.add('is-selected');
        selected = chip;
        status.textContent = 'Now tap the slot where it belongs.';
      });
    });

    root.querySelectorAll('.flow-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        if (slot.classList.contains('is-filled')) return;
        if (!selected) { status.textContent = 'Pick a stage first.'; return; }
        const want = selected.dataset.correct;
        const got = slot.dataset.slot;
        if (want === got) {
          slot.classList.add('is-filled');
          slot.querySelector('[data-label]').textContent =
            selected.querySelector('.act-snip-text').textContent;
          selected.classList.add('is-placed');
          selected.classList.remove('is-selected');
          selected = null;
          placed++;
          if (placed === 8) {
            status.textContent = 'All eight, in order. Beautifully done.';
            status.classList.add('is-success');
            proceedBtn.hidden = false;
            proceedBtn.classList.add('is-ready');
            requestAnimationFrame(() => proceedBtn.classList.add('is-pulse'));
          } else {
            status.textContent = `Placed. ${8 - placed} to go.`;
          }
        } else {
          const wrong = selected;
          wrong.classList.add('is-wrong');
          slot.classList.add('flow-slot--shake');
          setTimeout(() => {
            wrong.classList.remove('is-wrong');
            slot.classList.remove('flow-slot--shake');
          }, 500);
          status.textContent = 'Not in that position — try again.';
        }
      });
    });
  }

  // ============================================================
  // Activity 2 — Your Pledge (last slide; no forward navigation needed)
  // ============================================================
  function initPledgeFlow(root) {
    if (!root || root.dataset.inited) return;
    root.dataset.inited = '1';

    const STORAGE_KEY = 'holiday.pledge.flow.v1';
    const saved = (() => {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) { return {}; }
    })();
    const startedFull = !!(saved.q1 && saved.q2 && saved.q3);

    root.innerHTML = `
      <div class="act-shell">
        <div class="act-eyebrow">Closing activity — your pledge</div>
        <h2 class="act-title">Three Commitments</h2>
        <p class="act-sub">Type each one. The act of writing them down dramatically increases the chance you do them.</p>

        <div class="act-pledge">
          <label class="act-pledge-row">
            <span class="act-pledge-n">01</span>
            <span class="act-pledge-label">The first discovery question I’ll ask on my next presale chat:</span>
            <textarea data-field="q1" rows="2" placeholder="e.g. Which country are you travelling to, and how long for?">${saved.q1 || ''}</textarea>
          </label>
          <label class="act-pledge-row">
            <span class="act-pledge-n">02</span>
            <span class="act-pledge-label">The one feature I’ll lead with for a nervous first-time traveller:</span>
            <textarea data-field="q2" rows="2" placeholder="e.g. the 6-month refund policy on unused plans&hellip;">${saved.q2 || ''}</textarea>
          </label>
          <label class="act-pledge-row">
            <span class="act-pledge-n">03</span>
            <span class="act-pledge-label">The presales peer I’ll trade transcripts with this week:</span>
            <textarea data-field="q3" rows="2" placeholder="Their name&hellip;">${saved.q3 || ''}</textarea>
          </label>
        </div>

        <div class="act-footer">
          <div class="act-status" data-status>${startedFull ? 'Saved earlier — update any time.' : 'Fill all three to save.'}</div>
          <div class="act-pledge-actions">
            <button class="act-secondary" data-clear>Clear</button>
            <button class="act-secondary" data-print>Print pledge</button>
            <button class="act-continue ${startedFull ? 'is-ready' : ''}" data-save ${startedFull ? '' : 'disabled'}>${startedFull ? 'Update pledge' : 'Save my pledge'}</button>
          </div>
        </div>
      </div>
    `;

    const fields = root.querySelectorAll('textarea[data-field]');
    const status = root.querySelector('[data-status]');
    const saveBtn = root.querySelector('[data-save]');
    const clearBtn = root.querySelector('[data-clear]');
    const printBtn = root.querySelector('[data-print]');

    function readState() {
      const out = {};
      fields.forEach(f => { out[f.dataset.field] = f.value.trim(); });
      return out;
    }
    function isComplete(s) { return !!(s.q1 && s.q2 && s.q3); }
    function refresh() {
      const s = readState();
      const ok = isComplete(s);
      saveBtn.disabled = !ok;
      saveBtn.classList.toggle('is-ready', ok);
      if (saveBtn.classList.contains('is-saved')) return;
      status.textContent = ok ? 'Ready to save.' : 'Fill all three to save.';
    }

    fields.forEach(f => f.addEventListener('input', refresh));
    refresh();

    saveBtn.addEventListener('click', () => {
      const s = readState();
      if (!isComplete(s)) return;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
      status.textContent = 'Saved. Thank you, team.';
      status.classList.add('is-success');
      saveBtn.textContent = 'Saved ✓';
      saveBtn.classList.add('is-saved');
      const shell = root.querySelector('.act-shell');
      shell.classList.add('is-pulse');
      setTimeout(() => {
        shell.classList.remove('is-pulse');
        saveBtn.textContent = 'Update pledge';
        saveBtn.classList.remove('is-saved');
      }, 1800);
    });

    clearBtn.addEventListener('click', () => {
      if (!confirm('Clear your pledge?')) return;
      fields.forEach(f => f.value = '');
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      saveBtn.textContent = 'Save my pledge';
      saveBtn.classList.remove('is-saved');
      status.classList.remove('is-success');
      refresh();
    });

    printBtn.addEventListener('click', () => {
      const s = readState();
      const safe = v => (v || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const html = `<!doctype html>
<html>
<head>
  <title>My Holiday.com Presale Flow Pledge</title>
  <style>
    body { font-family: Georgia, serif; max-width: 640px; margin: 60px auto; padding: 40px; color: #111; }
    h1 { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px; }
    .sub { color: #666; margin-bottom: 40px; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; }
    .row { margin-bottom: 32px; }
    .n { font-family: 'Oswald', sans-serif; font-weight: 700; color: #b08a2e; letter-spacing: 0.14em; font-size: 12px; }
    .label { font-weight: 600; margin: 6px 0 8px; }
    .val { border-left: 3px solid #b08a2e; padding: 4px 0 4px 14px; font-size: 18px; line-height: 1.5; }
    .sig { margin-top: 60px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <h1>My Presale Flow Pledge</h1>
  <div class="sub">Holiday.com · Presale Chat &amp; Ticket Flow</div>
  <div class="row"><div class="n">01 · First discovery question on my next chat</div><div class="val">${safe(s.q1)}</div></div>
  <div class="row"><div class="n">02 · Feature I’ll lead with for a nervous traveller</div><div class="val">${safe(s.q2)}</div></div>
  <div class="row"><div class="n">03 · Peer I’ll trade transcripts with</div><div class="val">${safe(s.q3)}</div></div>
  <div class="sig">Signed: ____________________ · Date: ____________________</div>
  <script>setTimeout(function(){ window.print(); }, 200);<\/script>
</body>
</html>`;
      const w = window.open('', '_blank');
      if (w) { w.document.write(html); w.document.close(); }
    });
  }

  // ============================================================
  // Bootstrap
  // ============================================================
  function boot() {
    document.querySelectorAll('[data-activity]').forEach(section => {
      const kind = section.dataset.activity;
      const r = section.querySelector('.activity-root');
      if (!r) return;
      if (kind === 'order-the-flow') initOrderTheFlow(r);
      else if (kind === 'pledge-flow') initPledgeFlow(r);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
