import { forwardRef } from "react";
import PropTypes from "prop-types";

const InvoiceTemplate = forwardRef(({ data }, ref) => {
  if (!data) return null;

  const {
    clientName,
    clientCIF,
    clientAddress,
    clientEmail,
    items,
    notes,
    invoiceNumber,
    invoiceDate,
    totals,
  } = data;

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        width: "210mm",
        height: "297mm",
        backgroundColor: "white",
        padding: "15mm",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <img
            src="/assets/img/icon/loyola-logo.svg"
            alt="Loyola Motors Logo"
            style={{ maxWidth: "200px" }}
          />
          <p>
            <b>Loyola Motors Valencia</b>
            <br />
            C/ Sant Ignasi de Loiola, 21-BJ IZ
            <br />
            46008 - Valencia
            <br />
            España
            <br />
            CIF/NIF: B97137160
            <br />
            Teléfono: +34 640 16 29 47
            <br />
            e-Mail: info@loyolamotors.es
            <br />
            www.loyolamotors.es
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <h2>Factura</h2>
          <p>
            Factura nº: {invoiceNumber}
            <br />
            Fecha: {invoiceDate}
          </p>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
          Dirección de facturación:
        </div>
        <p>
          {clientName}
          <br />
          {clientCIF}
          <br />
          {clientEmail}
          <br />
          {clientAddress}
          <br />
        </p>
      </div>

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th
              style={{
                borderBottom: "1px solid #000",
                padding: "5px",
                textAlign: "left",
              }}
            >
              Descripción
            </th>
            <th
              style={{
                borderBottom: "1px solid #000",
                padding: "5px",
                textAlign: "left",
              }}
            >
              Cantidad
            </th>
            <th
              style={{
                borderBottom: "1px solid #000",
                padding: "5px",
                textAlign: "left",
              }}
            >
              Tarifa
            </th>
            <th
              style={{
                borderBottom: "1px solid #000",
                padding: "5px",
                textAlign: "left",
              }}
            >
              IVA
            </th>
            <th
              style={{
                borderBottom: "1px solid #000",
                padding: "5px",
                textAlign: "left",
              }}
            >
              Importe
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={{ borderBottom: "1px solid #000", padding: "5px" }}>
                {item.description}
              </td>
              <td style={{ borderBottom: "1px solid #000", padding: "5px" }}>
                {item.quantity}
              </td>
              <td style={{ borderBottom: "1px solid #000", padding: "5px" }}>
                {item.unitPrice.toFixed(2)} €
              </td>
              <td style={{ borderBottom: "1px solid #000", padding: "5px" }}>
                {item.ivaRate > 0 ? `${item.ivaRate.toFixed(0)}%` : ""}
              </td>
              <td style={{ borderBottom: "1px solid #000", padding: "5px" }}>
                {(item.quantity * item.unitPrice).toFixed(2)} €
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table style={{ marginTop: "20px", width: "100%" }}>
        <tbody>
          <tr>
            <td style={{ textAlign: "right" }}>Subtotal:</td>
            <td style={{ textAlign: "right" }}>
              {totals.subtotal.toFixed(2)} €
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "right" }}>IVA 21%:</td>
            <td style={{ textAlign: "right" }}>
              {totals.ivaAmount.toFixed(2)} €
            </td>
          </tr>
          <tr style={{ fontWeight: "bold", borderTop: "2px solid #000" }}>
            <td style={{ textAlign: "right", paddingTop: "5px" }}>
              Total a pagar:
            </td>
            <td style={{ textAlign: "right", paddingTop: "5px" }}>
              {totals.total.toFixed(2)} €
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "40px" }}>
        <div style={{ fontWeight: "bold" }}>Notas</div>
        <p>{notes}</p>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = "InvoiceTemplate";

InvoiceTemplate.propTypes = {
  data: PropTypes.shape({
    clientName: PropTypes.string.isRequired,
    clientCIF: PropTypes.string.isRequired,
    clientAddress: PropTypes.string.isRequired,
    clientEmail: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        unitPrice: PropTypes.number.isRequired,
        ivaRate: PropTypes.number.isRequired,
      }),
    ).isRequired,
    notes: PropTypes.string.isRequired,
    invoiceNumber: PropTypes.string.isRequired,
    invoiceDate: PropTypes.string.isRequired,
    totals: PropTypes.shape({
      subtotal: PropTypes.number.isRequired,
      ivaAmount: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default InvoiceTemplate;
