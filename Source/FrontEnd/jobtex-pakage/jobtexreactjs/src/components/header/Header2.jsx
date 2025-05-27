import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Authentification from "../../Services/AuthentificationService";

import logo from "../../assets/images/logo.png";
import avt from "../../assets/images/user/avatar/image-01.jpg";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import toast from "react-hot-toast";



Header2.propTypes = {};

function Header2({ clname = "", handleMobile }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const handleDropdown = (index) => {
    setActiveIndex(index);
  };
  const [isLoading, setIsLoading] = useState(false);


  const [scroll, setScroll] = useState(0);
  const navigate = useNavigate();
  const user = Authentification?.getStoredUser?.()
  const [Photo, setPhoto] = useState("");



  useEffect(() => {
    const fetchCandidate = async () => {
      const user = Authentification?.getStoredUser?.();
      try {
        const response = await axios.get(`http://localhost:5259/api/Authentication/GetUser/${user?.userAccountId}`);
        const data = response.data;

        // 👉 Récupération du champ photo
        if (data.photoLogo) {
          setPhoto(data.photoLogo);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du candidat :', error);
      }
    };

    fetchCandidate();
  }, []);

  useEffect(() => {
    if (isLoading) {
      toast("⏳ Veuillez patienter, l’analyse de votre CV est en cours...", {
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  }, [isLoading]);

  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("CvFile", file);

    setIsLoading(true); // début du chargement

    try {
      const response = await axios.post(
        "http://localhost:5259/api/JobOfferCandidancy/recommendations",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/joblist_v5", {
        state: { recommendedJobs: response.data },
      });
    } catch (err) {
      console.error("Erreur lors de l'envoi :", err);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false); // fin du chargement
    }
  };


  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY > 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
  }, []);
  const handleLogout = () => {
    Authentification.logout(); // Assurez-vous que cette fonction gère bien la déconnexion

    window.location.href = "http://localhost:3000/login"; // Redirection correcte

    console.log("User logged out");
  };


  return (
    <header
      id="header"
      className={`header header-default ${scroll ? "is-fixed is-small" : ""}`}
    >
      <div className="tf-container ct2">
        <div className="row">
          <div className="col-md-12">
            <div className="sticky-area-wrap">
              <div className="header-ct-left">
                <div id="logo" className="logo">
                  <Link to="\candidatesingle_v1">
                    <img
                      className="site-logo"
                      id="trans-logo"
                      src={logo}
                      alt="Image"
                    />
                  </Link>
                </div>
                <div className="categories">
                  <Link to="#">
                    <span className="icon-grid"></span>Categories
                  </Link>
                  <div className="sub-categorie">
                    <ul className="pop-up">
                      <li>
                        <Link to="#">
                          <span className="icon-categorie-1"></span>Design &
                          Creative
                        </Link>
                        <div className="group-menu-category">
                          <div className="menu left">
                            <h6>Top Categories</h6>
                            <ul>
                              <li>
                                <Link to="/joblist_v1">Design & Creative</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Digital marketing</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Development & IT</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Music & Audio</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">
                                  Finance & Accounting
                                </Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Programming & Tech</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">video & Animation</Link>
                              </li>
                            </ul>
                          </div>
                          <div className="menu right">
                            <h6>Top Skills</h6>
                            <ul>
                              <li>
                                <Link to="/jobsingle_v1">Adobe Photoshop</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">adobe XD</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">
                                  Android Developer
                                </Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">Figma</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">CSS, Html</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">BA</Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </li>
                      <li>
                        <Link to="#">
                          <span className="icon-categorie-8"></span>Digital
                          Marketing
                        </Link>
                        <div className="group-menu-category">
                          <div className="menu left">
                            <h6>Top Categories</h6>
                            <ul>
                              <li>
                                <Link to="/joblist_v1">Digital marketing</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Design & Creative</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">
                                  Finance & Accounting
                                </Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Development & IT</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Programming & Tech</Link>
                              </li>
                            </ul>
                          </div>
                          <div className="menu right">
                            <h6>Top Skills</h6>
                            <ul>
                              <li>
                                <Link to="/jobsingle_v1">adobe XD</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">Figma</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">BA</Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </li>
                      <li>
                        <Link to="#">
                          <span className="icon-categorie-2"></span>Development
                          & IT
                        </Link>
                        <div className="group-menu-category">
                          <div className="menu left">
                            <h6>Top Categories</h6>
                            <ul>
                              <li>
                                <Link to="/joblist_v1">Design & Creative</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Development & IT</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Music & Audio</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">video & Animation</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">
                                  Finance & Accounting
                                </Link>
                              </li>
                            </ul>
                          </div>
                          <div className="menu right">
                            <h6>Top Skills</h6>
                            <ul>
                              <li>
                                <Link to="/jobsingle_v1">adobe XD</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">
                                  Android Developer
                                </Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">Adobe Photoshop</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">CSS, Html</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">BA</Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </li>
                      <li>
                        <Link to="#">
                          <span className="icon-categorie-3"></span>Music &
                          Audio
                        </Link>
                        <div className="group-menu-category">
                          <div className="menu left">
                            <h6>Top Categories</h6>
                            <ul>
                              <li>
                                <Link to="/joblist_v1">Digital marketing</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Design & Creative</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">video & Animation</Link>
                              </li>
                            </ul>
                          </div>
                          <div className="menu right">
                            <h6>Top Skills</h6>
                            <ul>
                              <li>
                                <Link to="/jobsingle_v1">
                                  Android Developer
                                </Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">Adobe Photoshop</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">adobe XD</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">Figma</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">BA</Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </li>
                      <li>
                        <Link to="#">
                          <span className="icon-categorie-4"></span>Finance &
                          Accounting
                        </Link>
                        <div className="group-menu-category">
                          <div className="menu left">
                            <h6>Top Categories</h6>
                            <ul>
                              <li>
                                <Link to="/joblist_v1">Development & IT</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Design & Creative</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Programming & Tech</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Music & Audio</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">
                                  Finance & Accounting
                                </Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">video & Animation</Link>
                              </li>
                            </ul>
                          </div>
                          <div className="menu right">
                            <h6>Top Skills</h6>
                            <ul>
                              <li>
                                <Link to="/jobsingle_v1">adobe XD</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">Figma</Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </li>
                      <li>
                        <Link to="#">
                          <span className="icon-categorie-5"></span>Programming
                          & Tech
                        </Link>
                        <div className="group-menu-category">
                          <div className="menu left">
                            <h6>Top Categories</h6>
                            <ul>
                              <li>
                                <Link to="/joblist_v1">Design & Creative</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Digital marketing</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Music & Audio</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">
                                  Finance & Accounting
                                </Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Programming & Tech</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">video & Animation</Link>
                              </li>
                            </ul>
                          </div>
                          <div className="menu right">
                            <h6>Top Skills</h6>
                            <ul>
                              <li>
                                <Link to="/jobsingle_v1">Adobe Photoshop</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">adobe XD</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">Figma</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">CSS, Html</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">BA</Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </li>
                      <li>
                        <Link to="#">
                          <span className="icon-categorie-6"></span>Video &
                          Animation
                        </Link>
                        <div className="group-menu-category">
                          <div className="menu left">
                            <h6>Top Categories</h6>
                            <ul>
                              <li>
                                <Link to="/joblist_v1">Design & Creative</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Digital marketing</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Programming & Tech</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">video & Animation</Link>
                              </li>
                            </ul>
                          </div>
                          <div className="menu right">
                            <h6>Top Skills</h6>
                            <ul>
                              <li>
                                <Link to="/jobsingle_v1">Adobe Photoshop</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">CSS, Html</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">BA</Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </li>
                      <li>
                        <Link to="#">
                          <span className="icon-categorie-7"></span>Writing &
                          translation
                        </Link>
                        <div className="group-menu-category">
                          <div className="menu left">
                            <h6>Top Categories</h6>
                            <ul>
                              <li>
                                <Link to="/joblist_v1">
                                  Finance & Accounting
                                </Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">Programming & Tech</Link>
                              </li>
                              <li>
                                <Link to="/joblist_v1">video & Animation</Link>
                              </li>
                            </ul>
                          </div>
                          <div className="menu right">
                            <h6>Top Skills</h6>
                            <ul>
                              <li>
                                <Link to="/jobsingle_v1">Figma</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">CSS, Html</Link>
                              </li>
                              <li>
                                <Link to="/jobsingle_v1">BA</Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="header-ct-center">
                <div className="nav-wrap">
                  <nav id="main-nav" className="main-nav">
                    <ul id="menu-primary-menu" className={`menu ${clname}`}>
                      <li className="menu-item menu-item-has-children sub1">
                        <Link to="/">Home </Link>

                      </li>
                      <li className="menu-item menu-item-has-children sub2">
                        <Link to="#">Find jobs </Link>
                        <ul className="sub-menu st1">
                          <li className="nav-sub subnav1">
                            {user?.appRoleId === 3 && (
                              <>



                                <li className="nav-menu-item subitem2">
                                  <NavLink to="/job-grid">Job List </NavLink>
                                </li>
                                <li className="nav-sub subnav5">
                                  <NavLink to="/employernotfound">
                                    Application
                                  </NavLink>
                                </li>
                                <li className="nav-sub subnav2">
                                  <NavLink to="/joblist_v10">
                                    Interviews
                                  </NavLink>
                                </li>
                              </>
                            )}
                            {user?.appRoleId === 2 && (
                              <>

                                <li className="nav-menu-item subitem1">
                                  <NavLink to="/joblist_v1">Job List </NavLink>
                                </li>
                                <li className="nav-sub subnav2">
                                  <NavLink to="/jobCandidancy">
                                    Applications
                                  </NavLink>
                                </li>
                                <li className="nav-sub subnav2">
                                  <NavLink to="/joblist_v6">
                                    Interviews
                                  </NavLink>
                                </li>
                              </>
                            )}
                            {!user && (
                              <>
                               <li className="nav-menu-item subitem2">
                                  <NavLink to="/job-grid">Job List </NavLink>
                                </li>
                               
                              </>
                            )}
                          </li>



                        </ul>
                      </li>

                      <li className="menu-item menu-item-has-children sub3">
                        <Link to="#">Companies</Link>
                        <ul className="sub-menu st1">
                          <li className="nav-sub subnav1">
                          {user?.appRoleId === 2 && (
                              <>
                            <li className="nav-menu-item">
                              <NavLink to="/employers_v1">
                                Companies List
                              </NavLink>
                            </li>
                            <li className="nav-sub">
                              <NavLink to="/employerreview">
                                Interview Scheduled
                              </NavLink>
                            </li>
                            </>
                          )
                        }
                         {user?.appRoleId === 3 && (
                          <>
                            <li className="nav-menu-item">
                              <NavLink to="/employers_v2">
                                Companies Grid
                              </NavLink>
                            </li>
                             </>
                            )
                          }
                            
                          </li>
                          {!user && (
                              <>
                               <li className="nav-menu-item subitem2">
                               <NavLink to="/employers_v2">
                                Companies Grid
                              </NavLink>
                                </li>
                               
                              </>
                            )}
                        </ul>
                      </li>
                     
                      <li className="menu-item menu-item-has-children sub6">
                        <Link to="#">Pages</Link>
                        <ul className="sub-menu st1">

                          <li className="nav-sub subnav2">
                            <Link to="/aboutus">About Us</Link>
                          </li>
                          <li className="nav-sub subnav8">
                            <Link to="/contactus">Contact Us</Link>
                          </li>
                          <li className="nav-menu-item">
                                  <NavLink to="/login">Connexion</NavLink>
                                </li>
                                <li className="nav-menu-item">
                                  <NavLink to="/register">Créer un compte</NavLink>
                                </li>
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="header-ct-right">

                <div className="header-customize-item help">
                  <Link to="/termsofuse">
                    <span className="icon-help-circle"></span>
                  </Link>
                </div>
                <div className="header-customize-item bell">
                  <span className="icon-bell"></span>



                </div>

                <div className="header-customize-item account">
                  <Link to={`/candidatesingle_v1`}>
                    <img
                      src={Photo}
                      alt="photo"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid #ccc",
                        cursor: "pointer"
                      }}
                    />
                  </Link>
                  {user?.appRoleId === 3 && (
                              <>
                  <div className="header-customize-item button">
      <label
        htmlFor="cv-upload"
        style={{
          background: "#f0f0f0",
          color: "#333",
          padding: "8px 16px",
          borderRadius: "4px",
          fontWeight: "500",
          textDecoration: "none",
          cursor: "pointer",
          display: "inline-block",
        }}
        onMouseOver={(e) => {
          e.target.style.background = "#0e7abf";
          e.target.style.color = "#fff";
        }}
        onMouseOut={(e) => {
          e.target.style.background = "#f0f0f0";
          e.target.style.color = "#333";
        }}
      >
        Upload Resume
      </label>
      <input
        type="file"
        id="cv-upload"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={handleCvUpload}
      />
    </div> </>
              )}


                </div>
             
                <div className="header-customize-item button">
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      padding: '8px 16px',
                    }}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
                    <span style={{ marginLeft: '8px', fontSize: '12px' }}>Logout</span>
                  </button>

                </div>


              </div>
              <div className="nav-filter" onClick={handleMobile}>
                <div className="nav-mobile">
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header2;

