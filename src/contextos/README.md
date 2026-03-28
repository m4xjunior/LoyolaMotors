# Pasta: /src/contexts

Esta pasta é dedicada ao **gerenciamento de estado global** da aplicação utilizando a **React Context API**.

## ❯ Propósito

Em uma aplicação React, compartilhar dados entre componentes que não são diretamente pai e filho pode ser complexo. Os "Contexts" resolvem esse problema criando uma "árvore" de dados global que qualquer componente pode acessar sem a necessidade de passar `props` manualmente por vários níveis (um problema conhecido como "prop drilling").

Esta pasta centraliza todos os provedores de contexto da aplicação.

## 📂 Conteúdo

Atualmente, o principal contexto definido aqui é:

-   **`AuthContext.jsx`**: Gerencia todo o estado relacionado à **autenticação** do usuário.
    -   Armazena as informações do usuário logado (`user`).
    -   Expõe funções para `login()`, `logout()`.
    -   Fornece helpers como `isAuthenticated()` e `hasRole()` para verificar permissões em toda a aplicação.

## ✨ Como Usar

Para consumir um contexto em qualquer componente, utilizamos o hook customizado exportado pelo arquivo de contexto. Isso torna o uso mais limpo e desacoplado da implementação.

**Exemplo de uso do `AuthContext`:**

```jsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated()) {
    return <p>Por favor, faça o login.</p>;
  }

  return (
    <div>
      <h1>Bem-vindo, {user.nombre}!</h1>
      <button onClick={logout}>Sair</button>
    </div>
  );
};
```

## 💡 Boas Práticas

-   **Use Context para estado global:** Ideal para dados que são necessários em muitas partes da aplicação, como informações de usuário, tema (claro/escuro), ou configurações de idioma.
-   **Não abuse:** Para estados que são usados apenas por um componente ou por seus filhos diretos, prefira o gerenciamento de estado local (`useState`) ou o "levantamento de estado" (state lifting). O uso excessivo de Context pode tornar o fluxo de dados mais difícil de rastrear.