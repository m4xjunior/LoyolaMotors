import { useState, useEffect } from "react";
import BlogCard from "./CartaoBlog";
import SectionHeading from "../TituloSecao/TituloSecao";
import blogsDataFallback from "../../dadosJson/dadosBlog.json";
import { servicioContenido } from "../../servicios/servicioContenido";

const Blogs = () => {
  const [blogsData, setBlogsData] = useState(blogsDataFallback);

  useEffect(() => {
    servicioContenido.obtener('blog').then(r => {
      if (r.length > 0) setBlogsData(r);
    });
  }, []);

  const blogPosts = blogsData.slice(0, 3); // Show first 3 posts
  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="ak-height-125 ak-height-lg-80"></div>
      <SectionHeading
        type={true}
        bgText="Blog"
        title="Nuestro Blog"
        desp="Consejos de nuestros expertos en chapa y pintura para mantener tu coche en perfecto estado."
      />
      <div className="ak-height-50 ak-height-lg-50"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-4">
        {blogPosts.map((post, index) => (
          <BlogCard key={index} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
