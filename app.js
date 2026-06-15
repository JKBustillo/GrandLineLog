/* =====================================================================
   ONE PIECE · BITÁCORA DE VIAJE — LÓGICA
   Vanilla JS. Persiste todo en localStorage.
   ===================================================================== */
'use strict';

const STORAGE_KEY = 'op-bitacora-v1';
const DAY = 86400000;

/* Episodio inicial mínimo permitido para "último emitido": el mayor
   "start" de las sagas (para que la saga en emisión nunca quede al revés). */
const MIN_LATEST = Math.max(...CONTENT.filter(c => c.type === 'saga').map(c => c.start));

/* ----------------------------- Estado ----------------------------- */
function defaultState() {
  return {
    theme: 'grandline',
    mode: 'daily',                 // 'daily' | 'manual'
    startDate: todayISO(),
    startEp: 1,                    // en modo diario: cap. del día 1
    manualCount: 0,
    latestEpisode: DEFAULT_LATEST_EPISODE,
    auto: { saga:true, movie:true, ova:true, special:true, short:true, omake:true },
    manualMarks: {}                // { [id]: true/false }  (cuando auto está OFF)
  };
}

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const saved = JSON.parse(raw);
    const base = defaultState();
    return {
      ...base, ...saved,
      auto: { ...base.auto, ...(saved.auto || {}) },
      manualMarks: { ...(saved.manualMarks || {}) }
    };
  } catch (e) {
    console.warn('No se pudo leer el progreso guardado:', e);
    return defaultState();
  }
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { console.warn('No se pudo guardar:', e); }
}

