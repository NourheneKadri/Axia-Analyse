import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Authentification from "../../Services/AuthentificationService";
import CompanyService from "../../Services/CompanyService";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Input } from "reactstrap";
import axios from 'axios';





function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState("candidate");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [message, setMessage] = useState("");
  const [companyId, setCompanyId] = useState("");  // For recruiter
  const [companies, setCompanies] = useState([]);  // List of companies
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [siret, setSiret] = useState(""); // Assurez-vous que setSiret est bien initialisé
  const [phone, setPhone] = useState('');
  const [adress, setadress] = useState('');
  const [emailCompany, setEmailCompany] = useState('');
  const [logo, setLogo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);





  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("http://localhost:5259/api/Companies");
        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.statusText}`);
        }
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {

    const response = await fetch("http://localhost:5259/api/Companies");
    // 
    const data = await response.json();
    setCompanies(data);
  }




  // Fonction pour gérer l'upload du logo






  const handleCreateCompany = async () => {

    // Création de l'objet contenant les données de l'entreprise
    const newCompany = {
      name,
      email: emailCompany,  // Utilisation correcte de l'email de l'entreprise
      siret,
      phone,
      logo,
      adress
    };

    const formData = new FormData();

    // Ajouter les données de l'entreprise à FormData
    formData.append('name', name);
    formData.append('email', emailCompany);
    formData.append('siret', siret);
    formData.append('phone', phone);
    formData.append('adress', adress);


    // Ajouter le fichier logo s'il existe
    if (logo) {
      formData.append('logo', logo); // 'logo' est le nom du champ attendu par le backend
    }


    try {
      // Envoyer les données au backend
      const response = await axios.post('http://localhost:5259/api/Companies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important pour les fichiers
        },
      });

      fetchCompanies()

      setShowModal(false); // Fermer le modal après soumission
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      alert("Erreur lors de la création de l'entreprise.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Empêcher un double clic rapide
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Vérifier si les mots de passe correspondent
    if (password !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas !");
      setIsSubmitting(false); // Réactiver le bouton
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      companyId: companyId || null,
      appRoleId: role === "candidate" ? 3 : 2,
    };

    try {
      await Authentification.register(userData);
      setMessage("✅ Inscription réussie ! Redirection vers la connexion...");

      // Redirection après un délai
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage("❌ Erreur lors de l'inscription !");
      console.error("Erreur:", error);
    } finally {
      setIsSubmitting(false); // Réactiver le bouton après la réponse
    }
  };


  return (
    <section className="account-section">
      <div className="tf-container">
        <div className="row">
          <Tabs className="wd-form-login tf-tab">
            <h4>Créer un compte</h4>
            <TabList className="menu-tab">
              <Tab className="ct-tab" onClick={() => setRole("candidate")}>Candidat</Tab>
              <Tab className="ct-tab" onClick={() => setRole("recruteur")}>Recruteur</Tab>
            </TabList>
            <div className="content-tab">
              <TabPanel className="inner animation-tab">
                {role === "candidate" && (
                  <SignUpForm
                    firstName={firstName}
                    lastName={lastName}
                    email={email}
                    password={password}
                    confirmPassword={confirmPassword}
                    showPass={showPass}
                    showPass2={showPass2}
                    setFirstName={setFirstName}
                    setLastName={setLastName}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    setConfirmPassword={setConfirmPassword}
                    setShowPass={setShowPass}
                    setShowPass2={setShowPass2}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                    message={message}
                  />
                )}
              </TabPanel>
              <TabPanel className="inner animation-tab">
                {role === "recruteur" && (
                  <SignUpForm
                    firstName={firstName}
                    lastName={lastName}
                    email={email}
                    password={password}
                    confirmPassword={confirmPassword}
                    showPass={showPass}
                    showPass2={showPass2}
                    setFirstName={setFirstName}
                    setLastName={setLastName}
                    setEmail={setEmail}
                    setCompanyId={setCompanyId}
                    companyId={companyId}
                    companies={companies}  // Pass companies as a prop
                    setPassword={setPassword}
                    setConfirmPassword={setConfirmPassword}
                    setShowPass={setShowPass}
                    setShowPass2={setShowPass2}
                    handleSubmit={handleSubmit}
                    name={name}
                    setName={setName}
                    siret={siret}
                    setSiret={setSiret}
                    emailCompany={emailCompany}
                    setEmailCompany={setEmailCompany}
                    phone={phone}
                    setPhone={setPhone}
                    logo={logo}
                    setLogo={setLogo}
                    adress={adress}
                    setadress={setadress}
                    message={message}
                    isRecruiter={true}
                    role={role}
                    setShowModal={setShowModal}
                    //newCompany={newCompany}
                    //setNewCompany={setNewCompany}
                    handleCreateCompany={handleCreateCompany}
                    showModal={showModal}
                    isSubmitting={isSubmitting}

                  />
                )}
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

function SignUpForm({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  companyId,
  setCompanyId,
  companies,
  setCompanies,
  newCompany,
  setNewCompany,
  showPass,
  showPass2,
  setFirstName,
  setLastName,
  setEmail,
  setPassword,
  setConfirmPassword,
  setShowPass,
  setShowPass2,
  setShowModal,
  showModal,
  handleInputChange,
  handleCreateCompany,
  handleSubmit,
  message,
  name,
  setName,
  emailCompany,
  setEmailCompany,
  siret, setSiret,
  adress, setadress,
  handleLogoUpload,
  phone, setPhone, logo, setLogo,
  isRecruiter = false,
  isSubmitting,
  setIsSubmitting
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="ip">
        <label>Prénom<span>*</span></label>
        <input type="text" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      </div>

      <div className="ip">
        <label>Nom<span>*</span></label>
        <input type="text" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      </div>

      <div className="ip">
        <label>Email<span>*</span></label>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="ip">
        <label>Mot de passe<span>*</span></label>
        <div className="inputs-group">
          <input type={showPass ? "text" : "password"} placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Link className={`password-addon ${showPass ? "icon-eye" : "icon-eye-off"}`} onClick={() => setShowPass(!showPass)} />
        </div>
      </div>

      <div className="ip">
        <label>Confirmer le mot de passe<span>*</span></label>
        <div className="inputs-group">
          <input type={showPass2 ? "text" : "password"} placeholder="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <Link className={`password-addon ${showPass2 ? "icon-eye" : "icon-eye-off"}`} onClick={() => setShowPass2(!showPass2)} />
        </div>
      </div>

      {isRecruiter && (
        <div className="ip">
          <label>Entreprise<span>*</span></label>
          <div className="inputs-group">
            <select
              value={companyId}
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue === "new") {
                  setShowModal(true);
                  setCompanyId(""); // Réinitialiser la sélection
                } else {
                  setCompanyId(parseInt(selectedValue, 10)); // Convertir en entier
                }
              }}
              required
            >
              <option value="">Sélectionner une entreprise</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
              <option value="new" onClick={() => setShowModal(true)}>Créer une nouvelle entreprise</option>
            </select>
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered >
        <Modal.Header closeButton>
          <Modal.Title>Créer une nouvelle entreprise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault(); handleCreateCompany(); }}>
            <input
              type="text"
              placeholder="Nom de l'entreprise"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="SIRET"
              value={siret}
              onChange={(e) => setSiret(e.target.value)}
              style={{ padding: "-10px" }}
            />
            <input
              type="text"
              placeholder="Téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="text"
              placeholder="adress"
              value={adress}
              onChange={(e) => setadress(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={emailCompany}
              onChange={(e) => setEmailCompany(e.target.value)}
            />
            <input
              type="file"
              accept="image/*" // Limiter aux fichiers image
              onChange={(e) => setLogo(e.target.files[0])} // Récupérer le fichier sélectionné
            />


          </form>
        </Modal.Body>
        <Modal.Footer> <Button type="submit" onClick={handleCreateCompany}>Créer l'entreprise</Button></Modal.Footer>
      </Modal>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "En cours..." : "S'inscrire"}
      </button>
      {message && <div className="message">{message}</div>}
    </form>
  );
}

export default SignUp;
