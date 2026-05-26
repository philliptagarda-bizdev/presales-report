/* Activity slides — interactive retention exercises.
 *
 * Activities do NOT auto-advance. The user advances by completing the activity,
 * which reveals a “Proceed to next slide” button in the footer.
 * The Pledge activity is the last slide of the deck — no proceed button there.
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
  // ============================================================
  // Activity 1 — Match the Move
  // ============================================================
  function initMatchTheMove(root) {
    if (!root || root.dataset.inited) return;
    root.dataset.inited = '1';

    const MOVES = [
      { id: 'pain',   label: 'Pain Point',                hint: 'Naming a gap the customer feels' },
      { id: 'reframe',label: 'Objection Reframe',          hint: 'Turning a fear into an upside' },
      { id: 'roi',    label: 'R.O.I. of Transformation',   hint: 'Cost of the problem, not the solution' },
      { id: 'fomo',   label: 'F.O.M.O.',                    hint: 'Genuine urgency from real facts' },
    ];

    const SNIPPETS = [
      { id: 's1', text: '"You\u2019ve told me your last trip had no maps in the taxi \u2014 that\u2019s exactly why we built this."', answer: 'pain' },
      { id: 's2', text: '"Most travellers we help spend twenty dollars on a single roaming day \u2014 our plan is five for the whole trip."', answer: 'roi' },
      { id: 's3', text: '"You\u2019re right that paying upfront feels odd \u2014 but think of it as buying back peace of mind, not data."', answer: 'reframe' },
      { id: 's4', text: '"Activation usually takes around fifteen minutes \u2014 and your flight is in ninety, so let\u2019s lock it in now."', answer: 'fomo' },
    ];

    let selectedSnippet = null;
    const pairs = {}; // snippetId -> moveId

    root.innerHTML = `
      <div class="act-shell">
        <div class="act-eyebrow">Activity \u2014 lock it in</div>
        <h2 class="act-title">Match the Move</h2>
        <p class="act-sub">Tap a chat line, then tap the move it demonstrates. There\u2019s no pressure \u2014 pause the narration on the right if you need more time.</p>

        <div class="act-board">
          <div class="act-col">
            <div class="act-col-h">Chat snippets</div>
            <div class="act-snippets">
              ${SNIPPETS.map(s => `
                <button class="act-snip" data-snip="${s.id}" data-answer="${s.answer}">
                  <span class="act-snip-text">${s.text}</span>
                  <span class="act-snip-tag" data-tag="${s.id}">unpaired</span>
                </button>
              `).join('')}
            </div>
          </div>
          <div class="act-col">
            <div class="act-col-h">Moves</div>
            <div class="act-moves">
              ${MOVES.map(m => `
                <button class="act-move" data-move="${m.id}">
                  <span class="act-move-label">${m.label}</span>
                  <span class="act-move-hint">${m.hint}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="act-footer">
          <div class="act-status" data-status>Pick a chat snippet to begin.</div>
          <button class="act-continue" data-proceed hidden>Proceed to next slide →</button>
        </div>
      </div>
    `;

    const snipBtns = root.querySelectorAll('.act-snip');
    const moveBtns = root.querySelectorAll('.act-move');
    const status = root.querySelector('[data-status]');
    const proceedBtn = root.querySelector('[data-proceed]');

    proceedBtn.addEventListener('click', () => advance());

    snipBtns.forEach(btn => btn.addEventListener('click', () => {
      if (btn.classList.contains('is-correct')) return;
      snipBtns.forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      selectedSnippet = btn;
      status.textContent = 'Now tap the move that fits.';
    }));

    moveBtns.forEach(btn => btn.addEventListener('click', () => {
      if (!selectedSnippet) {
        status.textContent = 'Pick a chat snippet first.';
        return;
      }
      const want = selectedSnippet.dataset.answer;
      const got = btn.dataset.move;
      const tag = selectedSnippet.querySelector('.act-snip-tag');
      const moveLabel = btn.querySelector('.act-move-label').textContent;
      if (want === got) {
        selectedSnippet.classList.remove('is-selected');
        selectedSnippet.classList.add('is-correct');
        tag.textContent = moveLabel;
        tag.classList.add('is-correct');
        pairs[selectedSnippet.dataset.snip] = got;
        selectedSnippet = null;
        const remaining = SNIPPETS.length - Object.keys(pairs).length;
        if (remaining === 0) {
          status.textContent = 'All four matched. Beautifully done.';
          status.classList.add('is-success');
          proceedBtn.hidden = false;
          proceedBtn.classList.add('is-ready');
          requestAnimationFrame(() => proceedBtn.classList.add('is-pulse'));
        } else {
          status.textContent = `Matched. ${remaining} to go.`;
        }
      } else {
        selectedSnippet.classList.remove('is-selected');
        selectedSnippet.classList.add('is-wrong');
        tag.textContent = 'try again';
        const wrongSnippet = selectedSnippet;
        setTimeout(() => {
          wrongSnippet && wrongSnippet.classList.remove('is-wrong');
          if (tag) tag.textContent = 'unpaired';
        }, 900);
        selectedSnippet = null;
        status.textContent = 'Not quite \u2014 try a different pairing.';
      }
    }));
  }

  // ============================================================
  // Activity 2 — Your Pledge (last slide; no forward navigation needed)
  // ============================================================
  function initPledge(root) {
    if (!root || root.dataset.inited) return;
    root.dataset.inited = '1';

    const STORAGE_KEY = 'holiday.pledge.v1';
    const saved = (() => {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) { return {}; }
    })();
    const startedFull = !!(saved.q1 && saved.q2 && saved.q3);

    root.innerHTML = `
      <div class="act-shell">
        <div class="act-eyebrow">Closing activity \u2014 your pledge</div>
        <h2 class="act-title">Three Commitments</h2>
        <p class="act-sub">Type each one. The act of writing them down dramatically increases the chance you do them.</p>

        <div class="act-pledge">
          <label class="act-pledge-row">
            <span class="act-pledge-n">01</span>
            <span class="act-pledge-label">One open question I will ask on my very next chat:</span>
            <textarea data-field="q1" rows="2" placeholder="e.g. Tell me about the trip you\u2019re planning&hellip;">${saved.q1 || ''}</textarea>
          </label>
          <label class="act-pledge-row">
            <span class="act-pledge-n">02</span>
            <span class="act-pledge-label">One abandoned chat I will rewrite using today\u2019s framework:</span>
            <textarea data-field="q2" rows="2" placeholder="Customer, date, or topic of the chat&hellip;">${saved.q2 || ''}</textarea>
          </label>
          <label class="act-pledge-row">
            <span class="act-pledge-n">03</span>
            <span class="act-pledge-label">The presales peer I will trade transcripts with this week:</span>
            <textarea data-field="q3" rows="2" placeholder="Their name&hellip;">${saved.q3 || ''}</textarea>
          </label>
        </div>

        <div class="act-footer">
          <div class="act-status" data-status>${startedFull ? 'Saved earlier \u2014 update any time.' : 'Fill all three to save.'}</div>
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
      if (saveBtn.classList.contains('is-saved')) {
        // user has saved at least once; keep showing "Update pledge" + ready styling
        return;
      }
      if (ok) status.textContent = 'Ready to save.';
      else status.textContent = 'Fill all three to save.';
    }

    fields.forEach(f => f.addEventListener('input', refresh));
    refresh();

    saveBtn.addEventListener('click', () => {
      const s = readState();
      if (!isComplete(s)) return;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
      status.textContent = 'Saved. Thank you, team.';
      status.classList.add('is-success');
      saveBtn.textContent = 'Saved \u2713';
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
  <title>My Holiday.com Presales Pledge</title>
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
  <h1>My Presales Pledge</h1>
  <div class="sub">Holiday.com \u00b7 The Genesis of Sales</div>
  <div class="row"><div class="n">01 \u00b7 Open question I will ask on my next chat</div><div class="val">${safe(s.q1)}</div></div>
  <div class="row"><div class="n">02 \u00b7 Abandoned chat I will rewrite</div><div class="val">${safe(s.q2)}</div></div>
  <div class="row"><div class="n">03 \u00b7 Peer I will trade transcripts with</div><div class="val">${safe(s.q3)}</div></div>
  <div class="sig">Signed: ____________________ \u00b7 Date: ____________________</div>
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
      const root = section.querySelector('.activity-root');
      if (!root) return;
      if (kind === 'match-the-move') initMatchTheMove(root);
      else if (kind === 'pledge') initPledge(root);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
