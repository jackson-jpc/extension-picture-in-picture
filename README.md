<p align="center">
  <img src="store-assets/logo-512.png" width="128" alt="PiP Unlocker">
</p>

<h1 align="center">Picture-in-Picture Unlocker</h1>

<p align="center">
  Picture-in-Picture em qualquer vídeo. Feito para o <b>Crunchyroll</b>, funciona em todos os sites.<br>
  <i>Picture-in-Picture on any video. Built for Crunchyroll, works everywhere.</i>
</p>

<p align="center">
  <a href="#instalar">Instalar</a> •
  <a href="#como-funciona">Como funciona</a> •
  <a href="#desenvolvimento">Desenvolvimento</a> •
  <a href="PRIVACY.md">Privacidade</a> •
  <a href="#english">English</a>
</p>

---

## O problema

O Crunchyroll (e vários outros players) marca o vídeo com o atributo `disablepictureinpicture`,
o que faz o botão de Picture-in-Picture do navegador sumir. Para piorar, o player do Crunchyroll
fica dentro de um **iframe** e o `<video>` é criado depois que a página já carregou. Extensões que
só rodam na página principal, ou só depois do carregamento, não conseguem pegar esse momento, e
você acaba tendo que desativar e reativar a extensão toda vez.

## O que a PiP Unlocker faz

- Roda **em todos os frames**, **antes de qualquer script do site**, e fica vigiando vídeos criados depois.
- Remove o atributo `disablepictureinpicture` e **impede que o site o coloque de volta**
  (bloqueia `video.disablePictureInPicture = true`, `setAttribute` e `toggleAttribute`).
- **Firefox:** o botão nativo de PiP do navegador volta a aparecer ao passar o mouse no vídeo
  (atalho nativo `Ctrl+Shift+]`).
- **Chrome / Edge / Brave / Opera:** mostra um botão flutuante no canto do vídeo e o atalho **`Alt+P`**
  liga/desliga o PiP no maior vídeo em reprodução.
- **Configurável:** na página de opções escolha entre liberar em todos os sites (padrão), somente nos
  sites de uma lista, ou em todos exceto os da lista. Útil para deixar a extensão inerte em sites sensíveis.
- Sem rede, sem telemetria. A única permissão é `storage`, para guardar as opções no próprio navegador.

Testado no Crunchyroll. Funciona também em qualquer outro site que bloqueie o PiP.

## Instalar

### Pelas lojas (recomendado)

- **Firefox:** _link do Firefox Add-ons (em breve)_
- **Chrome / Edge / Brave:** _link da Chrome Web Store (em breve)_

### Manualmente

Baixe o `.zip` da última [release](../../releases) para o seu navegador.

**Chrome / Edge / Brave:** descompacte, abra `chrome://extensions`, ligue o **Modo do desenvolvedor**,
clique em **Carregar sem compactação** e escolha a pasta.

**Firefox:** arraste o arquivo `.xpi` da release para dentro de uma janela do Firefox.
Para testar sem instalar: `about:debugging#/runtime/this-firefox` → **Carregar extensão temporária…** → `manifest.json`.

Se no Firefox o botão não aparecer, confira em `about:config` se estão em `true`:
`media.videocontrols.picture-in-picture.enabled` e `media.videocontrols.picture-in-picture.video-toggle.enabled`.

## Como funciona

| Arquivo | Onde roda | O que faz |
|---|---|---|
| `src/main-world.js` | No contexto da página (`world: "MAIN"`), todos os frames, `document_start` | Troca o setter de `disablePictureInPicture` por um no-op e intercepta `setAttribute`/`toggleAttribute` para `<video>` |
| `src/content.js` | No contexto isolado da extensão, todos os frames | Lê as opções e decide se o site está autorizado (avisa o `main-world.js` por um evento DOM). Se sim: `MutationObserver` + eventos de mídia em fase de captura removem o atributo de vídeos existentes ou criados depois; botão flutuante e atalho `Alt+P` onde existe a API `requestPictureInPicture` |
| `src/options.html` / `options.js` | Página de opções | Modo (todos / só a lista / todos exceto a lista) e lista de domínios, salvos em `storage.sync` |

Não há varredura periódica: quando nada acontece na página, a extensão não executa nada.
Se o site não estiver autorizado, o `main-world.js` entra em modo passthrough e devolve ao site o que ele
tentou fazer antes da decisão (uma janela de poucos milissegundos).

Requisitos: Firefox 128+ ou Chrome 111+ (suporte a `world: "MAIN"` em `content_scripts`).

## Desenvolvimento

```bash
./build.sh            # gera dist/chrome, dist/firefox e os dois .zip
npx web-ext lint --source-dir dist/firefox   # linter da Mozilla (o mesmo da revisão da AMO)
npx web-ext run  --source-dir dist/firefox   # abre um Firefox com a extensão carregada
```

Estrutura:

```
src/                 código e recursos compartilhados (JS, ícones, _locales)
manifest.base.json   manifest comum
manifest.chrome.json / manifest.firefox.json   diferenças por navegador (mescladas pelo build.sh)
store-assets/        logo e banners para as lojas
STORE_LISTING.md     textos prontos para a Chrome Web Store e o Firefox Add-ons
```

## Aviso

Este projeto não tem relação com a Crunchyroll, LLC. "Crunchyroll" é marca registrada de seus
respectivos donos e é citada apenas para descrever a compatibilidade.

## Autor

Feito por **Jackson Alves** ([@jackson-jpc](https://github.com/jackson-jpc)). Ícone e arte também de autoria própria.
Sugestões e problemas: abra uma [issue](../../issues).

## Licença

[MIT](LICENSE) © 2026 Jackson Alves

---

## English

**PiP Unlocker** unlocks Picture-in-Picture on every video. An options page lets you choose between every site (default), only listed sites, or every site except the listed ones. Crunchyroll's player (which lives inside an
iframe and creates the `<video>` late) sets `disablepictureinpicture`, hiding the browser's PiP
button. This extension runs in all frames at `document_start`, removes the attribute and prevents
the page from setting it again. On Firefox the native PiP toggle reappears; on Chromium browsers a
floating button and the `Alt+P` shortcut are provided. The only permission is `storage` (for the options); no network, no telemetry.
Made by **Jackson Alves** ([@jackson-jpc](https://github.com/jackson-jpc)). Not affiliated with Crunchyroll, LLC. MIT licensed.
