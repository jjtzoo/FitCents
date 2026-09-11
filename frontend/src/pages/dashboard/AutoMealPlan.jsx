import { useState } from "react";
import axios from "axios";
import MealPlanViewer from "../../components/MealPlanViewer";
import ConfirmModal from "../../components/ConfirmModal";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

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
      await axios.post(
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
      <div className="space-y-6">
        <Card className="w-full max-w-md mx-auto text-center">
          <h2 className="text-xl font-display font-semibold mb-4 text-stone-900">Generate Weekly Meal Plan</h2>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate Plan"}
          </Button>

          {feedback && (
            <p
              className={`mt-4 text-sm ${
                feedback.type === "success" ? "text-sage-600" : "text-red-600"
              }`}
            >
              {feedback.message}
            </p>
          )}
        </Card>
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
