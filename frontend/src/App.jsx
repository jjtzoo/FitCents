import { RouterProvider } from "react-router";
import router from "./router.jsx";
import { UserProvider } from "./context/UserContext.jsx";

const App = () => {
  return (
    <UserProvider>
      <h1>App</h1>
      <RouterProvider router={router} /> 
    </UserProvider>
  )
}

export default App
