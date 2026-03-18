/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║       PARENTWISE — DESIGN SYSTEM JAVASCRIPT · v2.3                  ║
 * ║       Companion to parentwise-design-system.css                     ║
 * ║                                                                      ║
 * ║  FEATURES:                                                           ║
 * ║    1. Dark / Light mode toggle  (toggleMode)                        ║
 * ║    2. Scroll-triggered fade-up  (IntersectionObserver)              ║
 * ║    3. Download menu             (toggleDownloadMenu)                ║
 * ║    4. Markdown reference export (downloadMarkdown)                  ║
 * ║                                                                      ║
 * ║  USAGE:                                                              ║
 * ║    <script src="parentwise-design-system.js"></script>               ║
 * ║    Place before </body>. Requires parentwise-design-system.css.      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

(function () {
  'use strict';

  /* ════════════════════════════════════════════════════════════════════
     1. DARK / LIGHT MODE TOGGLE
        Reads / writes data-mode="dark"|"light" on <html>.
        Updates toggle icon (#t-ic) and label (#t-lb) if present.
        All CSS tokens update via custom property cascade automatically.
     ════════════════════════════════════════════════════════════════════ */
  window.toggleMode = function () {
    var html = document.documentElement;
    var isDark = html.getAttribute('data-mode') === 'dark';
    html.setAttribute('data-mode', isDark ? 'light' : 'dark');

    var icon  = document.getElementById('t-ic');
    var label = document.getElementById('t-lb');
    if (icon)  icon.textContent  = isDark ? '☀️' : '🌙';
    if (label) label.textContent = isDark ? 'Light' : 'Dark';
  };

  /* ════════════════════════════════════════════════════════════════════
     2. SCROLL-TRIGGERED FADE-UP ANIMATION
        Adds class .pw-visible to elements that carry .pw-fade-up
        once they enter the viewport. CSS handles the transition.

        To use on any element:
          <div class="pw-fade-up">Your content</div>
     ════════════════════════════════════════════════════════════════════ */
  function initScrollReveal() {
    var targets = document.querySelectorAll('.pw-fade-up');
    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('pw-visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ════════════════════════════════════════════════════════════════════
     3. DOWNLOAD MENU TOGGLE
        Controls the dropdown on .dl-wrap / #dlDrop.

        HTML structure:
          <div class="dl-wrap">
            <button class="dl-btn" onclick="toggleDownloadMenu(event)">
              Download
            </button>
            <div class="dl-drop" id="dlDrop">
              <button class="dl-item" onclick="downloadMarkdown('dark')">🌙 Dark</button>
              <button class="dl-item" onclick="downloadMarkdown('light')">☀️ Light</button>
            </div>
          </div>
     ════════════════════════════════════════════════════════════════════ */
  window.toggleDownloadMenu = function (e) {
    e.stopPropagation();
    var drop = document.getElementById('dlDrop');
    if (drop) drop.classList.toggle('open');
  };

  function closeDownloadMenu() {
    var drop = document.getElementById('dlDrop');
    if (drop) drop.classList.remove('open');
  }

  /* Close dropdown on click outside */
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.dl-wrap')) {
      closeDownloadMenu();
    }
  });

  /* ════════════════════════════════════════════════════════════════════
     4. MARKDOWN REFERENCE EXPORT
        Generates a complete brand reference Markdown file with all
        tokens for the chosen mode and triggers a browser download.

        window.downloadMarkdown('dark')
        window.downloadMarkdown('light')
     ════════════════════════════════════════════════════════════════════ */
  window.downloadMarkdown = function (mode) {
    var md   = generateMarkdown(mode);
    var blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href     = url;
    a.download = 'parentwise-brand-reference-' + mode + '-mode.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    closeDownloadMenu();
  };

  /* ────────────────────────────────────────────────────────────────────
     MARKDOWN GENERATOR — full brand token tables for chosen mode
     ──────────────────────────────────────────────────────────────────── */
  function generateMarkdown(mode) {
    var D = (mode === 'dark');
    var M = D ? 'Dark' : 'Light';

    /* Mode-specific token values */
    var t = D ? {
      bgPage:'#1A1A2E',        bgAlt:'#120D24',       bgCard:'#211545',
      bgCardFeat:'#2A1A52',    bgInset:'#0E0919',      bgOverlay:'rgba(107,76,163,.2)',
      footerBg:'#08040F',
      txPrimary:'#F0EAF8',     txSecondary:'#C8BAE0',  txMuted:'#9C8BB8',
      txLabel:'#C9A96E',       txSerif:'#D4B97E',      txCode:'#C5B3E0',
      bdDefault:'rgba(255,255,255,.1)',  bdStrong:'rgba(255,255,255,.22)',
      bdGold:'rgba(212,185,126,.5)',     bdPurple:'rgba(107,76,163,.55)',
      iconColor:'#D4B97E',     iconBg:'rgba(212,185,126,.12)',
      badgeSciBg:'#2D1E50',    badgeSciTx:'#C8B4F0',
      badgePhBg:'#1D1338',     badgePhTx:'#B8A8D8',
      badgeOlTx:'#A897C8',     badgeOlBd:'#7A6A98',
      btnPurBg:'#6B4CA3',      btnPurHbg:'#7D5AB8',   btnPurTx:'#FFFFFF',
      btnOlTx:'#C8BAE0',       btnOlBd:'rgba(200,186,224,.4)',
      btnOlHbg:'rgba(255,255,255,.07)', btnOlHbd:'rgba(200,186,224,.7)',
      btnGolTx:'#D4B97E',      btnGolBd:'#C9A96E',
      btnGolHbg:'rgba(212,185,126,.1)', btnGolHbd:'#D4B97E',
      cardName:'#F0EAF8',      cardPrice:'#D4B97E',    cardSub:'#9C8BB8',
      cardDesc:'#C8BAE0',
      cbtnOlTx:'#C8BAE0',      cbtnOlBd:'rgba(200,186,224,.3)',
      cbtnOlHtx:'#F0EAF8',     cbtnOlHbd:'rgba(200,186,224,.6)',
      cbtnOlHbg:'rgba(255,255,255,.06)',
      pullquoteBg:'rgba(107,76,163,.18)', pqBorder:'#C9A96E',
      tileBg:'#1D1338',        tileBd:'rgba(255,255,255,.09)',
      tileTx1:'#F0EAF8',       tileTx2:'#9C8BB8',     tileHtx:'#C9A96E',
      navBg:'#0F0820',         navPillBg:'rgba(255,255,255,.07)',
      navPillTx:'rgba(255,255,255,.6)', navHbg:'rgba(212,185,126,.16)',
      navHtx:'#D4B97E',        codeBg:'#0A0615',
      twBg:'#211545',          twBd:'rgba(255,255,255,.15)',
      twTrack:'#2D1A50',       twDot:'#D4B97E',        twLbl:'#C8BAE0',
      hsLabelTx:'#9C8BB8',     hsValTx:'#D4B97E',
      txPrimaryContrast:'14.8:1', txSecondaryContrast:'8.1:1',
      iconNote:'gold on dark'
    } : {
      bgPage:'#F5F1E8',        bgAlt:'#FFFFFF',        bgCard:'#FFFFFF',
      bgCardFeat:'#FDFAFF',    bgInset:'#F0ECF8',      bgOverlay:'rgba(107,76,163,.06)',
      footerBg:'#5A3D8F',
      txPrimary:'#1A1A2E',     txSecondary:'#3D2E5A',  txMuted:'#6B5E82',
      txLabel:'#7A5C1A',       txSerif:'#5A3D8F',      txCode:'#C5B3E0',
      bdDefault:'#DDD8EC',     bdStrong:'#C5B7D0',
      bdGold:'rgba(184,148,58,.5)', bdPurple:'rgba(107,76,163,.35)',
      iconColor:'#6B4CA3',     iconBg:'#EDE8F5',
      badgeSciBg:'#EDE8F5',    badgeSciTx:'#3D2070',
      badgePhBg:'#F0ECF8',     badgePhTx:'#3D2070',
      badgeOlTx:'#5A3D8F',     badgeOlBd:'#9C8BB8',
      btnPurBg:'#5A3D8F',      btnPurHbg:'#6B4CA3',   btnPurTx:'#FFFFFF',
      btnOlTx:'#3D2E5A',       btnOlBd:'#9C8BB8',
      btnOlHbg:'rgba(61,46,90,.05)',  btnOlHbd:'#5A3D8F',
      btnGolTx:'#7A5C1A',      btnGolBd:'#B8943A',
      btnGolHbg:'rgba(184,148,58,.08)', btnGolHbd:'#8B6419',
      cardName:'#1A1A2E',      cardPrice:'#7A5C1A',    cardSub:'#6B5E82',
      cardDesc:'#3D2E5A',
      cbtnOlTx:'#5A3D8F',      cbtnOlBd:'#C5B7D0',
      cbtnOlHtx:'#3D2070',     cbtnOlHbd:'#9C8BB8',
      cbtnOlHbg:'rgba(90,61,143,.04)',
      pullquoteBg:'rgba(107,76,163,.07)', pqBorder:'#B8943A',
      tileBg:'#F8F5FF',        tileBd:'#DDD8EC',
      tileTx1:'#1A1A2E',       tileTx2:'#6B5E82',     tileHtx:'#6B4CA3',
      navBg:'#5A3D8F',         navPillBg:'rgba(255,255,255,.12)',
      navPillTx:'rgba(255,255,255,.72)', navHbg:'rgba(255,255,255,.22)',
      navHtx:'#FFFFFF',        codeBg:'#1A1A2E',
      twBg:'#EDE8F5',          twBd:'#C5B7D0',
      twTrack:'#C5B7D0',       twDot:'#5A3D8F',        twLbl:'#3D2E5A',
      hsLabelTx:'#6B5E82',     hsValTx:'#5A3D8F',
      txPrimaryContrast:'16.1:1', txSecondaryContrast:'9.4:1',
      iconNote:'purple on light'
    };

    var lines = [
      '# ParentWise · Brand Design Reference',
      '',
      '> **v2.3 · March 2026** — ' + M + ' Mode',
      '> getparentwise.com · offers.marcushiggs.com',
      '> "Secure Parents. Secure Teens. Secure Future."',
      '',
      '---',
      '',
      '## Fixed Brand Colors (same in both modes)',
      '',
      '| Name | Hex | Usage |',
      '|------|-----|-------|',
      '| Deep Plum       | `#5A3D8F` | Primary brand · headers |',
      '| Brand Purple    | `#6B4CA3` | CTAs · icons on light |',
      '| Hero Violet     | `#7B5AB5` | Gradient start |',
      '| Deep Indigo     | `#3D2970` | Gradient end |',
      '| Honey Gold      | `#D4B97E` | Button start · icons on dark |',
      '| Gold Mid        | `#C9A96E` | Labels · text on dark · focus ring |',
      '| Gold Deep       | `#B8943A` | Button end · text on light |',
      '| Gold Darker     | `#8B6419` | Darkest gold accent |',
      '| On-Gold Text    | `#1A0E00` | 10.2:1 contrast — NEVER changes |',
      '| Warm Cream      | `#F5F1E8` | Page bg (light) |',
      '| Greige Canvas   | `#C9C3B4` | Page surround (both modes) |',
      '| Near Black      | `#1A1A2E` | Page bg (dark) |',
      '| Ghost Lavender  | `#F0EAF8` | Primary text (dark) |',
      '| Lavender Tint   | `#EDE8F5` | Icon bg · hover (light) |',
      '',
      '---',
      '',
      '## Gradients (always the same)',
      '',
      '| Name | CSS |',
      '|------|-----|',
      '| Hero          | `linear-gradient(155deg, #7B5AB5 0%, #5A3D8F 45%, #3D2970 100%)` |',
      '| Gold Button   | `linear-gradient(135deg, #D4B97E 0%, #B8943A 100%)` |',
      '| Chapter Bar   | `linear-gradient(90deg,  #5A3D8F 0%, #6B4CA3 100%)` |',
      '| Dark Section  | `linear-gradient(180deg, #1A1A2E 0%, #0F0820 100%)` |',
      '| Dark Card     | `linear-gradient(135deg, #2A1950 0%, #1A1035 100%)` |',
      '',
      '---',
      '',
      '## ' + M + ' Mode Tokens',
      '',
      '### Backgrounds',
      '',
      '| Token | Value |',
      '|-------|-------|',
      '| `--bg-page`      | `' + t.bgPage      + '` |',
      '| `--bg-alt`       | `' + t.bgAlt       + '` |',
      '| `--bg-card`      | `' + t.bgCard      + '` |',
      '| `--bg-card-feat` | `' + t.bgCardFeat  + '` |',
      '| `--bg-inset`     | `' + t.bgInset     + '` |',
      '| `--bg-overlay`   | `' + t.bgOverlay   + '` |',
      '| `--footer-bg`    | `' + t.footerBg    + '` |',
      '',
      '### Text',
      '',
      '| Token | Value | Contrast |',
      '|-------|-------|----------|',
      '| `--tx-primary`   | `' + t.txPrimary   + '` | ' + t.txPrimaryContrast   + ' on --bg-page |',
      '| `--tx-secondary` | `' + t.txSecondary + '` | ' + t.txSecondaryContrast + ' |',
      '| `--tx-muted`     | `' + t.txMuted     + '` | 4.6:1 |',
      '| `--tx-label`     | `' + t.txLabel     + '` | gold/brown label |',
      '| `--tx-serif`     | `' + t.txSerif     + '` | pull-quote serif |',
      '| `--tx-code`      | `' + t.txCode      + '` | code blocks |',
      '',
      '### Borders',
      '',
      '| Token | Value |',
      '|-------|-------|',
      '| `--bd-default` | `' + t.bdDefault + '` |',
      '| `--bd-strong`  | `' + t.bdStrong  + '` |',
      '| `--bd-gold`    | `' + t.bdGold    + '` |',
      '| `--bd-purple`  | `' + t.bdPurple  + '` |',
      '',
      '### Icons',
      '',
      '| Token | Value | Note |',
      '|-------|-------|------|',
      '| `--icon-color` | `' + t.iconColor + '` | ' + t.iconNote + ' |',
      '| `--icon-bg`    | `' + t.iconBg    + '` | background behind icon |',
      '',
      '### Badges',
      '',
      '| Token | Value |',
      '|-------|-------|',
      '| `--badge-sci-bg`  | `' + t.badgeSciBg + '` |',
      '| `--badge-sci-tx`  | `' + t.badgeSciTx + '` |',
      '| `--badge-ph-bg`   | `' + t.badgePhBg  + '` |',
      '| `--badge-ph-tx`   | `' + t.badgePhTx  + '` |',
      '| `--badge-ol-tx`   | `' + t.badgeOlTx  + '` |',
      '| `--badge-ol-bd`   | `' + t.badgeOlBd  + '` |',
      '',
      '### Buttons',
      '',
      '| Token | Value |',
      '|-------|-------|',
      '| `--btn-pur-bg`   | `' + t.btnPurBg  + '` |',
      '| `--btn-pur-hbg`  | `' + t.btnPurHbg + '` |',
      '| `--btn-pur-tx`   | `' + t.btnPurTx  + '` |',
      '| `--btn-ol-tx`    | `' + t.btnOlTx   + '` |',
      '| `--btn-ol-bd`    | `' + t.btnOlBd   + '` |',
      '| `--btn-ol-hbg`   | `' + t.btnOlHbg  + '` |',
      '| `--btn-ol-hbd`   | `' + t.btnOlHbd  + '` |',
      '| `--btn-gol-tx`   | `' + t.btnGolTx  + '` |',
      '| `--btn-gol-bd`   | `' + t.btnGolBd  + '` |',
      '| `--btn-gol-hbg`  | `' + t.btnGolHbg + '` |',
      '| `--btn-gol-hbd`  | `' + t.btnGolHbd + '` |',
      '',
      '### Cards',
      '',
      '| Token | Value |',
      '|-------|-------|',
      '| `--card-name`    | `' + t.cardName   + '` |',
      '| `--card-price`   | `' + t.cardPrice  + '` |',
      '| `--card-sub`     | `' + t.cardSub    + '` |',
      '| `--card-desc`    | `' + t.cardDesc   + '` |',
      '| `--cbtn-ol-tx`   | `' + t.cbtnOlTx   + '` |',
      '| `--cbtn-ol-bd`   | `' + t.cbtnOlBd   + '` |',
      '| `--cbtn-ol-htx`  | `' + t.cbtnOlHtx  + '` |',
      '| `--cbtn-ol-hbd`  | `' + t.cbtnOlHbd  + '` |',
      '| `--cbtn-ol-hbg`  | `' + t.cbtnOlHbg  + '` |',
      '',
      '### Navigation',
      '',
      '| Token | Value |',
      '|-------|-------|',
      '| `--nav-bg`       | `' + t.navBg      + '` |',
      '| `--nav-pill-bg`  | `' + t.navPillBg  + '` |',
      '| `--nav-pill-tx`  | `' + t.navPillTx  + '` |',
      '| `--nav-hbg`      | `' + t.navHbg     + '` |',
      '| `--nav-htx`      | `' + t.navHtx     + '` |',
      '',
      '### Misc / UI',
      '',
      '| Token | Value |',
      '|-------|-------|',
      '| `--pullquote-bg` | `' + t.pullquoteBg + '` |',
      '| `--pq-border`    | `' + t.pqBorder    + '` |',
      '| `--tile-bg`      | `' + t.tileBg      + '` |',
      '| `--tile-bd`      | `' + t.tileBd      + '` |',
      '| `--tile-tx1`     | `' + t.tileTx1     + '` |',
      '| `--tile-tx2`     | `' + t.tileTx2     + '` |',
      '| `--tile-htx`     | `' + t.tileHtx     + '` |',
      '| `--code-bg`      | `' + t.codeBg      + '` |',
      '| `--tw-bg`        | `' + t.twBg        + '` |',
      '| `--tw-bd`        | `' + t.twBd        + '` |',
      '| `--tw-track`     | `' + t.twTrack     + '` |',
      '| `--tw-dot`       | `' + t.twDot       + '` |',
      '| `--tw-lbl`       | `' + t.twLbl       + '` |',
      '| `--hs-label-tx`  | `' + t.hsLabelTx   + '` |',
      '| `--hs-val-tx`    | `' + t.hsValTx     + '` |',
      '',
      '---',
      '',
      '## Typography',
      '',
      '| Role | Family | Size | Weight | Notes |',
      '|------|--------|------|--------|-------|',
      '| Display         | DM Sans           | clamp(24–40px) | 700 | Hero headline, em → var(--purple-brand) |',
      '| H1              | DM Sans           | 26px           | 700 | Section headings |',
      '| Serif Pull Quote| Cormorant Garamond| 21px italic     | 400 | Emotion only |',
      '| Body            | DM Sans           | 16px           | 400 | line-height: 1.8 |',
      '| Gold Label      | DM Sans           | 12px           | 700 | UPPERCASE, 0.14em spacing |',
      '| Caption         | DM Sans           | 13px           | 400 | Sub-labels |',
      '',
      '**Google Fonts import:**',
      '',
      '```html',
      '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Cormorant+Garamond:ital,wght@1,400;1,500&display=swap" rel="stylesheet" />',
      '```',
      '',
      '---',
      '',
      '## Animations (all in CSS)',
      '',
      '| Name | Keyframe | Usage |',
      '|------|----------|-------|',
      '| `shimmer`   | `left: -80% → 130%` skewed stripe | Shine sweep on `.btn-gold::before`, `.cbtn-gold::before` — 2.8s / 3.2s |',
      '| `goldPulse` | box-shadow glow oscillation | Applied to `.btn-gold` — 3s infinite |',
      '| `floatY`    | `translateY(0 → -4px → 0)` | Applied to `.btn-gold` — 4s infinite |',
      '| `orbDrift`  | `translate(0,0 → 20px,-15px → 0,0)` | Hero background orbs — 8s, staggered delay |',
      '| `fadeUp`    | `opacity 0→1, translateY 22px→0` | Page entrance — 0.6s cubic-bezier(.22,1,.36,1) |',
      '| Scroll fade | `.pw-fade-up → .pw-visible` | JS IntersectionObserver adds class |',
      '| Mode switch | CSS transition on all tokens | background-color .35s, color/border .28s |',
      '',
      '---',
      '',
      '## Button States (complete)',
      '',
      '### Gold Button (.btn-gold)',
      '',
      '```css',
      '/* Default: animated */',
      'animation: goldPulse 3s ease-in-out infinite, floatY 4s ease-in-out infinite;',
      'box-shadow: 0 4px 20px rgba(201,169,110,.45);',
      '',
      '/* ::before shimmer */    animation: shimmer 2.8s ease-in-out infinite;',
      '',
      '/* :hover */    transform: translateY(-3px) scale(1.01);',
      '               box-shadow: 0 12px 40px rgba(201,169,110,.65);',
      '               animation-play-state: paused;',
      '               filter: brightness(1.06);',
      '',
      '/* :active */   transform: translateY(0) scale(.98);',
      '               box-shadow: 0 3px 12px rgba(201,169,110,.4);',
      '',
      '/* :focus-visible */ outline: 2px solid #C9A96E; outline-offset: 3px;',
      '```',
      '',
      '### Purple Button (.btn-purple)',
      '',
      '```css',
      '/* Default */   background: ' + t.btnPurBg + '; box-shadow: 0 4px 24px rgba(107,76,163,.3);',
      '/* :hover */    background: ' + t.btnPurHbg + '; transform: translateY(-2px);',
      '               box-shadow: 0 8px 30px rgba(107,76,163,.45);',
      '/* :active */   background: #5A3D8F; transform: translateY(1px);',
      '/* :focus */    outline: 2px solid #C9A96E; outline-offset: 3px;',
      '```',
      '',
      '### Outline Button (.btn-ol)',
      '',
      '```css',
      '/* Default */   color: ' + t.btnOlTx + '; border: 1.5px solid ' + t.btnOlBd + ';',
      '/* :hover */    background: ' + t.btnOlHbg + '; border-color: ' + t.btnOlHbd + ';',
      '               color: var(--tx-primary); transform: translateY(-2px);',
      '/* :active */   transform: translateY(1px);',
      '```',
      '',
      '### Gold Outline Button (.btn-gol)',
      '',
      '```css',
      '/* Default */   color: ' + t.btnGolTx + '; border: 1.5px solid ' + t.btnGolBd + ';',
      '/* :hover */    background: ' + t.btnGolHbg + '; border-color: ' + t.btnGolHbd + ';',
      '               transform: translateY(-2px);',
      '/* :active */   transform: translateY(1px);',
      '```',
      '',
      '---',
      '',
      '## Badge States (complete)',
      '',
      '| Class | Default | :hover |',
      '|-------|---------|--------|',
      '| `.b-gold` | grad-gold fill, on-gold text | brightness(1.08), translateY(-1px) |',
      '| `.b-sci`  | badge-sci-bg fill | badge-sci-hbg, translateY(-1px) |',
      '| `.b-ph`   | badge-ph-bg fill  | badge-ph-hbg, translateY(-1px) |',
      '| `.b-ol`   | outline only      | subtle fill, border strengthens |',
      '| `.b-gol`  | gold outline      | badge-gol-hbg, gold-mid border |',
      '| All active | — | translateY(0), brightness(.96) |',
      '',
      '---',
      '',
      '## Card States (complete)',
      '',
      '```css',
      '/* Standard :hover */   transform: translateY(-4px); border-color: var(--bd-gold);',
      '                        box-shadow: 0 14px 40px rgba(0,0,0,.16); [dark: .45]',
      '/* Featured :hover */   box-shadow: 0 14px 40px rgba(212,185,126,.18); [dark: .3]',
      '/* :active */           transform: translateY(-1px);',
      '',
      '/* cbtn-gold :hover */  filter: brightness(1.08); transform: translateY(-1px);',
      '                        box-shadow: 0 8px 24px rgba(201,169,110,.5);',
      '/* cbtn-ol :hover */    subtle fill + border strengthens',
      '```',
      '',
      '---',
      '',
      '## Icon System',
      '',
      '**Library:** Phosphor Icons v2.1 (web components)',
      '',
      '```html',
      '<script type="module" src="https://unpkg.com/@phosphor-icons/webcomponents@2.1"></script>',
      '```',
      '',
      '**Color rule:** `--icon-color` = `' + t.iconColor + '` (' + t.iconNote + ')',
      '',
      '**Usage:**',
      '```html',
      '<ph-compass color="var(--icon-color)" weight="duotone" size="32"></ph-compass>',
      '```',
      '',
      '**Sizes:** 16 · 20 · 24 · 32 · 40 · 48 · 64 px',
      '',
      '| Icon | Tag | Product / Meaning |',
      '|------|-----|-------------------|',
      '| Plant            | `<ph-plant>`                | First Steps |',
      '| Globe            | `<ph-globe-hemisphere-west>`| Circle |',
      '| Compass          | `<ph-compass>`              | Pathway |',
      '| Shield Check     | `<ph-shield-check>`         | Trust / Security |',
      '| Users Three      | `<ph-users-three>`          | Family / Community |',
      '| Heart            | `<ph-heart>`                | Connection / Care |',
      '| Flower Lotus     | `<ph-flower-lotus>`         | Brand mark / Favicon |',
      '| Brain            | `<ph-brain>`                | Attachment theory |',
      '| Chat Circle Dots | `<ph-chat-circle-dots>`     | Coaching |',
      '| Lightbulb        | `<ph-lightbulb>`            | Insight |',
      '| Seal Check       | `<ph-seal-check>`           | Science-backed |',
      '| Book Open        | `<ph-book-open>`            | Learning |',
      '| Hand Heart       | `<ph-hand-heart>`           | Repair / Empathy |',
      '| Sparkle          | `<ph-sparkle>`              | Transform / Delight |',
      '| Arrow Circle Right| `<ph-arrow-circle-right>`  | CTA / Navigation |',
      '',
      '---',
      '',
      '## Spacing System (base unit: 4px)',
      '',
      '| Token | Value | Usage |',
      '|-------|-------|-------|',
      '| `--sp-1` | `4px`  | Tight — icon padding, inline gaps |',
      '| `--sp-2` | `8px`  | Compact — badge padding, small gaps |',
      '| `--sp-3` | `16px` | Base — component padding |',
      '| `--sp-4` | `24px` | Section — card padding, list rhythm |',
      '| `--sp-5` | `40px` | Open — between major sections |',
      '| `--sp-6` | `64px` | Hero — top / bottom padding |',
      '',
      '---',
      '',
      '## Border Radius System',
      '',
      '| Value | Usage |',
      '|-------|-------|',
      '| `6px`  | Badges |',
      '| `8px`  | Buttons |',
      '| `12px` | Cards |',
      '| `16px` | Page / containers |',
      '| `50% 50% 0 0 / 100% 100% 0 0` | Hero wave (brand signature) |',
      '',
      '---',
      '',
      '## Design Principles',
      '',
      '| # | Principle | Rule |',
      '|---|-----------|------|',
      '| 01 | Contrast first | WCAG AA everywhere. Text min 4.5:1. Gold button #1A0E00 = 10.2:1. |',
      '| 02 | Gold = primary CTA | Animated gold button is highest hierarchy. One per section max. |',
      '| 03 | Hover = 3 properties | Every interactive changes: position, border/shadow, background/brightness. |',
      '| 04 | :active presses back | Reverses hover lift → translateY(0) or +1px. Communicates physical press. |',
      '| 05 | Focus = gold ring | `2px solid var(--gold-mid)` at `3px` offset on every interactive. |',
      '| 06 | Icons follow bg | `--icon-color` is sole source of truth. Purple on light, gold on dark. |',
      '| 07 | Hero wave is brand signature | border-radius: 50% 50% 0 0 / 100% 100% 0 0 |',
      '| 08 | Cormorant = emotion only | Serif only for pull quotes, hero sub, footer tag — never UI. |',
      '',
      '---',
      '',
      '*Generated by parentwise-design-system.js · ' + new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + '*'
    ];

    return lines.join('\n');
  }

  /* ════════════════════════════════════════════════════════════════════
     INIT — runs on DOMContentLoaded
     ════════════════════════════════════════════════════════════════════ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }

})();
