import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button2 from "../button/Button2";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import axios from "axios";
import moment from "moment";

Job07.propTypes = {};

function Job07(props) {
  const { className } = props;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobOffers, setJobOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companyLogos, setCompanyLogos] = useState({});
  
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

  const jobTypes = [
    { id: 1, name: "Full Time" },
    { id: 2, name: "Part Time" },
    { id: 3, name: "Freelance" },
    { id: 4, name: "CDD" },
    { id: 5, name: "CDI" },
  ];

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5259/api/JobOffer/jobcategories");
        setCategories(response.data.slice(0, 4)); // Get only the first 4 categories
        setSelectedCategory(response.data[0]?.id); // Set the first category as default

      } catch (error) {
        console.error("Erreur lors du chargement des catégories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      // Fetch job offers for the selected category
      const fetchJobOffers = async () => {
        try {
          const response = await axios.get(`http://localhost:5259/api/JobOffer/category/${selectedCategory}`);
          setJobOffers(response.data);

          // Fetch logos for the jobs
          const logos = await Promise.all(
            response.data.map((job) => fetchCompanyLogo(job.userAccountId))
          );
          const logosMap = logos.reduce((acc, logo, index) => {
            acc[response.data[index].userAccountId] = logo;
            return acc;
          }, {});
          setCompanyLogos(logosMap);
        } catch (error) {
          console.error("Erreur lors du chargement des offres", error);
          setJobOffers([]); // Réinitialiser les offres d'emploi
        
        }
      };

      fetchJobOffers();
    }
  }, [selectedCategory]);

  const fetchCompanyLogo = async (userAccountId) => {
    try {
      const response = await fetch(`http://localhost:5259/api/Authentication/company/${userAccountId}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du logo");
      }
      const companyData = await response.json();
      return companyData.logoUrl; // Assume the response contains a logoUrl key
    } catch (error) {
      console.error("Erreur lors de la récupération du logo", error);
      return null;
    }
  };

  const calculateDaysLeft = (deadlineTimestamp) => {
    const deadlineDate = new Date(deadlineTimestamp);
    const currentDate = new Date();
    const timeDiff = deadlineDate - currentDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (daysLeft < 0) {
      return "Deadline passed";
    } else if (daysLeft === 0) {
      return "Deadline is today";
    } else {
      return `${daysLeft} day${daysLeft > 1 ? 's' : ''} left to Apply`;
    }
  };

  return (
    <section className={className}>
      <Tabs
        className="wrap-testimonials style-1 over-flow-hidden tf-tab"
        onSelect={(index) => {
          setSelectedCategory(categories[index]?.id);
        }}
      >
        <div className="tf-container">
          <div className="tf-title style-3 margin">
            <div className="group-title">
              <h1>Featured Jobs</h1>
              <p>Find the right career opportunity for you</p>
            </div>
            <TabList className="menu-tab">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <Tab key={category.id} className="user-tag">
                    {category.value}
                  </Tab>
                ))
              ) : (
                <p>Chargement...</p>
              )}
            </TabList>
          </div>
          <div className="content-tab">
  {categories.map((category, index) => (
    <TabPanel key={category.id} className="row wow fadeInUp animation-tab job-tab-item">
      {jobOffers && jobOffers.length > 0 ? (
        jobOffers
          .filter((offer) => offer.categorieId === category.id) // filtrer par catégorie si besoin
          .slice(0, 9)
          .map((offer) => (
            <div key={offer.id} className="col-lg-4">
              <div className="features-job">
                <div className="job-archive-header">
                  <div className="inner-box">
                    <div className="logo-company">
                      {companyLogos[offer.userAccountId] ? (
                        <img src={companyLogos[offer.userAccountId]} alt="Company Logo" />
                      ) : (
                        <p>No Logo</p>
                      )}
                    </div>
                    <div className="box-content">
                      <h4>
                        <Link to="/jobsingle_v1">
                          {categoryMap[offer.categorieId] || "Unknown Category"}
                        </Link>
                      </h4>
                      <h3>
                        <Link to="/Jobsingle_v1">{offer.title}</Link>
                        <span className="icon-bolt"></span>
                      </h3>
                      <ul>
                        <li>
                          <span className="icon-map-pin"></span>&nbsp;{offer.adress}
                        </li>
                        <li>
                          <span className="icon-calendar" style={{ marginRight: '5px' }}></span>
                          {calculateDaysLeft(offer.deadlineTimestamp)}
                        </li>
                      </ul>
                      <span className="icon-heart"></span>
                    </div>
                  </div>
                </div>
                <div className="job-archive-footer">
                  <div className="job-footer-left">
                    <ul className="job-tag">
                      <li>
                        <Link to="#">
                          {{
                            1: 'Full-Time',
                            2: 'Part-Time',
                            3: 'Freelance',
                            4: 'CDD',
                            5: 'CDI',
                          }[offer.jobTypeId] || 'Unknown Type'}
                        </Link>
                      </li>
                    </ul>
                    <div className="star">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="icon-star-full"></span>
                      ))}
                    </div>
                  </div>
                  <div className="job-footer-right">
                    <div className="price">
                      <span className="icon-dolar1"></span>
                      <p>
                        {offer.salaryRange}
                        <span className="year">/year</span>
                      </p>
                    </div>
                    <p className="days">{moment(offer.timestamp).fromNow()}</p>
                  </div>
                </div>
                <Link to="/Jobsingle_v1" className="jobtex-link-item" tabIndex="0"></Link>
              </div>
            </div>
          ))
      ) : (
        <div className="col-12">
          <p>Aucune offre disponible pour cette catégorie.</p>
        </div>
      )}

      <div className="col-md-12">
        <div className="wrap-button">
          <Button2 title="See more Jobs" link="/joblist_v1" />
        </div>
      </div>
    </TabPanel>
  ))}
</div>

        </div>
      </Tabs>
    </section>
  );
}

export default Job07;
