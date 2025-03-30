import React from "react";
import PropTypes from "prop-types";
import SelectLocation from "../dropdown";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


Banner07.propTypes = {};

function Banner07(props) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");  // State to hold the selected location

  const handleLocationChange = (selectedOption) => {
    setLocation(selectedOption.label);  // Use selectedOption.label to get the location name
  };
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("location", location)
    // Naviguer vers la page des résultats en passant les paramètres via state
    navigate("/job-list-sidebar", {
      state: { title, location },
    });
  };
    
  return (
    <section className="tf-slider sl5">
      <div className="tf-container">
        <div className="row">
          <div className="col-lg-12">
            <div className="content">
              <div className="heading text-center">
                <h2 className="text-white">Find the job that fits your life</h2>
                <p className="text-white">
                  Resume-Library is a true performance-based job board. Enjoy
                  custom hiring products and access to up to 10,000 new resume
                  registrations daily, with no subscriptions or user licences.
                </p>
              </div>
              <div className="icon ic1 ani3">
                <img
                  src={require("../../assets/images/review/icon6.png")}
                  alt="images"
                />
              </div>
              <div className="icon ic2 ani6">
                <img
                  src={require("../../assets/images/review/icon5.png")}
                  alt="images"
                />
              </div>
              <div className="form-sl">
                <form  onSubmit={handleSubmit}>
                  <div className="row-group-search home1 st">
                    <div className="form-group-1">
                      <span className="icon-search search-job"></span>
                      <input
                        type="text"
                        className="input-filter-search"
                        placeholder="Job title, key words or company"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="form-group-2">
                      <span className="icon-map-pin"></span>
                      <SelectLocation value={location} onChange={handleLocationChange} />

                    </div>
                    <div className="form-group-4">
                      <button type="submit" className="btn btn-find">
                        Find Jobs
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner07;
