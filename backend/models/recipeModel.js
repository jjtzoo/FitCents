import mongoose from "mongoose";
const ingredientSchema = mongoose.Schema({
    quantity: Number,
    unit: String,
    pricePerUnit: Number,
    calories: Number,
    cost: Number,
    ingredient: String,
    label: String,
    category: {type: String, enum : ["main", "condiments"]}
}
,{
    _id: false
});

const recipeSchema = mongoose.Schema({
    recipeName : { type: String, required: true },
    mealType: { type: String, enum: ["snack", "main"], required: true},
    label: { type: String, required: true },
    totalMealCost : { type: Number, required: true },
    caloriesPerServing: { type: Number, required: true },
    description: { type: String, required: true },
    instructions: {
    type: [String],
    validate: [(val) => val.length > 0, 'Instructions must have at least one step'],
    required: true
    },
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
            'Mexican',
            'Western'
        ],
        required: true
    },
    ingredients: {
        type: [ingredientSchema],
        default: [],
        validate: [(val) => val.length > 0, 'Ingredients must have at least one item']
    }
})

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;