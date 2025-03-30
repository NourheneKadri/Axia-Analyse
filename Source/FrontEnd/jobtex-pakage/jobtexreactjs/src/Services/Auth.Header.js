import Cookies from 'js-cookie';  // Assurez-vous que js-cookie est importé

export default function authHeader() {
  const authToken = Cookies.get('authToken');  // Récupère le cookie authToken

  if (authToken) {
    try {
      const parsedToken = JSON.parse(authToken);  // Parse le JSON pour obtenir les informations
      const token = parsedToken.token;            // Extraire le token
      const userAccountId = parsedToken.userAccountId; // Extraire le userAccountId

      console.log('Token:', token);
      console.log('User Account ID:', userAccountId);

      return { Authorization: 'Bearer ' + token };  // Retourne l'en-tête avec le token
    } catch (error) {
      console.error('Erreur de parsing JSON:', error);
      return {};  // Retourne un objet vide en cas d'erreur
    }
  } else {
    return {};  // Retourne un objet vide si le cookie est absent
  }
}
