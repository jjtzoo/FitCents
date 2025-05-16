const meatParts = require("../models/meatParts");

exports.getAllMeatPart = async(req, res) => {
    try{
        const data = await meatParts.find();
        if(data.length > 0) {
            return res.status(200).json({
                message: 'All meat parts record retrieve!',
                data
            });
        } else {
            return res.status(404).json({
                error: "No records found."
            });
        }
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: 'Internal Server Error.'
        });
    }
}

exports.getMeatPart = async(req, res) => {
    try{
        const data = await meatParts.findById(req.params.id);
        if (!data) {
            return res.status(404).json({
                error: "No records found."
            });
        }
        return res.status(200).json({
            message: "Recipe retrieved successfully!",
            data
        });
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: 'Internal Server Error.'
        });
    }
}

exports.createMeatPart = async(req, res) => {
    try{
        const data = new meatParts(req.body);
        const savedData = await data.save();

        res.status(201).json({
            message: "New user successfully created.",
            data : savedData
        });
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: 'Internal Server Error.'
        });
    }
}

exports.updateMeatParts = async(req, res) => {
    try{
        const data = await meatParts.findByIdAndUpdate(req.params.id, req.body, {new : true} );
        if (!data) {
            return res.status(404).json({error: 'No Meat-part found.'});
        }
        return res.status(200).json({
            message: "User update successful",
            data
        });
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: 'Internal Server Error.'
        });
    }
}

exports.deleteMeatPart = async(req, res) => {
    try{
        const data = await meatParts.findByIdAndUpdate(req.params.id);
        if (!data) {
            return res.status(404).json({
                error: "Recipe not found."
            });
        }
        res.status(200).json({
            message: "Recipe successfully deleted.",
            data
        });
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: 'Internal Server Error.'
        });
    }
}
