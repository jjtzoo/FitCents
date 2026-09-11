import { MdChecklist } from "react-icons/md";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

const PickMealPlan = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Meal Planning"
        title="Pick Your Meal Plan"
        subtitle="Browse and choose meal plans tailored to your goals, instead of generating one automatically."
      />
      <EmptyState
        icon={MdChecklist}
        title="Manual plan picking is on its way"
        description="Soon you'll be able to browse curated meal plan options and pick the one that fits your week, instead of only auto-generating one."
      />
    </div>
  )
}

export default PickMealPlan
