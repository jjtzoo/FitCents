const mongoose = require("mongoose");

const userGoalsSchema = new mongoose.Schema({
    user: { type: String, ref: 'userData', required: true},
    totalOverallKcal: { type: Number, required: true },
    totalMeals: { type: Number, required: true },
    costPerMeal:  { type: Number, required: true },
    kcalPerMeal: { type: Number, required: true }
}, { timestamp: true });

module.exports = mongoose.model('userGoals', userGoalsSchema, 'userGoals');