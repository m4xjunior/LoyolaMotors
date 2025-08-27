# Pasta: /src/layout

Esta pasta contém os componentes responsáveis pela **estrutura visual principal** e consistente da aplicação.

## ❯ Propósito

Os componentes de layout definem o "esqueleto" de uma página. Eles são usados para garantir que elementos comuns, como o cabeçalho (`Header`), o rodapé (`Footer`) e a navegação, apareçam de forma consistente em todas as páginas do site, evitando a repetição de código.

Eles funcionam como um "template" onde o conteúdo específico de cada página é inserido.

## 📂 Conteúdo

-   **`Header/`**: Contém o componente `Header.jsx`, responsável por renderizar o cabeçalho superior da aplicação, que inclui a logo, o menu de navegação principal (`NavMenu`) e links de contato ou login.

-   **`Footer/`**: Contém o componente `Footer.jsx`, que renderiza o rodapé exibido em todas as páginas.

-   **`DashboardLayout/`**: Uma subpasta que contém a estrutura específica para o painel de controle administrativo.
    -   `DashboardHeader.jsx`: O cabeçalho exclusivo do dashboard.
    -   `DashboardSidebar.jsx`: A barra de navegação lateral (menu) do dashboard.
    -   `DashboardMain.jsx`: O componente que organiza o layout do dashboard e provê o contexto (`DashboardContext`) para controlar o estado da sidebar.

-   **`Main.jsx`**: Este é um componente de layout de nível superior que age como o "orquestrador". Ele utiliza o `Outlet` do `react-router-dom` para renderizar o componente da página ativa entre o `Header` e o `Footer`, garantindo que essa estrutura seja aplicada a todas as rotas aninhadas a ele.

## ✨ Como Funciona

No arquivo de rotas principal (`App.jsx`), o `Main.jsx` é usado como um *layout route*, envolvendo todas as outras rotas de páginas públicas.

**Exemplo simplificado de `App.jsx`:**

```jsx
import { Routes, Route } from 'react-router-dom';
import Main from './layout/Main';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Routes>
      {/* Rotas que usam o layout principal (com Header e Footer) */}
      <Route path="/" element={<Main />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>

      {/* Rota do Dashboard, que pode ter seu próprio layout */}
      <Route path="/dashboard" element={<DashboardLayout />}>
         <Route index element={<DashboardPage />} />
         {/* ... outras rotas do dashboard */}
      </Route>
    </Routes>
  );
}
```

Dessa forma, qualquer página renderizada dentro da rota `<Main />` herdará automaticamente o cabeçalho e o rodapé definidos nele.