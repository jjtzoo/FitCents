import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    auth: {
        username : { type: String, required: true, unique: true},
        email: { type: String, required: true, unique: true},
        passwordHash: { type: String, required: true }
    },
    role: {
        type: String,
        enum: ["regular", "premium", "developer" ], 
        default: "regular"
    },
    biometrics: {
        name : { type: String, required: true},
        age:{type: Number, required: true},
        gender: { 
            type:String, 
            required: true,
            enum: ["male", "female", "non-binary"]
        },
        height_cm :{ 
            type: Number, 
            required: true,
            min: 100,
            max: 250
        },
        weight_kg : {
            type: Number, 
            required: true,
            min: 30,
            max: 300
        },
        activityLevel: {
            type: String, 
            required:true,
            enum: ['sedentary', 'light', 'moderate', 'active', 'veryActive']
        },
        weightGoal: { 
            type: String, 
            required: true, 
            enum: ["extreme", "moderate", "light"]
        },
        bmi : { type: Number },
        bmr: {type: Number },
        tdee: { type: Number},
        targetCalories: { type: Number },
        targetWeight_kilo : {type: Number}
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
            'vegetarian',
            'vegan'
        ],
        default: []

    },
    preferences: { 
        type: [String],
        enum : [
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
        default: []
    },
    dietDuration_days: {
        type: Number, 
        default : 7
    },
    budget_php: { 
        type: Number, 
        required: true 
    },
    mealsPerDay : {
        type: Number,
        default : 3,
        min: 2,
        max: 5,
    }
},
{timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;