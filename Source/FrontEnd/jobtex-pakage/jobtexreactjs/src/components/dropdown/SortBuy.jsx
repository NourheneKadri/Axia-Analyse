import React, { useState } from "react";
import Dropdown from "react-dropdown";
import { Button, Modal, ModalBody, Form, Label, Input, Row, Col } from "reactstrap";
import moment from "moment";
import axios from "axios"; // Importation d'axios pour faire la requête API
import Authentification from "../../Services/AuthentificationService";

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
  console.log('jobs', currentJobs)


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
      const API_URL = "http://localhost:5259/api/JobOffer/Add"; // Remplace par l'URL de ton API

      // Envoi de la requête POST avec les données du formulaire
      const response = await axios.post(API_URL, jobOffer);

      // Si la requête est réussie, afficher un message de succès
      alert("Offre d'emploi ajoutée avec succès !");
      toggleModal();
    } catch (error) {
      console.error("Erreur lors de la soumission de l'offre d'emploi:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
   
      <>
      <Button 
        className="btn-sort-buy" 
        onClick={toggleModal} 
        style={{ display: user && user.appRoleId === 2 ? 'block' : 'none' }}
      >
        Add
      </Button>


      <Modal isOpen={modal} toggle={toggleModal} centered style={{ maxWidth: "50%", width: "50%" }}>
        <ModalBody className="modal-body p-5">
          <div className="text-center mb-4">
            <h5 className="modal-title">Créer une nouvelle offre d'emploi</h5>
          </div>

          <div className="position-absolute end-0 top-0 p-3">
            <button type="button" onClick={toggleModal} className="btn-close" aria-label="Close"></button>
          </div>

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Label>Titre de poste</Label>
                <Input type="text" name="title" value={jobOffer.title} onChange={handleInputChange} placeholder="Titre du poste" required />
              </Col>
              <Col md={6}>
                <Label>Numéro de poste</Label>
                <Input type="number" name="postNumber" value={jobOffer.postNumber} onChange={handleInputChange} placeholder="Numéro de poste" />
              </Col>

            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Label>Catégorie</Label>
                <Input type="select" name="categorieId" value={jobOffer.categorieId} onChange={handleInputChange} required>
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </Input>
              </Col>
              <Col md={6}>
                <Label>Type d'offre</Label>
                <Input type="select" name="jobTypeId" value={jobOffer.jobTypeId} onChange={handleInputChange} required>
                  <option value="">Sélectionner un type</option>
                  {jobTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </Input>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Label>Adresse</Label>
                <Input type="text" name="adress" value={jobOffer.adress} onChange={handleInputChange} placeholder="Adresse" required />
              </Col>
              <Col md={6}>
                <Label>Expérience</Label>
                <Input type="select" name="experienceLevel" value={jobOffer.experienceLevel} onChange={handleInputChange} required>
                  <option value="">Sélectionner le niveau d'expérience</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Directeur</option>
                  <option value="VP">Vice-Président</option>
                  <option value="C-Level">Cadre supérieur</option>
                </Input>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Label>Plage salariale</Label>
                <Input type="text" name="salaryRange" value={jobOffer.salaryRange} onChange={handleInputChange} placeholder="Salaire" />
              </Col>
              <Col md={6}>
                <Label>Date Limite</Label>
                <Input type="date" name="deadlineTimestamp" value={jobOffer.deadlineTimestamp ? moment(jobOffer.deadlineTimestamp).format("YYYY-MM-DD") : ""} onChange={handleDateChange} required />
              </Col>
            </Row>

            <Row className="mb-3">
            <Col md={12}>
  <Label>Exigences</Label>
  <Input 
    type="text" 
    name="requirements" 
    value={jobOffer.requirements} 
    onChange={handleInputChange} 
    placeholder="Exigences spécifiques" 
  />
</Col>
              <Col md={12}>
                <Label>Compétences requises</Label>
                <textarea 
                  className="form-control" 
                  name="skillsRequired" 
                  value={jobOffer.skillsRequired} 
                  onChange={handleInputChange} 
                  placeholder="Ex: React, Node.js, SQL, Agile" 
                  rows="3" 
                  required
                ></textarea>
              </Col>
            </Row>

            <div className="mb-3">
              <Label>Description</Label>
              <textarea className="form-control" name="description" value={jobOffer.description} onChange={handleInputChange} placeholder="Description du poste" rows="4" required></textarea>
            </div>

            <Button type="submit" className="btn btn-primary w-100">
              Ajouter
            </Button>
          </Form>
        </ModalBody>
      </Modal>
      </>
  );
}

export default SortBuy;
