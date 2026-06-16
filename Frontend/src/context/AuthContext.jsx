import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchUser = async () => {
            try {
                // Modified to use environment variable
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/auth/check-token`,
                    { withCredentials: true }
                );

                // console.log(response.data.accessToken)

                const token = response.data.accessToken;
                const decoded = jwtDecode(token);

                setUser(decoded);

            } catch (error) {
                console.log("Not logged in");
                setUser(null);
            } finally {
                setLoading(false); 
            }
        };

        fetchUser();

    }, []);

    const login = (accessToken) => {
        const decoded = jwtDecode(accessToken);
        console.log(decoded);
        setUser(decoded);
    };

    const logout = async () => {
        try {
            // Modified to use environment variable
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, { withCredentials: true })
            setUser(null);
            navigate('/');
        } catch (err) {
            console.log(err);
        }

    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;


