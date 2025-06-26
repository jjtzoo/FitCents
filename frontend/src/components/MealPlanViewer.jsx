import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const apiURL = import.meta.env.VITE_API_BASE_URL;

const MealPlanViewer = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [archived, setArchived] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [expandedMeals, setExpandedMeals] = useState({});

  const toggleExpand = (day, index) => {
    setExpandedMeals(prev => ({
      ...prev,
      [`${day}-${index}`]: !prev[`${day}-${index}`]
    }));
  };

  const handleToggleCompletion = async (planId, day, index) => {
    try {
      const res = await axios.patch(
        `${apiURL}/api/meal-plan/meal-plans/${planId}/toggle`,
        { day, index },
        { withCredentials: true }
      );

      const { updatedMealPlan, planArchived } = res.data;
      setMealPlan(updatedMealPlan);
      setArchived(planArchived);
      if (planArchived) setShowModal(true);
    } catch (err) {
      console.error("Toggle error:", err.response?.data || err.message);
    }
  };

  const fetchMealPlan = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${apiURL}/api/meal-plan/active`, {
        withCredentials: true
      });
      const data = res.data;

      if (!data || !data.meals || data.meals.length === 0) {
        setMealPlan(null);
        setError("No meal plan found.")
      } else {
        setMealPlan(data);
        setError("");
      }
    } catch (err) {
      const message = err.response?.data?.error || "Failed to fetch meal plan";
      setError(message);
      setMealPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNewPlan = async () => {
    try {
      setMealPlan(null);
      setLoading(true)
      await axios.post(
        `${apiURL}/api/meal-plan/generate`,
        {},
        { withCredentials: true }
      );
      await fetchMealPlan();
      setArchived(false);
    } catch (err) {
      console.error("Failed to generate new plan:", err.response?.data || err.message);
    }
  };


  useEffect(() => {
    fetchMealPlan();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error || !mealPlan) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error || "No active meal plan"}</p>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Your Meal Plan</h2>

      <div className="grid gap-6">
        {mealPlan.meals.map((day) => (
          <div key={day.day} className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">Day {day.day}</h3>
            <ul className="space-y-2">
              {day.meal.map((m, index) => {
                const key = `${day.day}-${index}`;
                const isExpanded = expandedMeals[key];
                return (
                  <li
                    key={index}
                    className="border rounded-lg p-3 flex flex-col gap-2 bg-gray-50"
                  >
                    <div className="flex justify-between items-center">
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
                          m.completed
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {m.completed ? "Completed" : "Pending"}
                      </button>
                    </div>

                    <div className="text-right">
                      <button
                        onClick={() => toggleExpand(day.day, index)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {isExpanded ? "Hide Ingredients" : "View Ingredients"}
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && m.ingredients && (
                        <motion.ul
                          className="text-sm text-gray-700 pl-4 list-disc"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {m.ingredients.map((ingredient, i) => (
                            <li key={i}>
                              {ingredient.ingredient} — {ingredient.quantity} {ingredient.unit}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Generate New Meal Plan?</h3>
            <p className="text-sm text-gray-600 mb-4">
              You've completed your current meal plan. Would you like to create a new one?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleGenerateNewPlan();
                  setShowModal(false);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanViewer;
