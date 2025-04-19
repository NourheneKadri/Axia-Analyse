import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import SortBuy from "../dropdown/SortBuy";
import axios from 'axios';
import moment from "moment";
import SelectLocation from "../dropdown";
import JobOfferServices from "../../Services/JobOfferService";


function JobSec2(props) {
  const { className, handlePopup } = props;
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [isOpen, setIsOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [companyLogos, setCompanyLogos] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4; 
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const [sortBy, setSortBy] = useState("default");
  const [error, setError] = useState(null); 
  


 
  const handleClick = () => {
    setIsOpen(!isOpen);
  };


  const handleLocationChange = (selectedLocation) => {
    setSelectedLocation(selectedLocation);
    if (selectedLocation.label === "All Location") {
      setCurrentPage(1); // Réinitialiser la page à 1 lorsque "All Locations" est sélectionné
    }
  };
  const filteredJobs = data.filter((job) => {
    
    const matchesLocation = selectedLocation && selectedLocation.label !== "All Location"
    ? job.adress.includes(selectedLocation.label)
    : true;
    const normalizeText = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const matchesSearch = normalizeText(job.title).includes(normalizeText(searchTerm));
    const matchesJobType = selectedJobType ? job.jobTypeId.toString() === selectedJobType : true;
      return matchesSearch && matchesLocation && matchesJobType;

  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === "new") {
      return new Date(b.timestamp) - new Date(a.timestamp); // Nouveaux en premier
    }
    if (sortBy === "last") {
      return new Date(a.timestamp) - new Date(b.timestamp); // Anciens en premier
    }
    return 0; // Ordre par défaut
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage); // Total pages based on filtered data
  const currentJobs = sortedJobs.slice(indexOfFirstJob, indexOfLastJob);
  const handleSortChange = (selectedOption) => {
    setSortBy(selectedOption.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredJobs.length / jobsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
 useEffect(() => {
     // Remplace l'URL ci-dessous par celle de ton API
     const fetchData = async () => {
       try {
        const response = await JobOfferServices.getJobOffers(); // ← ICI il faut "await"
        
         
         const result = response.data;
         console.log("resp", result)
         setData(result); 
         result.forEach(async (job) => {
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
 
     fetchData();
   }, []); 
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

  if (loading) {
    return <div>Loading...</div>; // Display loading message or spinner
  }

  return (
    <section className={`inner-jobs-section ${className}`}>
       <div className="tf-container" style={{paddingBottom:"38px"}}>
              <div className="job-search-form inner-form-map st1">
                <form action="/job-list-sidebar">
                  <div className="row-group-search">
                    <div className="form-group-1">
                      <input
                        type="text"
                        className="input-filter-search"
                        placeholder="Job title, key words or company"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <span className="icon-search search-job"></span>
                    </div>
                    <div className="form-group-2">
                      <span className="icon-map-pin"></span>
                      <SelectLocation value={selectedLocation}onChange={handleLocationChange} />
      
                    </div>
                    <div className="form-group-3">
                      <span className="icon-filter"></span>
                      <div
                        className={`filter-radio ${isOpen ? "open" : ""}`}
                        onClick={handleClick}
                      >
                        <p>Filter More</p>
                      </div>
                    </div>
                    <div
                      className={`wd-filter-radio ${
                        isOpen ? "modal-menu--open" : ""
                      }`}
                    >
                      <div className="content">
                        <div className="fl-cl lc1">
                          <h6>On-site/Remote</h6>
                          <ul>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-1" />
                                <label htmlFor="checkbox-1"></label>
                              </div>
                              <label>On-site (1,675)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-2" />
                                <label htmlFor="checkbox-2"></label>
                              </div>
                              <label>Remote (5,675)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-3" />
                                <label htmlFor="checkbox-3"></label>
                              </div>
                              <label>Hybrid (6,675)</label>
                            </li>
                          </ul>
                        </div>
                        <div className="fl-cl lc2">
                          <h6>All Job Types</h6>
                          <ul>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-4" />
                                <label htmlFor="checkbox-4"></label>
                              </div>
                              <label>All Job Types (1,675)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-5" />
                                <label htmlFor="checkbox-5"></label>
                              </div>
                              <label>Full-time (623)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-6" />
                                <label htmlFor="checkbox-6"></label>
                              </div>
                              <label>Part-time (45)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-7" />
                                <label htmlFor="checkbox-7"></label>
                              </div>
                              <label>Contract (65)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-8" />
                                <label htmlFor="checkbox-8"></label>
                              </div>
                              <label>Internship (9)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-9" />
                                <label htmlFor="checkbox-9"></label>
                              </div>
                              <label>Temporary (4)</label>
                            </li>
                          </ul>
                        </div>
                        <div className="fl-cl lc3">
                          <h6>All Salary</h6>
                          <ul>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-10" />
                                <label htmlFor="checkbox-10"></label>
                              </div>
                              <label>All Salaries (6,277)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-11" />
                                <label htmlFor="checkbox-11"></label>
                              </div>
                              <label>$50,000+ (2,277)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-12" />
                                <label htmlFor="checkbox-12"></label>
                              </div>
                              <label>$70,000+ (1,627)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-13" />
                                <label htmlFor="checkbox-13"></label>
                              </div>
                              <label>$90,000+ (7,627)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-14" />
                                <label htmlFor="checkbox-14"></label>
                              </div>
                              <label>$110,000+ (227)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-15" />
                                <label htmlFor="checkbox-15"></label>
                              </div>
                              <label>$130,000+ (527)</label>
                            </li>
                          </ul>
                        </div>
                        <div className="fl-cl lc4">
                          <h6>Any Distance</h6>
                          <ul>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-16" />
                                <label htmlFor="checkbox-16"></label>
                              </div>
                              <label>Any Distance (227)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-17" />
                                <label htmlFor="checkbox-17"></label>
                              </div>
                              <label>within 5 miles (227)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-18" />
                                <label htmlFor="checkbox-18"></label>
                              </div>
                              <label>within 10 miles (227)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-19" />
                                <label htmlFor="checkbox-19"></label>
                              </div>
                              <label>within 25 miles (227)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-20" />
                                <label htmlFor="checkbox-20"></label>
                              </div>
                              <label>within 50 miles (227)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-21" />
                                <label htmlFor="checkbox-21"></label>
                              </div>
                              <label>within 100 miles (227)</label>
                            </li>
                          </ul>
                        </div>
                        <div className="fl-cl lc5">
                          <h6>Posted Anytime</h6>
                          <ul>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-22" />
                                <label htmlFor="checkbox-22"></label>
                              </div>
                              <label>Posted Anytime</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-23" />
                                <label htmlFor="checkbox-23"></label>
                              </div>
                              <label>Last 1 days (227)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-24" />
                                <label htmlFor="checkbox-24"></label>
                              </div>
                              <label>Last 3 days (227)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-25" />
                                <label htmlFor="checkbox-25"></label>
                              </div>
                              <label>Last 7 days (227)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-26" />
                                <label htmlFor="checkbox-26"></label>
                              </div>
                              <label>Last 14 days (227)</label>
                            </li>
                          </ul>
                        </div>
                        <div className="fl-cl lc6">
                          <h6>All Seniority Levels</h6>
                          <ul>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-27" />
                                <label htmlFor="checkbox-27"></label>
                              </div>
                              <label>All Seniority Levels</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-28" />
                                <label htmlFor="checkbox-28"></label>
                              </div>
                              <label>Entry Level (24)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-29" />
                                <label htmlFor="checkbox-29"></label>
                              </div>
                              <label>Mid Senior Level (34)</label>
                            </li>
                            <li>
                              <div className="round">
                                <input type="checkbox" id="checkbox-30" />
                                <label htmlFor="checkbox-30"></label>
                              </div>
                              <label>Executive (12)</label>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="form-group-4">
                      <button className="btn btn-find">Find Jobs</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
      <div className="tf-container">
        <div className="row">
          <Tabs className="col-lg-12 tf-tab">
            <div className="wd-meta-select-job">
              <div className="wd-findjob-filer">
                <div className="group-select-display">
                  <Link className="button-filter st2" onClick={handlePopup}>
                    <i className="icon-filter"></i> Filters
                  </Link>
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
                    <span>{data.length} </span>  jobs recommended for you
                  </p>
                </div>
                <SortBuy />
              </div>
            </div>
            <div className="content-tab">
              <TabPanel className="inner">
                <div className="group-col-2">
                  {currentJobs.slice(0, 8).map((idx) => (
                    <div key={idx.id} className="features-job cl2">
                      <div className="job-archive-header">
                        <div className="inner-box">
                        <div className="logo-company">
                        {companyLogos[idx.userAccountId] ? (
                <img src={companyLogos[idx.userAccountId]} alt="Company Logo" />
              ) : (
                <p>No Logo</p>
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
                <ul className="pagination-job padding" style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', padding: 0 }}>
                  <li style={{ margin: '0 5px' }}>
                    <Link 
                      onClick={currentPage > 1 ? prevPage : undefined} 
                      className={currentPage === 1 ? "disabled" : ""}
                    >
                      <i className="icon-keyboard_arrow_left"></i>
                    </Link>
                  </li>
                
                  {[...Array(totalPages)].map((_, index) => (
                    <li key={index} style={{ margin: '0 5px' }} className={currentPage === index + 1 ? "current" : ""}>
                      <Link onClick={() => paginate(index + 1)}>{index + 1}</Link>
                    </li>
                  ))}
                
                  <li style={{ margin: '0 5px' }}>
                    <Link 
                      onClick={currentPage < totalPages ? nextPage : undefined} 
                      className={currentPage === totalPages ? "disabled" : ""}
                    >
                      <i className="icon-keyboard_arrow_right"></i>
                    </Link>
                  </li>
                </ul>
              </TabPanel>
              {/* Add other TabPanels here */}
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

JobSec2.propTypes = {
  className: PropTypes.string,
  handlePopup: PropTypes.func
};

export default JobSec2;
