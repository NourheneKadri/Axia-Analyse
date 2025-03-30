import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import img from "../../assets/image.png";
import SortBuy from "../dropdown/SortBuy";
import { Tab, Tabs, TabList } from "react-tabs";
import { padding } from "@mui/system";
import { Link } from "react-router-dom";
import ReactDownloadLink from 'react-download-link';
import moment from "moment";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import SelectLocation from "../dropdown";
import Dropdown from "react-dropdown";
import { useMemo } from "react";


EmpSec5.propTypes = {};

function EmpSec5(props) {
  const [candidacies, setCandidacies] = useState([]);
  const [jobOffers, setJobOffers] = useState({}); // Store job offer titles and categories by ID
  const { data } = props;
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  
    
  
  
const options1 = [
  { value: "op1", label: "Job Title" },
  { value: "op2", label: "Design & Creative" },
  { value: "op3", label: "Design" },
  { value: "op4", label: "Ux/Ui" },
];

const options2 = [
  { value: "op1", label: "Any Distance" },
  { value: "op2", label: "Any Distance 1" },
  { value: "op3", label: "Any Distance 2" },
];
const options3 = [
  { value: "op1", label: "Company Size" },
  { value: "op2", label: "Company Size 1" },
  { value: "op3", label: "Company Size 2" },
];
const [jobCategory, setJobCategory] = useState(options1[0].value);
  const [distance, setDistance] = useState(options2[0].value);
  const [companySize, setCompanySize] = useState(options3[0].value);
  const handleKeywordChange = (event) => setKeyword(event.target.value);
  const handleLocationChange = (value) => setLocation(value);
  const handleJobCategoryChange = (value) => setJobCategory(value);
  const handleDistanceChange = (value) => setDistance(value);
  const handleCompanySizeChange = (value) => setCompanySize(value);
  
    
    // Filter by keyword (in job title or candidate name)
    const filteredCandidacies = useMemo(() => {
      if (!keyword) return candidacies; // Si aucun mot-clé, affiche tout
    
      return candidacies.filter((candidacy) => {
        const jobOffer = jobOffers[candidacy.jobOfferId] || {};
    
        // Filtre par mot-clé (nom du candidat OU titre du job)
        const matchesKeyword = 
          `${candidacy.firstName} ${candidacy.lastName}`.toLowerCase().includes(keyword.toLowerCase()) ||
          (jobOffer.title && jobOffer.title.toLowerCase().includes(keyword.toLowerCase()));
    
        return matchesKeyword;
      });
    }, [candidacies, keyword, jobOffers]);
    
    // You can add more filters as necessary
  

  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 1: // PENDING
        return 'warning'; // Yellow
      case 2: // UNDER_REVIEW
        return 'info'; // Blue
      case 3: // INTERVIEW_SCHEDULED
        return 'primary'; // Blue
      case 4: // INTERVIEW_COMPLETED
        return 'success'; // Green
      case 5: // ACCEPTED
        return 'success'; // Green
      case 6: // REJECTED
        return 'danger'; // Red
      default:
        return 'secondary'; // Default color
    }
  };

  useEffect(() => {
    const fetchCandidacies = async () => {
      try {
        const candidaciesResponse = await fetch('http://localhost:5259/api/JobOfferCandidancy');
        const candidaciesData = await candidaciesResponse.json();
        setCandidacies(candidaciesData);
  
        // Fetch job offers for all candidacies at once
        const jobOfferIds = [...new Set(candidaciesData.map(c => c.jobOfferId))];
        jobOfferIds.forEach(async (jobOfferId) => {
          if (!jobOffers[jobOfferId]) {
            const jobOfferResponse = await fetch(`http://localhost:5259/api/JobOffer/${jobOfferId}`);
            const jobOfferData = await jobOfferResponse.json();
            const companyResponse = await fetch(`http://localhost:5259/api/Authentication/company/${jobOfferData.userAccountId}`);
            const companyData = await companyResponse.json();
            
            setJobOffers(prev => ({
              ...prev,
              [jobOfferId]: {
                title: jobOfferData.title,
                category: jobOfferData.categorieId,
                companyLogo: companyData.logoUrl,
              },
            }));
          }
        });
      } catch (error) {
        console.error('Error fetching candidacies or job offers:', error);
      }
    };
  
    fetchCandidacies();
  }, []);
  

  const acceptCandidacy = async (candidacyId) => {
    try {
      const candidacy = candidacies.find(c => c.id === candidacyId);
      if (candidacy) {
        const updatedCandidacy = { ...candidacy, statusId: 5 }; // Create a new object
        await axios.put('http://localhost:5259/api/JobOfferCandidancy/update', updatedCandidacy); // Pass the updated candidacy to the API
  
        // Update the local state
        setCandidacies(candidacies.map(c => (c.id === candidacyId ? updatedCandidacy : c)));
      }
    } catch (error) {
      console.error('Error accepting candidacy:', error);
    }
  };
  

 
  const refuseCandidacy = async (candidacyId) => {
    try {
      const candidacy = candidacies.find(c => c.id === candidacyId);
      if (candidacy) {
        const updatedCandidacy = { ...candidacy, statusId: 6 }; // Create a new object
        await axios.put('http://localhost:5259/api/JobOfferCandidancy/update', updatedCandidacy); // Pass the updated candidacy to the API
  
        // Update the local state
        setCandidacies(candidacies.map(c => (c.id === candidacyId ? updatedCandidacy : c)));
      }
    } catch (error) {
      console.error('Error accepting candidacy:', error);
    }
  };

  const UnderReviwCandidacy = async (candidacyId) => {
    try {
      const candidacy = candidacies.find(c => c.id === candidacyId);
      if (candidacy) {
        const updatedCandidacy = { ...candidacy, statusId: 2 }; // Create a new object
        await axios.put('http://localhost:5259/api/JobOfferCandidancy/update', updatedCandidacy); // Pass the updated candidacy to the API
  
        // Update the local state
        setCandidacies(candidacies.map(c => (c.id === candidacyId ? updatedCandidacy : c)));
      }
    } catch (error) {
      console.error('Error accepting candidacy:', error);
    }
  };
  const deleteCandidacy = async (candidacyId) => {
    try {
      const response = await axios.delete(`http://localhost:5259/api/JobOfferCandidancy/${candidacyId}`);
      console.log('Candidacy deleted successfully:', response.data);
  
      // Optionally, you can update your local state after deletion to reflect the changes
      setCandidacies(candidacies.filter(c => c.id !== candidacyId));
  
    } catch (error) {
      console.error('Error deleting candidacy:', error);
    }
  };
  


  return (
    <section className="inner-employer-section">
      <div className="tf-container">
  <div className="job-search-form st1 employers-form">
    <form>
      <div className="row-group-search inner-form">
      <div className="form-group-1" style={{ width: '350px' }}>
      <input
            type="text"
            className="input-filter-search"
            placeholder="key words"
            onChange={handleKeywordChange}
            
          />
          <span className="icon-search search-job"></span>
        </div>
        
        <div className="form-group-1" style={{ width: '350px' }}>
        <Dropdown
            options={options1}
            className="react-dropdown select-location"
            value={options1[0]}
          />
        </div>
        <div className="form-group-1" style={{ width: '350px' }}>
        <Dropdown
            options={options2}
            className="react-dropdown select-location"
            value={options2[0]}
          />
        </div>
        <div className="form-group-1" style={{ width: '300px  ' }}>
        <Dropdown
            options={options3}
            className="react-dropdown select-location"
            value={options3[0]}
          />
        </div>
       
      </div>
    </form>
  </div>

  {/* Adding space below the form */}
  <br />
  <br />
</div>

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
                    <span>{candidacies.length}</span> candidancy  
                  </p>
                </div>
                <SortBuy />
              </div>
            </div>
            <MDBTable align="middle" borderless>
  <MDBTableHead>
    <tr className="border-bottom">
     <th scope="col">Title</th>
     <th scope="col">Name</th>
     <th scope="col">Status</th>
      <th scope="col">Attachment</th>
      <th scope="col">score</th>
      <th scope="col">Date</th>
      <th scope="col">Actions</th>
    </tr>
  </MDBTableHead>
  <MDBTableBody>
    {filteredCandidacies.map((candidacy) => {
      const jobOffer = jobOffers[candidacy.jobOfferId] || { title: 'Loading...', categoryId: 'Loading...', companyLogo: null  };
      
      return (
        <tr key={candidacy.id} className="border-bottom">
        <td style={{ verticalAlign: "middle" }}>
          <div className="d-flex align-items-center" style={{ gap: "8px" }}>
            <img
              src={jobOffer.companyLogo}
              alt=""
              style={{ width: '30px', height: '30px', objectFit: "contain" }}
              className="rounded-circle me-2"
            />
            <div>
              <Link to={`/jobdetails/${jobOffer.id}`} className="text-decoration-none text-dark">
                <p className="fw-normal mb-1" style={{ whiteSpace: "nowrap" }}>
                  {jobOffer.title || 'N/A'}
                </p>
              </Link>
              <p className="text-muted mb-0" style={{ fontSize: '0.85rem', whiteSpace: "nowrap" }}>
                {jobOffer.category === 1 && 'Information Technology'}
                {jobOffer.category === 2 && 'Software Development'}
                {jobOffer.category === 3 && 'Human Resources'}
                {jobOffer.category === 4 && 'Finance'}
                {jobOffer.category === 5 && 'Design & Multimedia'}
                {jobOffer.category === 6 && 'Telecommunications'}
                {jobOffer.category === 7 && 'Engineering'}
                {jobOffer.category === 8 && 'Construction & Facilities'}
                {![1, 2, 3, 4, 5, 6, 7, 8].includes(jobOffer.category) && 'Unknown Category'}
              </p>
            </div>
          </div>
        </td>
      
        <td style={{ verticalAlign: "middle" }}>
          <Link to={`/candidatedetails2/${candidacy.id}`}>
            <p className="fw-bold mb-0">{candidacy.firstName} {candidacy.lastName}</p>
            <p className="text-muted mb-1">{candidacy.email}</p>
          </Link>
        </td>
      
        <td style={{ verticalAlign: "middle" }}>
          <MDBBadge color={getStatusColor(candidacy.statusId)} pill>
            {candidacy.statusId === 1 ? 'Pending' :
             candidacy.statusId === 2 ? 'Under Review' :
             candidacy.statusId === 3 ? 'Interview Scheduled' :
             candidacy.statusId === 4 ? 'Interview Completed' :
             candidacy.statusId === 5 ? 'Accepted' : 'Rejected'}
          </MDBBadge>
        </td>
      
        <td style={{ verticalAlign: "middle" }}>
          <i className="uil uil-import" style={{ marginRight: '1px', color: 'grey', fontSize: '16px' }}></i> 
          <ReactDownloadLink
            filename="CV.pdf"
            label="Attachment"
            exportFile={() => fetch(candidacy.cvUrl).then(res => res.blob())}
            style={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'normal',
              fontSize: '16px',
              color: 'grey',
              textAlign: 'center',
              margin: '20px 0',
            }}
          >
            <i className="uil uil-import" style={{ marginRight: '1px', color: 'black', fontSize: '16px' }}></i>
          </ReactDownloadLink>
        </td>
      
        <td style={{ verticalAlign: "middle" }}>
          {candidacy.score && JSON.parse(candidacy.score).parts[0].text.trim() || 0}%
        </td>
      
        <td style={{ verticalAlign: "middle" }}>
          <p className="fw-normal mb-1">{moment(candidacy.submissionDate).fromNow()}</p>
        </td>
      
        <td style={{ verticalAlign: "middle", display: 'flex', alignItems: 'center' }}>
  <MDBBadge 
    color="success" 
    style={{ marginRight: '10px', cursor: 'pointer' }} 
    pill
    onClick={() => acceptCandidacy(candidacy.id)}
  >
    Accept
  </MDBBadge>

  <MDBBadge 
    color="danger" 
    style={{ marginRight: '10px', cursor: 'pointer' }} 
    pill
    onClick={() => refuseCandidacy(candidacy.id)}
  >
    Refuse
  </MDBBadge>

  <MDBBadge 
    color="primary" 
    style={{ marginRight: '10px', cursor: 'pointer' }} 
    pill
    onClick={() => UnderReviwCandidacy(candidacy.id)}
  >
    Under Review
  </MDBBadge>

  <div 
    onClick={() => {deleteCandidacy(candidacy.id) /* Add your delete functionality here */ }} 
    style={{
      width: '30px', 
      height: '30px', 
      cursor: 'pointer', 
      zIndex: 9999,
      marginLeft: '10px'  // Add some space between the last badge and the icon
    }}
  >
    <DeleteIcon style={{ color: '#9e9e9e' }} />
  </div>
</td>

      </tr>
      
      );
    })}
  </MDBTableBody>
</MDBTable>




    
          </Tabs>
        </div>
        
      </div>

      
    </section>
  );
}

export default EmpSec5;
