import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css/bundle";
import { Link } from "react-router-dom";
import { useEffect } from "react";

Category07.propTypes = {};

function Category07(props) {
  const [dataList , setDataList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5259/api/JobOffer/jobcategoriescount"); 
        setDataList(response.data); 
      } catch (error) {
        console.error("Erreur lors de la récupération des offres:", error);
      }
    };

    fetchCategories();
  }, []);  

  const categoryMap = {
    1: "IT & Networking",
    2: "Data Science",
    3: "Human Resources",
    4: "Finance",
    5: "Design & Multimedia",
    6: "Telecommunications",
    7: "Engineering",
    8: "Construction & Facilities"
  };
  

  const { data } = props;
  return (
    <section className="testimonials-category-section">
      <div className="tf-container">
        <div className="row">
          <div className="col-md-12">
            <div className="tf-title style-2">
              <div className="group-title">
                <h1>Browse by category</h1>
                <p>Recruitment Made Easy in 100 seconds</p>
              </div>
            </div>
          </div>

          <div className=" col-md-12">
            <Swiper
              modules={[Pagination]}
              spaceBetween={0}
              slidesPerView={1}
              pagination={{ clickable: true }}
              loop
              className="tes-category-job"
            >
              {dataList.map((idx) => (
                <SwiperSlide key={idx.categoryId}>
                  <div className="group-category-job padding wow fadeInUp">
                    {dataList.map((idx) => (
                      <div
                        key={idx.categoryId}
                        className={`job-category-box ${idx.active}`}
                      >
                        <div className="job-category-header">
                          <h1>
                          <Link to="/joblist_v1">
                          {categoryMap[idx.categoryId] || "Unknown Category"}
                        </Link>
                          </h1>
                          <p>{idx.jobCount }  Jobs available</p>
                        </div>
                        <Link to={`/joblist_v7?categoryId=${idx.categoryId}`} className="btn-category-job">
                          Explore Jobs
                          <span className="icon-keyboard_arrow_right"></span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Category07;
