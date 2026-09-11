import Card from "./ui/Card";
import Button from "./ui/Button";

const ConfirmModal = ({ open, onConfirm, onCancel }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 px-4">
            <Card className="w-80 text-center" padding="p-6">
            <h2 className="text-lg font-display font-semibold mb-4 text-stone-900">Regenerate Meal Plan?</h2>
            <p className="text-sm text-stone-600 mb-6">
                This will replace your current plan. Are you sure?
            </p>
            <div className="flex justify-between gap-3">
                <Button variant="ghost" onClick={onCancel}>
                Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                Yes, Regenerate
                </Button>
            </div>
            </Card>
        </div>
    );
};

export default ConfirmModal;
