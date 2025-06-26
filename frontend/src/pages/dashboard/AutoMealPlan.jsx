import { useState } from "react";
import axios from "axios";
import MealPlanViewer from "../../components/MealPlanViewer";
import ConfirmModal from "../../components/ConfirmModal";

const apiURL = import.meta.env.VITE_API_BASE_URL;

const AutoMealPlan = () => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [refreshViewer, setRefreshViewer] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setFeedback(null);

    try {
      const res = await axios.post(
        `${apiURL}/api/meal-plan/generate`,
        {},
        { withCredentials: true }
      );
      setFeedback({ type: "success", message: "Meal plan generated successfully!" });
      setRefreshViewer(prev => prev + 1);
    } catch (err) {
      const msg = err.response?.data?.error || "An error occurred.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };
    return (
      <div className="p-4 max-w-4xl mx-auto">
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
        <ConfirmModal
          open={showModal}
          onCancel={() => setShowModal(false)}
          onConfirm={() => {
            setShowModal(false);
            handleGenerate();
          }}
        />
        <MealPlanViewer key={refreshViewer} />
      </div> 
    )
}

export default AutoMealPlan