/* ----------------------------- Utilidades ----------------------------- */
const $  = (s, r = document) => r.querySelector(s);
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
function todayISO() {
  const d = new Date(); d.setHours(0,0,0,0);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function midnight(date) { const d = new Date(date); d.setHours(0,0,0,0); return d; }
function getLatest() { return Math.max(MIN_LATEST, state.latestEpisode || MIN_LATEST); }
function effectiveEnd(item) { return item.end === null ? getLatest() : item.end; }

/* Capítulos vistos según el modo activo. */
function watchedCount() {
  const latest = getLatest();
  if (state.mode === 'manual') return clamp(Math.floor(state.manualCount) || 0, 0, latest);
  // Modo diario: cada día desde la fecha de inicio suma 1 capítulo.
  const start = midnight(state.startDate + 'T00:00:00');
  if (isNaN(start)) return 0;
  const today = midnight(new Date());
  const days = today >= start ? Math.floor((today - start) / DAY) + 1 : 0;
  const base = (Math.floor(state.startEp) || 1) - 1;
  return clamp(base + days, 0, latest);
}

/* Estado de cada entrada para pintarla. */
function statusOf(item, watched) {
  const isSaga = item.type === 'saga';
  const autoOn = !!state.auto[item.type];
  const ongoing = isSaga && item.end === null;
  const end = effectiveEnd(item);
  const trigger = isSaga ? end : item.after;   // hito a partir del cual cuenta

  let done;
  if (autoOn) done = watched >= trigger;
  else        done = state.manualMarks[item.id] === true;

  const reached = watched >= trigger;          // ¿ya pasamos su punto?
  const ready = !autoOn && reached && !done;   // pendiente de marcar a mano

  // Progreso parcial / saga actual (informativo, siempre que se sepa el conteo)
  let current = false, partialPct = null;
  if (isSaga && watched >= item.start && watched < end) {
    current = true;
    partialPct = ((watched - item.start + 1) / (end - item.start + 1)) * 100;
  }
  const caughtUp = ongoing && done;            // al día con lo emitido
  return { isSaga, autoOn, ongoing, done, ready, current, partialPct, caughtUp, end, trigger };
}

/* ----------------------------- Render ----------------------------- */
function render() {
  const watched = watchedCount();
  const latest = getLatest();

  // --- Marcador grande ---
  $('#count-num').textContent = watched;
  $('#count-total').textContent = latest;
  const pct = latest ? Math.round((watched / latest) * 100) : 0;
  $('#count-bar').style.width = pct + '%';
  $('#count-pct').textContent = pct + '%';

  // --- Tallies ---
  let sagasDone = 0, sagasTot = 0, extrasDone = 0, extrasTot = 0;
  const statuses = CONTENT.map(item => {
    const st = statusOf(item, watched);
    if (st.isSaga) { sagasTot++; if (st.done) sagasDone++; }
    else { extrasTot++; if (st.done) extrasDone++; }
    return st;
  });
  $('#t-sagas').textContent = `${sagasDone}/${sagasTot}`;
  $('#t-extras').textContent = `${extrasDone}/${extrasTot}`;

  // --- Pista del modo diario ---
  if (state.mode === 'daily') {
    const start = midnight(state.startDate + 'T00:00:00');
    const today = midnight(new Date());
    const days = (!isNaN(start) && today >= start) ? Math.floor((today - start)/DAY) + 1 : 0;
    $('#daily-hint').textContent = days > 0
      ? `Llevas ${days} día${days===1?'':'s'} de viaje → vas por el capítulo ${watched}.`
      : `Tu viaje empieza ese día. Cada jornada sumará 1 capítulo.`;
  }

  // --- Línea de tiempo ---
  const tl = $('#timeline');
  tl.innerHTML = '';
  CONTENT.forEach((item, i) => {
    const st = statuses[i];
    const info = TYPE_INFO[item.type];

    const art = document.createElement('article');
    art.className = 'entry'
      + (st.isSaga ? '' : ' extra')
      + (st.done ? ' done' : '')
      + (st.current ? ' current' : '');
    art.dataset.id = item.id;
    art.dataset.stamp = st.caughtUp ? 'AL DÍA' : 'VISTO';
    art.style.animationDelay = Math.min(i * 0.028, 1.2) + 's';

    // rango / hito
    const range = st.isSaga
      ? (item.end === null ? `Ep. ${item.start}– · en emisión` : `Ep. ${item.start}–${item.end}`)
      : `Tras el ep. ${item.after}`;

    // etiquetas contextuales
    let tags = '';
    if (st.current) tags += `<span class="tag now">Vas por aquí · cap. ${watched}</span>`;
    if (st.ongoing && !st.current) tags += `<span class="tag air">En emisión</span>`;
    if (st.ready) tags += `<span class="tag ready">¡Listo para marcar!</span>`;

    // barra parcial de la saga en curso
    const subbar = st.current
      ? `<div class="subbar"><i style="width:${st.partialPct.toFixed(0)}%"></i></div>` : '';

    // control de marcado
    const markHTML = st.autoOn
      ? `<div class="lock" title="Auto-marcado activado para ${info.plural.toLowerCase()}">
           <span class="auto-pill">Auto</span><span>${st.done ? 'visto' : 'pend.'}</span></div>`
      : `<button class="check" data-mark="${item.id}" aria-pressed="${st.done}"
            title="${st.done ? 'Desmarcar' : 'Marcar como visto'}">${st.done ? '✓' : ''}</button>`;

    art.innerHTML = `
      <div class="node"></div>
      ${st.current ? '<span class="youarehere" title="Estás aquí">⛵</span>' : ''}
      <div class="card" data-stamp="${st.caughtUp ? 'AL DÍA' : 'VISTO'}">
        <div class="medal">${info.icon}</div>
        <div class="body">
          <div class="kind">${info.label} · ${range}</div>
          <div class="name">${item.title}</div>
          ${item.sub ? `<div class="sub">${item.sub}</div>` : ''}
          ${tags ? `<div class="meta">${tags}</div>` : ''}
          ${subbar}
        </div>
        <div class="mark">${markHTML}</div>
      </div>`;
    tl.appendChild(art);
  });

  updateGoto();
}

/* ----------------------------- Eventos ----------------------------- */

// Marcado manual (delegación)
$('#timeline').addEventListener('click', (e) => {
  const btn = e.target.closest('.check[data-mark]');
  if (!btn) return;
  const id = btn.dataset.mark;
  state.manualMarks[id] = !state.manualMarks[id];
  saveState(); render();
});

// Tema
function setTheme(theme) {
  state.theme = theme;
  document.body.dataset.theme = theme;
  $('#th-grandline').setAttribute('aria-pressed', theme === 'grandline');
  $('#th-bitacora').setAttribute('aria-pressed', theme === 'bitacora');
  saveState();
}
$('#th-grandline').addEventListener('click', () => setTheme('grandline'));
$('#th-bitacora').addEventListener('click', () => setTheme('bitacora'));

// Modo
function setMode(mode) {
  state.mode = mode;
  $('#mode-daily').setAttribute('aria-pressed', mode === 'daily');
  $('#mode-manual').setAttribute('aria-pressed', mode === 'manual');
  $('#block-daily').classList.toggle('active', mode === 'daily');
  $('#block-manual').classList.toggle('active', mode === 'manual');
  saveState(); render();
}
$('#mode-daily').addEventListener('click', () => setMode('daily'));
$('#mode-manual').addEventListener('click', () => setMode('manual'));

// Inputs de progreso
$('#start-date').addEventListener('input', e => { state.startDate = e.target.value || todayISO(); saveState(); render(); });
$('#start-ep').addEventListener('input', e => { state.startEp = clamp(parseInt(e.target.value)||1, 1, 9999); saveState(); render(); });
$('#manual-count').addEventListener('input', e => { state.manualCount = clamp(parseInt(e.target.value)||0, 0, 99999); saveState(); render(); });

// Último episodio emitido
$('#latest-ep').addEventListener('input', e => {
  state.latestEpisode = Math.max(MIN_LATEST, parseInt(e.target.value) || MIN_LATEST);
  saveState(); render();
});

/* ------- Modal de ajustes ------- */
const modal = $('#settings-modal');
const openModal = () => { fillCode(); modal.classList.add('open'); };
const closeModal = () => modal.classList.remove('open');
$('#open-settings').addEventListener('click', openModal);
$('#open-settings-fab').addEventListener('click', openModal);
$('#close-settings').addEventListener('click', closeModal);
$('#close-settings-2').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Construir la lista de interruptores de auto-marcado
function buildAutoList() {
  const list = $('#auto-list');
  list.innerHTML = '';
  Object.keys(TYPE_INFO).forEach(type => {
    const info = TYPE_INFO[type];
    const count = CONTENT.filter(c => c.type === type).length;
    const row = document.createElement('div');
    row.className = 'auto-row';
    row.innerHTML = `
      <span class="lbl">${info.icon} ${info.plural}
        <small>${count} en la lista · ${type === 'saga' ? 'al pasar su último cap.' : 'al pasar su episodio'}</small>
      </span>
      <label class="switch">
        <input type="checkbox" data-auto="${type}" ${state.auto[type] ? 'checked' : ''}>
        <span class="track"></span>
      </label>`;
    list.appendChild(row);
  });
}
$('#auto-list').addEventListener('change', e => {
  const cb = e.target.closest('input[data-auto]');
  if (!cb) return;
  const type = cb.dataset.auto;
  const wasOn = state.auto[type];
  const nowOn = cb.checked;
  // Al pasar de AUTO → MANUAL, conservamos lo que estaba marcado.
  if (wasOn && !nowOn) {
    const watched = watchedCount();
    CONTENT.filter(c => c.type === type).forEach(item => {
      state.manualMarks[item.id] = statusOf(item, watched).done;
    });
  }
  state.auto[type] = nowOn;
  saveState(); render();
});

// Reiniciar progreso
$('#reset-progress').addEventListener('click', () => {
  if (!confirm('¿Seguro que quieres reiniciar tu progreso? (capítulos y marcas manuales)')) return;
  const keepTheme = state.theme, keepAuto = state.auto, keepLatest = state.latestEpisode;
  state = defaultState();
  state.theme = keepTheme; state.auto = keepAuto; state.latestEpisode = keepLatest;
  saveState();
  refreshUIFromState();
  toast('Progreso reiniciado');
});

/* ----------------------------- Init ----------------------------- */
function syncInputs() {
  $('#start-date').value = state.startDate;
  $('#start-ep').value = state.startEp;
  $('#manual-count').value = state.manualCount;
  $('#latest-ep').value = state.latestEpisode;
}
function refreshUIFromState() {
  setTheme(state.theme);
  $('#mode-daily').setAttribute('aria-pressed', state.mode === 'daily');
  $('#mode-manual').setAttribute('aria-pressed', state.mode === 'manual');
  $('#block-daily').classList.toggle('active', state.mode === 'daily');
  $('#block-manual').classList.toggle('active', state.mode === 'manual');
  syncInputs();
  buildAutoList();
  render();
}

/* ------- Aviso flotante ------- */
let toastTimer = null;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2300);
}

