# Textos prontos para as lojas

Copie e cole. Nos dois casos o nome NÃO deve conter "Crunchyroll" (as lojas rejeitam marcas de
terceiros no nome); cite o Crunchyroll só na descrição.

---

## Chrome Web Store

**Nome:** Picture-in-Picture Unlocker

**Resumo (máx. 132 caracteres):**
Libera o Picture-in-Picture em todos os vídeos. Feito para o Crunchyroll (player em iframe), funciona em qualquer site.

**Descrição detalhada:**
```
PiP Unlocker libera o botão de Picture-in-Picture (vídeo flutuante) em qualquer site, inclusive naqueles que o escondem de propósito.

FEITO PARA O CRUNCHYROLL
O player do Crunchyroll fica dentro de um iframe e marca o vídeo com "disablepictureinpicture", o que esconde o botão de PiP do navegador. Outras extensões precisam ser desativadas e reativadas toda vez. A PiP Unlocker roda em todos os frames antes do player carregar e impede que o site bloqueie o PiP. Funciona de primeira, sempre.

FUNCIONA EM QUALQUER SITE
Qualquer página que bloqueie o PiP passa a permitir. Não precisa configurar nada.

COMO USAR
• Passe o mouse sobre o vídeo e clique no botão flutuante no canto superior direito, ou
• pressione Alt+P para abrir/fechar o PiP do maior vídeo em reprodução.

CONFIGURÁVEL
Na página de opções você escolhe: liberar em todos os sites (padrão), só nos sites de uma lista, ou em todos exceto os da lista.

PRIVACIDADE
Sem conexão com a internet, sem coleta de dados, sem anúncios. A única permissão é "storage", usada apenas para guardar as suas opções no próprio navegador. Código aberto: https://github.com/jackson-jpc/extension-picture-in-picture

Este projeto não tem relação com a Crunchyroll, LLC.
```

**Categoria:** Produtividade (ou Entretenimento)

**Idioma:** Português (Brasil). Depois adicione a versão em inglês abaixo como segundo idioma.

**Single purpose (campo obrigatório, em inglês):**
```
Unlock the browser's Picture-in-Picture feature on videos that sites have disabled, by removing the "disablepictureinpicture" attribute from video elements.
```

**Justificativa para host permissions `<all_urls>` (em inglês):**
```
The content script must run on every page and in every frame because video players (e.g. Crunchyroll's) are embedded in iframes served from different origins, and the attribute that disables Picture-in-Picture can be set by any site. The script only touches <video> elements; it makes no network requests and reads no page data.
```

**Justificativa para a permissão `storage` (em inglês):**
```
Used only to save the user's preferences (mode and site list) in browser storage. No data leaves the browser.
```

**Uso de dados (formulário "Privacy practices"):** marque que a extensão NÃO coleta nenhum dado. Política de privacidade: link para `PRIVACY.md` no GitHub (ex.: `https://github.com/jackson-jpc/extension-picture-in-picture/blob/main/PRIVACY.md`).

**Imagens:**
- Ícone 128×128: `src/icons/icon-128.png`
- Pequeno tile promocional 440×280: `store-assets/promo-small-440x280.png`
- Marquee 1400×560 (opcional): `store-assets/promo-marquee-1400x560.png`
- Capturas de tela 1280×800 ou 640×400 (pelo menos 1, obrigatório): tire você mesmo com o vídeo em PiP aberto. Dica: evite mostrar a logo/marca do Crunchyroll em destaque.

---

## Firefox Add-ons (AMO)

**Nome:** Picture-in-Picture Unlocker

**Resumo (máx. 250 caracteres):**
Libera o botão de Picture-in-Picture em todos os vídeos, inclusive em players dentro de iframes como o do Crunchyroll. Sem configuração, sem coleta de dados.

**Descrição:** use o mesmo texto da Chrome Web Store, trocando o bloco "COMO USAR" por:
```
COMO USAR
Passe o mouse sobre o vídeo: o botão nativo de Picture-in-Picture do Firefox aparece. Você também pode usar o atalho do próprio Firefox, Ctrl+Shift+].
```

**Categoria:** Fotos, Música e Vídeos

**Licença:** MIT

**Política de privacidade:** cole o texto de `PRIVACY.md`.

**Notas para o revisor (em inglês):**
```
Source is unminified and identical to the public repo: https://github.com/jackson-jpc/extension-picture-in-picture
Build: ./build.sh merges manifest.base.json + manifest.firefox.json and copies src/ to dist/firefox. No bundler, no third-party code.
main-world.js runs in the page's main world only to override the disablePictureInPicture setter and setAttribute/toggleAttribute for <video>; content.js reads the options (storage.sync), tells main-world.js via a DOM event whether the site is allowed, and removes the attribute via MutationObserver + media events. There is no periodic polling. The "storage" permission only stores the user's mode and site list. No network, no data collection.
```

**Ícone:** `src/icons/icon-128.png` (a AMO pede 128×128 ou maior; também aceita `store-assets/logo-512.png`).

---

## English version (for the second language on both stores)

**Name:** Picture-in-Picture Unlocker

**Summary:**
Unlocks Picture-in-Picture on every video. Built for Crunchyroll (player inside an iframe), works on any site.

**Description:**
```
PiP Unlocker unlocks the Picture-in-Picture (floating video) button on any site, including the ones that hide it on purpose.

BUILT FOR CRUNCHYROLL
Crunchyroll's player lives inside an iframe and marks the video with "disablepictureinpicture", which hides the browser's PiP button. Other extensions need to be disabled and re-enabled every time. PiP Unlocker runs in every frame before the player loads and keeps the site from blocking PiP. It just works, every time.

WORKS ON ANY SITE
Any page that blocks PiP will allow it. Nothing to configure.

HOW TO USE
Chrome/Edge/Brave: hover the video and click the floating button in the top-right corner, or press Alt+P.
Firefox: hover the video and use Firefox's native PiP toggle, or Ctrl+Shift+].

CONFIGURABLE
From the options page choose: every site (default), only the sites in a list, or every site except the listed ones.

PRIVACY
No internet connection, no data collection, no ads. The only permission is "storage", used solely to keep your preferences in the browser. Open source: https://github.com/jackson-jpc/extension-picture-in-picture

Not affiliated with Crunchyroll, LLC.
```
