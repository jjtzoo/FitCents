import { MdSportsGymnastics } from "react-icons/md";
import { FaCentSign } from "react-icons/fa6";
import { Link } from "react-router";

const AppHeader = () => {
    return (
        <h1 className="flex items-center gap-1 text-lg font-bold text-amber-700">
            <span className="flex items-center gap-1">
                <MdSportsGymnastics className="text-blue-600" />
                Fit
            </span>
            <span className="flex items-center text-blue-600">
                Cents <FaCentSign />
            </span>
        </h1>
    )
}

export default AppHeader
