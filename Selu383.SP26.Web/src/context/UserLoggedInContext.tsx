import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { UserDto } from "@/types/UserDto";

interface AuthContextType {
  user: UserDto | null;
  isLoading: boolean;
  login: (userName: string, password: string) => Promise<void>;
  signup: (userName: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
}

export const UserLoggedInContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/authentication/me");
        if (response.ok) {
          const data = await response.json() as UserDto;
          setUser(data);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userName: string, password: string) => {
    const response = await fetch("/api/authentication/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, password }),
    });

    if (response.status === 400) {
      throw new Error("Invalid username or password.");
    }

    if (!response.ok) {
      throw new Error("An unexpected error occurred. Please try again.");
    }

    const userData = await response.json() as UserDto;
    setUser(userData);
  };

  const signup = async (userName: string, password: string) => {
    const response = await fetch("/api/authentication/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, password }),
    });

    console.log("Signup response status:", response.status);
    console.log("Signup response headers:", {
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
    });

    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error((errorData as { message?: string }).message || "Invalid username or password. Username may already be taken.");
    }

    if (!response.ok) {
      let errorMessage = "";
      const contentType = response.headers.get("content-type");
      console.log("Response not OK, attempting to parse error...");
      try {
        const responseBody = await response.clone().text();
        console.log("Raw response body:", responseBody);
        
        if (contentType?.includes("application/json")) {
          const errorData = JSON.parse(responseBody);
          console.error("Signup error response JSON:", errorData);
          errorMessage = (errorData as { message?: string }).message || JSON.stringify(errorData);
        } else {
          errorMessage = responseBody;
        }
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
      }
      throw new Error(`Signup failed (${response.status}): ${errorMessage || "An unexpected error occurred during signup."}`);
    }

    const userData = await response.json() as UserDto;
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch("/api/authentication/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    isLoggedIn: user !== null,
  };

  return (
    <UserLoggedInContext.Provider value={value}>
      {children}
    </UserLoggedInContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(UserLoggedInContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}