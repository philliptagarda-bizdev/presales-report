/* Activity slides for "The Seven Deadly Traits of a Sales Assassin" deck.
 *
 * Same conventions as activities.js: no auto-Continue, the narration palette's
 * Refresh button morphs to a Next-slide button when narration ends. Activities
 * with a completion gate (e.g. SHATTER drill) ALSO expose an internal
 * "Proceed to next slide" button when the user finishes the interaction.
 */

(function () {
  function advance() {
    const deck = document.querySelector('deck-stage');
    if (!deck) return;
    const next = (typeof deck.index === 'number' ? deck.index + 1 : 0);
    const slides = deck.children ? [...deck.children].filter(el => el.tagName === 'SECTION') : [];
    if (next >= slides.length) return;
    if (typeof deck.goTo === 'function') deck.goTo(next);
    setTimeout(() => {
      if (window.__narration && typeof window.__narration.play === 'function') {
        window.__narration.play();
      }
    }, 300);
  }

  // ============================================================
  // Activity A — SHATTER Drill (match 4 frameworks to 4 traits)
  // ============================================================
  function initShatterDrill(root) {
    if (!root || root.dataset.inited) return;
    root.dataset.inited = '1';

    const TRAITS = [
      { id: 'comm',  label: 'Communication',           hint: 'Clearing the smoke for the customer' },
      { id: 'pers',  label: 'Persistence & Resilience', hint: 'Enduring \u201cno\u201d on volume' },
      { id: 'emp',   label: 'Empathy',                  hint: 'Solving problems, not selling product' },
      { id: 'prod',  label: 'Product Knowledge',        hint: 'Anticipating friction before it lands' },
    ];

    const FRAMES = [
      { id: 'clear',   label: 'C.L.E.A.R.',     answer: 'comm',  blurb: 'Connect. Listen. Explain. Adapt. Resolve.' },
      { id: 'shatter', label: 'S.H.A.T.T.E.R.', answer: 'pers',  blurb: 'Reject takes a callus. Build one.' },
      { id: 'slot',    label: 'S.L.O.T.',       answer: 'emp',   blurb: 'Solve, not Sell. Look. Orient. Tailor.' },
      { id: 'ace',     label: 'A.C.E.',         answer: 'prod',  blurb: 'Anticipate. Command. Earn confidence.' },
    ];

    let selected = null;
    const pairs = {};

    root.innerHTML = `
      <div class="act-shell act-red">
        <div class="act-eyebrow act-eyebrow--red">Activity \u2014 lock the frameworks in</div>
        <h2 class="act-title">SHATTER Drill</h2>
        <p class="act-sub">Each trait has a framework that operationalises it. Tap a framework, then tap the trait it serves. Match all four to complete the drill.</p>

        <div class="act-board">
          <div class="act-col">
            <div class="act-col-h">Frameworks</div>
            <div class="act-snippets">
              ${FRAMES.map(f => `
                <button class="act-snip" data-snip="${f.id}" data-answer="${f.answer}">
                  <span class="act-snip-text"><strong class="act-frame-label">${f.label}</strong> &mdash; ${f.blurb}</span>
                  <span class="act-snip-tag" data-tag="${f.id}">unpaired</span>
                </button>
              `).join('')}
            </div>
          </div>
          <div class="act-col">
            <div class="act-col-h">Traits</div>
            <div class="act-moves">
              ${TRAITS.map(t => `
                <button class="act-move" data-move="${t.id}">
                  <span class="act-move-label">${t.label}</span>
                  <span class="act-move-hint">${t.hint}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="act-footer">
          <div class="act-status" data-status>Pick a framework to begin.</div>
          <button class="act-continue act-continue--red" data-proceed hidden>Proceed to next slide &rarr;</button>
        </div>
      </div>
    `;

    const snipBtns = root.querySelectorAll('.act-snip');
    const moveBtns = root.querySelectorAll('.act-move');
    const status   = root.querySelector('[data-status]');
    const proceed  = root.querySelector('[data-proceed]');

    proceed.addEventListener('click', () => advance());

    snipBtns.forEach(btn => btn.addEventListener('click', () => {
      if (btn.classList.contains('is-correct')) return;
      snipBtns.forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      selected = btn;
      status.textContent = 'Now tap the trait this framework serves.';
    }));

    moveBtns.forEach(btn => btn.addEventListener('click', () => {
      if (!selected) {
        status.textContent = 'Pick a framework first.';
        return;
      }
      const want = selected.dataset.answer;
      const got = btn.dataset.move;
      const tag = selected.querySelector('.act-snip-tag');
      const traitLabel = btn.querySelector('.act-move-label').textContent;
      if (want === got) {
        selected.classList.remove('is-selected');
        selected.classList.add('is-correct');
        tag.textContent = traitLabel;
        tag.classList.add('is-correct');
        pairs[selected.dataset.snip] = got;
        selected = null;
        const remaining = FRAMES.length - Object.keys(pairs).length;
        if (remaining === 0) {
          status.textContent = 'All four locked in. The arsenal is yours.';
          status.classList.add('is-success');
          proceed.hidden = false;
          proceed.classList.add('is-ready');
          requestAnimationFrame(() => proceed.classList.add('is-pulse'));
        } else {
          status.textContent = `Locked. ${remaining} to go.`;
        }
      } else {
        const wrong = selected;
        wrong.classList.remove('is-selected');
        wrong.classList.add('is-wrong');
        tag.textContent = 'try again';
        setTimeout(() => {
          wrong.classList.remove('is-wrong');
          if (tag) tag.textContent = 'unpaired';
        }, 900);
        selected = null;
        status.textContent = 'Not quite \u2014 try a different pairing.';
      }
    }));
  }

  // ============================================================
  // Activity B — Assassin Code Pledge (closing)
  // ============================================================
  function initAssassinPledge(root) {
    if (!root || root.dataset.inited) return;
    root.dataset.inited = '1';

    const STORAGE_KEY = 'holiday.assassin.pledge.v1';
    const saved = (() => {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) { return {}; }
    })();
    const startedFull = !!(saved.q1 && saved.q2 && saved.q3);

    root.innerHTML = `
      <div class="act-shell act-red">
        <div class="act-eyebrow act-eyebrow--red">Closing activity \u2014 sign the code</div>
        <h2 class="act-title">My Assassin Code</h2>
        <p class="act-sub">Three sharp lines. The act of writing them down is what turns the lesson into muscle memory.</p>

        <div class="act-pledge">
          <label class="act-pledge-row">
            <span class="act-pledge-n act-pledge-n--red">01</span>
            <span class="act-pledge-label">The trait I will sharpen this week (Communication, Persistence, Empathy, Product Knowledge, Adaptability, Attitude, or Time):</span>
            <textarea data-field="q1" rows="2" placeholder="e.g. Empathy. Solve, don\u2019t sell&hellip;">${saved.q1 || ''}</textarea>
          </label>
          <label class="act-pledge-row">
            <span class="act-pledge-n act-pledge-n--red">02</span>
            <span class="act-pledge-label">The framework I will deploy on my very next chat (C.L.E.A.R., S.H.A.T.T.E.R., S.L.O.T., A.C.E., V.A.R.Y., F.U.S.E., or E.D.G.E.):</span>
            <textarea data-field="q2" rows="2" placeholder="e.g. S.L.O.T. on the next hesitating customer&hellip;">${saved.q2 || ''}</textarea>
          </label>
          <label class="act-pledge-row">
            <span class="act-pledge-n act-pledge-n--red">03</span>
            <span class="act-pledge-label">My assassin alias \u2014 what I\u2019m naming this sharper version of me:</span>
            <textarea data-field="q3" rows="2" placeholder="e.g. The Maple-Tongue \u2014 quiet, precise, doesn\u2019t miss&hellip;">${saved.q3 || ''}</textarea>
          </label>
        </div>

        <div class="act-footer">
          <div class="act-status" data-status>${startedFull ? 'Saved earlier \u2014 update any time.' : 'Fill all three to sign.'}</div>
          <div class="act-pledge-actions">
            <button class="act-secondary" data-clear>Clear</button>
            <button class="act-secondary" data-print>Print code</button>
            <button class="act-continue act-continue--red ${startedFull ? 'is-ready' : ''}" data-save ${startedFull ? '' : 'disabled'}>${startedFull ? 'Update my code' : 'Sign my code'}</button>
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
      status.textContent = ok ? 'Ready to sign.' : 'Fill all three to sign.';
    }
    fields.forEach(f => f.addEventListener('input', refresh));
    refresh();

    saveBtn.addEventListener('click', () => {
      const s = readState();
      if (!isComplete(s)) return;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
      status.textContent = 'Signed. The code is yours.';
      status.classList.add('is-success');
      saveBtn.textContent = 'Signed \u2713';
      saveBtn.classList.add('is-saved');
      const shell = root.querySelector('.act-shell');
      shell.classList.add('is-pulse');
      setTimeout(() => {
        shell.classList.remove('is-pulse');
        saveBtn.textContent = 'Update my code';
        saveBtn.classList.remove('is-saved');
      }, 1800);
    });

    clearBtn.addEventListener('click', () => {
      if (!confirm('Clear your code?')) return;
      fields.forEach(f => f.value = '');
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      saveBtn.textContent = 'Sign my code';
      saveBtn.classList.remove('is-saved');
      status.classList.remove('is-success');
      refresh();
    });

    printBtn.addEventListener('click', () => {
      const s = readState();
      const safe = v => (v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const html = `<!doctype html>
<html><head><title>My Assassin Code \u2014 Holiday.com</title>
<style>
  body { font-family: Georgia, serif; max-width: 640px; margin: 60px auto; padding: 40px; color: #111; }
  h1 { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px; }
  .sub { color: #666; margin-bottom: 40px; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; }
  .row { margin-bottom: 32px; }
  .n { font-family: 'Oswald', sans-serif; font-weight: 700; color: #c8252a; letter-spacing: 0.14em; font-size: 12px; }
  .val { border-left: 3px solid #c8252a; padding: 4px 0 4px 14px; font-size: 18px; line-height: 1.5; }
  .sig { margin-top: 60px; font-size: 12px; color: #666; }
</style></head>
<body>
  <h1>My Assassin Code</h1>
  <div class="sub">Holiday.com \u00b7 The Seven Deadly Traits</div>
  <div class="row"><div class="n">01 \u00b7 Trait I will sharpen this week</div><div class="val">${safe(s.q1)}</div></div>
  <div class="row"><div class="n">02 \u00b7 Framework I will deploy</div><div class="val">${safe(s.q2)}</div></div>
  <div class="row"><div class="n">03 \u00b7 My assassin alias</div><div class="val">${safe(s.q3)}</div></div>
  <div class="sig">Signed: ____________________ \u00b7 Date: ____________________</div>
  <script>setTimeout(function(){ window.print(); }, 200);<\/script>
</body></html>`;
      const w = window.open('', '_blank');
      if (w) { w.document.write(html); w.document.close(); }
    });
  }

  
  // ============================================================
  // Slide 14 — Share Your Alias (alias-share activity)
  // ============================================================
  function initAliasShare(root) {
    if (!root || root.dataset.inited) return;
    root.dataset.inited = '1';

    const STORAGE_KEY = 'holiday.alias.share.v1';
    const saved = (() => {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) { return {}; }
    })();
    const startedFull = !!(saved.q1 && saved.q2 && saved.q3);

    root.innerHTML = `
      <div class="act-shell act-red">
        <div class="act-eyebrow act-eyebrow--red">Share with the team</div>
        <h2 class="act-title">Three lines &mdash; one by one</h2>
        <p class="act-sub">Write your alias and what the assessment captured. When the team goes around the room, this is what you'll share.</p>

        <div class="act-pledge">
          <label class="act-pledge-row">
            <span class="act-pledge-n act-pledge-n--red">01</span>
            <span class="act-pledge-label">My assassin alias from the assessment:</span>
            <textarea data-field="q1" rows="2" placeholder="e.g. The White-Nosed Coatimundi&hellip;">${saved.q1 || ''}</textarea>
          </label>
          <label class="act-pledge-row">
            <span class="act-pledge-n act-pledge-n--red">02</span>
            <span class="act-pledge-label">One strength the result captured about me:</span>
            <textarea data-field="q2" rows="2" placeholder="e.g. Pattern recognition under pressure&hellip;">${saved.q2 || ''}</textarea>
          </label>
          <label class="act-pledge-row">
            <span class="act-pledge-n act-pledge-n--red">03</span>
            <span class="act-pledge-label">One trait I will sharpen this quarter:</span>
            <textarea data-field="q3" rows="2" placeholder="e.g. Empathy — listening past the literal words&hellip;">${saved.q3 || ''}</textarea>
          </label>
        </div>

        <div class="act-footer">
          <div class="act-status" data-status>${startedFull ? 'Saved earlier — update any time.' : 'Fill all three to save.'}</div>
          <div class="act-pledge-actions">
            <button class="act-secondary" data-clear>Clear</button>
            <button class="act-secondary" data-print>Print</button>
            <button class="act-continue act-continue--red ${startedFull ? 'is-ready' : ''}" data-save ${startedFull ? '' : 'disabled'}>${startedFull ? 'Update' : 'Save'}</button>
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
      status.textContent = 'Saved. Ready when you are.';
      status.classList.add('is-success');
      saveBtn.textContent = 'Saved ✓';
      saveBtn.classList.add('is-saved');
      const shell = root.querySelector('.act-shell');
      shell.classList.add('is-pulse');
      setTimeout(() => {
        shell.classList.remove('is-pulse');
        saveBtn.textContent = 'Update';
        saveBtn.classList.remove('is-saved');
      }, 1600);
    });

    clearBtn.addEventListener('click', () => {
      if (!confirm('Clear your alias notes?')) return;
      fields.forEach(f => f.value = '');
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      saveBtn.textContent = 'Save';
      saveBtn.classList.remove('is-saved');
      status.classList.remove('is-success');
      refresh();
    });

    printBtn.addEventListener('click', () => {
      const s = readState();
      const safe = v => (v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const html = `<!doctype html><html><head><title>My Assassin Alias — Holiday.com</title>
<style>
  body { font-family: Georgia, serif; max-width: 640px; margin: 60px auto; padding: 40px; color: #111; }
  h1 { font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px; }
  .sub { color: #666; margin-bottom: 40px; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; }
  .row { margin-bottom: 32px; }
  .n { font-family: 'Oswald', sans-serif; font-weight: 700; color: #c8252a; letter-spacing: 0.14em; font-size: 12px; }
  .val { border-left: 3px solid #c8252a; padding: 4px 0 4px 14px; font-size: 18px; line-height: 1.5; }
</style></head><body>
  <h1>My Assassin Alias</h1>
  <div class="sub">Holiday.com · The Seven Deadly Traits</div>
  <div class="row"><div class="n">01 · Alias from the assessment</div><div class="val">${safe(s.q1)}</div></div>
  <div class="row"><div class="n">02 · Strength the result captured</div><div class="val">${safe(s.q2)}</div></div>
  <div class="row"><div class="n">03 · Trait I will sharpen this quarter</div><div class="val">${safe(s.q3)}</div></div>
  <script>setTimeout(function(){ window.print(); }, 200);<\/script>
</body></html>`;
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
      if (kind === 'alias-share') initAliasShare(root);
      else if (kind === 'shatter-drill') initShatterDrill(root);
      else if (kind === 'assassin-pledge') initAssassinPledge(root);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
