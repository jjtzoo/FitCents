import { useState } from "react";
import axios from "axios";

const AutoMealPlan = () => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setFeedback(null);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/meal-plan/generate",
        {},
        { withCredentials: true }
      );
      setFeedback({ type: "success", message: "Meal plan generated successfully!" });
    } catch (err) {
      const msg = err.response?.data?.error || "An error occurred.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };
    return (
      <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Generate Weekly Meal Plan</h2>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Plan"}
        </button>

        {feedback && (
          <p
            className={`mt-4 text-sm ${
              feedback.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {feedback.message}
          </p>
        )}
      </div>
    )
}

export default AutoMealPlan
