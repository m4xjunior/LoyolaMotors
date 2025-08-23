# LoyolaMotors - Sistema de Gestão de Oficina Automotiva

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)

Um sistema completo para a gestão de clientes, veículos e serviços de uma oficina automotiva, construído com React e Vite.

---

## Tabela de Conteúdos

1.  [Visão Geral do Projeto](#-visão-geral-do-projeto)
2.  [Funcionalidades Principais](#-funcionalidades-principais)
3.  [Tecnologias Utilizadas](#-tecnologias-utilizadas)
4.  [Estrutura de Pastas](#-estrutura-de-pastas)
5.  [Como Começar](#️-como-começar)
6.  [Scripts Disponíveis](#-scripts-disponíveis)
7.  [Deploy](#-deploy)

---

## 📖 Visão Geral do Projeto

**LoyolaMotors** é uma Single Page Application (SPA) projetada para centralizar e otimizar as operações diárias de uma oficina automotiva. A aplicação oferece uma interface de dashboard intuitiva para gerenciar todos os aspectos do negócio, desde o primeiro contato com o cliente até o histórico completo de manutenções de um veículo.

O sistema utiliza o **Local Storage** do navegador para simular um banco de dados, permitindo a persistência de dados de forma local sem a necessidade de um backend complexo.

---

## ✨ Funcionalidades Principais

-   **Dashboard Central:** Uma visão geral com estatísticas rápidas, como número total de clientes, veículos ativos e serviços em andamento.
-   **Gestão Completa de Clientes:**
    -   Funcionalidades de Criar, Ler, Atualizar e Excluir (CRUD) para clientes.
    -   Visualização detalhada de cada cliente, incluindo seus veículos e histórico de serviços.
    -   Busca e filtragem por nome, status, tipo de cliente e cidade.
-   **Gestão de Veículos:**
    -   CRUD completo para os veículos da oficina.
    -   Associação de cada veículo a um cliente.
    -   Registro de informações essenciais: marca, modelo, ano, matrícula, quilometragem, cor e VIN.
-   **Gestão de Serviços:**
    -   Criação e acompanhamento de ordens de serviço.
    -   Atribuição de status (Pendente, Em Processo, Concluído, Cancelado).
    -   Registro de custos e detalhes do serviço.
-   **Autenticação Segura:** Sistema de login para proteger o acesso às informações do dashboard.
-   **Interface Responsiva:** O layout se adapta a diferentes tamanhos de tela, garantindo usabilidade em desktops, tablets e smartphones.

---

## 🚀 Tecnologias Utilizadas

-   **Frontend:** [React.js](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Roteamento:** [React Router DOM](https://reactrouter.com/)
-   **Estilização:** [Sass (SCSS)](https://sass-lang.com/)
-   **Validação de Tipos:** [PropTypes](https://www.npmjs.com/package/prop-types)
-   **Banco de Dados (Simulado):** Local Storage do navegador.

---

## 📂 Estrutura de Pastas

O projeto é organizado de forma modular para facilitar a manutenção e escalabilidade.

```
/
├── dist/                  # Arquivos de produção (gerados pelo build)
├── node_modules/          # Dependências do projeto
├── public/                # Assets públicos
└── src/
    ├── assets/            # Imagens, fontes, etc.
    ├── components/        # Componentes reutilizáveis (Header, Footer, etc.)
    ├── constants/         # Constantes globais (tipos de cliente, marcas, etc.)
    ├── contexts/          # React Context para gestão de estado (AuthContext)
    ├── data/              # Camada de simulação do banco de dados (database.js)
    ├── layout/            # Estruturas de layout da página (DashboardLayout)
    ├── pages/             # Componentes de página para cada rota
    ├── styles/            # Arquivos SASS globais, variáveis e mixins
    ├── App.jsx            # Componente principal com a configuração de rotas
    └── main.jsx           # Ponto de entrada da aplicação
├── .eslintrc.cjs          # Configuração do ESLint
├── .gitignore             # Arquivos ignorados pelo Git
├── package.json           # Dependências e scripts do projeto
├── README.md              # Este arquivo
└── vite.config.js         # Configuração do Vite
```

---

## 🛠️ Como Começar

Siga os passos abaixo para executar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 18.x ou superior)
-   [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Instalação e Execução

1.  **Clone o repositório:**
    ```sh
    git clone https://github.com/seu-usuario/loyola-motors.git
    ```

2.  **Navegue até o diretório do projeto:**
    ```sh
    cd LoyolaMotors
    ```

3.  **Instale as dependências:**
    ```sh
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```sh
    npm run dev
    ```

A aplicação estará disponível em `http://localhost:5173`.

---

## 📜 Scripts Disponíveis

-   `npm run dev`: Inicia o servidor de desenvolvimento com Hot Module Replacement (HMR).
-   `npm run build`: Compila e otimiza a aplicação para produção. Os arquivos são gerados na pasta `dist/`.
-   `npm run lint`: Executa o ESLint para analisar o código e encontrar problemas.
-   `npm run preview`: Inicia um servidor local para visualizar os arquivos de produção da pasta `dist/`.

---

## ☁️ Deploy

Este projeto é construído como uma aplicação estática, o que torna o deploy simples e rápido.

1.  **Gere os arquivos de produção:**
    ```sh
    npm run build
    ```
2.  **Publique o conteúdo da pasta `dist/`** em qualquer serviço de hospedagem de sites estáticos.

### Plataformas Recomendadas

-   [Vercel](https://vercel.com/)
-   [Netlify](https://www.netlify.com/)
-   [GitHub Pages](https://pages.github.com/)