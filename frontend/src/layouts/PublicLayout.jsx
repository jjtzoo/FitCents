import { Outlet } from "react-router"
import PublicNav from "../components/PublicNav"
import Footer from "../components/Footer"

const PublicLayout = () => {


    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <PublicNav />
            <main className="pt-25 px-4 flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default PublicLayout
