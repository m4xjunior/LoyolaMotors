import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAutenticacion } from "../contextos/ContextoAutenticacion";
import CommonPageHero from "../componentes/HeroPagina/HeroPagina";
import { mockInvoices } from "../dados/dadosMock";

const PAGE_SIZE = 6;
const STATUS_TABS = ["all", "pagada", "pendiente", "vencida"];

const STATUS_META = {
  pagada: {
    label: "Pagada",
    dot: "#15803d",
    text: "#166534",
    border: "rgba(34, 197, 94, 0.25)",
    background: "rgba(240, 253, 244, 0.95)",
  },
  pendiente: {
    label: "Pendiente",
    dot: "#d97706",
    text: "#b45309",
    border: "rgba(245, 158, 11, 0.25)",
    background: "rgba(255, 251, 235, 0.98)",
  },
  vencida: {
    label: "Vencida",
    dot: "#dc2626",
    text: "#b91c1c",
    border: "rgba(239, 68, 68, 0.22)",
    background: "rgba(254, 242, 242, 0.98)",
  },
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value || 0);

const getStatusMeta = (status) => STATUS_META[status] || STATUS_META.pendiente;

const getPageNumbers = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
};

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowUpRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 17L17 7M9 7h8v8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FileTextIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M14 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V9z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2v7h7M9 13h6M9 17h6M9 9h2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WalletIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 7H4a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 12h.01M6 7V6a2 2 0 012-2h10"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AlertIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EmptyIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 9h6M9 13h3m6 7H6a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v9a2 2 0 01-2 2z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid transparent;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  height: 42px;
  padding: 0 18px;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const buttonVariant = {
  default: css`
    background: linear-gradient(135deg, #ff5a3d 0%, #ff3d24 100%);
    color: #ffffff;
    box-shadow: 0 14px 26px rgba(255, 90, 61, 0.2);

    &:hover {
      box-shadow: 0 16px 30px rgba(255, 90, 61, 0.28);
    }
  `,
  outline: css`
    background: rgba(255, 255, 255, 0.92);
    border-color: rgba(15, 23, 42, 0.1);
    color: #0f172a;

    &:hover {
      background: #ffffff;
      border-color: rgba(255, 90, 61, 0.28);
    }
  `,
  ghost: css`
    background: transparent;
    color: #475569;

    &:hover {
      background: rgba(248, 250, 252, 0.95);
      color: #0f172a;
    }
  `,
};

const PageSection = styled.div`
  padding: 42px 0 96px;
  background:
    radial-gradient(circle at top right, rgba(255, 90, 61, 0.14), transparent 28%),
    linear-gradient(180deg, rgba(255, 248, 244, 0.9) 0%, rgba(255, 255, 255, 0) 280px);
`;

const Stack = styled.div`
  display: grid;
  gap: 24px;
`;

const Card = styled.section`
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(14px);
`;

const HeroCard = styled(Card)`
  padding: 28px;
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.7fr);
  gap: 24px;
  align-items: center;
  background:
    radial-gradient(circle at 100% 0%, rgba(255, 90, 61, 0.18), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 248, 244, 0.92) 100%);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const HeroText = styled.div`
  display: grid;
  gap: 14px;
