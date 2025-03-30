import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const API_URL_Login = "http://localhost:5259/api/Authentication/login";
const API_URL_register = "http://localhost:5259/api/Authentication/register";
const API_URL = "http://localhost:5259/api/Authentication/reset-password"; // L'URL de l'API

const COOKIE_NAME = "authToken";

axios.defaults.headers.common["Content-Type"] = "application/json";

// Décoder le token JWT et vérifier s'il est expiré
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token); 
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime; // Le token est expiré si exp < currentTime
  } catch (error) {
    return true;
  }
};

class Authentification {
  static async register(userData) {
    try {
      const response = await axios.post(API_URL_register, userData);
      return response;
    } catch (error) {
      console.error("Registration error", error);
      throw error;
    }
  }

  static async login(email, password) {
    try {
      const response = await axios.post(API_URL_Login, { email, password });
       console.log(response.data)
      // Stocker toute la réponse sous forme de JSON dans le cookie
      Cookies.set(COOKIE_NAME, JSON.stringify(response.data), {
        expires: 5, // Expire après 5 minutes
        secure: true, 
        sameSite: "Strict"
      });
  
      return response.data;
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }
  }
  static getStoredUser () {
    const storedUser = Cookies.get(COOKIE_NAME);
    return storedUser ? JSON.parse(storedUser) : null;
  };

  static isLoggedIn() {
    const token = Cookies.get(COOKIE_NAME);
    return !!token && !isTokenExpired(token); // Vérifie si le token est présent et valide
  }

  static logout() {
    Cookies.remove(COOKIE_NAME); // Supprime le token du cookie
    localStorage.removeItem(COOKIE_NAME); // Supprime aussi du localStorage (si utilisé)

    // Redirige vers la page de login après la déconnexion
    window.location.replace("/login"); // Utiliser replace pour éviter de revenir en arrière
  }

  // Obtenir le token actuel depuis le cookie
  static getToken() {
    return Cookies.get(COOKIE_NAME);
  }

  // Attacher le token aux en-têtes pour les requêtes authentifiées
  static attachTokenToHeaders() {
    const token = Cookies.get(COOKIE_NAME);
    if (token && !isTokenExpired(token)) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      // Si le token est expiré, déconnecter l'utilisateur
      this.logout();
    }
  }
  static async requestPasswordReset(email) {
    try {
      const response = await axios.post(API_URL, { email }); // Pas besoin de token ici
      return response.data; // Réponse de l'API (message de succès, etc.)
    } catch (error) {
      console.error("Erreur lors de la demande de réinitialisation du mot de passe:", error.response || error.message);
      throw new Error("Erreur lors de la demande de réinitialisation du mot de passe.");
    }
  }
  
  

  // Ajouter un interceptor pour gérer l'expiration du token à chaque requête
  static addTokenExpirationInterceptor() {
    axios.interceptors.response.use(
      (response) => response, // Si la réponse est réussie, on la retourne
      (error) => {
        if (error.response && error.response.status === 401) {
          // Token expiré ou invalide
          this.logout(); // Déconnecter l'utilisateur si le token est expiré
        }
        return Promise.reject(error); // Propager l'erreur
      }
    );
  }

  // Optionnel: Vérification périodique du token pour déconnexion automatique
  static startTokenExpirationCheck() {
    const token = Cookies.get(COOKIE_NAME);
    if (token && !isTokenExpired(token)) {
      const decoded = jwtDecode(token);
      const timeUntilExpiration = decoded.exp * 1000 - Date.now();

      // Déconnexion automatique juste avant l'expiration (par exemple 5 secondes avant)
      setTimeout(() => this.logout(), timeUntilExpiration - 5000);
    }
  }
}

export default Authentification;
