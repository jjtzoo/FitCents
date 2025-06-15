import { Outlet } from "react-router"
import PublicNav from "../components/PublicNav"
import AppHeader from "../components/AppHeader"

const PublicLayout = () => {


    return (
        <div className="min-h-screen bg-amber-50">
            <PublicNav />
            <Outlet />
        </div>
    )
}

export default PublicLayout