`;

const Eyebrow = styled.span`
  display: inline-flex;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 90, 61, 0.12);
  color: #c2410c;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const HeroTitle = styled.h1`
  margin: 0;
  color: #0f172a;
  font-size: clamp(2rem, 2.8vw, 3rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
`;

const HeroDescription = styled.p`
  margin: 0;
  max-width: 58ch;
  color: #475569;
  font-size: 15px;
  line-height: 1.75;
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 6px;
`;

const ButtonLink = styled(Link)`
  text-decoration: none;
  ${buttonStyles}
  ${({ $variant = "default" }) => buttonVariant[$variant]};
`;

const Button = styled.button`
  ${buttonStyles}
  ${({ $variant = "default" }) => buttonVariant[$variant]};
`;

const HeroAside = styled.div`
  display: grid;
  gap: 14px;
`;

const HighlightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

const HighlightTile = styled.div`
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 18px;
  display: grid;
  gap: 6px;
`;

const HighlightLabel = styled.span`
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const HighlightValue = styled.strong`
  color: #0f172a;
  font-size: 1.2rem;
  line-height: 1.2;
`;

const HighlightMeta = styled.span`
  color: #94a3b8;
  font-size: 13px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(Card)`
  padding: 20px;
  display: grid;
  gap: 14px;
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
`;

const StatIcon = styled.div`
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  color: ${({ $tone }) => $tone};
  background: ${({ $background }) => $background};
`;

const StatLabel = styled.span`
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
`;

const StatValue = styled.strong`
  color: #0f172a;
  font-size: clamp(1.4rem, 2.2vw, 1.85rem);
  letter-spacing: -0.03em;
`;

const StatFootnote = styled.span`
  color: #94a3b8;
  font-size: 13px;
`;

const ToolbarCard = styled(Card)`
  padding: 18px;
  display: grid;
  gap: 18px;
`;

const ToolbarTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const ToolbarText = styled.div`
  display: grid;
  gap: 6px;
`;

const ToolbarTitle = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: 1.2rem;
  letter-spacing: -0.02em;
`;

const ToolbarDescription = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 14px;
`;

const SearchRow = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
`;

const InputGroup = styled.div`
  position: relative;
  flex: 1 1 320px;
  min-width: 240px;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  height: 46px;
  padding: 0 16px 0 44px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: #ffffff;
  color: #0f172a;
  font-size: 14px;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 90, 61, 0.35);
    box-shadow: 0 0 0 4px rgba(255, 90, 61, 0.1);
  }
`;

const Tabs = styled.div`
  width: 100%;
`;

const TabsList = styled.div`
  width: fit-content;
  max-width: 100%;
  display: inline-flex;
  gap: 8px;
  padding: 6px;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(248, 250, 252, 0.96);
  overflow-x: auto;
`;

const TabsTrigger = styled.button`
  height: 38px;
  border: 0;
  border-radius: 12px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${({ $active }) =>
    $active ? "linear-gradient(135deg, #ff5a3d 0%, #ff3d24 100%)" : "transparent"};
  color: ${({ $active }) => ($active ? "#ffffff" : "#475569")};
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: ${({ $active }) =>
    $active ? "0 12px 24px rgba(255, 90, 61, 0.24)" : "none"};
  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const CountBadge = styled.span`
  min-width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $active }) =>
    $active ? "rgba(255, 255, 255, 0.16)" : "rgba(148, 163, 184, 0.14)"};
  color: inherit;
`;

const TableCard = styled(Card)`
  overflow: hidden;
`;

const TableHeaderBar = styled.div`
  padding: 20px 22px 0;
`;

const TableSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding-bottom: 16px;
`;

const TableSummaryText = styled.div`
  display: grid;
  gap: 6px;
`;

const TableSummaryTitle = styled.h3`
  margin: 0;
  color: #0f172a;
  font-size: 1.1rem;
`;

const TableSummaryDescription = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 14px;
`;

const TableViewport = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 760px;
  border-collapse: separate;
  border-spacing: 0;
`;

const TableHead = styled.thead`
  background: rgba(248, 250, 252, 0.92);
`;

const TableHeadCell = styled.th`
  padding: 14px 22px;
  border-top: 1px solid rgba(15, 23, 42, 0.06);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: ${({ $align = "left" }) => $align};
`;

const TableRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.18s ease;

  &:hover td {
    background: rgba(255, 248, 244, 0.92);
  }
`;

const TableCell = styled.td`
  padding: 18px 22px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(255, 255, 255, 0.96);
  color: #334155;
  font-size: 14px;
  vertical-align: middle;
  text-align: ${({ $align = "left" }) => $align};
`;

const InvoiceIdentity = styled.div`
  display: grid;
  gap: 4px;
`;

const InvoiceNumber = styled.span`
  color: #0f172a;
  font-size: 15px;
  font-weight: 700;
`;

const InvoiceMeta = styled.span`
  color: #94a3b8;
  font-size: 13px;
`;

const ClientBlock = styled.div`
  display: grid;
  gap: 4px;
`;

const ClientName = styled.span`
  color: #0f172a;
  font-size: 14px;
  font-weight: 600;
`;

const ClientMeta = styled.span`
  color: #94a3b8;
  font-size: 13px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid ${({ $borderColor }) => $borderColor};
  background: ${({ $backgroundColor }) => $backgroundColor};
  color: ${({ $textColor }) => $textColor};
  font-size: 12px;
  font-weight: 700;
`;

const BadgeDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
`;

const Amount = styled.span`
  color: #0f172a;
  font-size: 15px;
  font-weight: 700;
`;

const ActionGroup = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  gap: 8px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  flex-wrap: wrap;
`;

const PaginationInfo = styled.span`
  color: #64748b;
  font-size: 14px;
`;

const PaginationContent = styled.nav`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const PaginationButton = styled.button`
  min-width: ${({ $compact }) => ($compact ? "38px" : "44px")};
  height: 38px;
  border-radius: 12px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(255, 90, 61, 0.26)" : "rgba(15, 23, 42, 0.1)"};
  background: ${({ $active }) =>
    $active ? "rgba(255, 90, 61, 0.12)" : "rgba(255, 255, 255, 0.9)"};
  color: ${({ $active }) => ($active ? "#c2410c" : "#475569")};
  font-size: 13px;
  font-weight: 700;
  padding: 0 12px;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background-color 0.18s ease;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    transform: translateY(-1px);
    border-color: rgba(255, 90, 61, 0.26);
  }
`;

const Empty = styled.div`
  padding: 46px 22px 22px;
`;

const EmptyCard = styled.div`
  border-radius: 18px;
  border: 1px dashed rgba(15, 23, 42, 0.12);
  background: linear-gradient(
    180deg,
    rgba(248, 250, 252, 0.88) 0%,
    rgba(255, 255, 255, 0.96) 100%
  );
  padding: 34px 26px;
  display: grid;
  gap: 16px;
  justify-items: center;
  text-align: center;
`;

const EmptyMedia = styled.div`
  width: 56px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: rgba(255, 90, 61, 0.1);
  color: #c2410c;
`;

const EmptyTitle = styled.h3`
  margin: 0;
  color: #0f172a;
  font-size: 1.1rem;
`;

const EmptyDescription = styled.p`
  margin: 0;
  color: #64748b;
  max-width: 42ch;
  line-height: 1.7;
`;

const InvoicesPage = () => {
  const { logout } = useAutenticacion();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setInvoices(mockInvoices);
  }, []);

  const countsByStatus = useMemo(
    () =>
      invoices.reduce(
        (accumulator, invoice) => {
          const status = invoice.status || "pendiente";
          accumulator[status] = (accumulator[status] || 0) + 1;
          return accumulator;
        },
        { pagada: 0, pendiente: 0, vencida: 0 },
      ),
    [invoices],
  );

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const statusMatch =
        activeStatus === "all" || (invoice.status || "pendiente") === activeStatus;

      const searchableFields = [
        invoice.number,
        invoice.clientName,
        invoice.clientCIF,
        invoice.clientEmail,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const searchMatch =
        normalizedSearch.length === 0 ||
        searchableFields.includes(normalizedSearch);

      return statusMatch && searchMatch;
    });
  }, [activeStatus, invoices, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PAGE_SIZE));
  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const stats = useMemo(() => {
    const totalAmount = invoices.reduce(
      (sum, invoice) => sum + (invoice.total || 0),
      0,
    );
    const paidAmount = invoices
      .filter((invoice) => invoice.status === "pagada")
      .reduce((sum, invoice) => sum + (invoice.total || 0), 0);
    const pendingAmount = invoices
      .filter((invoice) => invoice.status === "pendiente")
      .reduce((sum, invoice) => sum + (invoice.total || 0), 0);
    const overdueAmount = invoices
      .filter((invoice) => invoice.status === "vencida")
      .reduce((sum, invoice) => sum + (invoice.total || 0), 0);

    return {
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
      averageTicket: invoices.length ? totalAmount / invoices.length : 0,
    };
  }, [invoices]);

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const clearFilters = () => {
    setSearchTerm("");
    setActiveStatus("all");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <CommonPageHero title="Dashboard" />
      <PageSection>
        <div className="container">
          <Stack>
            <HeroCard>
              <HeroText>
                <Eyebrow>Facturacion</Eyebrow>
                <HeroTitle>Centro de control para todas tus facturas</HeroTitle>
                <HeroDescription>
                  La lista de facturas ahora funciona como un dashboard de
                  facturacion: puedes filtrar por estado, buscar por cliente o
                  CIF y abrir cada documento desde una tabla mucho mas limpia.
                </HeroDescription>
                <HeroActions>
                  <ButtonLink to="/create-invoice">
                    <PlusIcon />
                    Nueva factura
                  </ButtonLink>
                  <Button type="button" $variant="outline" onClick={handleLogout}>
                    Cerrar sesion
                  </Button>
                </HeroActions>
              </HeroText>

              <HeroAside>
                <HighlightGrid>
                  <HighlightTile>
                    <HighlightLabel>Emitidas</HighlightLabel>
                    <HighlightValue>{invoices.length}</HighlightValue>
                    <HighlightMeta>Documentos en el tablero</HighlightMeta>
                  </HighlightTile>
                  <HighlightTile>
                    <HighlightLabel>Vencidas</HighlightLabel>
                    <HighlightValue>{countsByStatus.vencida}</HighlightValue>
                    <HighlightMeta>Requieren seguimiento</HighlightMeta>
                  </HighlightTile>
                  <HighlightTile>
                    <HighlightLabel>Pendientes</HighlightLabel>
                    <HighlightValue>{formatCurrency(stats.pendingAmount)}</HighlightValue>
                    <HighlightMeta>Importe por cobrar</HighlightMeta>
                  </HighlightTile>
                  <HighlightTile>
                    <HighlightLabel>Ticket medio</HighlightLabel>
                    <HighlightValue>{formatCurrency(stats.averageTicket)}</HighlightValue>
                    <HighlightMeta>Promedio por factura</HighlightMeta>
                  </HighlightTile>
                </HighlightGrid>
              </HeroAside>
            </HeroCard>

            <StatsGrid>
              <StatCard>
                <StatHeader>
                  <StatLabel>Total facturado</StatLabel>
                  <StatIcon
                    $tone="#c2410c"
                    $background="rgba(255, 90, 61, 0.12)"
                  >
                    <FileTextIcon />
                  </StatIcon>
                </StatHeader>
                <StatValue>{formatCurrency(stats.totalAmount)}</StatValue>
                <StatFootnote>{invoices.length} facturas emitidas</StatFootnote>
              </StatCard>

              <StatCard>
                <StatHeader>
                  <StatLabel>Cobrado</StatLabel>
                  <StatIcon
                    $tone="#166534"
                    $background="rgba(34, 197, 94, 0.12)"
                  >
                    <WalletIcon />
                  </StatIcon>
                </StatHeader>
                <StatValue>{formatCurrency(stats.paidAmount)}</StatValue>
                <StatFootnote>{countsByStatus.pagada} facturas pagadas</StatFootnote>
              </StatCard>

              <StatCard>
                <StatHeader>
                  <StatLabel>Por cobrar</StatLabel>
                  <StatIcon
                    $tone="#b45309"
                    $background="rgba(245, 158, 11, 0.12)"
                  >
                    <ClockIcon />
                  </StatIcon>
                </StatHeader>
                <StatValue>{formatCurrency(stats.pendingAmount)}</StatValue>
                <StatFootnote>
                  {countsByStatus.pendiente} facturas pendientes
                </StatFootnote>
              </StatCard>

              <StatCard>
                <StatHeader>
                  <StatLabel>Importe vencido</StatLabel>
                  <StatIcon
                    $tone="#b91c1c"
                    $background="rgba(239, 68, 68, 0.12)"
                  >
                    <AlertIcon />
                  </StatIcon>
                </StatHeader>
                <StatValue>{formatCurrency(stats.overdueAmount)}</StatValue>
                <StatFootnote>{countsByStatus.vencida} facturas vencidas</StatFootnote>
              </StatCard>
            </StatsGrid>

            <ToolbarCard>
              <ToolbarTop>
                <ToolbarText>
                  <ToolbarTitle>Explorar facturas</ToolbarTitle>
                  <ToolbarDescription>
                    La composicion de esta area esta montada con patrones de
                    Card, Input, Tabs y Table.
                  </ToolbarDescription>
                </ToolbarText>

                <ButtonLink to="/create-invoice" $variant="outline">
                  <PlusIcon />
                  Crear factura
                </ButtonLink>
              </ToolbarTop>

              <SearchRow>
                <InputGroup>
                  <InputIcon>
                    <SearchIcon />
                  </InputIcon>
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar por numero, cliente, CIF o email"
                  />
                </InputGroup>
              </SearchRow>

              <Tabs>
                <TabsList>
                  {STATUS_TABS.map((status) => {
                    const isActive = activeStatus === status;
                    const count =
                      status === "all"
                        ? invoices.length
                        : countsByStatus[status] || 0;

                    const labelMap = {
                      all: "Todas",
                      pagada: "Pagadas",
                      pendiente: "Pendientes",
                      vencida: "Vencidas",
                    };

                    return (
                      <TabsTrigger
                        key={status}
                        type="button"
                        $active={isActive}
                        onClick={() => setActiveStatus(status)}
                      >
                        {labelMap[status]}
                        <CountBadge $active={isActive}>{count}</CountBadge>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </ToolbarCard>

            <TableCard>
              <TableHeaderBar>
                <TableSummary>
                  <TableSummaryText>
                    <TableSummaryTitle>Listado de facturas</TableSummaryTitle>
                    <TableSummaryDescription>
                      Haz clic en cualquier fila para abrir el detalle.
                    </TableSummaryDescription>
                  </TableSummaryText>

                  {filteredInvoices.length > 0 && (
                    <Badge
                      $borderColor="rgba(255, 90, 61, 0.18)"
                      $backgroundColor="rgba(255, 248, 244, 0.96)"
                      $textColor="#c2410c"
                    >
                      {filteredInvoices.length} resultados
                    </Badge>
                  )}
                </TableSummary>
              </TableHeaderBar>

              {filteredInvoices.length === 0 ? (
                <Empty>
                  <EmptyCard>
                    <EmptyMedia>
                      <EmptyIcon />
                    </EmptyMedia>
                    <EmptyTitle>No hay facturas para esos filtros</EmptyTitle>
                    <EmptyDescription>
                      Cambia el estado activo o limpia la busqueda para volver a
                      ver el tablero completo de facturacion.
                    </EmptyDescription>
                    <Button type="button" $variant="outline" onClick={clearFilters}>
                      Limpiar filtros
                    </Button>
                  </EmptyCard>
                </Empty>
              ) : (
                <>
                  <TableViewport>
                    <Table>
                      <TableHead>
                        <tr>
                          <TableHeadCell>Factura</TableHeadCell>
                          <TableHeadCell>Cliente</TableHeadCell>
                          <TableHeadCell>Vencimiento</TableHeadCell>
                          <TableHeadCell>Estado</TableHeadCell>
                          <TableHeadCell $align="right">Total</TableHeadCell>
                          <TableHeadCell $align="right">Accion</TableHeadCell>
                        </tr>
                      </TableHead>
                      <tbody>
                        {currentInvoices.map((invoice) => {
                          const status = getStatusMeta(invoice.status);

                          return (
                            <TableRow
                              key={invoice.id}
                              onClick={() => navigate(`/invoice/${invoice.id}`)}
                            >
                              <TableCell>
                                <InvoiceIdentity>
                                  <InvoiceNumber>#{invoice.number}</InvoiceNumber>
                                  <InvoiceMeta>
                                    Emitida{" "}
                                    {format(invoice.date, "dd MMM yyyy", {
                                      locale: es,
                                    })}
                                  </InvoiceMeta>
                                </InvoiceIdentity>
                              </TableCell>

                              <TableCell>
                                <ClientBlock>
                                  <ClientName>{invoice.clientName}</ClientName>
                                  <ClientMeta>
                                    {invoice.clientEmail || invoice.clientCIF}
                                  </ClientMeta>
                                </ClientBlock>
                              </TableCell>

                              <TableCell>
                                {invoice.dueDate
                                  ? format(invoice.dueDate, "dd MMM yyyy", {
                                      locale: es,
                                    })
                                  : "Sin fecha"}
                              </TableCell>

                              <TableCell>
                                <Badge
                                  $borderColor={status.border}
                                  $backgroundColor={status.background}
                                  $textColor={status.text}
                                >
                                  <BadgeDot $color={status.dot} />
                                  {status.label}
                                </Badge>
                              </TableCell>

                              <TableCell $align="right">
                                <Amount>{formatCurrency(invoice.total)}</Amount>
                              </TableCell>

                              <TableCell
                                $align="right"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <ActionGroup>
                                  <ButtonLink
                                    to={`/invoice/${invoice.id}`}
                                    $variant="ghost"
                                  >
                                    Abrir
                                    <ArrowUpRightIcon />
                                  </ButtonLink>
                                </ActionGroup>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </tbody>
                    </Table>
                  </TableViewport>

                  <Pagination>
                    <PaginationInfo>
                      Mostrando {(currentPage - 1) * PAGE_SIZE + 1}-
                      {Math.min(currentPage * PAGE_SIZE, filteredInvoices.length)} de{" "}
                      {filteredInvoices.length}
                    </PaginationInfo>

                    <PaginationContent aria-label="Paginacion de facturas">
                      <PaginationButton
                        type="button"
                        onClick={() =>
                          setCurrentPage((page) => Math.max(1, page - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </PaginationButton>

                      {pageNumbers.map((pageNumber) => (
                        <PaginationButton
                          key={pageNumber}
                          type="button"
                          $compact
                          $active={pageNumber === currentPage}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationButton>
                      ))}

                      <PaginationButton
                        type="button"
                        onClick={() =>
                          setCurrentPage((page) => Math.min(totalPages, page + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Siguiente
                      </PaginationButton>
                    </PaginationContent>
                  </Pagination>
                </>
              )}
            </TableCard>
          </Stack>
        </div>
      </PageSection>
    </>
  );
};

export default InvoicesPage;
