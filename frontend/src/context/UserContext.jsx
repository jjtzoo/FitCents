import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();

const UserProvider = (props) => {
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(null);
    const [ error, setError] = useState(null);

    useEffect(() => {
    const fetchSession = async () => {
        try {
            const { data } = await axios.get("/api/user/profile");
            setUser(data);
        } catch (err) {
            console.error("User session fetch failed:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
        };

        fetchSession();
    }, []);

    const myObj = {
        user,
        setUser,
        loading,
        setLoading,
    }

    return (
        <UserContext.Provider value={myObj}>
            {props.children}
        </UserContext.Provider>

    )
    
};

export {UserContext, UserProvider};
export const useUserContext = () => useContext(UserContext);