// AuthContext.tsx
import { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => {
        setIsAuthenticated(true);
        // Store the token in localStorage or a cookie for persistence
    };

    const logout = () => {
        setIsAuthenticated(false);
        // Remove the token from localStorage or cookies
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
