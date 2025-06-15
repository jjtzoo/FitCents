import { RouterProvider, useNavigate } from "react-router";
import router from "./router.jsx";
import { UserProvider } from "./context/UserContext.jsx";

const App = () => {
    return (
        <UserProvider>
          <RouterProvider router={router} /> 
        </UserProvider>
    )
}

export default App
