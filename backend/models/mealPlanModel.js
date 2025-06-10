import mongoose from "mongoose";

const mealPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    createdAt: { type: Date, default: Date.now},
    days: [
        {
            day: Number,
            meals: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Recipe",
                }
            ]
        }
    ]
});

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);

export default MealPlan;