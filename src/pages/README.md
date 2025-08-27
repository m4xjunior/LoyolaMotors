# Pasta: /src/pages

Esta pasta contém os **componentes de nível superior** que representam cada página ou rota específica da aplicação.

## ❯ Propósito

Enquanto a pasta `/components` contém pequenos blocos de construção reutilizáveis (como um botão), a pasta `/pages` contém os componentes que "montam" esses blocos para formar uma visão completa.

Cada arquivo aqui geralmente corresponde a uma rota definida no arquivo `App.jsx`. A responsabilidade de um componente de página inclui:

1.  **Estruturar o Conteúdo:** Organizar como os diferentes componentes (`/components`) e layouts (`/layout`) são exibidos na página.
2.  **Buscar e Gerenciar Dados:** Fazer a "ponte" entre a camada de dados (`/data`) e a interface, buscando as informações necessárias e gerenciando o estado da página (filtros, ordenação, paginação, etc.).
3.  **Lidar com a Lógica da Página:** Implementar a lógica de negócio específica daquela rota, como o que acontece ao submeter um formulário ou ao clicar em um botão de ação.

## 📂 Conteúdo

Aqui você encontrará um arquivo `.jsx` para cada rota principal da aplicação:

-   `DashboardPage.jsx`: A página inicial do painel administrativo, que exibe estatísticas e resumos.
-   `ClientesManagementPage.jsx`: A página de gerenciamento de clientes, que inclui a tabela, filtros e ações de CRUD.
-   `VehiclesPage.jsx`: A página para gerenciar os veículos da oficina.
-   `ServicesPage.jsx`: A página de gestão de todos os serviços.
-   `UsersManagementPage.jsx`: A página para administrar os usuários do sistema.
-   `LoginPage.jsx`: A tela de login para acesso ao painel.
-   ... entre outras.

## ✨ Exemplo de Estrutura de uma Página

Um componente de página típico segue esta estrutura:

```jsx
// 1. Importações de hooks, componentes e serviços
import { useState, useEffect } from 'react';
import { clienteService } from '../data/database';
import CommonPageHero from '../components/CommonPageHero/CommonPageHero';
import TabelaClientes from '../components/TabelaClientes/TabelaClientes';
import Filtros from '../components/Filtros/Filtros';

const ClientesManagementPage = () => {
  // 2. Gerenciamento do estado da página
  const [clientes, setClientes] = useState([]);
  const [filtroAtivo, setFiltroAtivo] = useState('todos');

  // 3. Lógica para buscar dados
  useEffect(() => {
    const dados = clienteService.getAll();
    // Lógica de filtragem...
    setClientes(dados);
  }, [filtroAtivo]);

  // 4. Funções para manipular eventos da página
  const handleFiltroChange = (novoFiltro) => {
    setFiltroAtivo(novoFiltro);
  };

  // 5. Renderização: montagem da página com os componentes
  return (
    <>
      <CommonPageHero title="Gestão de Clientes" />
      <div className="container">
        <Filtros onChange={handleFiltroChange} />
        <TabelaClientes data={clientes} />
      </div>
    </>
  );
};

export default ClientesManagementPage;
```

## 💡 Boas Práticas

-   **Mantenha as páginas focadas no layout e no fluxo de dados.** Evite colocar lógica de UI muito complexa diretamente nelas. Em vez disso, extraia essa lógica para componentes reutilizáveis em `/components`.
-   Uma página deve "orquestrar" os componentes, e não se preocupar com os detalhes de como um botão parece ou funciona internamente.