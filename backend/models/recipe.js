const mongoose = require("mongoose");


const ingredientSubSchema = new mongoose.Schema ({
    ingredient : {
        type: String,
        ref: 'meatParts',
        required: true
    },
    label : {
        type : String,
        required: true
    },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    pricePerUnit : { type: Number, required: true },
    calories : { type: Number, required: true },
    cost: { type: Number, required: true }
},{ _id: false });

const recipeSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    meatPartId: { 
        type: String, 
        ref: 'meatParts',
        required: true 
    },
    label : { type: String, required: true },
    totalMealCost: { type: Number, required: true },
    caloriesPerServing: { type: Number, required: true },
    ingredients : [ ingredientSubSchema ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('recipes', recipeSchema, 'recipes');