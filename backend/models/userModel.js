import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    name : { type: String, required: true},
    age:{type: Number, required: true},
    gender: { type:String, required: true},
    weight: {type: Number, required: true},
    activityLevel: {type: String, required:true},
    weightGoal: { type: Number, required: true},
    restrictions: { type: [String], default: []},
    preferences: { type: [String], default: []},
    role: {type: String, enum: ["regular", "premium", "developer" ], default: "regular"}
},
{timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;