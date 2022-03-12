import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";
import Router from "next/router";
import { parseCookies, setCookie } from "nookies"

type SignInCredentials = {
  email: string;
  password: string;
}

type User = {
  email: string;
  roles: string[];
  permissions: string[];
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  user: User;
  isAuthenticated: boolean;
}

export const AuthContext = createContext({} as AuthContextData)

type AuthProviderProps = {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {  
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();

    if(token) {
      api.get("me").then(response => console.log(response))
    }
  }, [])

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("sessions", {
        email,
        password
      });

      const { token, refreshToken, roles, permissions } = response.data;

      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, //30 dias
        path: '/'
      });

      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, //30 dias
        path: '/'
      });
  
      setUser({
        email,
        roles,
        permissions
      });

      Router.push("/dashboard");
    } catch(err) {
      console.log(err)
    }
  }
  
  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}