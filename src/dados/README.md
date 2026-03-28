# Pasta: /src/data

Esta pasta contém os arquivos responsáveis por simular a camada de dados e a persistência da aplicação.

## ❯ Propósito

Como este projeto é um *front-end* puro sem um banco de dados real, esta pasta serve como uma camada de abstração para o **armazenamento e a manipulação de dados**. Ela simula como a aplicação interagiria com uma API ou um banco de dados, utilizando o **Local Storage** do navegador para persistência.

Isso permite que os dados (clientes, veículos, serviços) não se percam ao recarregar a página, proporcionando uma experiência de usuário mais realista.

## 📂 Conteúdo

-   **`mockCustomers.js` / `mockData.js`**: Contêm os dados iniciais (mock data) que "populam" a aplicação na primeira vez que ela é executada. Esses arquivos são úteis para desenvolvimento e demonstração, garantindo que a aplicação sempre tenha conteúdo para exibir.

-   **`database.js`**: Este é o coração da nossa camada de dados simulada. Ele contém a lógica para:
    -   **Inicializar o banco de dados:** Verifica se já existem dados no Local Storage e, caso contrário, carrega os dados mock.
    -   **CRUD (Create, Read, Update, Delete):** Expõe "serviços" (ex: `clienteService`, `vehiculoService`) com métodos como `getAll()`, `getById(id)`, `create(data)`, `update(id, data)` e `delete(id)`.
    -   **Persistência:** Garante que qualquer alteração feita nos dados seja salva de volta no Local Storage.

## ✨ Como Funciona

Os componentes da aplicação (nas páginas) não interagem diretamente com o Local Storage. Em vez disso, eles importam os "serviços" do `database.js`.

**Exemplo de uso:**

```jsx
// Em uma página de gerenciamento de clientes

import { clienteService } from '../data/database';
import { useEffect, useState } from 'react';

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Busca todos os clientes ao carregar a página
    const todosOsClientes = clienteService.getAll();
    setClientes(todosOsClientes);
  }, []);

  const handleDeletarCliente = (id) => {
    // Deleta um cliente e atualiza a lista
    clienteService.delete(id);
    setClientes(clienteService.getAll());
  };

  // ... resto do componente
};
```

Essa abstração é uma excelente prática, pois se no futuro decidirmos conectar este front-end a uma API real, precisaremos modificar apenas os arquivos nesta pasta (`/data`), sem precisar alterar a lógica nos componentes das páginas.