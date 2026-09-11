import { Outlet } from "react-router"
import DashboardNavBar from "../components/DashboardNavBar"

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-stone-50">
            <DashboardNavBar />
            <main className="md:pl-64">
                <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout
