import { useState, useEffect } from "react";

import BlogCard from "../componentes/Blog/CartaoBlog";
import CommonPageHero from "../componentes/HeroPagina/HeroPagina";
import BlogFeature from "../componentes/Blog/DestaqueBlog";
import Pagination from "../componentes/Paginacao/Paginacao";

import blogsDataFallback from "../dadosJson/dadosBlog.json";
import { servicioContenido } from "../servicios/servicioContenido";

const Blog = () => {
  const [blogsData, setBlogsData] = useState(blogsDataFallback);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    servicioContenido.obtener('blog').then(r => {
      if (r.length > 0) setBlogsData(r);
    });
  }, []);

  const totalPages = Math.ceil(blogsData.length / postsPerPage);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogsData.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <CommonPageHero title={"Blog"} />
      <BlogFeature />
      <div className="container">
        <div className="ak-height-50 ak-height-lg-50"></div>
        <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 g-5 g-lg-4">
          {currentPosts.map((post, index) => (
            <BlogCard key={index} post={post} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default Blog;
