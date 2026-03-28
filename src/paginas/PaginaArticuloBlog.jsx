import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import BlogCard from "../componentes/Blog/CartaoBlog";
import BlogPost from "../componentes/Blog/PostBlog";
import CommonPageHero from "../componentes/HeroPagina/HeroPagina";
import SectionHeading from "../componentes/TituloSecao/TituloSecao";

<<<<<<<< HEAD:src/paginas/PaginaArticuloBlog.jsx
import blogsDataFallback from "../dataJson/blogsData.json";
import { servicioContenido } from "../servicios/servicioContenido";
========
import blogsData from "../dadosJson/dadosBlog.json";
>>>>>>>> origin/main:src/paginas/BlogUnico.jsx

const SingleBlog = () => {
  const { blogId } = useParams();
  const [blogsData, setBlogsData] = useState(blogsDataFallback);

  useEffect(() => {
    servicioContenido.obtener('blog').then(r => {
      if (r.length > 0) setBlogsData(r);
    });
  }, []);

  const blog = blogsData.find((post) => post.id === parseInt(blogId));

  const similarBlogs = blogsData
    .filter((post) => post.id !== parseInt(blogId))
    .slice(0, 3);

  if (!blog) {
    return <p>Blog post not found</p>;
  }

  return (
    <>
      <CommonPageHero title={"Single Blog"} />
      <BlogPost post={blog} />

      <div className="container">
        <div className="ak-height-125 ak-height-lg-80"></div>
        <SectionHeading
          type={true}
          bgText="SIMILARBLOG"
          title="SIMILAR BLOG"
          desp="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard."
        />
        <div className="ak-height-50 ak-height-lg-50"></div>
        <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 g-5 g-lg-4">
          {similarBlogs.map((post, index) => (
            <BlogCard key={index} post={post} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SingleBlog;
