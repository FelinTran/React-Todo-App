// AuthContext.tsx
import { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (accessToken: any, tokenType: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
        // Remove the token from localStorage
        localStorage.removeItem('accessToken');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("authContext must be used within AuthProvider");
    return context;
};
