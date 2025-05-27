import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import JobOfferServices from "../../Services/JobOfferService";
import ph1 from "../../assets/images/c1.jpg"

Location.propTypes = {};

function Location() {
 const [locations, setLocations] = useState([]);

 useEffect(() => {
  const fetchLocations = async () => {
        const rawData = await JobOfferServices.getJobOfferCountsBySupportedCountries();

    const flags = {
      France:ph1,
      Germany: "../../assets/images/c3.jpg",
      Canada: "/images/c2.jpg",
      "United States": "/images/c3.jpg",
      "United Kingdom": "/images/c2.jpg",
    };

    const formattedData = Object.entries(rawData).map(([country, count], index) => ({
      id: index + 1,
      title: country,
      unit: `${count} Job${count !== 1 ? "s" : ""}`,
      img: flags[country] || "/images/default.png",
    }));
console.log("formattedData",formattedData)
    setLocations(formattedData);
  };

  fetchLocations();
}, []);

  return (
    <section className="location-section over-flow-hidden background1">
      <div className="tf-container">
        <div className="row">
          <div className="col-md-12">
            <div className="tf-title style-2">
              <div className="group-title">
                <h1>Jobs by Location</h1>
                <p>Find your favourite jobs and get the benefits of yourself</p>
              </div>
            </div>
          </div>
          <div className="col-lg-12 wow fadeInUp">
            <Swiper
              spaceBetween={19.5}
              slidesPerView={1}
              className="location-slider"
              loop={true}
              breakpoints={{
                600: {
                  slidesPerView: 2,
                  spaceBetween: 19.5,
                },
                991: {
                  slidesPerView: 3,
                  spaceBetween: 19.5,
                },
                1400: {
                  slidesPerView: 4,
                  spaceBetween: 19.5,
                },
              }}
            >
              {locations.map((idx) => (
                <SwiperSlide key={idx.id}>
                  <div className="wd-job-location">
                    <div className="features">
                      <img src={idx.img} alt="images" />
                    </div>
                    <div className="content">
                      <h6>
                        <Link to="/jobsingle_v1">{idx.title}</Link>
                      </h6>
                      <Link to="#" className="category">
                        {idx.unit}
                      </Link>
                    </div>
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

export default Location;
