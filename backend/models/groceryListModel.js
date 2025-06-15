import mongoose from "mongoose"

const ingredientsEntrySchema = new mongoose.Schema({
    ingredient: { type: String, required: true },
    label : { type: String },
    totalQuantity: { type: Number, required: true },
    unit: { type: String, required: true},
    category: { type: String, enum: ["main", "condiments"] },
    pricePerUnit : { type: Number },
    totalCost: { type: Number }
}, { _id: false });

const groceryListSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    mealPlan : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MealPlan",
        required: true,
        unique: true
    },
    ingredients: [ingredientsEntrySchema],
    totalItems: Number,
    totalEstimatedCost: Number,
    genereratedAt: {
        type: Date,
        default: Date.now
    },
    archived: {
        type: Boolean,
        default: false
    },
    archivedAt: {
        type: Date
    }
},{
    timestamps: true
});

const GroceryList = mongoose.model("GroceryList", groceryListSchema);

export default GroceryList;