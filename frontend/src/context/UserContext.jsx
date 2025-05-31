import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();

const UserProvider = (props) => {
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(null);
    const [ userGoals, setUserGoals ] = useState(null);
    const [userSelectedMeals , setUserSelectedMeals] = useState(null);
    const [userMeals, setUserMeals] = useState(null);

    useEffect(() => {
        if (!user?.username) return;

        const fetchUserData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:4000/api/userData/${user.username}`)
                setUser(res.data)
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, [user?.username])

    const myObj = {
        user,
        setUser,
        loading,
        setLoading,
        userGoals,
        setUserGoals,
        userSelectedMeals,
        setUserSelectedMeals,
        userMeals,
        setUserMeals
    }

    return (
        <UserContext.Provider value={myObj}>
            {props.children}
        </UserContext.Provider>

    )
    
};

export {UserContext, UserProvider};
export const useUserContext = () => useContext(UserContext);