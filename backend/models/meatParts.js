const mongoose = require('mongoose');

const meatPartsSchema = new mongoose.Schema({
    _id: {type: String, required: true },
    name: {type: String, required: true },
    caloriesPerKilo: {type: Number, required: true},
    meatCategoryId: {type: String, required: true},
    pricePerKilo: { type: Number, required: true}
}, {
    _id: false,
});

module.exports = mongoose.model('MeatParts', meatPartsSchema, 'meatParts');