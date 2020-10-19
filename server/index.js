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

//user profiles
app.use("/profile", require("./routes/profile"));

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
                                            avg_rating, Caretakers.caretaker_email, offers_services.employment_type, \
                                            type_pref, service_avail, daily_price \
                                            FROM Offers_services \
                                            LEFT JOIN Users \
                                            ON Offers_services.caretaker_email = Users.email \
                                            LEFT JOIN Caretakers \
                                            ON Offers_Services.caretaker_email = Caretakers.caretaker_email \
                                            ");
        res.json(searches.rows);
    } catch (error) {
        console.log(error.message)
    }
});

//get all pets owned by petowner
app.get("/pets", async (req, res) => {
    try {
        const jwtToken = req.header("token")
        const user_email = jwt.verify(jwtToken, process.env.jwtSecret).user.email;
        console.log(user_email)
        const searches = await pool.query(`SELECT DISTINCT pet_name, \
                                            gender, special_req, pet_type \
                                            FROM Owns_Pets, \
                                             Users \
                                             \
                                            WHERE owner_email = '${user_email}'; \ 
                                            ` );
        res.json(searches.rows);
    } catch (error) {
        console.log(error.message)
    }
});

//get all bids from petowner for caretaker
app.get("/bids", async (req, res) => {
    try {
        const jwtToken = req.header("token")
        const caretaker_email = jwt.verify(jwtToken, process.env.jwtSecret).user.email;
        console.log(caretaker_email)
        const searches = await pool.query(`SELECT users.full_name, users.user_address, Petowner_bids.owner_email, Petowner_bids.selected_pet, \
                                            gender, special_req, service_request_period, offer_price, transfer_mode, Petowner_bids.pet_type \
                                            FROM Petowner_bids LEFT JOIN Owns_pets  \
                                            ON (Petowner_bids.selected_pet = Owns_pets.pet_name AND Owns_pets.owner_email = Petowner_bids.owner_email) \
                                            LEFT JOIN Users ON users.email = Petowner_bids.owner_email
                                            WHERE Petowner_bids.caretaker_email = '${caretaker_email}';\ 
                                            ` );
        res.json(searches.rows);
    } catch (error) {
        console.log(error.message)
    }
});

//get all transactions for caretaker or petowner
app.get("/transactions", async (req, res) => {
    try {
        const jwtToken = req.header("token")
        const user_email = jwt.verify(jwtToken, process.env.jwtSecret).user.email;
        const acc_type = req.header("acc_type")
        console.log(user_email)
        let searches;
        if (acc_type === "petowner") {
            searches = await pool.query(`SELECT users.full_name, users.user_address, Transactions_Details.owner_email, Transactions_Details.pet_name, \
                                            gender, special_req, duration, cost, mode_of_transfer, t_status, caretaker_email \
                                            FROM Transactions_Details LEFT JOIN Owns_pets  \
                                            ON (Transactions_Details.pet_name = Owns_pets.pet_name AND Owns_pets.owner_email = Transactions_Details.owner_email) \
                                            LEFT JOIN Users ON users.email = Transactions_Details.owner_email
                                            WHERE Transactions_Details.owner_email = '${user_email}';\ 
                                            ` );
        } else if (acc_type === "caretaker") {
            searches = await pool.query(`SELECT users.full_name, users.user_address, Transactions_Details.owner_email, Transactions_Details.pet_name, \
                                            gender, special_req, duration, cost, mode_of_transfer, t_status, caretaker_email \
                                            FROM Transactions_Details LEFT JOIN Owns_pets  \
                                            ON (Transactions_Details.pet_name = Owns_pets.pet_name AND Owns_pets.owner_email = Transactions_Details.owner_email) \
                                            LEFT JOIN Users ON users.email = Transactions_Details.owner_email
                                            WHERE Transactions_Details.caretaker_email = '${user_email}';\ 
                                            ` );
        }
        
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
        const {service_avail, employment_type, daily_price, pet_type} = req.body;
        
        // get user_email from jwt token
        const jwtToken = req.header("token")
        const user_email = jwt.verify(jwtToken, process.env.jwtSecret).user.email;
        console.log(user_email)
        
        const newService = await pool.query(
            "INSERT INTO Offers_Services (caretaker_email, employment_type, service_avail, type_pref, daily_price) VALUES ($1, $2, $3, $4, $5) RETURNING *" , 
            [user_email, employment_type, service_avail, pet_type, daily_price] );

        res.json(newService.rows[0].service_avail);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("A server error has been encountered");
    }
});

//petowner to submit bid for service
app.post("/submitbid", async (req, res) => {
    try {
        //step 1: destructure req.body to get details
        const { caretaker_email, employment_type, pet_type, service_request_period, bidding_offer, transfer_mode, selected_pet } = req.body;
        
        // get user_email from jwt token
        const jwtToken = req.header("token")
        const owner_email = jwt.verify(jwtToken, process.env.jwtSecret).user.email;
        console.log(owner_email)
        
        const newService = await pool.query(
            "INSERT INTO Transactions_Details (caretaker_email, employment_type, pet_name, owner_email, payment_mode, cost, mode_of_transfer, duration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *" , 
            [caretaker_email, employment_type, selected_pet, owner_email, "cash", bidding_offer, transfer_mode, service_request_period] );

        res.json(newService.rows[0].service_request_period);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("A server error has been encountered");
    }
});

//caretaker to change bid status to ACCEPTED, REJECTED OR COMPLETED
app.put("/changebid", async (req, res) => {
    try {
        //step 1: destructure req.body to get details
        const { owner_email, pet_name, duration, status_update} = req.body;
        
        // get user_email from jwt token
        const jwtToken = req.header("token")
        const caretaker_email = jwt.verify(jwtToken, process.env.jwtSecret).user.email;
        console.log(caretaker_email)
        
        const txn = await pool.query(
            "UPDATE Transactions_Details SET t_status = $1 \
            WHERE (owner_email = $2 AND caretaker_email = $3 AND pet_name = $4 AND duration = $5) RETURNING *" , 
            [status_update, owner_email, caretaker_email, pet_name, duration] );

        res.json(txn.rows[0].duration);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("A server error has been encountered");
    }
});

//petowner to submit review for service
app.put("/submitreview", async (req, res) => {
    try {
        //step 1: destructure req.body to get details
        const { caretaker_email, employment_type, pet_name, duration, rating, review } = req.body;
        
        // get user_email from jwt token
        const jwtToken = req.header("token")
        const owner_email = jwt.verify(jwtToken, process.env.jwtSecret).user.email;
        console.log(owner_email)
        
        const txn = await pool.query(
            "UPDATE Transactions_Details SET owner_rating = $1, owner_review = $2 \
            WHERE (owner_email = $3 AND caretaker_email = $4 AND pet_name = $5 AND duration = $6) RETURNING *" , 
            [rating, review, owner_email, caretaker_email, pet_name, duration] );

        res.json(txn.rows[0].duration);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("A server error has been encountered");
    }
});

//get all reviews of a caretaker
app.get("/getreview", async (req, res) => {       
    try {
        console.log(req.query.caretaker_email);
        const searches = await pool.query(`SELECT Users.full_name, owner_review, owner_rating FROM Transactions_Details LEFT JOIN Users ON Transactions_Details.owner_email = Users.email \ 
                                           WHERE caretaker_email ='${req.query.caretaker_email}' AND employment_type='${req.query.employment_type}';`);
        console.log(searches.rows)
        res.json(searches.rows);
    } catch (error) {
        console.log(error.message)
    }
});


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