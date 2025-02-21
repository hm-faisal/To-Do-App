import PropTypes from "prop-types";
import AuthContext from "./AuthContext";
import { useEffect, useState } from "react";
import {
  deleteUser,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import app from "../../firebase/firebase.config";

const AuthProvider = ({ children }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // authentication state observer and get user data

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Google Login

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  // Sign out existing User

  const signOutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Delete signIn user

  const deleteCurrentUser = () => {
    setLoading(true);
    return deleteUser(user);
  };

  /**
   * All Auth Context Values
   */
  const AuthContextValue = {
    user,
    loading,
    setUser,
    setLoading,
    googleSignIn,
    signOutUser,
    deleteCurrentUser,
  };
  return (
    <>
      <AuthContext.Provider value={AuthContextValue}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.object,
};

export default AuthProvider;