/* <li className="menu-item menu-item-has-children sub4">
                        <Link to="#">Candidates</Link>
                        <ul className="sub-menu st1">
                          <li className="nav-sub subnav1">
                            <Link to="#">
                              Candidates Listing
                              <span className="icon-keyboard_arrow_right"></span>
                            </Link>
                            <ul className="nav-sub-menu">
                              <li className="nav-menu-item">
                                <NavLink to="/candidates_v1">
                                  List Layout
                                </NavLink>
                              </li>
                              <li className="nav-menu-item">
                                <NavLink to="/candidates_v2">
                                  Grid Layout
                                </NavLink>
                              </li>
                              <li className="nav-menu-item">
                                <NavLink to="/candidates_v3">
                                  List Sidebar
                                </NavLink>
                              </li>
                              <li className="nav-menu-item">
                                <NavLink to="/candidates_v4">Top Map</NavLink>
                              </li>

                              <li className="nav-menu-item">
                                <NavLink to="/candidates_v5">Half Map</NavLink>
                              </li>
                              <li className="nav-menu-item">
                                <NavLink to="/candidates_v6">
                                  No Available - V1
                                </NavLink>
                              </li>
                              <li className="nav-menu-item">
                                <NavLink to="/candidates_v7">
                                  No Available - V2
                                </NavLink>
                              </li>
                            </ul>
                          </li>
                          <li className="nav-sub subnav2">
                            <Link to="#">
                              Sample CV
                              <span className="icon-keyboard_arrow_right"></span>
                            </Link>
                            <ul className="nav-sub-menu">
                              <li className="nav-menu-item">
                                <NavLink to="/samplecv">Sample CV</NavLink>
                              </li>
                              <li className="nav-menu-item">
                                <NavLink to="/samplecvdetails">
                                  CV Details
                                </NavLink>
                              </li>
                              <li className="nav-menu-item">
                                <NavLink to="/samplecvslidebar">
                                  Sample CV Sidebar
                                </NavLink>
                              </li>
                            </ul>
                          </li>
                          <li className="nav-sub subnav3">
                            <NavLink to="/candidatesingle_v1">
                              Candidate Single - V1
                            </NavLink>
                          </li>
                          <li className="nav-sub subnav4">
                            <NavLink to="/candidatesingle_v2">
                              Candidate Single - V2
                            </NavLink>
                          </li>
                        </ul>
                      </li>
*/