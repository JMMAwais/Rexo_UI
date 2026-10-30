import { createContext, useContext, useState, useEffect } from "react";
import { graphqlRequest, GraphQLRequestError } from "@/lib/graphqlClient";
import type { ReactNode } from "react";

interface AuthUser {
  email: string;
  fullName: string;
  role: string;
  roles: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      data { accessToken refreshToken email fullName role roles }
      error
    }
  }
`;

const REGISTER_MUTATION = `
  mutation Register($firstName: String!, $lastName: String!, $email: String!, $password: String!, $confirmPassword: String!) {
    register(input: {
      firstName: $firstName, lastName: $lastName, email: $email,
      password: $password, confirmPassword: $confirmPassword
    }) {
    data { accessToken refreshToken email fullName role roles }
      error
    }
  }
`;

const GOOGLE_LOGIN_MUTATION = `
  mutation GoogleLogin($idToken: String!) {
    googleLogin(input: { idToken: $idToken }) {
      data { accessToken refreshToken email fullName role roles }
      error
    }
  }
`;

type AuthResponseData = {
  accessToken: string;
  refreshToken: string;
  email: string;
  fullName: string;
  role: string;
  roles: string[];
} | null;


function saveSession(data: NonNullable<AuthResponseData>) {
  localStorage.setItem("rexo_access_token", data.accessToken);
  localStorage.setItem("rexo_refresh_token", data.refreshToken);
  localStorage.setItem(
    "rexo_user",
    JSON.stringify({ email: data.email, fullName: data.fullName, role: data.role, roles: data.roles })
  );
}

function clearSession() {
  localStorage.removeItem("rexo_access_token");
  localStorage.removeItem("rexo_refresh_token");
  localStorage.removeItem("rexo_user");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("rexo_access_token");
    const savedUser = localStorage.getItem("rexo_user");

    if (token && savedUser) {
      setAccessToken(token);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const result = await graphqlRequest<{ login: { data: AuthResponseData; error: string | null } }>(
      LOGIN_MUTATION,
      { email, password }
    );

    if (result.login.error || !result.login.data) {
      throw new GraphQLRequestError(result.login.error ?? "Login failed");
    }

    saveSession(result.login.data);
    setAccessToken(result.login.data.accessToken);
    setUser({
      email: result.login.data.email,
      fullName: result.login.data.fullName,
      role: result.login.data.role,
      roles: result.login.data.roles,
    });
  }

  async function register(input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    const result = await graphqlRequest<{ register: { data: AuthResponseData; error: string | null } }>(
      REGISTER_MUTATION,
      input
    );

    if (result.register.error || !result.register.data) {
      throw new GraphQLRequestError(result.register.error ?? "Registration failed");
    }

    saveSession(result.register.data);
    setAccessToken(result.register.data.accessToken);
    setUser({
      email: result.register.data.email,
      fullName: result.register.data.fullName,
      role: result.register.data.role,
      roles: result.register.data.roles,
    });
  }

  async function googleLogin(idToken: string) {
    const result = await graphqlRequest<{ googleLogin: { data: AuthResponseData; error: string | null } }>(
      GOOGLE_LOGIN_MUTATION,
      { idToken }
    );

    if (result.googleLogin.error || !result.googleLogin.data) {
      throw new GraphQLRequestError(result.googleLogin.error ?? "Google login failed");
    }

    saveSession(result.googleLogin.data);
    setAccessToken(result.googleLogin.data.accessToken);
    setUser({
      email: result.googleLogin.data.email,
      fullName: result.googleLogin.data.fullName,
      role: result.googleLogin.data.role,
      roles: result.googleLogin.data.roles,
    });
  }

  function logout() {
    clearSession();
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}