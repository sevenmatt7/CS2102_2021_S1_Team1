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
            "INSERT INTO sample (description) VALUES($1) RETURNING *", 
            [description]
        );
        res.json(newItem.rows[0]);
    } catch (err) {
        console.log(err.message);
    }
});
//get all items
app.get("/items", async(req, res) => {
    try {
        const allItems = await pool.query("SELECT * FROM sample")
        res.json(allItems.rows);
    } catch (err) {
        console.log(err.message);
    }
});
//get an item

//update an item

//delete an item

app.listen(5000, () => {
    console.log('server has started at port 5000');
});