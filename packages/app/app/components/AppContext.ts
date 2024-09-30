import { useContext, createContext } from "react";

type record = {
  username?: string
  attributes?: {
    sub: string
    email: string
  }
}

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isAuthenticating: boolean;
  setIsAuthenticating: (isAuthenticating: boolean) => void;
  userAttributes: record
  setUserAttributes: (userAttributes: record) => void
}

export const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  isAuthenticating: false,
  setIsAuthenticating: () => {},
  userAttributes: {},
  setUserAttributes: () => {}
});

export function useAppContext() {
  return useContext(AppContext);
}
