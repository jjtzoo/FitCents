import { useState } from "react";
import axios from "axios";
import MealPlanViewer from "../../components/MealPlanViewer";
import ConfirmModal from "../../components/ConfirmModal";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";
import { useUserContext } from "../../context/UserContext";

const apiURL = import.meta.env.VITE_API_BASE_URL;

const AutoMealPlan = () => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [refreshViewer, setRefreshViewer] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);

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

  const handleGenerateClick = () => {
    if (hasPlan) {
      setShowModal(true);
    } else {
      handleGenerate();
    }
  };

  const targetCalories = user?.biometrics?.targetCalories;
  const budget = user?.budget_php;
  const duration = user?.dietDuration_days;

    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Meal Planning" title="Auto Meal Plan" subtitle="Generate a weekly meal plan built around your profile." />

        <Card className="w-full max-w-md mx-auto text-center">
          {(targetCalories || budget || duration) && (
            <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
              {targetCalories && (
                <div>
                  <p className="text-stone-400 text-xs uppercase tracking-wide">Target</p>
                  <p className="font-semibold text-stone-900">{Math.round(targetCalories)} kcal</p>
                </div>
              )}
              {budget && (
                <div>
                  <p className="text-stone-400 text-xs uppercase tracking-wide">Budget</p>
                  <p className="font-semibold text-stone-900">₱{budget}</p>
                </div>
              )}
              {duration && (
                <div>
                  <p className="text-stone-400 text-xs uppercase tracking-wide">Duration</p>
                  <p className="font-semibold text-stone-900">{duration} days</p>
                </div>
              )}
            </div>
          )}
          <Button onClick={handleGenerateClick} disabled={loading}>
            {loading ? "Generating..." : hasPlan ? "Regenerate Plan" : "Generate Plan"}
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
        <MealPlanViewer key={refreshViewer} onPlanStatusChange={setHasPlan} />
      </div>
    )
}

export default AutoMealPlan
