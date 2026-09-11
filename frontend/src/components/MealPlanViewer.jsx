import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./ui/Card";
import Button from "./ui/Button";
import PageHeader from "./ui/PageHeader";

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

  if (loading) return <div className="text-center py-8 text-stone-500">Loading...</div>;
  if (error || !mealPlan) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error || "No active meal plan"}</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Your Meal Plan" className="mb-6 text-center" />

      <div className="grid gap-6">
        {mealPlan.meals.map((day) => (
          <Card key={day.day} padding="p-4">
            <h3 className="text-lg font-display font-semibold mb-2 text-stone-900">Day {day.day}</h3>
            <ul className="space-y-2">
              {day.meal.map((m, index) => {
                const key = `${day.day}-${index}`;
                const isExpanded = expandedMeals[key];
                return (
                  <li
                    key={index}
                    className="border border-stone-200 rounded-lg p-3 flex flex-col gap-2 bg-stone-50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-stone-900">{m.name}</p>
                        <p className="text-sm text-stone-600">{m.label}</p>
                        <p className="text-sm text-stone-500">
                          {m.caloriesPerServing} kcal • ₱{m.totalMealCost.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleCompletion(mealPlan._id, day.day, index)}
                        className={`px-2 py-1 text-xs font-medium rounded-full focus:outline-none ${
                          m.completed
                            ? "bg-sage-100 text-sage-700"
                            : "bg-primary-100 text-primary-700"
                        }`}
                      >
                        {m.completed ? "Completed" : "Pending"}
                      </button>
                    </div>

                    <div className="text-right">
                      <button
                        onClick={() => toggleExpand(day.day, index)}
                        className="text-xs text-primary-600 hover:underline"
                      >
                        {isExpanded ? "Hide Ingredients" : "View Ingredients"}
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && m.ingredients && (
                        <motion.ul
                          className="text-sm text-stone-700 pl-4 list-disc"
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
          </Card>
        ))}
      </div>

      {archived && (
        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-stone-600 mb-2">
            🎉 You've completed this meal plan.
          </p>
          <Button onClick={handleGenerateNewPlan}>Generate New Meal Plan</Button>
        </div>
      )}

      <div className="mt-6 text-sm text-center text-stone-500">
        Plan ends on: {new Date(mealPlan.expiresAt).toLocaleDateString()}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <Card className="w-80 text-center" padding="p-6">
            <h3 className="text-lg font-display font-semibold mb-4 text-stone-900">Generate New Meal Plan?</h3>
            <p className="text-sm text-stone-600 mb-4">
              You've completed your current meal plan. Would you like to create a new one?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="secondary"
                onClick={() => {
                  handleGenerateNewPlan();
                  setShowModal(false);
                }}
              >
                Yes
              </Button>
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MealPlanViewer;
