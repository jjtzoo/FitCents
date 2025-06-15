import { Outlet } from "react-router"
import RegistrationForm from "../../components/RegistrationForm"
const Register = () => {
    return (
        <>
            <RegistrationForm />
            <Outlet />
        </>
    )
}

export default Register
