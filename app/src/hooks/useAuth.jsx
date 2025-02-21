import { useContext } from "react";
import AuthContext from "../context/auth/AuthContext";

/**
 * useAuth Hook can be use for access all auth context value
 */
const useAuth = () => {
  const auth = useContext(AuthContext);
  return auth;
};

export default useAuth;
