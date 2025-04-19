import axios from 'axios';
import moment from 'moment'; 
import authHeader from './Auth.Header';


const JOBOFFER_API_BASE_URL = "http://localhost:5259/api/JobOffer";


class JobOfferServices {

    getJobOffers(){
        axios.get(JOBOFFER_API_BASE_URL, { headers: authHeader() })
        .then(response => {
          console.log(response.data); // Vérifie la réponse
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des offres d\'emploi:', error);
        });
            }

    static async getJobOfferById(jobOfferId){
        return axios.get(JOBOFFER_API_BASE_URL + '/' + jobOfferId);
    }


    static async createJobOffer(jobOffer) {
        jobOffer.typeId = parseInt(jobOffer.typeId, 10);
        jobOffer.postNumber = parseInt(jobOffer.postNumber, 10);
        jobOffer.deadlineTimestamp = moment(jobOffer.deadlineTimestamp).toDate();
    
        return axios.post(JOBOFFER_API_BASE_URL + '/Add' ,jobOffer,{ headers: authHeader() });
      }
      static async getJobOffers() {
        return axios.get(JOBOFFER_API_BASE_URL,{ headers: authHeader() });
      }

      static async deleteJobOffer(jobOfferId){
        return axios.get(JOBOFFER_API_BASE_URL + '/delete/'+ jobOfferId,{ headers: authHeader() });
    }

    static async updateJobOffer(jobOffer){

        jobOffer.typeId = parseInt(jobOffer.typeId)
        jobOffer.postNumber = parseInt(jobOffer.postNumber)
        jobOffer.deadlineTimestamp= moment(jobOffer.deadlineTimestamp).toDate();
        return axios.post(JOBOFFER_API_BASE_URL + '/Update' ,jobOffer,{ headers: authHeader() });
    }

    static async getJobOfferById(jobOfferId){
        return axios.get(JOBOFFER_API_BASE_URL + '/' + jobOfferId, { headers: authHeader() });
    }

    static async searchJobOffers({ title, adress, categoryId }) {
       console.log( "params",title, adress, categoryId );
        const queryParams = new URLSearchParams();
        if (title) queryParams.append('title', title);
        if (adress) queryParams.append('address', adress);
        if (categoryId) queryParams.append('categoryId', categoryId);
    
        
        try {
            const response = await axios.get(`${JOBOFFER_API_BASE_URL}/search?${queryParams}`, { headers: authHeader() });
            return response.data; 
        } catch (error) {
            console.error('Error fetching job offers:', error);
            throw error; 
        }
    }
    
}
export default JobOfferServices;
