import React, { useState } from "react";
import Dropdown from "react-dropdown";
import { Button, Modal, ModalBody, Form, Label, Input, Row, Col } from "reactstrap";
import moment from "moment";
import axios from "axios"; // Importation d'axios pour faire la requête API
import Authentification from "../../Services/AuthentificationService";
import JobOfferServices from "../../Services/JobOfferService";

const options = [
  { value: "12", label: "12 Per Page" },
  { value: "1", label: "1 Per Page" },
  { value: "10", label: "10 Per Page" },
];

const sortOptions = [
  { value: "default", label: "Sort by (Default)" },
  { value: "new", label: "New" },
  { value: "last", label: "Last" },
];

// Récupérer l'utilisateur stocké
const user = Authentification.getStoredUser();


function SortBuy(props) {
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const [sortBy, setSortBy] = useState("default"); // Default sorting
  const { currentJobs = [] } = props;


  const [jobOffer, setJobOffer] = useState({
    title: "",
    categorieId: "",
    jobTypeId: "",
    adress: "",
    experienceLevel: "",
    responsibilities: "",
    postNumber: "",
    requirements: "",
    salaryRange: "",
    skillsRequired: "",
    deadlineTimestamp: "",
    userAccountId: user ? user.userAccountId : "", // S'assurer que l'ID est récupéré de l'utilisateur stocké
    description: "",
    status: "open"
  });

  const categories = [
    { id: 1, name: "Information Technology" },
    { id: 2, name: "Software Development" },
    { id: 3, name: "Human Resources" },
    { id: 4, name: "Finance" },
    { id: 5, name: "Design & Multimedia" },
    { id: 6, name: "Telecommunications" },
    { id: 7, name: "Engineering" },
    { id: 8, name: "Construction & Facilities" },
  ];

  const jobTypes = [
    { id: 1, name: "Full Time" },
    { id: 2, name: "Part Time" },
    { id: 3, name: "Freelance" },
    { id: 4, name: "CDD" },
    { id: 5, name: "CDI" },
  ];

  const handleSortChange = (selectedOption) => {
    setSortBy(selectedOption.value);
  };
  
  
  
  const sortedJobs = [...currentJobs].sort((a, b) => {
    if (sortBy === "new") {
      return new Date(b.timestamp) - new Date(a.timestamp); // Newest first
    }
    if (sortBy === "last") {
      return new Date(a.timestamp) - new Date(b.timestamp); // Oldest first
    }
    return 0; // Default order
  });
  
  // Gérer le changement des champs du formulaire
  const handleInputChange = (e) => {
    setJobOffer({ ...jobOffer, [e.target.name]: e.target.value });
  };

  // Gérer la date de soumission
  const handleDateChange = (e) => {
    setJobOffer({ ...jobOffer, deadlineTimestamp: e.target.value });
  };

  // Soumettre le formulaire à l'API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // URL de l'API (à ajuster selon ton backend)
     // const API_URL = "http://localhost:5259/api/JobOffer/Add"; // Remplace par l'URL de ton API

      // Envoi de la requête POST avec les données du formulaire
      const response = await JobOfferServices.createJobOffer(jobOffer)

      // Si la requête est réussie, afficher un message de succès
      toggleModal();
    } catch (error) {
      console.error("Erreur lors de la soumission de l'offre d'emploi:", error);
    }
  };

  return (
   
      <>
    


      </>
  );
}
export default SortBuy; 