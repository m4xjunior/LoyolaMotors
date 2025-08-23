# Dashboard de Gestão de Clientes - LoyolaMotors

## Visão Geral

A Dashboard de Gestão de Clientes da LoyolaMotors é uma interface moderna e profissional desenvolvida para facilitar o gerenciamento completo de clientes, veículos e serviços automotivos. Esta dashboard foi projetada seguindo os padrões visuais da identidade da LoyolaMotors, oferecendo uma experiência de usuário intuitiva e eficiente.

## ✨ Funcionalidades Principais

### 📊 Estatísticas em Tempo Real
- **Total de Clientes**: Contador de clientes ativos no sistema
- **Veículos Cadastrados**: Número de veículos registrados
- **Serviços Pendentes**: Serviços aguardando atendimento
- **Serviços Completados**: Serviços finalizados com sucesso
- **Receita do Mês**: Faturamento mensal em tempo real

### 📈 Métricas de Performance
- **Gráfico de Barras**: Visualização de serviços por mês
- **Progresso Circular**: Taxa de satisfação dos clientes
- **Indicadores de Tendência**: Percentuais de crescimento/declínio

### 🕒 Timeline de Atividades
- Histórico de ações recentes no sistema
- Novos clientes cadastrados
- Serviços completados
- Pagamentos recebidos
- Agendamentos criados

### ⚡ Ações Rápidas
- **Novo Cliente**: Cadastro rápido de cliente
- **Novo Serviço**: Registro de serviço
- **Gestão de Veículos**: Administração de veículos
- **Gestão de Usuários**: (Apenas para administradores)

## 🎨 Design e Interface

### Paleta de Cores
- **Cor Primária**: #ff3d24 (Vermelho LoyolaMotors)
- **Fundo**: #101010 (Preto profundo)
- **Texto Principal**: #ffffff (Branco)
- **Texto Secundário**: #d3d3d3 (Cinza claro)

### Tipografia
- **Títulos**: Oxanium (Font family principal)
- **Corpo de texto**: Sarabun (Font family secundária)

### Elementos Visuais
- **Gradientes**: Efeitos de profundidade
- **Sombras**: Drop shadows sutis
- **Bordas**: Bordas arredondadas (16px)
- **Animações**: Transições suaves (0.3s ease)

## 🛠️ Componentes Desenvolvidos

### StatCard
Cartões de estatísticas com:
- Ícones SVG personalizados
- Valores numéricos destacados
- Indicadores de tendência
- Efeitos hover animados

### SimpleChart
Gráfico de barras simples com:
- Visualização responsiva
- Tooltips informativos
- Animações de hover
- Cores personalizáveis

### CircularProgress
Progresso circular para métricas:
- Animação de preenchimento
- Valores centralizados
- Efeitos de sombra
- Labels descritivas

### QuickActionCard
Cartões de ação rápida com:
- Ícones representativos
- Títulos e descrições
- Links para páginas específicas
- Efeitos de elevação

## 📱 Responsividade

A dashboard é totalmente responsiva, adaptando-se a diferentes tamanhos de tela:

- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Grid adaptável com reorganização de componentes
- **Mobile**: Layout em coluna única com elementos otimizados

### Breakpoints
- Desktop: ≥ 1024px
- Tablet: 768px - 1023px
- Mobile: < 768px

## 🔧 Tecnologias Utilizadas

- **React 18**: Framework principal
- **React Router**: Navegação entre páginas
- **SASS/SCSS**: Estilização avançada
- **PropTypes**: Validação de propriedades
- **Date-fns**: Manipulação de datas
- **Context API**: Gerenciamento de estado

## 📁 Estrutura de Arquivos

```
src/
├── pages/
│   └── DashboardPage.jsx
├── components/
│   └── Dashboard/
│       ├── SimpleChart.jsx
│       └── CircularProgress.jsx
├── styles/
│   └── Dashboard.scss
└── contexts/
    └── AuthContext.js
```

## 🚀 Como Usar

### 1. Acesso à Dashboard
```javascript
// Navegue para /dashboard após fazer login
import { useAuth } from '../contexts/AuthContext';

const { user } = useAuth();
// Usuário deve estar autenticado
```

### 2. Personalização de Estatísticas
```javascript
// As estatísticas são calculadas automaticamente
// baseadas nos dados dos clientes e serviços
const stats = {
  totalClientes: mockCustomers.filter(c => c.activo).length,
  totalVehiculos: mockVehicles.filter(v => v.activo).length,
  // ... outras métricas
};
```

### 3. Adição de Novas Métricas
```javascript
// Para adicionar uma nova métrica:
<StatCard
  title="Nova Métrica"
  value={novoValor}
  subtitle="Descrição da métrica"
  icon={<NovoIcone />}
  trend={percentualMudanca}
/>
```

## 🎯 Funcionalidades Avançadas

### Filtros de Período
- Visualização de dados por mês, trimestre ou ano
- Comparação entre períodos diferentes

### Exportação de Dados
- Relatórios em PDF
- Exportação para Excel
- Gráficos para impressão

### Notificações
- Alertas de serviços pendentes
- Notificações de novos clientes
- Lembretes de follow-up

### Temas
- Tema escuro (padrão)
- Tema claro (opcional)
- Modo de alto contraste

## 🔒 Segurança

### Controle de Acesso
- Autenticação obrigatória
- Níveis de permissão (usuário/admin)
- Sessão com timeout automático

### Proteção de Dados
- Dados sensíveis mascarados
- Logs de auditoria
- Backup automático

## 📊 Métricas de Performance

### Tempo de Carregamento
- Carregamento inicial: < 2s
- Navegação entre seções: < 500ms
- Atualização de dados: < 1s

### Usabilidade
- Interface intuitiva
- Acessibilidade WCAG 2.1
- Suporte a teclado completo

## 🐛 Solução de Problemas

### Problemas Comuns

1. **Dashboard não carrega**
   - Verificar autenticação do usuário
   - Confirmar permissões de acesso
   - Verificar conectividade

2. **Gráficos não aparecem**
   - Verificar dados de origem
   - Confirmar componentes importados
   - Validar formatação de dados

3. **Estatísticas incorretas**
   - Verificar cálculos nas funções useEffect
   - Confirmar filtros aplicados
   - Validar dados mock

## 🚀 Atualizações Futuras

### Versão 2.0 (Planejado)
- [ ] Integração com API real
- [ ] Dashboard customizável
- [ ] Mais tipos de gráficos
- [ ] Relatórios avançados
- [ ] Integração com CRM

### Melhorias Contínuas
- [ ] Otimização de performance
- [ ] Novas animações
- [ ] Modo offline
- [ ] PWA (Progressive Web App)

## 📞 Suporte

Para questões relacionadas à dashboard:

- **Desenvolvedor**: Equipe LoyolaMotors
- **Documentação**: Este arquivo README
- **Issues**: Reportar bugs via sistema interno

---

**Versão**: 1.0.0  
**Última Atualização**: Janeiro 2024  
**Compatibilidade**: React 18+, Chrome 90+, Firefox 88+, Safari 14+