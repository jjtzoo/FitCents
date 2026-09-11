import { useState } from "react"
import { Outlet } from "react-router"
import DashboardNavBar from "../components/DashboardNavBar"
import OnboardingModal from "../components/OnboardingModal"
import { useUserContext } from "../context/UserContext"

const DashboardLayout = () => {
    const { user } = useUserContext();
    const [dismissed, setDismissed] = useState(false);

    const hasLegacyProfile = Boolean(user?.biometrics?.name);
    const needsOnboarding = user && !user.onboarded && !hasLegacyProfile && !dismissed;

    return (
        <>
            <DashboardNavBar />
            <div className="mt-4 px-4">
                <Outlet />
            </div>
            {needsOnboarding && (
                <OnboardingModal onClose={() => setDismissed(true)} />
            )}
        </>
    )
}

export default DashboardLayout
