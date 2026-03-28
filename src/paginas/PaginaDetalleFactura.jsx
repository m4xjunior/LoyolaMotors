import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, PencilSimple, Receipt } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { servicioFacturas } from "../servicios/servicioFacturas";

const formatEUR = (valor) =>
  new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor || 0) + " €";

const badgeEstado = (estado) => {
  switch (estado) {
    case "pagado":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "parcial":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "pendiente":
    default:
      return "bg-red-500/10 text-red-500 border-red-500/20";
  }
};

const etiquetaEstado = (estado) => {
  switch (estado) {
    case "pagado":   return "Pagado";
    case "parcial":  return "Parcial";
    case "pendiente":
    default:         return "Pendiente";
  }
};

const PaginaDetalleFactura = () => {
  const { facturaId } = useParams();
  const navigate = useNavigate();

  const [factura, setFactura] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const datos = await servicioFacturas.obtenerPorId(facturaId);
        if (!datos) {
          setError("Factura no encontrada.");
          return;
        }
        setFactura(datos);
      } catch (err) {
        console.error("Error al cargar factura:", err);
        setError("Error al cargar los datos de la factura.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [facturaId]);

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[var(--texto-deshabilitado)]">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="text-[var(--texto-deshabilitado)]">
            <Link to="/panel/facturas">
              <ArrowLeft className="mr-1 size-4" />
              Volver a Facturas
            </Link>
          </Button>
        </div>
        <div className="rounded-lg border border-[var(--peligro)]/30 bg-[var(--peligro)]/10 px-4 py-6 text-center text-[var(--peligro)]">
          {error}
        </div>
      </div>
    );
  }

  const fechaFactura = factura.fecha
    ? new Date(factura.fecha).toLocaleDateString("es-ES")
    : factura.creadoEn
    ? new Date(factura.creadoEn).toLocaleDateString("es-ES")
    : "-";

  const items = Array.isArray(factura.items) ? factura.items : [];
  const subtotal = items.reduce((s, it) => s + (it.cantidad || 1) * (it.precioUnitario || 0), 0);
  const iva = factura.iva != null ? factura.iva : factura.total != null && subtotal > 0
    ? factura.total - subtotal
    : 0;
  const total = factura.total != null ? factura.total : subtotal + iva;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-[var(--texto-deshabilitado)] hover:text-[var(--texto-principal)]"
          >
            <Link to="/panel/facturas">
              <ArrowLeft className="mr-1 size-4" />
              Volver a Facturas
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Receipt weight="duotone" className="size-6 text-[var(--acento)]" />
            <div>
              <h1 className="text-2xl font-bold text-[var(--texto-principal)] font-[family-name:var(--fuente-datos)]">
                Factura {factura.numero || factura.id}
              </h1>
              <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
                Emitida el {fechaFactura}
              </p>
            </div>
          </div>
        </div>
        <Button
          asChild
          className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
        >
          <Link to={`/panel/facturas/editar/${facturaId}`}>
            <PencilSimple className="mr-2 size-4" />
            Editar
          </Link>
        </Button>
      </div>

      {/* Datos Generales */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-[var(--texto-principal)]">
            Datos de la Factura
          </CardTitle>
          <Badge
            className={badgeEstado(factura.estadoPago)}
            variant="outline"
          >
            {etiquetaEstado(factura.estadoPago)}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                Numero
              </p>
              <p className="text-sm text-[var(--texto-principal)] font-[family-name:var(--fuente-datos)]">
                {factura.numero || "-"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                Cliente
              </p>
              <p className="text-sm text-[var(--texto-principal)]">
                {factura.clienteNombre || "-"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                Fecha
              </p>
              <p className="text-sm text-[var(--texto-principal)] font-[family-name:var(--fuente-datos)]">
                {fechaFactura}
              </p>
            </div>

            {factura.clienteEmail && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                  Email Cliente
                </p>
                <p className="text-sm text-[var(--texto-principal)]">
                  {factura.clienteEmail}
                </p>
              </div>
            )}

            {factura.clienteCIF && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                  CIF / NIF
                </p>
                <p className="text-sm text-[var(--texto-principal)] font-[family-name:var(--fuente-datos)]">
                  {factura.clienteCIF}
                </p>
              </div>
            )}

            {factura.notas && (
              <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                <p className="text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide">
                  Notas
                </p>
                <p className="text-sm text-[var(--texto-principal)]">
                  {factura.notas}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lineas de Factura */}
      <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
        <CardHeader>
          <CardTitle className="text-[var(--texto-principal)]">
            Lineas de Factura
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="py-10 text-center text-[var(--texto-deshabilitado)]">
              No hay lineas registradas para esta factura
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[var(--borde)]">
                  <TableHead className="text-[var(--texto-deshabilitado)]">Descripcion</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)] text-right">Cantidad</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)] text-right">Precio Unit.</TableHead>
                  <TableHead className="text-[var(--texto-deshabilitado)] text-right">Importe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow key={idx} className="border-[var(--borde)] hover:bg-[var(--fondo-elevado)]/50">
                    <TableCell className="text-[var(--texto-principal)]">
                      {item.descripcion || item.description || "-"}
                    </TableCell>
                    <TableCell className="text-right text-[var(--texto-principal)] font-[family-name:var(--fuente-datos)]">
                      {item.cantidad ?? item.quantity ?? 1}
                    </TableCell>
                    <TableCell className="text-right text-[var(--texto-principal)] font-[family-name:var(--fuente-datos)]">
                      {formatEUR(item.precioUnitario ?? item.unitPrice ?? 0)}
                    </TableCell>
                    <TableCell className="text-right text-[var(--texto-principal)] font-[family-name:var(--fuente-datos)]">
                      {formatEUR((item.cantidad ?? item.quantity ?? 1) * (item.precioUnitario ?? item.unitPrice ?? 0))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Totales */}
          <div className="flex justify-end px-6 py-4 border-t border-[var(--borde)]">
            <div className="space-y-2 min-w-48">
              <div className="flex justify-between text-sm text-[var(--texto-deshabilitado)]">
                <span>Subtotal</span>
                <span className="font-[family-name:var(--fuente-datos)]">{formatEUR(subtotal)}</span>
              </div>
              {iva > 0 && (
                <div className="flex justify-between text-sm text-[var(--texto-deshabilitado)]">
                  <span>IVA</span>
                  <span className="font-[family-name:var(--fuente-datos)]">{formatEUR(iva)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[var(--texto-principal)] pt-2 border-t border-[var(--borde)]">
                <span>Total</span>
                <span className="font-[family-name:var(--fuente-datos)]">{formatEUR(total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaginaDetalleFactura;
