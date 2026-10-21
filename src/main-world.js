// Roda no "mundo" da página (MAIN world), em todos os frames, antes de qualquer script do site.
// Objetivo: impedir que o site (ex.: Crunchyroll) desligue o Picture-in-Picture nos vídeos.
//
// Estado: `enabled` começa como null (ainda não sabemos se este site está autorizado).
// Enquanto null, bloqueamos e anotamos as tentativas. content.js lê as opções e dispara
// o evento "pip-unlocker:enabled" ou "pip-unlocker:disabled". Se for "disabled", restauramos o que
// o site tentou fazer e os patches viram passthrough (a extensão fica inerte nesta página).
(() => {
  if (window.__pipUnlockerPatched) return;
  window.__pipUnlockerPatched = true;

  const ATTR = 'disablepictureinpicture';
  const isVideo = (el) => typeof HTMLVideoElement !== 'undefined' && el instanceof HTMLVideoElement;
  let enabled = null;
  const wanted = new Set(); // vídeos em que o site tentou desligar o PiP antes da decisão

  const vproto = HTMLVideoElement.prototype;
  const eproto = Element.prototype;
  const origDesc = Object.getOwnPropertyDescriptor(vproto, 'disablePictureInPicture');
  const origSet = eproto.setAttribute;
  const origSetNS = eproto.setAttributeNS;
  const origToggle = eproto.toggleAttribute;

  const block = (el) => {
    if (enabled === false) return false;
    if (enabled === null) wanted.add(el);
    return true;
  };

  // 1) Propriedade JS: video.disablePictureInPicture = true
  try {
    if (origDesc && origDesc.configurable) {
      Object.defineProperty(vproto, 'disablePictureInPicture', {
        configurable: true,
        enumerable: origDesc.enumerable,
        get() { return enabled === false ? origDesc.get.call(this) : false; },
        set(v) { if (!block(this)) origDesc.set.call(this, v); }
      });
    }
  } catch (e) { /* ignora */ }

  // 2) Atributo HTML: setAttribute / setAttributeNS / toggleAttribute
  try {
    eproto.setAttribute = function (name, value) {
      if (isVideo(this) && String(name).toLowerCase() === ATTR && block(this)) return;
      return origSet.call(this, name, value);
    };
    eproto.setAttributeNS = function (ns, name, value) {
      if (isVideo(this) && String(name).toLowerCase().endsWith(ATTR) && block(this)) return;
      return origSetNS.call(this, ns, name, value);
    };
    eproto.toggleAttribute = function (name, force) {
      if (isVideo(this) && String(name).toLowerCase() === ATTR && force !== false && block(this)) return false;
      return origToggle.call(this, name, force);
    };
  } catch (e) { /* ignora */ }

  // 3) Alguns players substituem requestPictureInPicture por uma função que rejeita. Guardamos a original.
  try {
    if (typeof vproto.requestPictureInPicture === 'function') {
      Object.defineProperty(vproto, 'requestPictureInPicture', {
        configurable: true, writable: false, enumerable: true, value: vproto.requestPictureInPicture
      });
    }
  } catch (e) { /* ignora */ }

  // Decisão vinda do content.js (mundo isolado). Só o nome do evento carrega a informação,
  // assim funciona igual no Firefox e no Chrome sem precisar clonar objetos entre mundos.
  document.addEventListener('pip-unlocker:enabled', () => { enabled = true; wanted.clear(); }, { once: true });
  document.addEventListener('pip-unlocker:disabled', () => {
    enabled = false;
    // devolve ao site o que ele tentou fazer enquanto estávamos indecisos
    for (const v of wanted) { try { origSet.call(v, ATTR, ''); } catch (e) { /* ignora */ } }
    wanted.clear();
  }, { once: true });
})();
