import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { calculateCurrentTDEE, calculateUserBMI, calculateUserBMR, targetBMI, targetTDEE, targetWeight } from "../utils/calculateBiometrics.js";

// CRUD

// Register
export const createUser = async (req, res) => {
    try {
        const username = req.body.auth.username.trim().toLowerCase();
        const email = req.body.auth.email.trim().toLowerCase();
        const password = req.body.auth.password;

        const existing = await User.findOne({ "auth.username": username });
        if (existing) {
        return res.status(409).json({ error: "Username already exists." });
        }
        
        const {
            name,
            weight_kg,
            height_cm,
            age,
            gender,
            activityLevel,
            weightGoal
        } = req.body.biometrics

        const passwordHash = await bcrypt.hash(password, 10);

        const userBMI = calculateUserBMI(weight_kg, height_cm);
        const userBMR = calculateUserBMR(weight_kg, height_cm, age, gender);
        const userCurrentTDEE = Math.round(calculateCurrentTDEE(userBMR, activityLevel));
        const userTargetTDEE = Math.round(targetTDEE(userCurrentTDEE, gender, weightGoal));
        const userTargetBMI = targetBMI(userBMI, age)
        const userTargetWeight = Math.round(targetWeight(userTargetBMI, height_cm));

        const userUpdatedInfo = new User ({
            auth : {
                username,
                email,
                passwordHash
            },
            role: req.body.role || "regular",
            biometrics : {
                name,
                age,
                gender,
                height_cm,
                weight_kg,
                activityLevel,
                weightGoal,
                bmi: userBMI,
                bmr: userBMR,
                tdee: userCurrentTDEE,
                targetCalories: userTargetTDEE,
                targetWeight_kilo : userTargetWeight
            },
            restrictions: req.body.restrictions || [],
            preferences: req.body.preferences || [],
            dietDuration_days: req.body.dietDuration_days || 7,
            budget_php: req.body.budget_php
        });

        await userUpdatedInfo.save();
        res.status(201).json(userUpdatedInfo);

    } catch (err) {
        console.log("Creation Error: ", err);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
}


// List

export const list = async(req, res) => {
    try {
        const data = await User.find();
        if(data.length > 0) {
            res.status(200).json(data)
        } else {
            res.status(404).json({ error: "No data found"})
        }
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: "Internal Server Error."
        })
    }
}

// Read
export const read = async(req, res) => {
    try {
        const username = req.params.username;

        if(!username) {
            return res.status(400).json({ error: "Username is required"});
        }

        const data = await User.findOne({ "auth.username" : username });

        if (!data) {
            return res.status(404).json({ error: "No Username found."});
        }

        res.status(200).json(data);
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: "Internal Server Error."
        })
    }
}

// Update 
export const update = async(req, res) => {
    try {

        const username = req.params.username;
        const newData = req.body

        if ("_id" in newData || "username" in newData) {
            res.status(400).json({
            error: "You cannot update '_id' or 'username' via PUT."
            });
        }

        if (newData.biometrics) {
            const {
                weight_kg,
                height_cm,
                age,
                gender,
                activityLevel,
                weightGoal
            } = newData.biometrics

            const userBMI = calculateUserBMI(weight_kg, height_cm);
            const userBMR = calculateUserBMR(weight_kg, height_cm, age, gender);
            const userCurrentTDEE = calculateCurrentTDEE(userBMR, activityLevel);
            const userTargetTDEE = targetTDEE(userCurrentTDEE, gender, weightGoal);
            const userTargetBMI = targetBMI(userBMI, age)
            const userTargetWeight = targetWeight(userTargetBMI, height_cm);

            newData.bmi = userBMI;
            newData.bmr = userBMR;
            newData.tdee = Math.round(userCurrentTDEE);
            newData.targetCalories = Math.round(userTargetTDEE);

            newData.biometrics = {
            ...newData.biometrics,
            bmi: userBMI,
            bmr: userBMR,
            tdee: userCurrentTDEE,
            targetCalories: userTargetTDEE
            }
        }

        const putData = await User.findOneAndUpdate(
            { username },
            newData,
            { new: true, runValidators: true}
        );

        if (!putData) {
            return res.status(404).json({ error: "User not found."});
        }
        
        res.json(putData)
        
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ error: "Internal Server Error."});
    }
}

// Patch
export const patch = async (req, res) => {
    try {
        const patchData = await User.findOneAndUpdate(
            { username: req.params.username},
            { $set : req.body},
            { new: true, runValidators: true}
        );

        if (!patchData) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
        message: "User updated successfully.",
        user: patchData
    });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Internal Server Error." });
    }
}

// Delete
export const deleteUser = async (req, res) => {
    try {
        const username = req.params.username;

        const deletedUser = await User.findOneAndDelete( { "auth.username" : username })

        if (!deletedUser) {
         res.status(404).json({ error: "User not found" });
        }

        res.json({message: "Succesfully deleted"})
    } catch (err) {
        console.log("Error deleting user:", err);
        res.status(500).json({ error: "Internal Server Error." });
    }

}


export const updateMealsPerDay = async (req, res) => {
    try {
        const { mealsPerDay } = req.body;
        const { username } = req.params;

        if (mealsPerDay < 2 || mealsPerDay > 5) {
            return res.status(400).json({ error: "Meals per day must be between 2 and 5."});
        }

        const updatedNumber = await User.findByIdAndUpdate(
            { "auth.username" : username },
            { mealsPerDay },
            { new:true }
        );

        if (!updatedNumber) {
            return res.status(404).json({ error: "User not found."})
        }

        res.status(200).json({ message: "Meals/Day updated.", user: updatedNumber})
    } catch(err) {
        console.error("Error updating.", err);
        res.status(500).json({ error: "Internal Server Error" })
    }
}