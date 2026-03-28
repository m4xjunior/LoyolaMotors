import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { servicioFacturas } from "../servicios/servicioFacturas";

const estadoInicial = {
  numero: "",
  clienteNombre: "",
  clienteEmail: "",
  clienteCIF: "",
  fecha: new Date().toISOString().slice(0, 10),
  estadoPago: "pendiente",
  notas: "",
  items: [{ descripcion: "", cantidad: 1, precioUnitario: 0, tasaIVA: 21 }],
};

const calcularTotales = (items, tasaIVA) => {
  const subtotal = items.reduce(
    (s, it) => s + (Number(it.cantidad) || 0) * (Number(it.precioUnitario) || 0),
    0
  );
  const iva = subtotal * ((Number(tasaIVA) || 0) / 100);
  return { subtotal, iva, total: subtotal + iva };
};

const PaginaNuevaFactura = () => {
  const navigate = useNavigate();
  const { facturaId } = useParams();
  const esEdicion = Boolean(facturaId);

  const [formulario, setFormulario] = useState(estadoInicial);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (esEdicion) {
      servicioFacturas.obtenerPorId(facturaId).then((datos) => {
        if (datos) {
          setFormulario({
            numero: datos.numero || "",
            clienteNombre: datos.clienteNombre || "",
            clienteEmail: datos.clienteEmail || "",
            clienteCIF: datos.clienteCIF || "",
            fecha: datos.fecha ? datos.fecha.slice(0, 10) : new Date().toISOString().slice(0, 10),
            estadoPago: datos.estadoPago || "pendiente",
            notas: datos.notas || "",
            items:
              Array.isArray(datos.items) && datos.items.length > 0
                ? datos.items
                : [{ descripcion: "", cantidad: 1, precioUnitario: 0, tasaIVA: 21 }],
          });
        }
      });
    }
  }, [facturaId, esEdicion]);

  const setCampo = (campo) => (e) =>
    setFormulario((f) => ({ ...f, [campo]: e.target.value }));

  const setItem = (idx, campo) => (e) => {
    const nuevosItems = [...formulario.items];
    nuevosItems[idx] = { ...nuevosItems[idx], [campo]: e.target.value };
    setFormulario((f) => ({ ...f, items: nuevosItems }));
  };

  const agregarItem = () =>
    setFormulario((f) => ({
      ...f,
      items: [...f.items, { descripcion: "", cantidad: 1, precioUnitario: 0, tasaIVA: 21 }],
    }));

  const eliminarItem = (idx) =>
    setFormulario((f) => ({
      ...f,
      items: f.items.filter((_, i) => i !== idx),
    }));

  const tasaIVAGlobal = formulario.items[0]?.tasaIVA ?? 21;
  const { subtotal, iva, total } = calcularTotales(formulario.items, tasaIVAGlobal);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formulario.clienteNombre.trim()) {
      setError("El nombre del cliente es obligatorio.");
      return;
    }

    setGuardando(true);
    try {
      const datos = { ...formulario, total };
      if (esEdicion) {
        await servicioFacturas.actualizar(facturaId, datos);
      } else {
        await servicioFacturas.crear(datos);
      }
      navigate("/dashboard/facturas");
    } catch (err) {
      console.error("Error al guardar factura:", err);
      setError("Error al guardar la factura. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard/facturas")}
          className="text-[var(--texto-deshabilitado)] hover:text-[var(--texto-principal)]"
        >
          <ArrowLeft className="mr-1 size-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--texto-principal)]">
            {esEdicion ? "Editar Factura" : "Nueva Factura"}
          </h1>
          <p className="text-sm text-[var(--texto-deshabilitado)] mt-1">
            {esEdicion
              ? "Actualiza los datos de la factura"
              : "Registra una nueva factura en el sistema"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-[var(--peligro)]/30 bg-[var(--peligro)]/10 px-4 py-3 text-sm text-[var(--peligro)]">
            {error}
          </div>
        )}

        {/* Datos Generales */}
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader>
            <CardTitle className="text-[var(--texto-principal)]">
              Datos Generales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Numero de Factura
                </label>
                <Input
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)] font-[family-name:var(--fuente-datos)]"
                  placeholder="FAC-0001"
                  value={formulario.numero}
                  onChange={setCampo("numero")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Fecha
                </label>
                <Input
                  type="date"
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)] font-[family-name:var(--fuente-datos)]"
                  value={formulario.fecha}
                  onChange={setCampo("fecha")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Estado de Pago
                </label>
                <select
                  className="w-full rounded-md border border-[var(--borde)] bg-[var(--fondo-elevado)] px-3 py-2 text-sm text-[var(--texto-principal)] focus:outline-none focus:ring-2 focus:ring-[var(--acento)]/50"
                  value={formulario.estadoPago}
                  onChange={setCampo("estadoPago")}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="pagado">Pagado</option>
                  <option value="parcial">Parcial</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datos del Cliente */}
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader>
            <CardTitle className="text-[var(--texto-principal)]">
              Datos del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Nombre / Empresa <span className="text-[var(--peligro)]">*</span>
                </label>
                <Input
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)]"
                  placeholder="Nombre del cliente o empresa"
                  value={formulario.clienteNombre}
                  onChange={setCampo("clienteNombre")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  CIF / NIF
                </label>
                <Input
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)] font-[family-name:var(--fuente-datos)]"
                  placeholder="B12345678"
                  value={formulario.clienteCIF}
                  onChange={setCampo("clienteCIF")}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[var(--texto-secundario)]">
                  Email
                </label>
                <Input
                  type="email"
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)]"
                  placeholder="cliente@ejemplo.com"
                  value={formulario.clienteEmail}
                  onChange={setCampo("clienteEmail")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lineas de Factura */}
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[var(--texto-principal)]">
              Lineas de Factura
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={agregarItem}
              className="border-[var(--borde)] text-[var(--texto-principal)]"
            >
              <Plus weight="bold" className="mr-1 size-4" />
              Agregar Linea
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Header row */}
            <div className="hidden md:grid md:grid-cols-[3fr_1fr_1fr_1fr_auto] gap-3 text-xs font-medium text-[var(--texto-deshabilitado)] uppercase tracking-wide px-1">
              <span>Descripcion</span>
              <span>Cantidad</span>
              <span>Precio Unit. (€)</span>
              <span>IVA (%)</span>
              <span />
            </div>

            {formulario.items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr_1fr_auto] gap-3 items-center"
              >
                <Input
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)]"
                  placeholder="Descripcion del servicio o repuesto"
                  value={item.descripcion}
                  onChange={setItem(idx, "descripcion")}
                />
                <Input
                  type="number"
                  min="1"
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)] font-[family-name:var(--fuente-datos)]"
                  value={item.cantidad}
                  onChange={setItem(idx, "cantidad")}
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)] font-[family-name:var(--fuente-datos)]"
                  placeholder="0.00"
                  value={item.precioUnitario}
                  onChange={setItem(idx, "precioUnitario")}
                />
                <Input
                  type="number"
                  min="0"
                  className="bg-[var(--fondo-elevado)] border-[var(--borde)] text-[var(--texto-principal)] font-[family-name:var(--fuente-datos)]"
                  value={item.tasaIVA}
                  onChange={setItem(idx, "tasaIVA")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => eliminarItem(idx)}
                  disabled={formulario.items.length === 1}
                  title="Eliminar linea"
                >
                  <Trash className="size-4 text-[var(--peligro)]" />
                </Button>
              </div>
            ))}

            {/* Totales */}
            <div className="flex justify-end pt-4 border-t border-[var(--borde)]">
              <div className="space-y-2 min-w-48">
                <div className="flex justify-between text-sm text-[var(--texto-deshabilitado)]">
                  <span>Subtotal</span>
                  <span className="font-[family-name:var(--fuente-datos)]">
                    {new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2 }).format(subtotal)} €
                  </span>
                </div>
                <div className="flex justify-between text-sm text-[var(--texto-deshabilitado)]">
                  <span>IVA ({tasaIVAGlobal}%)</span>
                  <span className="font-[family-name:var(--fuente-datos)]">
                    {new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2 }).format(iva)} €
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[var(--texto-principal)] pt-2 border-t border-[var(--borde)]">
                  <span>Total</span>
                  <span className="font-[family-name:var(--fuente-datos)]">
                    {new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2 }).format(total)} €
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notas */}
        <Card className="bg-[var(--fondo-tarjeta)] border-[var(--borde)]">
          <CardHeader>
            <CardTitle className="text-[var(--texto-principal)]">Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full min-h-[100px] rounded-lg border border-[var(--borde)] bg-[var(--fondo-elevado)] px-3 py-2 text-sm text-[var(--texto-principal)] placeholder:text-[var(--texto-deshabilitado)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--acento)]/50"
              placeholder="Notas o condiciones adicionales..."
              value={formulario.notas}
              onChange={setCampo("notas")}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--borde)]">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/facturas")}
            className="border-[var(--borde)] text-[var(--texto-principal)]"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={guardando}
            className="bg-[var(--acento)] text-white hover:bg-[var(--acento)]/90"
          >
            {guardando
              ? "Guardando..."
              : esEdicion
              ? "Guardar Cambios"
              : "Crear Factura"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaginaNuevaFactura;
