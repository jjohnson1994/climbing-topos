import Auth, { SignUpParams } from "@aws-amplify/auth";
import { ICredentials } from "@aws-amplify/core";
import { useEffect, useState } from "react";
import { useAppContext } from "../components/AppContext";

const useUser = () => {
  const {
    setIsAuthenticated,
    setIsAuthenticating,
    isAuthenticating,
    isAuthenticated,
    userAttributes,
    setUserAttributes
  } = useAppContext();
  const [userCredentials, setUserCredentials] = useState<ICredentials>();

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      await Auth.currentSession();
      const userCredentials = await Auth.currentCredentials();
      const userAttributes = await Auth.currentAuthenticatedUser();

      setUserCredentials(userCredentials);
      setUserAttributes(userAttributes);
      setIsAuthenticated(true);
    } catch (error) {
      if (error !== "No current user") {
        console.error("error on load, no current user", error);
      }
    }

    setIsAuthenticating(false);
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsAuthenticating(true);
      setIsAuthenticated(false);
      setUserCredentials(undefined);

      await Auth.signIn(email, password);
      const userCredentials = await Auth.currentCredentials();
      const userAttributes = await Auth.currentAuthenticatedUser();

      setUserCredentials(userCredentials);
      setUserAttributes(userAttributes);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("sign in error", error);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      setUserCredentials(undefined);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("error signing out");
      throw error;
    }
  };

  const signUp = async (newUserAttributes: SignUpParams) => {
    try {
      setIsAuthenticated(false);
      setIsAuthenticating(true);
      setUserCredentials(undefined);

      await Auth.signUp(newUserAttributes);
    } catch (error) {
      console.error("error in sign up", error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const confirmSignUp = async (username: string, confirmationCode: string) => {
    try {
      await Auth.confirmSignUp(username, confirmationCode);
      setIsAuthenticated(true);
    } catch (error: any) {
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  return {
    userAttributes,
    userCredentials,
    isAuthenticating,
    isAuthenticated,
    signIn,
    signOut,
    signUp,
    confirmSignUp,
  };
};

export default useUser;
