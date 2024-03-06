import { createContext, useState, useEffect } from "react";
import {
  onAuthStateChangeListener,
  signOutUser,
  createUserDocumentFromAuth
} from "../utils/firebase/firebase.utils";

// useContext je React hook koji omogućuje komponentama da pristupe vrijednostima koje su podijeljene unutar Contexta.
// Context je mehanizam koji omogućuje prijenos podataka kroz cijelo stablo komponenata bez potrebe da se propisuju
// te vrijednosti kroz svaku komponentu.

//as the actual value you want to access
export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
});

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const value = { currentUser, setCurrentUser };

  signOutUser();

  useEffect(() => {
    const unsubscribe = onAuthStateChangeListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
      }
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
