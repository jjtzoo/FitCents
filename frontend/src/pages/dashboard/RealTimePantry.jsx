import { MdKitchen } from "react-icons/md";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";

const RealTimePantry = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Kitchen"
        title="Current Inventory"
        subtitle="Track condiments and long-lasting ingredients so meal plans account for what you already have."
      />
      <EmptyState
        icon={MdKitchen}
        title="Pantry tracking is on its way"
        description="Soon you'll be able to log what's in your kitchen and have meal plans factor it in automatically."
      />
      <div className="text-center">
        <Button variant="outline" disabled>Add Products</Button>
      </div>
    </div>
  )
}

export default RealTimePantry
