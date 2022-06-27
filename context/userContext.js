import { createContext, useContext, useState, useEffect } from "react";
import { getAuth } from "firebase/auth";


const UserContext = createContext({
  user: {},
  getUser: () => {}
});

const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});

    const getUser = async () => {
        // obtener el usuario
        console.log('------------------------------------')
        const auth = getAuth();
        const cuser = auth.currentUser;
     
        setUser({...cuser});
    }

    useEffect(() => {
        getUser();
      }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        getUser,
        setUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
export { UserProvider };