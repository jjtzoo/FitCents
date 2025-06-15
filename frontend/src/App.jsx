import { RouterProvider, useNavigate } from "react-router";
import router from "./router.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import AppHeader from "./components/AppHeader.jsx";

const App = () => {
    return (
        <UserProvider>
          
          <RouterProvider router={router} /> 
        </UserProvider>
    )
}

export default App
