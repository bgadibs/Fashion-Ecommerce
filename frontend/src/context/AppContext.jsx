import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await getCurrentUser();
            setUser(response.data.user);
        } catch (error) {
            console.error("User session expired");
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = (token, loggedUser) => {
        localStorage.setItem("token", token);
        setUser(loggedUser);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                login,
                logout,
                loading,
                loadUser,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);