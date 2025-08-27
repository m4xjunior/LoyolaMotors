# Pasta: /src/styles

Esta pasta centraliza os arquivos de estilização globais e específicos da aplicação, utilizando principalmente **Sass (SCSS)** e **CSS**.

## ❯ Propósito

O objetivo desta pasta é organizar o código de estilização de forma limpa e modular, separando a aparência (estilos) da estrutura (JSX). Isso torna o projeto mais fácil de manter, permitindo que as alterações de design sejam feitas de forma isolada, sem impactar a lógica dos componentes.

## 📂 Conteúdo

A estrutura de estilos é dividida da seguinte forma:

-   **`index.scss`**: Este é o arquivo principal de estilos SCSS. Ele serve como ponto de entrada para todas as outras folhas de estilo. É aqui que importamos fontes, definimos variáveis globais (cores, fontes, etc.) e importamos os estilos de componentes da biblioteca `template.scss`.

-   **`template.scss`**: Contém os estilos base do template original, como a aparência de botões, tipografia, formulários e outros elementos de UI genéricos.

-   **`Dashboard.scss`**: Um arquivo SCSS dedicado aos estilos específicos do layout e dos componentes do painel de controle administrativo.

-   **`ServicesPage.css`**: Um exemplo de CSS modular. Este arquivo foi criado para abrigar os estilos customizados e mais complexos da página de Gestão de Serviços, incluindo as animações e o design moderno dos cards e do formulário. O uso de CSS puro aqui demonstra a flexibilidade de usar tanto CSS quanto SCSS no mesmo projeto Vite.

## ✨ Metodologia

1.  **Estilos Globais (SCSS):** Para estilos que afetam toda a aplicação, como a paleta de cores, tipografia e resets de CSS, usamos variáveis SCSS em `index.scss`.
2.  **Estilos de Template:** Estilos reutilizáveis que definem a aparência de elementos comuns são mantidos em `template.scss`.
3.  **Estilos Específicos de Página (CSS/SCSS):** Quando uma página possui um design muito particular ou complexo (como a `ServicesPage`), criamos um arquivo de estilo dedicado para ela (ex: `NomeDaPagina.css`). Esse arquivo é importado diretamente no componente da página correspondente.

Essa abordagem híbrida nos permite aproveitar o poder do SCSS para a organização global, ao mesmo tempo que nos dá a liberdade de criar estilos encapsulados para componentes específicos quando necessário.