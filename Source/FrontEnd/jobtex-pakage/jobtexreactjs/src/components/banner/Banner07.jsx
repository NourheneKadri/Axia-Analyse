import React from "react";
import PropTypes from "prop-types";
import SelectLocation from "../dropdown";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Authentification from "../../Services/AuthentificationService";


Banner07.propTypes = {};

function Banner07(props) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");  // State to hold the selected location
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
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
  useEffect(() => {
    const user = Authentification.getStoredUser()

    if (query.length > 1) {

      fetch(`http://localhost:5259/api/JobOffer/suggestions?query=${query}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`, 
        },
      })
        .then((res) => res.json())
        .then((data) => setSuggestions(data))
        .catch((err) => console.error("Erreur suggestions:", err));
    } else {
      setSuggestions([]);
    }
  }, [query]);
  const handleSelect = (suggestion) => {
    setQuery(suggestion);
    setTitle(suggestion); // Pour garder la valeur dans title pour le submit
    setSuggestions([]);
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
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setTitle(e.target.value); // important pour la navigation après sélection
                        }}
                      />
                       {suggestions.length > 0 && (
        <ul style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "4px",
          margin: 0,
          padding: 0,
          listStyle: "none",
          zIndex: 10,
        }}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}
              style={{ padding: "8px", cursor: "pointer" }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
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
