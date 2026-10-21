# Changelog

## 1.2.0
- Renomeada para "Picture-in-Picture Unlocker" (nome curto "PiP Unlocker"). Novo ícone (arte própria, glossy azul) e banners das lojas refeitos.
- Página de opções com três modos: todos os sites (padrão), somente os sites da lista, ou todos exceto os da lista.
  Permite restringir a execução em sites sensíveis sem perder a liberação global.
- Removida a varredura periódica a cada 2 segundos. A detecção agora usa apenas `MutationObserver` e
  eventos de mídia (`loadstart`, `loadedmetadata`, `play`, `playing`) em fase de captura, que custam zero
  quando nada acontece, mais uma varredura única ao voltar para a aba.
- Quando um site não está autorizado, os patches do mundo principal ficam em modo passthrough e o que o
  site tentou fazer antes da decisão é restaurado.
- Nova permissão `storage` (só para guardar as opções; nada sai do navegador).

## 1.1.0
- Ícones, nome e descrição em português e inglês.
- Metadados de autor e página inicial.
- Build unificado (`build.sh`) gerando pacotes para Chrome e Firefox.

## 1.0.0
- Primeira versão: remove e bloqueia `disablepictureinpicture` em todos os frames.
- Botão flutuante e atalho Alt+P no Chrome.
