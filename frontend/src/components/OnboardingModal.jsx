import { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { heightConverter } from '../utils/heightConverter'
import { restrictionOptions } from './RegistrationForm/restrictionOptions'
import { conflictMap } from './RegistrationForm/conflictMap'
import { preferenceOption } from './RegistrationForm/preferenceOptions'
import { useUserContext } from '../context/UserContext'

const apiURL = import.meta.env.VITE_API_BASE_URL;

const OnboardingModal = ({ onClose }) => {
    const { user, setUser } = useUserContext();

    const [gender, setGender] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [activityLevel, setActivityLevel] = useState("");
    const [height, setHeight] = useState("");
    const [rawHeight, setRawHeight] = useState('');
    const [weightGoal, setWeightGoal] = useState('');
    const [heightError, setHeightError] = useState('');
    const [restrictions, setRestrictions] = useState([]);
    const [disabledRestrictions, setDisabledRestrictions] = useState([]);
    const [preferences, setPreferences] = useState([]);
    const [budget, setBudget] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleHeight = (e) => {
        const input = e.target.value;
        setRawHeight(input);

        const convertedHeight = heightConverter(input);

        if (convertedHeight === null) {
            setHeightError(`Please enter height in format like 5'7" between 4'0" and 7'11". No spaces in between!`)
        } else {
            setHeightError('');
            setHeight(convertedHeight);
        }
    }

    const handleRestrictions = (e) => {
        let { value, checked } = e.target;

        if (value === 'none') {
            setRestrictions([]);
            setDisabledRestrictions([]);
            return
        }

        setRestrictions((currentRestrictions) => {
            let newRestrictions;

            if (checked) {
                newRestrictions = [...currentRestrictions, value]

                if (conflictMap[value]) {
                    const conflictsToAdd = conflictMap[value];
                    newRestrictions = Array.from(new Set([...newRestrictions, ...conflictsToAdd]));
                    setDisabledRestrictions((restrictionDisabled) => {
                        return Array.from(new Set([...restrictionDisabled, ...conflictsToAdd]))
                    })
                }
            } else {
                newRestrictions = currentRestrictions.filter((r) => r !== value);

                if (conflictMap[value]) {
                    const conflictsToRemove = conflictMap[value];
                    setDisabledRestrictions((restrictionDisabled) =>
                        restrictionDisabled.filter((item) => !conflictsToRemove.includes(item))
                    );

                    newRestrictions = newRestrictions.filter((r) =>
                        !conflictsToRemove.includes(r) ||
                        currentRestrictions.some((other) =>
                            other !== value && (conflictMap[other] || []).includes(r)
                        )
                    );

                    setDisabledRestrictions((restrictionDisabled) => {
                        return restrictionDisabled.filter((item) =>
                            !conflictsToRemove.includes(item) ||
                            currentRestrictions.some((other) =>
                                other !== value && (conflictMap[other] || []).includes(item)
                            )
                        );
                    });
                }
            }
            return newRestrictions
        });
    };

    const handlePreferences = (e) => {
        const { value, checked } = e.target;
        setPreferences((preference) =>
            checked
                ? [...preference, value]
                : preference.filter((preferenceNot) => preferenceNot !== value)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !age || !gender || !height || !weight || !activityLevel || !weightGoal || !budget) {
            setErrorMsg("Please fill in every field so we can build your meal plan.");
            return;
        }

        setLoading(true);
        setErrorMsg("");

        const payload = {
            biometrics: {
                name,
                age: Number(age),
                gender,
                height_cm: height,
                weight_kg: Number(weight),
                activityLevel,
                weightGoal,
            },
            restrictions,
            preferences,
            budget_php: Number(budget),
        };

        try {
            const username = user.auth.username;
            const res = await axios.put(`${apiURL}/api/users/${username}`, payload, {
                withCredentials: true,
            });
            setUser(res.data);
            onClose();
        } catch (err) {
            const message = err.response?.data?.error || "Something went wrong saving your profile.";
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 my-auto"
                >
                    <div>
                        <h2 className="text-2xl font-bold text-amber-700">Finish setting up your profile</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            We use these to calculate your calories and build your weekly meal plan.
                        </p>
                    </div>

                    {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                                <input
                                    type="number"
                                    id="age"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                                <input
                                    type="number"
                                    id="weight"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (e.g. 5'7")</label>
                                <input
                                    type="text"
                                    id="height"
                                    value={rawHeight}
                                    onChange={handleHeight}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                {heightError && <p className="text-xs text-red-500 mt-1">{heightError}</p>}
                                {height && <p className="text-xs text-gray-400 mt-1">Converted to {height} cm</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="activity-level" className="block text-sm font-medium text-gray-700">Activity Level</label>
                            <select
                                id="activity-level"
                                value={activityLevel}
                                onChange={(e) => setActivityLevel(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                <option value="">-- Select activity level --</option>
                                <option value="sedentary">Sedentary, little/no exercise</option>
                                <option value="light">Light, 1-3 days/week</option>
                                <option value="moderate">Moderate, 3-5 days/week</option>
                                <option value="active">Active, 6-7 days/week</option>
                                <option value="veryActive">Very Active - physical job + exercise</option>
                            </select>
                        </div>

                        <fieldset>
                            <legend className="text-sm font-medium text-gray-700 mb-2">Gender</legend>
                            <div className="flex gap-4">
                                {["male", "female", "non-binary"].map((g) => (
                                    <label key={g} className="flex items-center gap-1 text-sm text-gray-700 capitalize">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={g}
                                            checked={gender === g}
                                            onChange={(e) => setGender(e.target.value)}
                                        />
                                        {g === "non-binary" ? "Prefer not to say" : g}
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <div>
                            <label htmlFor="weightGoal" className="block text-sm font-medium text-gray-700">
                                Weight Loss Goal
                            </label>
                            <select
                                id="weightGoal"
                                value={weightGoal}
                                onChange={(e) => setWeightGoal(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                <option value="">-- Select a Goal --</option>
                                <option value="extreme">Extreme Weight Loss</option>
                                <option value="moderate">High Weight Loss</option>
                                <option value="light">Light Weight Loss</option>
                            </select>
                        </div>

                        <fieldset className="border border-amber-200 rounded-xl p-4 space-y-3">
                            <legend className="text-sm font-semibold text-amber-700 px-2">Dietary Restrictions</legend>

                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    value="none"
                                    checked={restrictions.length === 0}
                                    onChange={handleRestrictions}
                                />
                                No Restrictions
                            </label>

                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {restrictionOptions.map((restriction) => (
                                    <label key={restriction} className="flex items-center gap-2 text-sm text-gray-700 capitalize">
                                        <input
                                            type="checkbox"
                                            value={restriction}
                                            checked={restrictions.includes(restriction)}
                                            disabled={disabledRestrictions.includes(restriction) && !restrictions.includes(restriction)}
                                            onChange={handleRestrictions}
                                            className="disabled:opacity-40"
                                        />
                                        {restriction.replace(/_/g, ' ')}
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset className="border border-teal-200 rounded-xl p-4 space-y-3">
                            <legend className="text-sm font-semibold text-teal-700 px-2">Cuisine Preferences</legend>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {preferenceOption.map((cuisine) => (
                                    <label key={cuisine} className="flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            value={cuisine}
                                            checked={preferences.includes(cuisine)}
                                            onChange={handlePreferences}
                                        />
                                        {cuisine}
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <div>
                            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                                Budget Per Week (₱)
                            </label>
                            <input
                                type="number"
                                id="budget"
                                min="0"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                placeholder="Enter amount in Philippine Peso"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Maybe later
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2 bg-amber-500 text-white font-semibold rounded-md shadow-md hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                            >
                                {loading ? "Saving..." : "Save & Continue"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default OnboardingModal
