import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const apiURL = import.meta.env.VITE_API_BASE_URL;

const UserInfo = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
        try {
            const res = await axios.get(`${apiURL}/api/users/profile`, {
                withCredentials: true,
            });
            setUser(res.data);
        } catch (err) {
            setError("Failed to fetch user profile.");
        } finally {
            setLoading(false);
        }
        };
        fetchProfile();
    }, []);

    if (loading) return <p className="text-center text-gray-500">Loading profile...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!user) return <p className="text-center text-gray-500">No user data available.</p>;

    const {
        auth,
        biometrics = {},
        restrictions = [],
        preferences = [],
        budget_php = 0
    } = user;

    const {
        name = "N/A",
        age = 0,
        gender = "N/A",
        height_cm = 0,
        weight_kg = 0,
        bmi = 0,
        bmr = 0,
        tdee = 0,
        targetCalories = 0,
        weightGoal = "N/A"
    } = biometrics;

  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 py-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-bold text-amber-700">👤 User Profile</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">Username</p>
          <p className="font-semibold">{auth?.username}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">Name</p>
          <p className="font-semibold">{name}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">Age</p>
          <p className="font-semibold">{age}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">Gender</p>
          <p className="font-semibold capitalize">{gender}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">Height</p>
          <p className="font-semibold">{height_cm} cm</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">Weight</p>
          <p className="font-semibold">{weight_kg} kg</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-6 text-amber-600">Biometric Stats</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card label="BMI" value={bmi.toFixed(2)} />
        <Card label="BMR" value={`${bmr.toFixed(0)} kcal`} />
        <Card label="TDEE" value={`${tdee.toFixed(0)} kcal`} />
        <Card label="Target Calories" value={`${targetCalories.toFixed(0)} kcal`} />
        <Card label="Weight Goal" value={weightGoal} />
        <Card label="Budget (₱)" value={`₱ ${budget_php}`} />
      </div>

      <h3 className="text-lg font-semibold mt-6 text-amber-600">Preferences</h3>
      <div className="bg-white shadow rounded-xl p-4 space-y-2">
        <p>
          <span className="font-medium">Cuisine:</span>{" "}
          {Array.isArray(preferences) && preferences.length > 0
            ? preferences.join(", ")
            : "N/A"}
        </p>
      </div>

      <h3 className="text-lg font-semibold mt-6 text-amber-600">Dietary Restrictions</h3>
      <div className="bg-white shadow rounded-xl p-4">
        {restrictions.length > 0 ? (
          <ul className="list-disc pl-5 text-sm">
            {restrictions.map((item, idx) => (
              <li key={idx}>
                {item
                  .replace(/_/g, " ")            
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">None</p>
        )}
      </div>
    </motion.div>
  );
};

const Card = ({ label, value }) => (
  <div className="bg-white shadow rounded-xl p-4">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

export default UserInfo;
