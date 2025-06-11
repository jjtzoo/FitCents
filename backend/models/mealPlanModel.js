import mongoose from "mongoose";


const dailyMealSchema = new mongoose.Schema({
    day: { type: Number, required: true},
    meals: [{ type: mongoose.Schema.Types.ObjectId, ref: Recipe, required: true}]
})

const mealPlanSchema = new mongoose.Schema(
    {
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        unique: true
    },
    meals: [dailyMealSchema],
    averageCaloriesPerServing : { type: Number, required: true },
    averageTotalMealCost : { type: Number, required: true },
    totalCalories: { type:Number, required: true},
    totalCost: { type: Number, required: true}
    },
    {
        timestamps: true
    }
);

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);

export default MealPlan;