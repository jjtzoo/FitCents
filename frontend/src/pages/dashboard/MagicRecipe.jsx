import { MdAutoAwesome } from "react-icons/md";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

const MagicRecipe = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Kitchen"
        title="Enter Your Ingredients"
        subtitle="Tell us what you have on hand and get a recipe built around it."
      />
      <EmptyState
        icon={MdAutoAwesome}
        title="Magic Dish is on its way"
        description="Soon you'll be able to enter ingredients you already have and get a budget-friendly recipe suggestion instantly."
      />
    </div>
  )
}

export default MagicRecipe
