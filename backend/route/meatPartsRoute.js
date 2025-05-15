const express = require("express")
const meatParts = require("../models/meatParts")

router = express.Router()

// #1 Retrieve All
// http://localhost:3001/meatParts
router.get("/", async(req, res) => {
    try{
        const data = await meatParts.find();
        if(data.length > 0) {
            return res.status(200).json({
                message: 'All meat parts record retrieve!',
                data: data
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
        })
    }
});

// Retrieve One
router.get("/:id", async(req, res) => {
    try{
        const data = await meatParts.findById(req.params.id);
        if (!data) {
            return res.status(404).json({
                error: "No records found."
            });
        }
        return res.status(200).json({
            message: "Recipe retrieved successfully!",
            data : data
        })
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: 'Internal Server Error.'
        })
    }
});

// Create One
router.post("/", async(req, res) => {
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
        })
    }
});

// Update One
router.put("/:id", async(req, res) => {
    try{
        const data = await meatParts.findByIdAndUpdate(req.params.id, req.body, {new : true} );
        if (!data) {
            return res.status(404).json({error: 'No Meat-part found.'});
        }
        return res.status(200).json({
            message: "User update successful",
            data: data
        });
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: 'Internal Server Error.'
        })
    }
});

// Delete One
router.delete("/:id", async(req, res) => {
    try{
        const data = await meatParts.findByIdAndUpdate(req.params.id);
        if (!data) {
            return res.status(404).json({
                error: "Recipe not found."
            })
        }
        res.status(200).json({
            message: "Recipe successfully deleted.",
            data: data
        })
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: 'Internal Server Error.'
        })
    }
});

module.exports = router;