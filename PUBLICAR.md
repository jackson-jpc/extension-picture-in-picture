# Passo a passo para publicar

## 0. Identidade da extensão

- `manifest.firefox.json` → `id` = `pip-unlocker@jackson-jpc.github.io`. É só um identificador único no formato
  de e-mail; não precisa existir. **Depois de publicar na AMO, nunca mais mude esse id.**
- Licença MIT, autor Jackson Alves, repositório público em
  https://github.com/jackson-jpc/extension-picture-in-picture

## 1. GitHub

O repositório `jackson-jpc/extension-picture-in-picture` já existe e o `origin` já aponta para ele.
O `git init` está feito e todos os arquivos estão no índice, sem nenhum commit ainda.

**Atenção ao e-mail:** `jacksonteka@gmail.com` está cadastrado na conta GitHub **Prorrac**, então commits
com ele aparecem como da Prorrac. Use um e-mail cadastrado na conta `jackson-jpc`
(veja em https://github.com/settings/emails) ou o endereço privado dela, que sempre funciona:

```bash
git config user.name  "Jackson Alves"
git config user.email "34745501+jackson-jpc@users.noreply.github.com"   # ou um e-mail da conta jackson-jpc
git commit -m "Picture-in-Picture Unlocker 1.2.0"
git push --force -u origin main      # --force porque o main remoto tem commits antigos que serão descartados
```

Depois crie a release com os pacotes:

```bash
./build.sh
gh release create v1.2.0 dist/pip-unlocker-chrome.zip dist/pip-unlocker-firefox.zip \
  --title "Picture-in-Picture Unlocker 1.2.0" --notes-file CHANGELOG.md
```

Para cada versão nova: aumente a `version` em `manifest.base.json`, atualize o `CHANGELOG.md`,
rode `./build.sh`, faça commit e crie uma Release com a tag `vX.Y.Z` anexando os dois zips e o `.xpi`
assinado que a Mozilla devolve (passo 2).

## 2. Firefox Add-ons (AMO) — grátis

1. Conta em https://addons.mozilla.org → https://addons.mozilla.org/developers/
2. **Submit a New Add-on** → **On this site** (listado, público).
3. Envie `dist/pip-unlocker-firefox.zip`. A validação automática deve passar com 0 erros
   (já conferido com `web-ext lint`).
4. Quando perguntar se precisa de código-fonte: responda **Não** (o zip já é o fonte, sem build/minificação).
5. Preencha nome, resumo, descrição, categoria, licença MIT e política de privacidade usando `STORE_LISTING.md`.
6. Ícone: `src/icons/icon-128.png`. Capturas de tela são opcionais mas ajudam muito.
7. Envie. A revisão costuma levar de minutos a alguns dias. Você recebe por e-mail o resultado e o link público.

Atualizações futuras: aumente a `version` em `manifest.base.json`, `./build.sh`, e envie o novo zip em
**Upload New Version**.

## 3. Chrome Web Store — taxa única de US$ 5

1. https://chrome.google.com/webstore/devconsole → pague a taxa de registro (uma vez só, vale para sempre).
2. **New item** → envie `dist/pip-unlocker-chrome.zip`.
3. Aba **Store listing**: nome, resumo, descrição, categoria, idioma e imagens (ícone 128, pelo menos 1
   captura de tela 1280×800, tile 440×280). Tudo em `STORE_LISTING.md` e `store-assets/`.
4. Aba **Privacy practices**: cole o "single purpose", a justificativa de `host permissions`, marque
   que não coleta dados e informe o link da política de privacidade.
5. Aba **Distribution**: público, todos os países.
6. **Submit for review**. Extensões com `<all_urls>` passam por revisão manual; costuma levar de 1 a 7 dias.

Atualizações futuras: aumente a `version`, `./build.sh`, e envie o novo zip em **Package → Upload new package**.

## 4. Depois de publicado

Coloque os links das lojas no `README.md` (seção "Instalar") e faça o commit.
