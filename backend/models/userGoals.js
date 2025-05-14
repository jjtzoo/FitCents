const mongoose = require("mongoose");

const userGoalsSchema = new mongoose.Schema({
    user: { type: String, ref: 'UserData', required: true},
    totalOverallKcal: { type: Number, required: true },
    totalMeals: { type: Number, required: true },
    costPerMeal:  { type: Number, required: true },
    kcalPerMeal: { type: Number, required: true }
}, { timestamp: true });

module.exports = mongoose.model('UserGoals', userGoalsSchema, 'userGoals');