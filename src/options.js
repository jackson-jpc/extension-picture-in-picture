(() => {
  const api = globalThis.browser ?? globalThis.chrome;
  const DEFAULTS = { mode: 'all', sites: ['crunchyroll.com'] };
  const $ = (s) => document.querySelector(s);

  // i18n
  for (const el of document.querySelectorAll('[data-i18n]')) {
    const msg = api.i18n.getMessage(el.dataset.i18n);
    if (msg) el.textContent = msg;
  }

  async function load() {
    const o = { ...DEFAULTS, ...(await api.storage.sync.get(DEFAULTS)) };
    const radio = document.querySelector(`input[name=mode][value="${o.mode}"]`) || document.querySelector('input[name=mode][value=all]');
    radio.checked = true;
    $('#sites').value = (o.sites || []).join('\n');
  }

  async function save() {
    const mode = document.querySelector('input[name=mode]:checked').value;
    const sites = $('#sites').value.split('\n').map(s => s.trim().toLowerCase()).filter(Boolean);
    await api.storage.sync.set({ mode, sites });
    $('#status').textContent = api.i18n.getMessage('optSaved') || 'Salvo.';
    setTimeout(() => { $('#status').textContent = ''; }, 2000);
  }

  $('#save').addEventListener('click', save);
  load();
})();
