import { MdMenuBook } from "react-icons/md";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";

const AllRecipes = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <PageHeader eyebrow="Admin" title="All Recipes" subtitle="Full recipe catalog and management tools." />
        <Badge tone="neutral">Developer only</Badge>
      </div>
      <EmptyState
        icon={MdMenuBook}
        badge="In development"
        title="Recipe catalog browser is on its way"
        description="Soon you'll be able to search, filter, and manage every recipe in the database from here."
      />
    </div>
  )
}

export default AllRecipes
