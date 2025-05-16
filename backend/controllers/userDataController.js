const UserData = require("../models/userData");
const UserGoals = require("../models/userGoals");

exports.createUser = async (req, res) => {
    try {
        const newUser = new UserData(req.body);
        const savedUser = await newUser.save();

        const totalKcal = savedUser.targetCaloriesPerDay * savedUser.dietDuration;
        const totalMeals = savedUser.mealsPerDay * savedUser.dietDuration;

        const newGoals = new UserGoals({
            user: savedUser._id,
            totalOverallKcal: totalKcal,
            totalMeals: totalMeals,
            costPerMeal: savedUser.budget / totalMeals,
            kcalPerMeal: totalKcal / totalMeals,
        })

        const savedGoals = await newGoals.save();

        return res.status(201).json({
            message: "User and goals created successfully.",
            user: savedUser,
            goals: savedGoals
        })
    } catch (err) {
        console.error("Creation Error: ", err);
        return res.status(500).json({ error: "Internal Server Error." })
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await UserData.findByIdAndUpdate(req.params.id)
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found"});
        }

        const totalKcal = updatedUser.targetCaloriesPerDay * updatedUser.dietDuration;
        const totalMeals = updatedUser.mealsPerDay * updatedUser.dietDuration;

        const updatedGoals = await UserGoals.findByIdAndUpdate(
            { user: updatedUser._id},
            {
                totalOverallKcal : totalKcal,
                totalMeals : totalMeals,
                costPerMeal : updatedUser.budget / totalMeals,
                kcalPerMeal : totalKcal / totalMeals
            },
            { new : true }
        );

        res.status(200).json({
            message : "User and goals updated successfully.",
            user: updatedUser,
            goals: updatedGoals
        });
    } catch (err) {

    }
};