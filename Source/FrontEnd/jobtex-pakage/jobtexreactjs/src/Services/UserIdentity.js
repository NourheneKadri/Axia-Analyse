class userIdentity {
    /*getCurrentUser()  {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("Retrieved user from local storage:", user);
      return user;
    }*/
  
    getUserAccountId(){
      const user = JSON.parse(localStorage.getItem("user"));
     const UserAccountId = user.UserAccountId;
    return UserAccountId;
    }
  }
    export default new userIdentity();