import { MoreBtn } from "../Botao/Botao";
import blogsData from "../../dadosJson/dadosBlog.json";

const BlogFeature = () => {
  const blogData = blogsData[0]; // Get the first blog post for the feature
  const { id, date, title, blogdetails, imageUrl } = blogData;

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="ak-height-75 ak-height-lg-80"></div>
      <div className="blog-feature">
        <div
          className="feature-content"
          data-aos="fade-right"
          data-aos-delay="600"
        >
          <p className="data">{date}</p>
          <h4 className="title">{title}</h4>
          <p className="desp">{blogdetails.shortDesp}</p>
          <MoreBtn to={`/blog-single/${id}`} className="more-btn">
            LEER MÁS
          </MoreBtn>
        </div>
        <div className="feature-img" data-aos="fade-left" data-aos-delay="600">
          <img src={imageUrl} className="ak-bg" alt="..." />
        </div>
      </div>
    </div>
  );
};

export default BlogFeature;