/* ------- Botón "Ir a la saga actual" -------
   Visible solo cuando la saga actual NO está dentro del viewport. */
let currentObserver = null;
function updateGoto() {
  const btn = $('#goto-current');
  if (currentObserver) currentObserver.disconnect();
  const el = $('#timeline .entry.current');
  if (!el) { btn.classList.remove('show'); return; }
  currentObserver = new IntersectionObserver((entries) => {
    btn.classList.toggle('show', !entries[0].isIntersecting);
  }, { threshold: 0.35 });
  currentObserver.observe(el);
}
$('#goto-current').addEventListener('click', () => {
  const el = $('#timeline .entry.current');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

/* ------- Importar / Exportar ------- */
const b64encode = (s) => btoa(unescape(encodeURIComponent(s)));
const b64decode = (s) => decodeURIComponent(escape(atob(s)));
function exportPayload() {
  return JSON.stringify({ app: 'op-bitacora', v: 1, exported: new Date().toISOString(), state });
}
function applyImport(text) {
  let data;
  try { data = JSON.parse(text); }
  catch { toast('⚠️ El contenido no es válido'); return; }
  const incoming = data && data.state ? data.state : data;  // acepta envuelto o crudo
  if (!incoming || typeof incoming !== 'object' || (!('manualMarks' in incoming) && !('mode' in incoming))) {
    toast('⚠️ No se reconoce el progreso'); return;
  }
  const base = defaultState();
  state = {
    ...base, ...incoming,
    auto: { ...base.auto, ...(incoming.auto || {}) },
    manualMarks: { ...(incoming.manualMarks || {}) }
  };
  saveState();
  refreshUIFromState();
  toast('Progreso importado ✓');
  closeModal();
}

// Exportar a archivo .json
$('#export-file').addEventListener('click', () => {
  const blob = new Blob([exportPayload()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `one-piece-progreso-${todayISO()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  toast('Archivo exportado ✓');
});

// Importar desde archivo
$('#import-file-btn').addEventListener('click', () => $('#import-file').click());
$('#import-file').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => applyImport(String(reader.result));
  reader.onerror = () => toast('⚠️ No se pudo leer el archivo');
  reader.readAsText(file);
  e.target.value = '';  // permite reimportar el mismo archivo
});

// Cuadro de texto: rellena con el código del estado actual (al abrir el modal)
function fillCode() {
  const box = $('#code-box');
  if (box) box.value = b64encode(exportPayload());
}

// Copiar el contenido del cuadro
$('#copy-code').addEventListener('click', async () => {
  const box = $('#code-box');
  if (!box.value) fillCode();
  box.select();
  box.setSelectionRange(0, box.value.length);  // móvil
  try {
    await navigator.clipboard.writeText(box.value);
    toast('Código copiado ✓');
  } catch {
    try { document.execCommand('copy'); toast('Código copiado ✓'); }   // respaldo en file://
    catch { toast('⚠️ Copia manual (Ctrl+C)'); }
  }
});

// Aplicar el código que haya en el cuadro
$('#apply-code').addEventListener('click', () => {
  const raw = $('#code-box').value.trim();
  if (!raw) { toast('⚠️ Pega un código primero'); return; }
  let text;
  try { text = b64decode(raw); }
  catch { text = raw; }  // por si pegaron el JSON en crudo
  applyImport(text);
});

function init() { refreshUIFromState(); }
init();
