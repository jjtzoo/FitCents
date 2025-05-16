const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    _id: { type: String, required: true},
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    pin:{ type: Number, required: true },
    targetCaloriesPerDay: { type: Number, default: 2000 },
    mealsPerDay: { type: Number, default: 3},
    dietDuration: { type: Number, default: 7},
    budget: { type: Number, default: 0 },
    role: { type: String, enum: ['regular', 'premium', 'developer'], default: 'regular'},
    preference: { type: [String], default: []},
}, {timestamps: true});

module.exports = mongoose.model('UserData', userDataSchema, 'userData');