import mongoose from "mongoose";

const recipeSchema = mongoose.Schema({
    recipeName : { type: String, required: true },
    label: { type: String, required: true },
    totalMealCost : { type: Number, required: true },
    caloriesPerServing: { type: Number, required: true },
    restrictions: {
        type: [String],
        enum: [
            'no_pork',
            'no_chicken',
            'no_beef',
            'no_seafood',
            'no_rice',
            'no_egg',
            'no_dairy',
            'vegetarian',
            'vegan'
        ],
        default: []
    },
    cuisine: {
        type: String,
        enum: [
            'Filipino',
            'Japanese',
            'Korean',
            'American',
            'Caribbean',
            'Mediterranean',
            'Chinese',
            'Italian',
            'Mexican'
        ],
        required: true
    },
    ingredients: [
        {
            quantity: Number,
            unit: String,
            pricePerUnit: Number,
            calories: Number,
            cost: Number,
            ingredient: String,
            label: String
        }
    ]
})

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;