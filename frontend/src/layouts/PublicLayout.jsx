import { Outlet } from "react-router"
import PublicNav from "../components/PublicNav"

const PublicLayout = () => {


    return (
        <div className="min-h-screen bg-amber-50">
            <PublicNav />
            <Outlet />
        </div>
    )
}

export default PublicLayout
