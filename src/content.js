// Roda no mundo isolado da extensão, em todos os frames, em document_start.
// 1) Lê as opções e decide se este site está autorizado; avisa o main-world.js.
// 2) Remove o atributo disablepictureinpicture de qualquer <video> (existente ou criado depois).
// 3) Onde existe a API requestPictureInPicture (Chrome/Edge/Brave), mostra um botão flutuante
//    ao passar o mouse e o atalho Alt+P. No Firefox o botão nativo aparece sozinho.
(() => {
  const ATTR = 'disablepictureinpicture';
  const api = globalThis.browser ?? globalThis.chrome;
  const DEFAULTS = { mode: 'all', sites: ['crunchyroll.com'] };

  // ---------- Autorização por site ----------
  function hostCandidates() {
    const hosts = new Set([location.hostname]);
    if (window !== window.top) {
      try { hosts.add(window.top.location.hostname); } catch (e) { /* cross-origin */ }
      try { for (const o of (location.ancestorOrigins || [])) hosts.add(new URL(o).hostname); } catch (e) { /* ignora */ }
      try { if (document.referrer) hosts.add(new URL(document.referrer).hostname); } catch (e) { /* ignora */ }
    }
    hosts.delete('');
    return [...hosts];
  }

  function matches(host, site) {
    site = site.trim().toLowerCase().replace(/^\*\./, '').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!site) return false;
    host = host.toLowerCase();
    return host === site || host.endsWith('.' + site);
  }

  function isAllowed(opts) {
    if (opts.mode === 'all') return true;
    const hosts = hostCandidates();
    const listed = hosts.some(h => (opts.sites || []).some(s => matches(h, s)));
    return opts.mode === 'list' ? listed : !listed; // 'list' = só a lista; 'except' = todos menos a lista
  }

  async function loadOptions() {
    try {
      const stored = await api.storage.sync.get(DEFAULTS);
      return { ...DEFAULTS, ...stored };
    } catch (e) {
      return DEFAULTS;
    }
  }

  // ---------- Remoção do atributo ----------
  function fix(video) {
    if (video instanceof HTMLVideoElement && video.hasAttribute(ATTR)) video.removeAttribute(ATTR);
  }
  function fixAll(root) {
    if (!root) return;
    if (root instanceof HTMLVideoElement) fix(root);
    if (root.querySelectorAll) root.querySelectorAll('video').forEach(fix);
  }

  function startWatching() {
    const observe = () => {
      new MutationObserver((muts) => {
        for (const m of muts) {
          if (m.type === 'attributes') fix(m.target);
          else for (const n of m.addedNodes) fixAll(n);
        }
      }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: [ATTR] });
      fixAll(document);
    };
    if (document.documentElement) observe();
    else document.addEventListener('DOMContentLoaded', observe, { once: true });

    // Em vez de varrer a página a cada 2 s: eventos de mídia (capture, porque não borbulham).
    // Custam zero quando nada acontece e pegam vídeos recriados ou que trocaram de fonte.
    for (const ev of ['loadstart', 'loadedmetadata', 'play', 'playing']) {
      document.addEventListener(ev, (e) => fix(e.target), { capture: true, passive: true });
    }
    // Ao voltar para a aba, uma varredura única e barata.
    document.addEventListener('visibilitychange', () => { if (!document.hidden) fixAll(document); }, { passive: true });
  }

  // ---------- Botão flutuante + Alt+P (só onde existe a API) ----------
  function startButton() {
    const hasPipApi = typeof HTMLVideoElement.prototype.requestPictureInPicture === 'function' && !!document.pictureInPictureEnabled;
    if (!hasPipApi) return;

    let btn = null, current = null, hideTimer = null;
    const t = (k, fb) => { try { return api.i18n.getMessage(k) || fb; } catch (e) { return fb; } };

    function ensureButton() {
      if (btn) return btn;
      btn = document.createElement('button');
      btn.id = 'pip-unlocker-floating-btn';
      btn.type = 'button';
      btn.title = t('pipButtonTitle', 'Picture-in-Picture (Alt+P)');
      btn.setAttribute('aria-label', 'Picture-in-Picture');
      btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><rect x="12" y="11" width="8" height="6" rx="1" fill="currentColor" stroke="none"/></svg>';
      Object.assign(btn.style, {
        position: 'fixed', zIndex: '2147483647', width: '40px', height: '40px',
        border: 'none', borderRadius: '8px', background: 'rgba(0,0,0,0.65)', color: '#fff',
        display: 'none', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        padding: '0', margin: '0', boxShadow: '0 2px 8px rgba(0,0,0,0.4)', opacity: '0.9'
      });
      btn.addEventListener('mouseenter', () => { clearTimeout(hideTimer); btn.style.opacity = '1'; });
      btn.addEventListener('mouseleave', () => { btn.style.opacity = '0.9'; scheduleHide(); });
      btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); if (current) togglePip(current); });
      (document.body || document.documentElement).appendChild(btn);
      return btn;
    }

    async function togglePip(video) {
      try {
        if (document.pictureInPictureElement) await document.exitPictureInPicture();
        else { fix(video); await video.requestPictureInPicture(); }
      } catch (err) {
        console.warn('[PiP Unlocker] não foi possível ativar o PiP:', err && err.message);
      }
    }

    function position(video) {
      const r = video.getBoundingClientRect();
      if (r.width < 120 || r.height < 80) { hideBtn(); return; }
      const b = ensureButton();
      b.style.left = Math.round(r.right - 48) + 'px';
      b.style.top = Math.round(r.top + 8) + 'px';
      b.style.display = 'flex';
    }
    function hideBtn() { if (btn) btn.style.display = 'none'; }
    function scheduleHide() { clearTimeout(hideTimer); hideTimer = setTimeout(hideBtn, 1800); }

    document.addEventListener('mousemove', (e) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      let video = el instanceof HTMLVideoElement ? el : null;
      if (!video) {
        for (const v of document.querySelectorAll('video')) {
          const r = v.getBoundingClientRect();
          if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom && r.width >= 120) { video = v; break; }
        }
      }
      if (video) { current = video; position(video); scheduleHide(); }
      else if (!(el && btn && el === btn)) scheduleHide();
    }, { passive: true });

    window.addEventListener('scroll', () => { if (current && btn && btn.style.display !== 'none') position(current); }, { passive: true });

    document.addEventListener('keydown', (e) => {
      if (!e.altKey || e.key.toLowerCase() !== 'p' || e.ctrlKey || e.metaKey) return;
      const vids = [...document.querySelectorAll('video')];
      if (!vids.length) return;
      const area = (v) => { const r = v.getBoundingClientRect(); return r.width * r.height; };
      const playing = vids.filter(v => !v.paused);
      e.preventDefault();
      togglePip((playing.length ? playing : vids).sort((a, b) => area(b) - area(a))[0]);
    });
  }

  // ---------- Início ----------
  loadOptions().then((opts) => {
    const ok = isAllowed(opts);
    document.dispatchEvent(new Event(ok ? 'pip-unlocker:enabled' : 'pip-unlocker:disabled'));
    if (!ok) return;
    startWatching();
    startButton();
  });
})();
