//get user by email id
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const users = await User.find({ emailId: userEmail });
        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Error while fetching user : " + err.message);
    }
})

//feed API to get all the users
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Error while fetching user : " + err.message);
    }
});


app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (deletedUser) {
            res.send("User deleted successfully");
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        res.status(400).send("Error while deleting user : " + err.message);
    }
});

//update the data 
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const updateData = req.body;
    try {
        const ALLOWED_UPDATES = ["age", "skills", "gender", "photoUrl", "about"];
        const isUpdateAllowed = Object.keys(updateData).every((key) => ALLOWED_UPDATES.includes(key));
        if (!isUpdateAllowed) {
            throw new Error("Updates Not ALlowed");
        };
        if (updateData.skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }
        const updatedUser = await User.findByIdAndUpdate({ _id: userId }, updateData, { returnDocument: "after", runValidators: true });
        console.log("Updated user data:", updatedUser); // Log the updated user data
        if (updatedUser) {
            res.send("User updated successfully");
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        res.status(400).send("Error while updating user : " + err.message);
    }
})