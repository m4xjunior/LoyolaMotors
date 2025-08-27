# Pasta: /src/components

Esta pasta contém todos os **componentes React reutilizáveis** que formam os blocos de construção da interface do usuário (UI) da aplicação.

## ❯ Propósito

O objetivo principal desta pasta é promover a **reutilização de código** e a **consistência visual**. Em vez de reescrever o mesmo código em várias páginas (como um botão customizado ou um card), nós o criamos uma vez aqui e o importamos onde for necessário.

## 📂 Conteúdo

Aqui você encontrará componentes genéricos e de propósito específico, como:

-   `AdminNav/`: A barra de navegação lateral do painel de controle.
-   `CommonPageHero/`: O banner (hero) padrão utilizado no topo de várias páginas.
-   `Nav/`: O menu de navegação principal do site.
-   `ProtectedRoute/`: Um componente de ordem superior (HOC) que protege rotas, garantindo que apenas usuários autenticados possam acessá-las.
-   `ScrollUp/`: O botão "voltar ao topo" que aparece durante a rolagem da página.
-   ... e outros pequenos blocos de construção.

## ✨ Boas Práticas

-   **Componentes devem ser "burros":** Idealmente, os componentes aqui não devem conter lógica de negócio complexa. Eles recebem dados via `props` e os exibem.
-   **Nomeação clara:** O nome de cada pasta de componente deve refletir claramente sua função.
-   **Estilos encapsulados:** Sempre que possível, os estilos de um componente devem ser específicos para ele, evitando vazar e afetar outras partes da aplicação.
