import User from "../models/userModel";

// CRUD

// Create
export const createUser = async (req, res) => {
    try {
        const data = new User(req.body);
        const savedData = await data.save();
        res.status(201).json({
            message : "Data created successfully!",
            data: savedData
        })
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
        const data = await User.findOne(req.params.username);
        if (!data) {
            res.status(404).json({ error: "No data found"})
        }
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

        const updatedData = await UserData.findOneAndReplace( 
            {
                username
            }, 
            newData, 
            { 
                new : true,
                runValidators: true,
                upsert: false
            });
        if (!updatedData) {
            return res.status(404).json({ error: "User not found"});
        }
        res.status(200).json({
            message : "User and goals updated successfully.",
            user: updatedData,
        });
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
            res.status(404).json({ error: "User not found" });
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

        await User.findOneAndDelete(username);
        res.json({message: "Succesfully deleted"})
    } catch (error) {
        res.status(400).json({ error: err.message});
    }

}