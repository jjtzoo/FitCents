import { Outlet } from "react-router"
import PublicNav from "../components/PublicNav"

const PublicLayout = () => {


    return (
        <div className="min-h-screen bg-amber-50">
            <PublicNav />
            <main className="pt-25 px-4">
                <Outlet />
            </main>
        </div>
    )
}

export default PublicLayout
