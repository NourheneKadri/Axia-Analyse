import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import SortBuy from "../dropdown/SortBuy";
import Authentification from "../../Services/AuthentificationService";
import { useLocation } from 'react-router-dom';
import moment from "moment";


JobTopmap.propTypes = {};

function JobTopmap(props) {
  const { className } = props;
  const location = useLocation();
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 

  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get('categoryId');
  const [offers, setOffers] = useState([]);

  const [companyLogos, setCompanyLogos] = useState({});

  useEffect(() => {
    const fetchOffersByCategory = async () => {
      const user = Authentification.getStoredUser(); // Or other method to get the user

      try {
        const response = await axios.get(
          `http://localhost:5259/api/JobOffer/category/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setOffers(response.data);
        offers.forEach(async (job) => {
          const companyLogo = await fetchCompanyLogo(job.userAccountId);
          setCompanyLogos((prevLogos) => ({
            ...prevLogos,
            [job.userAccountId]: companyLogo,
          }));
        });
      } catch (error) {
        setError(error.message); // Gérer l'erreur
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchOffersByCategory();
  }, [categoryId]); 
  const fetchCompanyLogo = async (userAccountId) => {
   try {
     const response = await fetch(`http://localhost:5259/api/Authentication/company/${userAccountId}`);
     if (!response.ok) {
       throw new Error("Erreur lors de la récupération du logo");
     }
     const companyData = await response.json();
     return companyData.logoUrl; // Suppose que la réponse contient une clé `logoUrl`
   } catch (error) {
     console.error("Erreur lors de la récupération du logo", error);
     return null;
   }
 };  




      /*  offers.forEach(async (job) => {
          const companyLogo = await fetchCompanyLogo(job.userAccountId);
          setCompanyLogos((prevLogos) => ({
            ...prevLogos,
            [job.userAccountId]: companyLogo,
          }));
        });
      } catch (error) {
        console.error("Error fetching job offers:", error);
      }
    };

    fetchOffersByCategory();
  }, [categoryId]); // Re-run when categoryId changes

  useEffect(() => {
    const fetchCompanyLogos = async () => {
      for (const job of offers) {
        try {
          const companyLogo = await fetch(`http://localhost:5259/api/Authentication/company/${job.userAccountId}`);
          const companyData = await companyLogo.json();
          return companyData.logoUrl; 

          setCompanyLogos((prevLogos) => ({
            ...prevLogos,
            [job.userAccountId]: companyLogo,
          }));
        } catch (error) {
          console.error("Error fetching company logo:", error);
        }
      }
    };*/

   


  return (
    <section className={`inner-jobs-section ${className}`}>
      <div className="tf-container">
        <div className="row">
          <Tabs className="col-lg-12 tf-tab">
            <div className="wd-meta-select-job">
              <div className="wd-findjob-filer">
                <div className="group-select-display">
                  <TabList className="inner menu-tab">
                    <Tab className="btn-display">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                      >
                        <path
                          d="M4.5 0H0.500478C0.5 0.380952 0.5 0.596931 0.5 1.33333V14.6667C0.5 15.4031 0.500478 16 0.500478 16H4.5C4.5 16 4.5 15.4031 4.5 14.6667V1.33333C4.5 0.596931 4.5 0.380952 4.5 0Z"
                          fill="white"
                        />
                        <path
                          d="M10.5 0H6.50048C6.5 0.380952 6.5 0.596931 6.5 1.33333V14.6667C6.5 15.4031 6.50048 16 6.50048 16H10.5C10.5 16 10.5 15.4031 10.5 14.6667V1.33333C10.5 0.596931 10.5 0.380952 10.5 0Z"
                          fill="white"
                        />
                        <path
                          d="M16.5 0H12.5005C12.5 0.380952 12.5 0.596931 12.5 1.33333V14.6667C12.5 15.4031 12.5005 16 12.5005 16H16.5C16.5 16 16.5 15.4031 16.5 14.6667V1.33333C16.5 0.596931 16.5 0.380952 16.5 0Z"
                          fill="white"
                        />
                      </svg>
                    </Tab>
                    <Tab className="btn-display">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                      >
                        <path
                          d="M0.5 12.001L0.5 16.0005C0.880952 16.001 1.09693 16.001 1.83333 16.001L15.1667 16.001C15.9031 16.001 16.5 16.0005 16.5 16.0005L16.5 12.001C16.5 12.001 15.9031 12.001 15.1667 12.001L1.83333 12.001C1.09693 12.001 0.880952 12.001 0.5 12.001Z"
                          fill="#A0A0A0"
                        />
                        <path
                          d="M0.5 6.00098L0.5 10.0005C0.880952 10.001 1.09693 10.001 1.83333 10.001L15.1667 10.001C15.9031 10.001 16.5 10.0005 16.5 10.0005L16.5 6.00098C16.5 6.00098 15.9031 6.00098 15.1667 6.00098L1.83333 6.00098C1.09693 6.00098 0.880952 6.00098 0.5 6.00098Z"
                          fill="#A0A0A0"
                        />
                        <path
                          d="M0.5 0.000976562L0.5 4.0005C0.880952 4.00098 1.09693 4.00098 1.83333 4.00098L15.1667 4.00098C15.9031 4.00098 16.5 4.0005 16.5 4.0005L16.5 0.000975863C16.5 0.000975863 15.9031 0.000975889 15.1667 0.000975921L1.83333 0.000976504C1.09693 0.000976536 0.880952 0.000976546 0.5 0.000976562Z"
                          fill="#A0A0A0"
                        />
                      </svg>
                    </Tab>
                  </TabList>
                  <p className="nofi-job">
                    <span>{offers.length}</span> jobs recommended for you
                  </p>
                </div>
                <SortBuy />
              </div>
            </div>
            <div className="content-tab">
              <TabPanel className="inner">
                <div className="group-col-2">
                  {offers.slice(0, 8).map((idx) => (
                    <div key={idx.id} className="features-job cl2">
                                        <div className="job-archive-header">
                                          <div className="inner-box">
                                          <div className="logo-company">
                        {companyLogos[idx.userAccountId] ? (
                <img src={companyLogos[idx.userAccountId]} alt="Company Logo" />
              ) : (
                <p></p>
              )}
                        </div>
                                            <div className="box-content">
                                              <h4>
                                              <Link   to={`/Jobsingle_v1/${idx.id}`}>
                                                      {(() => {
                                                        switch (idx.categorieId) {
                                                          case 1:
                                                            return 'Information Technology';
                                                          case 2:
                                                            return 'Software Development';
                                                          case 3:
                                                            return 'Human Resources';
                                                          case 4:
                                                            return 'Finance';
                                                          case 5:
                                                            return 'Design & Multimedia';
                                                          case 6:
                                                            return 'Telecommunications';
                                                          case 7:
                                                            return 'Engineering';
                                                          case 8:
                                                            return 'Construction & Facilities';
                                                          default:
                                                            return 'Unknown Category'; // Default case if categorieId doesn't match
                                                        }
                                                      })()}
                                                    </Link>
                                              </h4>
                                              <h3>
                                                <Link to={`/Jobsingle_v1/${idx.id}`}> {idx.title} </Link>
                                                <span className="icon-bolt"></span>
                                              </h3>
                                              <ul>
                                                <li>
                                                  <span className="icon-map-pin"></span>
                                                  {idx.adress}
                                                </li>
                                                <li>
                    <span className="icon-calendar" style={{ marginRight: '5px' }}></span>
                    {(() => {
                      const deadlineDate = new Date(idx.deadlineTimestamp);
                      const currentDate = new Date();
                      
                      // Calculate the difference in time (in milliseconds)
                      const timeDiff = deadlineDate - currentDate;
                      
                      // Convert time difference to days
                      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
                      
                      // Check if the deadline is in the past, today, or in the future
                      if (daysLeft < 0) {
                        return "Deadline passed";
                      } else if (daysLeft === 0) {
                        return "Deadline is today";
                      } else {
                        return `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`;
                      }
                    })()}
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
                                             {(() => {
                                                                  switch (idx.jobTypeId) {
                                                                    case 1:
                                                                      return 'Full-Time';
                                                                    case 2:
                                                                      return 'Part-Time';
                                                                    case 3:
                                                                      return 'Freelance';
                                                                    case 4:
                                                                      return 'CDD';
                                                                    case 5:
                                                                      return 'CDI';
                                                                    default:
                                                                      return 'Unknown Type'; // Default case if jobTypeId doesn't match
                                                                  }
                                                                })()}
                                                              </Link></li>
                                             
                                            </ul>
                                            <div className="star">
                                              <span className="icon-star-full"></span>
                                              <span className="icon-star-full"></span>
                                              <span className="icon-star-full"></span>
                                              <span className="icon-star-full"></span>
                                              <span className="icon-star-full"></span>
                                            </div>
                                          </div>
                                          <div className="job-footer-right">
                                            <div className="price">
                                              <span className="icon-dolar1"></span>
                                              <p>
                                                {idx.salaryRange}
                                                <span className="year"> /year</span>
                                              </p>
                                            </div>
                                            <p className="days">{moment(idx.timestamp).fromNow()}</p>
                                          </div>
                                        </div>
                                        <Link
                                           to={`/Jobsingle_v1/${idx.id}`}
                                          className="jobtex-link-item"
                                          tabIndex="0"
                                        ></Link>
                                      </div>
                                    ))}
                                  </div>

                <ul className="pagination-job padding">
                  <li>
                    <Link to="#">
                      <i className="icon-keyboard_arrow_left"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">1</Link>
                  </li>
                  <li className="current">
                    <Link to="#">2</Link>
                  </li>
                  <li>
                    <Link to="#">3</Link>
                  </li>
                  <li>
                    <Link to="#">
                      <i className="icon-keyboard_arrow_right"></i>
                    </Link>
                  </li>
                </ul>
              </TabPanel>
              <TabPanel className="inner">
                {offers.slice(0, 9).map((idx) => (
                  <div key={idx.id} className="features-job style-3">
                    <div className="inner-box">
                      <div className="company">
                        <div className="logo-company">
                          <img src={idx.img} alt="Jobtex" />
                        </div>
                        <div className="box-content">
                          <h4>
                            <Link to="/Jobsingle_v1">{idx.cate}</Link>
                          </h4>
                          <h3>
                            <Link to="/Jobsingle_v1">{idx.title} </Link>
                            <span className="icon-bolt"></span>
                          </h3>
                          <div className="star">
                            <span className="icon-star-full"></span>
                            <span className="icon-star-full"></span>
                            <span className="icon-star-full"></span>
                            <span className="icon-star-full"></span>
                            <span className="icon-star-full"></span>
                          </div>
                        </div>
                      </div>
                      <ul className="info">
                        <li>
                          <span className="icon-map-pin"></span>
                          {idx.map}
                        </li>
                        <li>{idx.time}</li>
                      </ul>
                      <div className="category">
                        <ul className="job-tag">
                          <li>
                            <Link to="#"> Full-time</Link>
                          </li>
                          <li>
                            <Link to="#"> Hybrid</Link>
                          </li>
                        </ul>
                      </div>
                      <div className="salary">
                        <span className="icon-dolar1"></span>
                        <p>
                          {idx.price} <span className="year">/year</span>
                        </p>
                      </div>
                      <div className="group-btn">
                        <span className="icon-heart"></span>
                        <button>Apply</button>
                      </div>
                    </div>
                    <Link
                      to="/Jobsingle_v1"
                      className="jobtex-link-item"
                      tabIndex="0"
                    ></Link>
                  </div>
                ))}

                <ul className="pagination-job padding">
                  <li>
                    <Link to="#">
                      <i className="icon-keyboard_arrow_left"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="#">1</Link>
                  </li>
                  <li className="current">
                    <Link to="#">2</Link>
                  </li>
                  <li>
                    <Link to="#">3</Link>
                  </li>
                  <li>
                    <Link to="#">
                      <i className="icon-keyboard_arrow_right"></i>
                    </Link>
                  </li>
                </ul>
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

export default JobTopmap;
