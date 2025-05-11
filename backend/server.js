const connect = require("./connect");
const express = require("express");
const cors = require("cors");
const recipes = require("./recipesRoutes");

const app = express();
const PORT = 3001;


app.use(cors());
app.use(express.json());
app.use(recipes);

app.listen(PORT, () => {
    connect.connectToServer();
    console.log(`Server is running on port ${PORT}`);
});

