import mongoose from "mongoose";

const pantryItemSchema = new mongoose.Schema({
    ingredient: { type: String, required: true },
    label: { type: String },
    unit: { type: String, required: true },
    category: { type: String, enum: ["main", "condiments"], required: true },
    currentQuantity: { type:Number, required: true },
    totalPurchased: { type: Number, default: 0 }
}, { _id: false });

const pantrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: [pantryItemSchema],
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Pantry = new mongoose.model("Pantry", pantrySchema);


export default Pantry;