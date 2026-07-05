import { createContext, useState } from 'react'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const userInfo = localStorage.getItem('userInfo');
        try {
            return userInfo ? JSON.parse(userInfo) : null;
        } catch (e) {
            console.error("Error parsing user info from localStorage:", e);
            return null;
        }
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
    }
    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    }
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }


