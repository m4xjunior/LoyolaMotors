
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { addInvoice } from '../data/mockData';
import CommonPageHero from '../components/CommonPageHero/CommonPageHero';

const InvoiceFormPage = () => {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      clientName: '',
      clientCIF: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = (data) => {
    // In a real app, you'd do more complex calculations.
    const subtotal = data.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    const newInvoice = {
      ...data,
      number: `2024-${Math.floor(Math.random() * 1000)}`, // Mock number
      subtotal,
      iva, 
      total,
    };

    addInvoice(newInvoice);
    navigate('/invoices');
  };

  return (
    <>
      <CommonPageHero title="Nueva Factura" />
      <div className="container" style={{ paddingTop: '50px', paddingBottom: '100px' }}>
      <h1>Nueva Factura</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '40px' }}>
        {/* Client Info */}
        <div style={{ marginBottom: '20px' }}>
          <label>Nombre del Cliente</label>
          <input {...register('clientName', { required: true })} style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }} />
          {errors.clientName && <span style={{ color: 'red' }}>Campo requerido</span>}
        </div>

        {/* Invoice Items */}
        <div>
          <h2>Items</h2>
          {fields.map((item, index) => (
            <div key={item.id} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                {...register(`items.${index}.description`, { required: true })}
                placeholder="Descripción"
                style={{ flex: 1, padding: '8px', border: '1px solid #ccc' }}
              />
              <input
                type="number"
                {...register(`items.${index}.quantity`, { valueAsNumber: true, required: true, min: 1 })}
                placeholder="Cantidad"
                style={{ width: '100px', padding: '8px', border: '1px solid #ccc' }}
              />
              <input
                type="number"
                step="0.01"
                {...register(`items.${index}.unitPrice`, { valueAsNumber: true, required: true, min: 0 })}
                placeholder="Precio Unitario"
                style={{ width: '120px', padding: '8px', border: '1px solid #ccc' }}
              />
              <button type="button" onClick={() => remove(index)} className="btn btn-danger">
                Eliminar
              </button>
            </div>
          ))}
          <button type="button" onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })} className="btn btn-secondary">
            Añadir Item
          </button>
        </div>

        <div style={{ marginTop: '40px' }}>
          <button type="submit" className="btn btn-primary">Guardar Factura</button>
        </div>
      </form>
      </div>
    </>
  );
};

export default InvoiceFormPage;
