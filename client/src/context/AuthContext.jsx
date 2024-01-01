// ** React Imports
import React, { createContext, useEffect, useState } from 'react';

// ** axios
import axios from 'axios';

// ** React Router Dom
import { useLocation, useNavigate } from 'react-router-dom';

// ** Default Provider Value
const defaultProviderValue = {
    user: null,
    setUser: null,
    logout: () => { },
    login: () => Promise.resolve(),
    register: () => Promise.resolve(),
}

// ** Creating Auth Context
export const AuthContext = createContext(defaultProviderValue);

const AuthContextProvider = ({ children }) => {
    const base_uri = "http://localhost:8080/api";

    // ** State
    const [user, setUser] = useState(null);

    // ** Hooks
    const navigate = useNavigate();
    const location = useLocation();

    // Function to register a new user
    const register = async (userData) => {
        try {
            const { data } = await axios.post(`${base_uri}/register`, userData);
            setUser(data.email);
            localStorage.setItem("accessToken", data.token);
            return { success: true, message: data.message };
        } catch (error) {
            setUser(null);
            return { success: false, message: error.response.data.message };
        }
    };

    // Function to login a user
    const login = async (userData) => {
        try {
            const { data } = await axios.post(`${base_uri}/login`, userData);
            setUser(data.email);
            localStorage.setItem('accessToken', data.token);
            return { success: true, message: data.message };
        } catch (error) {
            setUser(null);
            return { success: false, message: error.response.data.message };
        }
    };

    // Function to logout a user
    const logout = () => {
        setUser(null);
        localStorage.removeItem('accessToken');
        navigate('/signin');
    }

    // Function to initialize authentication
    const initAuth = async () => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            navigate('/signin')
            setUser(null);
            return;
        }

        try {
            const { data } = await axios.get(`${base_uri}/user`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            setUser(data.email);
            // ** If user data is available then redirect to dashboard
            if (location.pathname === '/signin' || location.pathname === '/signup') {
                navigate('/');
            }
        } catch (error) {
            setUser(null);
            localStorage.removeItem('accessToken');
            navigate('/signin');
        }

    };

    useEffect(() => {
        initAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Provider Values
    const values = {
        user,
        setUser,
        register,
        logout,
        login,
    }

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
