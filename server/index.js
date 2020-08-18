const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

//routes

//creating an item
app.post("/items", async(req, res) => {
    try {
        const {description} = req.body;
        const newItem = await pool.query(
            "INSERT into sample (description) VALUES($1)", 
            [description]
        );

    } catch (err) {
        console.log(err.message);
    }
});
//get all items

//get an item

//update an item

//delete an item

app.listen(5000, () => {
    console.log('server has started at port 5000');
});