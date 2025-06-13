import Pantry from "../models/pantryModel.js"

export const getPantry = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const pantry = await pantry.findOne({ user: userId });
        if (!pantry) return res.status(404).json({ error: "Pantry not found" });

        res.status(200).json(pantry)
    } catch (err) {
        console.error("Error fetching pantr: ", err);
        res.status(500).json({ error: "Internal Server Error"})
    }
};

export const resetPantryController = async (req, res) => {
    try {
        const userId = req.session.user._id;

        const pantry = await Pantry.find({ user: userId });
        if (!pantry) return res.status(404).json({ error: "Pantry not found."});

        pantry.items = [];
        pantry.updatedAt = new Date();
        await pantry.save();

        res.status(200).json({ message : "Pantry reset successfully." });
    } catch (err) {
        console.error("Error resetting pantry: ", err);
        res.status(500).json({ error: "Internal Server Error."});
    }
};

export const deductFromPantryController = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const { ingredients } = req.body;

        const pantry = await Pantry.findOne({ user: userId });
        if (!pantry) return res.status(404).json({ error: "Pantry data not found."});

        let updated = false;
        ingredients.forEach(({ ingredient, quantity, unit, category }) => {
            const item = pantry.items.find(i =>
            i.ingredient === ingredient &&
            i.unit === unit &&
            i.category === category
            );

            if (item) {
            item.currentQuantity = Math.max(0, item.currentQuantity - quantity);
            item.lastUpdated = new Date();
            updated = true;
            }
        });

        if (updated) {
            pantry.updatedAt = new Date();
            await pantry.save();
        }
        
        res.status(200).json({ message: "Pantry updated after meal completion." });
    } catch (err) {
        console.error("Error updating pantry: ", err);
        res.status(500).json({ error: "Server error." });
    }
};

