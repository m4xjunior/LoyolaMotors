import React from "react";
import BlogCard from "./BlogCard";
import SectionHeading from "../SectionHeading/SectionHeading";
import blogsData from "../../dataJson/blogsData.json";


const Blogs = () => {
  const blogPosts = blogsData.slice(0, 3); // Show first 3 posts
  return (
    <div className="container">
      <div className="ak-height-125 ak-height-lg-80"></div>
      <SectionHeading
        type={true}
        bgText="Blog"
        title="Nuestro Blog"
        desp="Consejos de nuestros expertos en chapa y pintura para mantener tu coche en perfecto estado."
      />
      <div className="ak-height-50 ak-height-lg-50"></div>
      <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 g-5 g-lg-4">
        {blogPosts.map((post, index) => (
          <BlogCard key={index} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
