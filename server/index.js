const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

//routes

//register and login
app.use("/auth", require("./routes/jwtAuth"));

//user homepage
app.use("/home", require("./routes/homepage"));

//submit enquiry
app.post("/contact", async (req, res) => {
    try {
        const { subject, message, date } = req.body
        const newEnquiry = await pool.query(
            "INSERT INTO enquiries (enq_type, submission, enq_message) VALUES($1, $2, $3)",
            [subject, date, message]
        )
        res.json(newEnquiry.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//get enquiries
app.get("/contact", async (req, res) => {
    try {
        const enquiries = await pool.query("SELECT * FROM enquiries")
        res.json(enquiries.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//get all caretaker searches
app.get("/caretakers", async (req, res) => {
    try {
        const searches = await pool.query("SELECT DISTINCT full_name, user_address, \
                                            avg_rating, caretaker_email, employment_type \
                                            FROM Caretakers \
                                            JOIN Users \
                                            ON Caretakers.caretaker_email = Users.email \
                                            ");
        res.json(searches.rows);
    } catch (error) {
        console.log(error.message)
    }
});

//get all filtered searches
app.get("/caretakersq", async (req, res) => {
    try {
        var sql = "SELECT DISTINCT full_name, user_address, avg_rating, caretaker_email, \
        employment_type FROM Caretakers JOIN Users ON Caretakers.caretaker_email=Users.email WHERE 1 = 1";

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
        console.log(error.message);
    }
});

//get by name
app.get("/formsearch", async (req, res) => {
    try {
        var sql = "SELECT DISTINCT full_name, user_address, avg_rating, caretaker_email, \
        employment_type FROM Caretakers JOIN Users ON Caretakers.caretaker_email=Users.email WHERE LOWER(full_name) LIKE LOWER(";
        sql += "'%" + req.query.form + "%')";
        const filteredSearches = await pool.query(sql);
        res.json(filteredSearches.rows);
    } catch (error) {
        console.log(error.message);
    }
});


//indicate availabilities for care takers
app.post("/setavail", async (req, res) => {
    try {
        //step 1: destructure req.body to get details
        const {service_avail, service_type, daily_price, pet_type} = req.body;
        
        // get user_email from jwt token
        const jwtToken = req.header("token")
        const user_email = jwt.verify(jwtToken, process.env.jwtSecret).user.email;
        console.log(user_email)
        
        const newService = await pool.query(
            "INSERT INTO Offers_Services (caretaker_email, service_type, service_avail, type_pref, daily_price) VALUES ($1, $2, $3, $4, $5) RETURNING *" , 
            [user_email, service_type, service_avail, pet_type, daily_price] );

        res.json(newService.rows[0].service_avail);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("A server error has been encountered");
    }
});
// //creating an item
// app.post("/items", async (req, res) => {
//     try {
//         const { description } = req.body;
//         const newItem = await pool.query(
//             "INSERT INTO sample (description) VALUES($1) RETURNING *",
//             [description]
//         );
//         res.json(newItem.rows[0]);
//     } catch (err) {
//         console.log(err.message);
//     }
// });

// //get all items
// app.get("/items", async (req, res) => {
//     try {
//         const allItems = await pool.query("SELECT * FROM sample")
//         res.json(allItems.rows);
//     } catch (err) {
//         console.log(err.message);
//     }
// });

// //get an item
// app.get("/items/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const item = await pool.query("SELECT * FROM sample WHERE id = $1", [id])

//         res.json(item.rows[0]);
//     } catch (err) {
//         console.log(err.message);
//     }
// });

// //update an item
// app.put("/items/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { description } = req.body;
//         const updateItem = await pool.query(
//             "UPDATE sample SET description = $1 WHERE id = $2",
//             [description, id]
//         );

//         res.json("Updated item");
//     } catch (err) {
//         console.log(err.message);
//     }
// });

// //delete an item
// app.delete("/items/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deleteItem = await pool.query(
//             "DELETE FROM sample WHERE id = $1",
//             [id]
//         );

//         res.json("Deleted item");
//     } catch (err) {
//         console.log(err.message);
//     }
// });

app.listen(5000, () => {
    console.log('server has started at port 5000');
});