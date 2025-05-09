// useDynamicMarkers.js
import { useState, useEffect } from "react";
import JobOfferServices from "../../Services/JobOfferService";
import axios from "axios";

// Fonction pour obtenir les coordonnées à partir de l'adresse
const getCoordinatesFromAddress = async (address) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`,
    {
      headers: {
        "User-Agent": "Axia-Job-App", // identifiant personnalisé
      },
    }
  );
  const data = await response.json();
  if (data.length > 0) {
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  }
  return null;
};

// Fonction pour transformer les offres d'emploi en marqueurs
const transformOffersToMarkers = async (offers) => {
  const markers = await Promise.all(
    offers.map(async (offer) => {
      const coords = await getCoordinatesFromAddress(offer.adress);
      let companyLogo = "/images/marker-icon.png";
      try {
        const companyResponse = await axios.get(`http://localhost:5259/api/Authentication/company/${offer.userAccountId}`);
        companyLogo = companyResponse?.data?.logoUrl;
      } catch (error) {
        console.warn("Erreur lors de la récupération du logo pour l'utilisateur", offer.userAccountId);
      }
      if (coords) {
        return {
          id: offer.id,
          latitude: coords.latitude,
          longitude: coords.longitude,
          title: offer.title,
          name: offer.experienceLevel,
          address: offer.adress,
          img: companyLogo, // change cette image si besoin
        };
      }
      return null;
    })
  );

  return markers.filter((marker) => marker !== null);
};

// Hook pour récupérer dynamiquement les offres via API
function useDynamicMarkers() {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      // Remplace l'URL par celle de ton API
      const response = await JobOfferServices.getJobOffers();
      const data =  response.data;
      
      // Transforme les offres en marqueurs
      const dynamicMarkers = await transformOffersToMarkers(data);
      setMarkers(dynamicMarkers);
      setLoading(false);
    };

    fetchOffers();
  }, []);

  return { markers, loading };
}

export default useDynamicMarkers;
