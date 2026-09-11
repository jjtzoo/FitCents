import { MdInsights } from "react-icons/md";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";

const Analytics = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <PageHeader eyebrow="Admin" title="Analytics" subtitle="Usage trends and system-wide insights." />
        <Badge tone="neutral">Developer only</Badge>
      </div>
      <EmptyState
        icon={MdInsights}
        badge="In development"
        title="Analytics dashboard is on its way"
        description="Soon this will surface usage trends, meal plan engagement, and system health at a glance."
      />
    </div>
  )
}

export default Analytics
