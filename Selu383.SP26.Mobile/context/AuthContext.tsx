import { createContext, useState, ReactNode } from "react";

export const AuthContext = createContext({
  user: null as any,
  setUser: (user: any) => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}