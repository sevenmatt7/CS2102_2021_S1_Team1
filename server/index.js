const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

//routes

//register and login
app.use("/auth", require("./routes/jwtAuth"));

//user homepage
app.use("/home", require("./routes/homepage"));

//get all caretaker searches
app.get("/caretakers", async (req, res) => {
    try {
        const searches = await pool.query("SELECT DISTINCT full_name, user_address, \
                                            avg_rating, caretaker_id, employment_type \
                                            FROM Caretakers \
                                            JOIN Users \
                                            ON Caretakers.caretaker_id=Users.user_id \
                                            ");
        res.json(searches.rows);
    } catch (error) {
        console.log(error.message)
    }
});

//get all filtered searches
app.get("/caretakersq", async (req, res) => {
    try {
        var sql = "SELECT DISTINCT full_name, user_address, avg_rating, caretaker_id, \
        employment_type FROM Caretakers JOIN Users ON Caretakers.caretaker_id=Users.user_id WHERE 1 = 1";
        
        if (req.query.employment_type != undefined && req.query.employment_type != "") {
            sql += " AND employment_type = ";
            sql += ("'" + req.query.employment_type + "'");
        }
        if (req.query.avg_rating != undefined && req.query.avg_rating != "") { 
            sql += " AND avg_rating = ";
            sql += (req.query.avg_rating);
        }
                
        const filteredSearches = await pool.query(sql);
        if (filteredSearches !== undefined) res.json(filteredSearches.rows);
    } catch (error) {
        console.log(error.message)
    }
});


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