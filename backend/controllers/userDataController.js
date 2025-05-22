const UserData = require("../models/userData");
const UserGoals = require("../models/userGoals");

exports.getAllUser = async (req, res) => {
    try {
        const users = await UserData.find();
        if(users.length > 0) {
            return res.status(200).json({
                message: "All user records retrieved!",
                users: users
            }); 
        } else {
            return res.status(404).json({
                error: "No records found."
            });
        }
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

exports.getOneUser = async(req, res) => {
    try {
        const user = await UserData.findById(req.params.id)

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.status(200).json({
            message: "User retrieved successfully",
            user
        });
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: "Internal Server Error."
        })
    }
}

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
            costPerMeal: Number((savedUser.budget / totalMeals).toFixed(2)),
            kcalPerMeal: Number((totalKcal / totalMeals).toFixed(2)),
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
        console.log("Updating UserData with filter:", { _id: req.params.id });
        const updatedUser = await UserData.findOneAndUpdate(
            { _id: req.params.id },
            req.body, 
            { new: true}
            );
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found"});
        }

        const totalKcal = updatedUser.targetCaloriesPerDay * updatedUser.dietDuration;
        const totalMeals = updatedUser.mealsPerDay * updatedUser.dietDuration;

        console.log("Updating UserGoals with filter:", { user: updatedUser._id });
        const updatedGoals = await UserGoals.findOneAndUpdate(
            { user: updatedUser._id},
            {
                user: updatedUser._id,
                totalOverallKcal : totalKcal,
                totalMeals : Number(totalMeals.toFixed(2)),
                costPerMeal : Number((updatedUser.budget / totalMeals).toFixed(2)),
                kcalPerMeal : Number((totalKcal / totalMeals).toFixed(2))
            },
            { new : true, upsert: true }
        );

        res.status(200).json({
            message : "User and goals updated successfully.",
            user: updatedUser,
            goals: updatedGoals
        });
    } catch (err) {
        console.log("Update Error: ", err);
        res.status(500).json({ error: "Internal Server Error."});
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await UserData.findOneAndDelete({ _id: req.params.id});

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found"});
        }

        await UserGoals.deleteOne({ user: deletedUser._id});
    } catch (err) {
        console.log("Delete Error: ", err);
        return res.status(500).json({ error: "Internal Server Error."})
    }
};