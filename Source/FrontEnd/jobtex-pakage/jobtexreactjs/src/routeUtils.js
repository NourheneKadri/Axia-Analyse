import Authentification from './Services/AuthentificationService';

const getAuthorizedRoutes = (routes) => {
  const currentUser = Authentification.getStoredUser();
  console.log("Current User:", currentUser); // Log the current user object

  if (!currentUser) {
    console.warn("No user logged in, returning all routes.");
    return routes; // If there's no user, return all routes (or you can modify this behavior as needed)
  }

  return routes.filter(route => {
    // Check if the route requires authorization and if the user's role is in the allowed roles
    const isAuthorized = !route.authorize || (Array.isArray(route.authorize) && route.authorize.includes(currentUser?.appRoleId));

    if (!isAuthorized) {
        
      console.warn(`Access denied for route: ${route.path}, role: ${currentUser?.appRoleId}`);
      
    }

    return isAuthorized;
  });
};

export { getAuthorizedRoutes };
