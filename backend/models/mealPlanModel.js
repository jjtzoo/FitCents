import mongoose from "mongoose";


const mealEntrySchema = new mongoose.Schema({
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        required: true
    },
    name: {
        type: String
    },
    label: {
        type:String
    },
    caloriesPerServing: {
        type: Number
    },
    totalMealCost : {
        type: Number
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { _id: false})

const dailyMealSchema = new mongoose.Schema({
    day: { 
        type: Number, 
        required: true
    },
    meal: [mealEntrySchema]
}, { _id : false})

const mealPlanSchema = new mongoose.Schema(
    {
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true
        },
        mealsPerDay: {type: Number, required: true},
        dietDuration_days : { type: Number, required: true},
        meals: [dailyMealSchema],
        averageCaloriesPerServing : { 
            type: Number, 
            required: true 
        },
        averageTotalMealCost : { 
            type: Number, 
            required: true 
        },
        totalCalories: { 
            type:Number, 
            required: true
        },
        totalCost: { 
            type: Number, 
            required: true
        },
        active: {
            type: Boolean,
            default: true
        },
        expiresAt: Date,
        archivedAt: Date
    },
    {
        timestamps: true
    }
);

const MealPlan = mongoose.model("MealPlan", mealPlanSchema);

export default MealPlan;