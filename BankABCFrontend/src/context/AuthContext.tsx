import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

// Type for User data (adjust based on your actual user object)
interface User {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  role?: string; // Optional: if you store user role
}

// Context type
interface AuthContextType {
  user: User | null;
  login: (credentials: any) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string; data?: any }>;
  logout: () => void;
  getAuthHeader: () => { Authorization: string } | {};
  loading: boolean;
  isAuthenticated: boolean;
  getCookie: (name: string) => string;
  setCookie: (name: string, value: string | number | boolean, days?: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Cookie utilities
const setCookie = (name: string, value: string | number | boolean, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; secure; samesite=strict`;
};

const getCookie = (name: string): string => {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
};

const deleteCookie = (name: string) => {
  setCookie(name, "", -1);
};

// Props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = getCookie("auth_token");
    const userData = getCookie("user_data");

    if (token && userData) {
      try {
        const parsedUser: User = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        logout();
      }
    }

    setLoading(false);
  }, []);

  const login = async (credentials: any) => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      setCookie("auth_token", data.token);
      setCookie("user_data", JSON.stringify(data));

      setUser(data);

      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const logout = () => {
    deleteCookie("auth_token");
    deleteCookie("user_data");
    setUser(null);
  };

  const getAuthHeader = () => {
    const token = getCookie("auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    getAuthHeader,
    loading,
    isAuthenticated: !!user,
    getCookie,
    setCookie,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
