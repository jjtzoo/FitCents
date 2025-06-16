import { useEffect, useState } from "react";
import axios from "axios";

const MealPlanViewer = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ archived, setArchived ] =  useState(false);

    const handleToggleCompletion = async (planId, day, index) => {
        try {
            const res = await axios.patch(
            `http://localhost:4000/api/meal-plan/meal-plans/${planId}/toggle`,
            { day, index },
            { withCredentials: true }
            );
            
            const { updatedMealPlan, planArchived } = res.data;
            setMealPlan(updatedMealPlan);
            setArchived(planArchived);
        } catch (err) {
            console.error("Toggle error:", err.response?.data || err.message);
        }
    };

    const handleGenerateNewPlan = async () => {
        try {
            const res = await axios.post(
            "http://localhost:4000/api/meal-plan/generate",
            {},
            { withCredentials: true }
            );
            setMealPlan(res.data); // or fetch again
            setArchived(false);
        } catch (err) {
            console.error("Failed to generate new plan:", err.response?.data || err.message);
        }
    };

    useEffect(() => {
        const fetchMealPlan = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/meal-plan/active",
                {
                    withCredentials: true
                }
            );

            setMealPlan(res.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchMealPlan();
    }, []);

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-red-600 text-center py-8">{error}</div>;
    if (!mealPlan) return <div className="text-center py-8">No active meal plan.</div>;

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-center">Your Meal Plan</h2>

            <div className="grid gap-6">
                {mealPlan.meals.map((day) => (
                <div key={day.day} className="bg-white rounded-xl shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-2">Day {day.day}</h3>
                    <ul className="space-y-2">
                    {day.meal.map((m, index) => (
                        <li
                            key={index}
                            className="border rounded-lg p-3 flex justify-between items-center bg-gray-50"
                            >
                            <div>
                                <p className="font-medium">{m.name}</p>
                                <p className="text-sm text-gray-600">{m.label}</p>
                                <p className="text-sm text-gray-500">
                                {m.caloriesPerServing} kcal • ₱{m.totalMealCost.toFixed(2)}
                                </p>
                            </div>
                            <button
                                onClick={() => handleToggleCompletion(mealPlan._id, day.day, index)}
                                className={`px-2 py-1 text-xs font-medium rounded-full focus:outline-none ${
                                    m.completed ? "bg-green-200 text-green-800" : "bg-yellow-100 text-yellow-700"
                                }`}
                                >
                                {m.completed ? "Completed" : "Pending"}
                            </button>

                        </li>
                    ))}
                    </ul>
                </div>
                ))}
            </div>

            {archived && (
                <div className="mt-6 text-center">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                    🎉 You've completed this meal plan.
                    </p>
                    <button
                    onClick={handleGenerateNewPlan}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                    Generate New Meal Plan
                    </button>
                </div>
            )}

            <div className="mt-6 text-sm text-center text-gray-500">
                Plan ends on: {new Date(mealPlan.expiresAt).toLocaleDateString()}
            </div>
        </div>
    );
};

export default MealPlanViewer;
