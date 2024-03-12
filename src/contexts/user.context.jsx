import { createContext, useEffect, useReducer } from "react";
import {
  onAuthStateChangeListener,
  signOutUser,
  createUserDocumentFromAuth,
} from "../utils/firebase/firebase.utils";

// useContext je React hook koji omogućuje komponentama da pristupe vrijednostima koje su podijeljene unutar Contexta.
// Context je mehanizam koji omogućuje prijenos podataka kroz cijelo stablo komponenata bez potrebe da se prepisuju
// te vrijednosti kroz svaku komponentu.

//as the actual value you want to access
export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
});

export const USER_ACTION_TYPES = {
  SET_CURRENT_USER: 'SET_CURRENT_USER',
}

export const userReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_ACTION_TYPES.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: payload,
      };
    default:
      throw new Error(`Unhandled type ${type} in userReducer`);
  }
};

const INITIAL_STATE = {
  currentUser: null,
}

export const UserProvider = ({ children }) => {
  // const [currentUser, setCurrentUser] = useState(null);
  const [ { currentUser }, dispatch ] = useReducer(userReducer, INITIAL_STATE);

  const setCurrentUser = (user) => {
    dispatch({type: USER_ACTION_TYPES.SET_CURRENT_USER, payload: user});
  }

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

/* 
 
const userReducer = (state, action) => {
  return {
    currentUser: null
  }
}

*/
