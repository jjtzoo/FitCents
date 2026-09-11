import Card from "./Card";
import Badge from "./Badge";

const EmptyState = ({ icon: Icon, title, description, badge = "Coming soon" }) => {
  return (
    <Card className="text-center max-w-lg mx-auto" padding="p-10">
      {Icon && (
        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center">
          <Icon className="text-2xl text-primary-600" />
        </div>
      )}
      <Badge tone="sage" className="mb-3">{badge}</Badge>
      <h2 className="text-xl font-display font-semibold text-stone-900 mb-2">{title}</h2>
      <p className="text-sm text-stone-500">{description}</p>
    </Card>
  );
};

export default EmptyState;
