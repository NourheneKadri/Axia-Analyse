import React, { useState } from "react";
import { Link } from "react-router-dom";
import img from "../../assets/images/review/google.png";
import img2 from "../../assets/images/review/tweet.png";
import Authentification from "../../Services/AuthentificationService";
import { useNavigate } from "react-router-dom";

import Cookies from "js-cookie";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const user = Authentification.getStoredUser()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("❌ Veuillez remplir tous les champs !");
      return;
    }

    try {
      const user = await Authentification.login(email, password);

      if (user && user.appRoleId !== undefined) {
        console.log("user", user);

        const redirectPath = localStorage.getItem("redirectAfterLogin");

        if (redirectPath) {
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath); // ✅ Redirection interne
          return;
        }

        // Redirection par rôle
        if (user.appRoleId === 1) {
          navigate("http://localhost:3039/");
                } else {
          navigate("/"); // Exemple : page candidat
        }
      } else {
        setMessage("❌ Impossible de récupérer les informations du rôle. Vérifie les données de connexion.");
      }
    } catch (error) {
      setMessage("❌ Email ou mot de passe incorrect !");
      console.error("Erreur de connexion:", error);
    }
  };

  

  return (
    <section className="account-section">
      <div className="tf-container">
        <div className="row">
          <div className="wd-form-login">
            <h4>Connexion</h4>
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
              <div className="ip">
                <label>Mot de passe<span>*</span></label>
                <div className="inputs-group auth-pass-inputgroup">
                  <input
                    type={showPass ? "text" : "password"}
                    className="input-form password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    required
                  />
                  <span
                    className={`password-addon ${showPass ? "icon-eye" : "icon-eye-off"}`}
                    onClick={() => setShowPass(!showPass)}
                  />
                </div>
              </div>
              <div className="group-ant-choice">
                <div className="sub-ip">
                  <input type="checkbox" /> Se souvenir de moi
                </div>
                <Link to="/ForgetPassword" className="forgot">
                  Mot de passe oublié ?
                </Link>
              </div>
              <button type="submit">Se connecter</button>
              <div className="sign-up">
                Pas encore inscrit ? <Link to="/createaccount">Créer un compte</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;