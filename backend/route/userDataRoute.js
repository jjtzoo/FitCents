const router = express.Router();
const userData = require("../models/userData");

// #1 Retrieve All
router.get("/", async (req, res) => {
    try {
        const users = await userData.find()
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
});
// http://localhost:3001/userData
// #2 Retrieve One
router.get("/:id", async(req, res) => {
    try {
        const user = await userData.findById(req.params.id)

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            })
        }

        res.status(200).json({
            message: "User retrieved successfully",
            user: user
        })
    } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
            error: "Internal Server Error."
        })
    }
})
// #3 Create One 
router.post("/", async(req, res) => {
    try {
        const newUser = new userData(req.body);
        const savedUser = await newUser.save();
        res.status(201).json({
            message: "New user successfully created.",
            newuser : savedUser
        });
    } catch (err) {
        console.log("Error: ", err);
        return response.status(500).json({
            error: "Internal Server Error."
        });
    }
});
// #4 Update One
router.put('/:id', async(req, res) => {
    try {
        const updateUser = await userData.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!updateUser) {
            return res.status(404).json({
                error: "User not found."
            })
        }
        return res.status(200).json({
            message: "User update successful",
            updatedUser : updateUser
        })
    } catch (err) {
        console.log("Error: ", error);
        return response.status(500).json({
            error: "Internal Server Error."
        })
    }
});
// #5 Delete One
router.delete('/:id', async(req, res) => {
    try{
        const deleteUser = await userData.findByIdAndDelete(req.params.id);
        if (!deleteUser) {
            return res.status(404).json({
                error: "User not found."
            })
        }
        res.status(200).json({
            message: "User successfully deleted."
        })
    } catch (err) {
        console.log("Error: ", err);
        return response.status(500).json({
            error: "Internal Server Error."
        })
    }
})
module.exports = router;