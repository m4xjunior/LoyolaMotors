# LoyolaMotors - Dashboard de Gestão de Oficina

![Project Banner](public/assets/img/icon/loyola-logo.svg)

**Um sistema de gestão completo para oficinas automotivas, construído com React, Vite e um design moderno e responsivo.**

[![Status do Projeto](https://img.shields.io/badge/status-ativo-brightgreen.svg)](https://github.com/m4xjunior/LoyolaMotors)
[![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](/LICENSE)
[![React Version](https://img.shields.io/badge/react-18.2.0-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-^5.1.4-yellowgreen?logo=vite&logoColor=white)](https://vitejs.dev/)

---

## ❯ Sobre o Projeto

**LoyolaMotors** é uma Single Page Application (SPA) projetada para centralizar e otimizar as operações diárias de uma oficina automotiva. A aplicação oferece um dashboard intuitivo para gerenciar todos os aspectos do negócio, desde o primeiro contato com o cliente até o histórico completo de manutenções de um veículo.

O foco é fornecer uma experiência de usuário (UX) fluida e uma interface (UI) profissional, garantindo que a gestão de dados seja eficiente e visualmente agradável.

---

## ✨ Principais Funcionalidades (Versão 2.0)

A **versão 2.0** representa uma evolução massiva em termos de design, usabilidade e qualidade de código, transformando a aplicação em uma ferramenta moderna e robusta.

### 🎨 Modernização da UI/UX

-   **Design Futurista:** Implementada uma nova identidade visual com gradientes suaves, efeitos de *backdrop-filter*, sombras profundas e animações que proporcionam uma experiência premium.
-   **Tabela de Clientes Redesenhada:** A tabela de clientes foi completamente modernizada, com um layout mais limpo, avatares dinâmicos, badges de status com gradientes e ações interativas com *hover effects*.
-   **Página de Serviços Aprimorada:**
    -   **Cards de Estatísticas:** As métricas agora são apresentadas em cards de destaque com tipografia impactante e animações.
    -   **Cards de Serviço:** O layout foi reestruturado para uma melhor hierarquia visual, facilitando a leitura das informações.
    -   **Formulário Moderno:** O formulário de criação/edição de serviços foi totalmente estilizado para se alinhar ao novo design, melhorando a usabilidade.
-   **Cards de Veículos Interativos:** Os cards de veículos também receberam o novo tratamento visual, com animações e um layout mais limpo.

### 🧹 Qualidade de Código e Refatoração

-   **Código Limpo:** Realizada uma varredura completa para corrigir todos os avisos e erros do ESLint, incluindo a remoção de variáveis não utilizadas e a correção de dependências de hooks.
-   **Estilização Modular:** O CSS foi separado da lógica dos componentes, com a criação de arquivos dedicados (ex: `ServicesPage.css`), tornando o código mais organizado e de fácil manutenção.
-   **Otimização de Desenvolvimento:** O código foi refatorado para garantir a melhor compatibilidade com o *React Fast Refresh*, melhorando a experiência de desenvolvimento.
-   **Gestão de Repositório:** O histórico do Git foi limpo e padronizado para uma única branch `main`, seguindo as melhores práticas de versionamento.

---

## 🛠️ Tecnologias Utilizadas

-   **Frontend:** React 18, Vite
-   **Estilização:** SCSS, CSS Modules, Estilos Inline para componentes dinâmicos
-   **Roteamento:** React Router DOM
-   **Linting:** ESLint
-   **Contexto:** React Context API para gerenciamento de estado (Autenticação)

---

## 📂 Estrutura do Projeto

O projeto é organizado de forma modular para facilitar a navegação e a manutenção.

```
/
├── public/                # Arquivos estáticos, como imagens e fontes
├── src/
│   ├── components/        # Componentes reutilizáveis (botões, cards, etc.)
│   ├── contexts/          # Context API para gerenciamento de estado global
│   ├── data/              # Simulação de banco de dados (mock data)
│   ├── layout/            # Estrutura principal da aplicação (Header, Footer, etc.)
│   ├── pages/             # Componentes que representam as páginas da aplicação
│   ├── styles/            # Arquivos de estilo globais e específicos de páginas
│   └── App.jsx            # Componente principal e configuração de rotas
├── .eslintrc.cjs          # Configuração do ESLint
├── README.md              # Documentação do projeto
└── package.json           # Dependências e scripts do projeto
```

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/m4xjunior/LoyolaMotors.git
    ```

2.  **Navegue até o diretório do projeto:**
    ```bash
    cd LoyolaMotors
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

Após executar o último comando, a aplicação estará disponível em `http://localhost:5173` (ou em outra porta, caso a 5173 esteja ocupada).

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](/LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ por m4xjunior**