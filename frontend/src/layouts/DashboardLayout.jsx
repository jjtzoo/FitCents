import { Outlet } from "react-router"
import DashboardNavBar from "../components/DashboardNavBar"
const DashboardLayout = () => {
    return (
        <>
            <DashboardNavBar />
            <div className="mt-4 px-4">
                <Outlet />
            </div>
        </>
    )
}

export default DashboardLayout
