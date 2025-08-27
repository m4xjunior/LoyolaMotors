
import { useState } from 'react';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    time: "",
    date: "",
    msg: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "El nombre es obligatorio";
    }
    if (!formData.email.trim()) {
      errors.email = "El email es obligatorio";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "El email no es válido";
    }
    if (!formData.phone.trim()) {
      errors.phone = "El teléfono es obligatorio";
    }
    if (!formData.vehicle.trim()) {
      errors.vehicle = "El tipo de vehículo es obligatorio";
    }
    if (!formData.time.trim()) {
      errors.time = "La hora es obligatoria";
    }
    if (!formData.date.trim()) {
      errors.date = "La fecha es obligatoria";
    }
    if (!formData.msg.trim()) {
      errors.msg = "El mensaje es obligatorio";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      alert("Datos enviados correctamente");

      setFormData({
        name: "",
        email: "",
        phone: "",
        vehicle: "",
        time: "",
        date: "",
        msg: "",
      });
    }
  };

  return (
    <div className="container">
      <div className="ak-height-125 ak-height-lg-80"></div>
      <div className="contact-content">
        <div
          className="contact-title-section"
          data-aos="fade-up"
          data-aos-delay="700"
        >
          <h2 className="contact-form-title ak-white-color text-uppercase">
            Solicita una cita
          </h2>
          <p>
            Te confirmaremos disponibilidad lo antes posible durante el horario laboral.
          </p>
        </div>
        <div className="ak-height-25 ak-height-lg-20"></div>
        <div className="contact-form" data-aos="fade-up" data-aos-delay="750">
          <div id="ak-alert"></div>
          <form onSubmit={handleSubmit} id="appointment-form">
            <div className="from-inputs">
              <div className="type_1">
                <label htmlFor="name" className="form-label">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nombre completo"
                  required
                />
                {formErrors.name && (
                  <span className="error-message text-danger">
                    {formErrors.name}
                  </span>
                )}
              </div>
              <div className="type_1">
                <label htmlFor="email" className="form-label">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  required
                />
                {formErrors.email && (
                  <span className="error-message text-danger">
                    {formErrors.email}
                  </span>
                )}
              </div>
            </div>
            <div className="from-inputs">
              <div className="type_1">
                <label htmlFor="phone" className="form-label">
                  Teléfono*
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Número de teléfono"
                  required
                />
                {formErrors.phone && (
                  <span className="error-message text-danger">
                    {formErrors.phone}
                  </span>
                )}
              </div>
              <div className="type_1">
                <label htmlFor="vehicle" className="form-label">
                  Tipo de vehículo*
                </label>
                <input
                  type="text"
                  name="vehicle"
                  value={formData.vehicle}
                  onChange={handleInputChange}
                  placeholder="Marca y modelo del vehículo"
                  required
                />
                {formErrors.vehicle && (
                  <span className="error-message text-danger">
                    {formErrors.vehicle}
                  </span>
                )}
              </div>
            </div>
            <div className="from-inputs">
              <div className="type_1">
                <label htmlFor="time" className="form-label">
                  Hora*
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.time && (
                  <span className="error-message text-danger">
                    {formErrors.time}
                  </span>
                )}
                <span className="date-time-icon">
                  <img src="/assets/img/icon/time-icon.svg" alt="Time" />
                </span>
              </div>
              <div className="type_1">
                <label htmlFor="date" className="form-label">
                  Fecha*
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.date && (
                  <span className="error-message text-danger">
                    {formErrors.date}
                  </span>
                )}
                <span className="date-time-icon">
                  <img src="/assets/img/icon/date-icon.svg" alt="Date" />
                </span>
              </div>
            </div>
            <div className="from-textarea">
              <div className="type_1">
                <label htmlFor="msg" className="form-label">
                  Tu mensaje*
                </label>
                <textarea
                  name="msg"
                  rows="5"
                  value={formData.msg}
                  onChange={handleInputChange}
                  required
                ></textarea>
                {formErrors.msg && (
                  <span className="error-message text-danger">
                    {formErrors.msg}
                  </span>
                )}
              </div>
            </div>
            <div className="ak-height-40 ak-height-lg-20"></div>
            <button
              type="submit"
              id="submit"
              name="submit"
              className="common-btn"
            >
              Reservar cita
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
