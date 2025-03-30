import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:5259/api/Companies"; // Base URL for the Company API
const COOKIE_NAME = "authToken";

// Axios defaults for the Company service
axios.defaults.headers.common["Content-Type"] = "application/json";

// Utility function to attach token to headers
const attachTokenToHeaders = () => {
  const token = Cookies.get(COOKIE_NAME);
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

class CompanyService {
  // Create a new company
  static async createCompany(companyData) {
    try {
      const response = await axios.post(API_URL, companyData, {
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${yourAuthToken}`,  // Ajoutez ceci si l'API est protégée
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating company:", error.response?.data || error.message);
      throw error;
    }
  }
  // Fetch all companies
  static async fetchCompanies() {
    try {
      attachTokenToHeaders(); // Attach token for authenticated requests
      const response = await axios.get(`${API_URL}/all`);
      return response.data; // List of companies
    } catch (error) {
      console.error("Error fetching companies", error);
      throw error;
    }
  }

  // Check if a company exists by its SIRET
  static async existsBySiret(siret) {
    try {
      attachTokenToHeaders(); // Attach token for authenticated requests
      const response = await axios.get(`${API_URL}/exists/${siret}`);
      return response.data.exists; // Boolean response indicating if the company exists
    } catch (error) {
      console.error("Error checking company existence by SIRET", error);
      throw error;
    }
  }

  // Fetch a single company by ID
  static async fetchCompanyById(companyId) {
    try {
      attachTokenToHeaders(); // Attach token for authenticated requests
      const response = await axios.get(`${API_URL}/${companyId}`);
      return response.data; // The company details
    } catch (error) {
      console.error("Error fetching company", error);
      throw error;
    }
  }
}

export default CompanyService;
