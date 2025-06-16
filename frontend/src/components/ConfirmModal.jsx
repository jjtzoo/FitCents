const ConfirmModal = ({ open, onConfirm, onCancel }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Regenerate Meal Plan?</h2>
            <p className="text-sm text-gray-600 mb-6">
                This will replace your current plan. Are you sure?
            </p>
            <div className="flex justify-between">
                <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={onCancel}
                >
                Cancel
                </button>
                <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={onConfirm}
                >
                Yes, Regenerate
                </button>
            </div>
            </div>
        </div>
    );
};

export default ConfirmModal;