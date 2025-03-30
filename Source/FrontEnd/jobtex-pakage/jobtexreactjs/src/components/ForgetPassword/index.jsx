import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Authentification from "../../Services/AuthentificationService";
import img from "../../assets/images/home.png";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("❌ Veuillez remplir le champ email !");
      return;
    }

    try {
      // Appel du service pour envoyer une demande de réinitialisation de mot de passe
      await Authentification.requestPasswordReset(email); // Appel réel à l'API
      
     
      navigate("/login")// Redirige vers la page de login après 3 secondes

      setMessage("✅ Un email de réinitialisation a été envoyé !");
    } catch (error) {
      setMessage("❌ Une erreur est survenue, veuillez réessayer.");
      console.error("Erreur de réinitialisation:", error);
    }
  };

  const sectionStyle = {
    backgroundImage: `url(${img})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const formStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: "30px",
    borderRadius: "10px",
    width: "700px",
  };

  return (
    <section style={sectionStyle}>
      <div className="tf-container">
        <div className="row">
          <div className="wd-form-login" style={formStyle}>
            <h4>Mot de passe oublié</h4>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
              <div className="ip">
                <label>Email<span>*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  required
                />
              </div>
              <button type="submit">Envoyer</button>
              <div className="sign-up">
                Vous vous souvenez de votre mot de passe ? <Link to="/login">Se connecter</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgetPassword;
