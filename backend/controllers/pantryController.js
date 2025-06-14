import Pantry from "../models/pantryModel.js"
import GroceryList from "../models/groceryListModel.js"

export const buildPantryFromGroceryList = async (req, res) => {
    const userId = req.session?.user?._id;

    if (!userId) {
        return res.status(404).json({ error: "Unauthorized access."});
    }

    try {
        const groceryList = await GroceryList.findOne({
            user: userId,
            archived: false
        });

        if (!groceryList) {
            return res.status(404).json({ error: "No active gorocery list found to build pantry."});
        }

        const pantryItems = groceryList.ingredients.map(ingredient => ({
            ingredient: ingredient.ingredient,
            label: ingredient.label,
            unit: ingredient.unit,
            category: ingredient.category,
            currentQuantity: ingredient.totalQuantity,
            totalPurchased: ingredient.totalQuantity,
            lastUpdated: new Date()
        }));

        let pantry = await Pantry.findOne({ user: userId });

        if (pantry) {
            pantry.items = pantryItems;
            pantry.updatedAt = new Date();
        } else {
            pantry = new Pantry({
                user: userId,
                items: pantryItems
            })
        }

        await pantry.save();

        return res.status(200).json({
            message: "Pantry successfully built from grocery list",
            pantry
        });
    } catch (err) {
        console.error("Error building pantry: ", err);
        return res.status(500).json({ error: "Internal Server Error."});
    }
}

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

export const updatePantryWithNewGroceryList = async (req, res) => {
    const  userId = req.session?.user?._id;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized access."});
    }

    try {
        const groceryList = await GroceryList.findOne({
            user: userId,
            archived: false
        })

        if (!groceryList) {
            return res.status(404).json({ error: "No active grocery list found."});
        }

        const newItems = groceryList.ingredients.map(ingredient => ({
            ingredient: ingredient.ingredient,
            label: ingredient.label,
            unit: ingredient.unit,
            category: ingredient.category,
            currentQuantity: ingredient.totalQuantity,
            totalPurchased: ingredient.totalQuantity,
            lastUpdated: new Date()
        }));

        const pantry = await Pantry.findOne({ user: userId });
        if (!pantry) {
            const newPantry = new Pantry({
                user: userId,
                items: newItems,
                updatedAt: new Date()
            });
            
            await newPantry.save();
            return res.status(201).json({ message: "Pantry created with new grocery list", pantry: newPantry });
        }

        newItems.forEach(newItem => {
            const existing = pantry.items.find(i =>
                i.ingredient === newItem.ingredient && 
                i.unit === newItem.unit &&
                i.category === newItem.category
            );

            if (existing) {
                existing.currentQuantity += newItem.currentQuantity;
                existing.totalPurchased += newItem.totalPurchased;
                existing.lastUpdated = new Date();
            } else {
                pantry.item.push(newItem);
            }
        });

        pantry.updatedAt = new Date();
        await pantry.save();

        return res.status(200).json({ message: "Pantry udpated with new grocery list", pantry })
    } catch (err) {
        console.error("Error updating pantry: ", err);
        return res.status(500).json({ error: "Internal Server Error." })
    }
};


export const manuallyUpdatePantryItem = async (req, res) => {
    const userId = req.session?.user?._id;
    const { ingredient, quantity, unit, category, label } = req.body;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized access." });
    }

    if (!ingredient || !unit || !category || typeof quantity !== "number") {
        return res.status(400).json({ error: "Missing required pantry item fields."})
    }

    try {
        const pantry = await Pantry.findOne({ user: userId });

        if (!pantry) {
            return res.status(404).json({ error: "Pantry not found." })
        }

        const item = pantry.item.find(i =>
            i.ingredient === ingredient &&
            i.unit === unit &&
            i.category === category
        );

        if (item) {
            item.currentQuantity += quantity;
            item.totalPurchased += quantity;
            item.lastUpdated = new Date();
        } else {
            pantry.item.push({
                ingredient,
                label,
                unit,
                category,
                currentQuantity: quantity,
                totalPurchased: quantity,
                lastUpdated: new Date()
            });
        }

        pantry.updatedAt = new Date();
        await pantry.save();

        res.status(200).json({ message: "Pantry item added or updated successfully.", pantry })
    } catch (err) {
        console.error("Error manually updating pantry item: ", err);
        res.status(500).json({ error: "Internal Server Error." });
    }
};
