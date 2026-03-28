import { servicioContenido } from "../servicios/servicioContenido";

// Importar datos JSON existentes
import blogsData from "../dadosJson/dadosBlog.json";
import teamMembersData from "../dadosJson/dadosMembrosEquipe.json";
import servicesData from "../dadosJson/dadosServicos.json";
import galleryData from "../dadosJson/dadosImagensGaleria.json";

export const sembrarDatosIniciales = async () => {
  // Blog posts
  const blogExistente = await servicioContenido.obtener("blog");
  if (blogExistente.length === 0 && blogsData) {
    for (const post of blogsData) {
      await servicioContenido.guardar("blog", null, {
        titulo: post.title,
        contenido: post.blogdetails?.shortDesp || "",
        fecha: post.date,
        imagenUrl: post.imageUrl || post.blogdetails?.img || "",
        publicado: true,
        activo: true,
      });
    }
  }

  // Miembros del equipo
  const equipoExistente = await servicioContenido.obtener("equipo");
  if (equipoExistente.length === 0 && teamMembersData) {
    for (const member of teamMembersData) {
      await servicioContenido.guardar("equipo", null, {
        nombre: member.name,
        cargo: member.title,
        descripcion: member.desp,
        imagenUrl: member.image,
        email: member.contact?.email || "",
        activo: true,
      });
    }
  }

  // Servicios
  const serviciosExistente = await servicioContenido.obtener("servicios");
  if (serviciosExistente.length === 0 && servicesData) {
    for (const service of servicesData) {
      await servicioContenido.guardar("servicios", null, {
        titulo: service.title,
        descripcion: service.desp,
        imagenUrl: service.img || "",
        activo: true,
      });
    }
  }

  // Galeria
  const galeriaExistente = await servicioContenido.obtener("galeria");
  if (galeriaExistente.length === 0 && galleryData) {
    for (const img of galleryData) {
      await servicioContenido.guardar("galeria", null, {
        imagenUrl: img.thumbnail,
        orientacion: img.orientation || "normal",
        activo: true,
      });
    }
  }

  // Preguntas frecuentes (hardcoded - no hay fichero JSON)
  const preguntasExistente = await servicioContenido.obtener("preguntas");
  if (preguntasExistente.length === 0) {
    const faqs = [
      {
        pregunta: "¿Que servicios ofreceis en vuestro taller?",
        respuesta:
          "Ofrecemos servicios de chapa y pintura, mecanica general, revision pre-ITV, neumaticos, aire acondicionado y electricidad del automovil.",
        orden: 0,
      },
      {
        pregunta: "¿Con que frecuencia debo revisar mi coche?",
        respuesta:
          "Recomendamos una revision general al menos una vez al ano o cada 15.000 km, lo que ocurra primero.",
        orden: 1,
      },
      {
        pregunta: "¿Como se si mis frenos necesitan ser reemplazados?",
        respuesta:
          "Si escuchas chirridos, notas vibracion al frenar o el pedal se hunde mas de lo normal, es momento de revisarlos.",
        orden: 2,
      },
      {
        pregunta: "¿Que puedo hacer entre revisiones?",
        respuesta:
          "Mantener los niveles de aceite y liquidos, comprobar la presion de los neumaticos y prestar atencion a luces de aviso del tablero.",
        orden: 3,
      },
      {
        pregunta: "¿Ofreceis garantia en vuestras reparaciones?",
        respuesta:
          "Si, ofrecemos garantia de hasta 1 ano en todas nuestras reparaciones de chapa, pintura y mecanica.",
        orden: 4,
      },
    ];
    for (const faq of faqs) {
      await servicioContenido.guardar("preguntas", null, { ...faq, activo: true });
    }
  }
};
