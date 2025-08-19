import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    subject: "",
    msg: "",
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.name) {
      isValid = false;
      tempErrors["name"] = "Por favor, introduce tu nombre completo.";
    }

    if (!formData.email) {
      isValid = false;
      tempErrors["email"] = "Por favor, introduce tu email.";
    } else if (typeof formData.email !== "undefined") {
      let pattern = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      if (!pattern.test(formData.email)) {
        isValid = false;
        tempErrors["email"] = "Por favor, introduce un email válido.";
      }
    }

    if (!formData.topic) {
      isValid = false;
      tempErrors["topic"] = "Por favor, indica un tema.";
    }

    if (!formData.subject) {
      isValid = false;
      tempErrors["subject"] = "Por favor, introduce un asunto.";
    }

    if (!formData.msg) {
      isValid = false;
      tempErrors["msg"] = "Por favor, escribe tu mensaje.";
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("¡Tu mensaje ha sido enviado con éxito!");

      setFormData({
        name: "",
        email: "",
        topic: "",
        subject: "",
        msg: "",
      });
    }
  };

  return (
    <div className="container">
      <div className="ak-height-100 ak-height-lg-40"></div>
      <div className="ak-height-125 ak-height-lg-80"></div>
      <div className="contact-content">
        <div
          className="contact-title-section"
          data-aos="fade-up"
          data-aos-delay="700"
        >
          <h2 className="contact-form-title ak-white-color text-uppercase">
            Contáctanos
          </h2>
          <p>Inicio / Contacto</p>
        </div>
        <div className="ak-height-25 ak-height-lg-20"></div>
        <div className="contact-form" data-aos="fade-up" data-aos-delay="750">
          <div>
            <h5 className="mb-3">¿Cómo podemos ayudarte?</h5>
            <p>
              Rellena el formulario y te contactaremos en menos de 2 horas en horario laboral.
            </p>
            <div className="ak-height-45 ak-height-lg-30"></div>
          </div>
          <div id="ak-alert">{alertMessage && <p>{alertMessage}</p>}</div>
          <form method="POST" id="contact-form" onSubmit={handleSubmit}>
            <div className="from-inputs">
              <div className="type_1">
                <label htmlFor="name" className="form-label">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <p className="error">{errors.name}</p>}
              </div>
              <div className="type_1">
                <label htmlFor="email" className="form-label">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
            </div>
            <div className="from-inputs">
              <div className="type_1">
                <label htmlFor="topic" className="form-label">
                  ¿Qué tema encaja mejor con tu consulta?
                </label>
                <input
                  type="text"
                  name="topic"
                  id="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  required
                />
                {errors.topic && <p className="error">{errors.topic}</p>}
              </div>
              <div className="type_1">
                <label htmlFor="subject" className="form-label">
                  Asunto
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
                {errors.subject && <p className="error">{errors.subject}</p>}
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
                  id="msg"
                  value={formData.msg}
                  onChange={handleChange}
                  required
                ></textarea>
                {errors.msg && <p className="error">{errors.msg}</p>}
              </div>
            </div>

            <div className="ak-height-40 ak-height-lg-20"></div>
            <button
              type="submit"
              id="submit"
              name="submit"
              className="common-btn"
            >
              ENVIAR MENSAJE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
