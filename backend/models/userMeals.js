const mongoose = require('mongoose');
const { Schema } = mongoose;

const mealEntrySchema = new Schema({
    mealNumber: { type: Number, required: true},
    recipe: {type: String, ref: 'Recipes', required: true}
}, { _id: false});

const userMealsSchema = new Schema({
    userId: {
        type: String,
        ref: 'UserData',
        required: true
    },
    goalId: {
        type: String,
        ref: 'UserGoals',
        required: true
    },
    totalMeals: {
        type: Number,
        required: true
    },
    meals: [ mealEntrySchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserMeals', userMealsSchema, 'userMeals');