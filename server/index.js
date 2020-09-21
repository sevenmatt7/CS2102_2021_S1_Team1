const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

//routes

app.use("/auth", require("./routes/jwtAuth"));

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
app.get("/items/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const item = await pool.query("SELECT * FROM sample WHERE id = $1", [id])

        res.json(item.rows[0]);
    } catch (err) {
        console.log(err.message);
    }
});

//update an item
app.put("/items/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const {description} = req.body;
        const updateItem = await pool.query(
            "UPDATE sample SET description = $1 WHERE id = $2", 
            [description, id]
        );

        res.json("Updated item");
    } catch (err) {
        console.log(err.message);
    }
});

//delete an item
app.delete("/items/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const deleteItem = await pool.query(
            "DELETE FROM sample WHERE id = $1", 
            [id]
        );

        res.json("Deleted item");
    } catch (err) {
        console.log(err.message);
    }
});

app.listen(5000, () => {
    console.log('server has started at port 5000');
});