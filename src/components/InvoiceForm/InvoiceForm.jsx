import { useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import InvoiceTemplate from './InvoiceTemplate';

export default function InvoiceForm() {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      clientName: '',
      clientCIF: '',
      clientEmail: '',
      clientAddress: '',
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().slice(0, 10),
      items: [{ description: '', quantity: 1, unitPrice: 0, ivaRate: 21 }],
      notes: '¡Gracias por su confianza!',
      ivaRate: 21,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const watchedIvaRate = watch('ivaRate');
  const [invoiceData, setInvoiceData] = useState(null);
  const invoiceTemplateRef = useRef();

  const calculateTotals = () => {
    const subtotal = watchedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const ivaAmount = subtotal * (watchedIvaRate / 100);
    const total = subtotal + ivaAmount;
    return { subtotal, ivaAmount, total };
  };

  const totals = calculateTotals();

  const onGeneratePDF = async (data) => {
    const fullData = { ...data, totals };
    setInvoiceData(fullData);

    setTimeout(async () => {
      if (invoiceTemplateRef.current) {
        const canvas = await html2canvas(invoiceTemplateRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('factura-loyola-motors.pdf');
        setInvoiceData(null); 
      }
    }, 100);
  };

  return (
    <>
      {invoiceData && <InvoiceTemplate ref={invoiceTemplateRef} data={invoiceData} />}
      <form onSubmit={handleSubmit(onGeneratePDF)} style={{ paddingTop: '150px', paddingBottom: '100px' }}>
        {/* Invoice Info */}
        <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Detalles de la Factura</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <input {...register('invoiceNumber')} placeholder="Número de Factura" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} required />
                <input {...register('invoiceDate')} type="date" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} required />
            </div>
        </div>

        {/* Client Info */}
        <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Datos del Cliente</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <input {...register('clientName')} placeholder="Nombre / Empresa" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} required />
            <input {...register('clientCIF')} placeholder="CIF/NIF" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            <input {...register('clientEmail')} placeholder="Email" type="email" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            <textarea {...register('clientAddress')} placeholder="Dirección" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', gridColumn: 'span 2' }} />
          </div>
        </div>

        {/* Items */}
        <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Artículos de la Factura</h2>
          {fields.map((field, index) => (
            <div key={field.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
              <textarea {...register(`items.${index}.description`)} placeholder="Descripción" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} required />
              <input {...register(`items.${index}.quantity`, { valueAsNumber: true })} type="number" defaultValue={1} min="1" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              <input {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} type="number" step="0.01" min="0" placeholder="Precio Unit." style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              <input {...register(`items.${index}.ivaRate`, { valueAsNumber: true })} type="number" defaultValue={21} min="0" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              <button type="button" onClick={() => remove(index)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }} disabled={fields.length === 1}>Eliminar</button>
            </div>
          ))}
          <button type="button" onClick={() => append({ description: '', quantity: 1, unitPrice: 0, ivaRate: 21 })} className="common-btn">Añadir Artículo</button>
        </div>

        {/* Totals & Notes */}
        <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Resumen</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p>Subtotal: {totals.subtotal.toFixed(2)} €</p>
                      <p>IVA ({watchedIvaRate}%): {totals.ivaAmount.toFixed(2)} €</p>
                      <p style={{ fontWeight: 'bold', fontSize: '20px' }}>Total: {totals.total.toFixed(2)} €</p>
                  </div>
              </div>
              <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Notas</h3>
                  <textarea {...register('notes')} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }} />
              </div>
          </div>
        </div>
        
        <button type="submit" className="common-btn">Generar Factura en PDF</button>
      </form>
    </>
  );
}
