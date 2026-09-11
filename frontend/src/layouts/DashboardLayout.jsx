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
        <div className="min-h-screen bg-stone-50">
            <DashboardNavBar />
            <main className="md:pl-64">
                <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
                    <Outlet />
                </div>
            </main>
            {needsOnboarding && (
                <OnboardingModal onClose={() => setDismissed(true)} />
            )}
        </div>
    )
}

export default DashboardLayout
