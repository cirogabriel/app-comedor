import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { loginRequest } from "../api/auth.js";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            const adminData = localStorage.getItem('admin');
            if (token && adminData) {
                setAdmin(JSON.parse(adminData));
                setIsAuthenticated(true);
            }
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('admin');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        const response = await loginRequest(credentials);
        if (response.data.status === 401) {
            throw new Error(response.data.message);
        }
        const { token, user } = response.data;
        // guardar ANTES de cualquier request posterior
        localStorage.setItem('token', token);
        localStorage.setItem('admin', JSON.stringify(user));
        setAdmin(user);
        setIsAuthenticated(true);
        return response;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        setAdmin(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ admin, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = { children: PropTypes.node.isRequired };