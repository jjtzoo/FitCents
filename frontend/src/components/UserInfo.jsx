import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { MdPerson } from "react-icons/md";
import Card from "./ui/Card";
import PageHeader from "./ui/PageHeader";

const apiURL = import.meta.env.VITE_API_BASE_URL;

const Stat = ({ label, value }) => (
    <Card padding="p-4">
        <p className="text-stone-500 text-sm">{label}</p>
        <p className="font-semibold text-stone-900">{value}</p>
    </Card>
);

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
        } catch {
            setError("Failed to fetch user profile.");
        } finally {
            setLoading(false);
        }
        };
        fetchProfile();
    }, []);

    if (loading) return <p className="text-center text-stone-500">Loading profile...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!user) return <p className="text-center text-stone-500">No user data available.</p>;

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
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <PageHeader eyebrow="Dashboard" title={<span className="flex items-center gap-2"><MdPerson className="text-primary-600" /> User Profile</span>} />

      <div className="grid sm:grid-cols-2 gap-4">
        <Stat label="Username" value={auth?.username} />
        <Stat label="Name" value={name} />
        <Stat label="Age" value={age} />
        <Stat label="Gender" value={<span className="capitalize">{gender}</span>} />
        <Stat label="Height" value={`${height_cm} cm`} />
        <Stat label="Weight" value={`${weight_kg} kg`} />
      </div>

      <section>
        <h3 className="text-lg font-display font-semibold mb-3 text-primary-700">Biometric Stats</h3>
        <div className="grid sm:grid-cols-2 gap-4">
            <Stat label="BMI" value={bmi.toFixed(2)} />
            <Stat label="BMR" value={`${bmr.toFixed(0)} kcal`} />
            <Stat label="TDEE" value={`${tdee.toFixed(0)} kcal`} />
            <Stat label="Target Calories" value={`${targetCalories.toFixed(0)} kcal`} />
            <Stat label="Weight Goal" value={weightGoal} />
            <Stat label="Budget (₱)" value={`₱ ${budget_php}`} />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-display font-semibold mb-3 text-primary-700">Preferences</h3>
        <Card>
          <p>
            <span className="font-medium">Cuisine:</span>{" "}
            {Array.isArray(preferences) && preferences.length > 0
              ? preferences.join(", ")
              : "N/A"}
          </p>
        </Card>
      </section>

      <section>
        <h3 className="text-lg font-display font-semibold mb-3 text-primary-700">Dietary Restrictions</h3>
        <Card>
          {restrictions.length > 0 ? (
            <ul className="list-disc pl-5 text-sm space-y-1">
              {restrictions.map((item, idx) => (
                <li key={idx}>
                  {item
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone-500">None</p>
          )}
        </Card>
      </section>
    </motion.div>
  );
};

export default UserInfo;
