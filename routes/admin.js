const pool = require("../db");

const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorize = require("../middleware/authorize");

//get all caretaker searches
router.get("/caretakers", async (req, res) => {
    try {
        // get user_email from jwt token
        const jwtToken = req.header("token")
        const admin_email = jwt.verify(jwtToken, process.env.jwtSecret).user.email;
        const searches = await pool.query("SELECT DISTINCT full_name, avg_rating, Caretakers.caretaker_email, employment_type, base_price \
                                            FROM Manages LEFT JOIN Users ON Manages.caretaker_email = Users.email \
                                            LEFT JOIN Caretakers ON users.email = Caretakers.caretaker_email \
                                            WHERE admin_email = $1", [admin_email]
                                            );
        res.json(searches.rows);
    } catch (error) {
        console.log(error.message)
    }
});

// admin to change base price for caretakers under his management
router.put("/changeprice", async (req, res) => {
    try {
        const { baseprice } = req.body;

        const jwtToken = req.header("token")
        const admin_email = jwt.verify(jwtToken, process.env.jwtSecret).user.email;

        const data = await pool.query(
            "UPDATE Manages SET base_price = $1\
            WHERE admin_email = $2 RETURNING *" ,
            [baseprice, admin_email]);
        
        

        res.json(data.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("A server error has been encountered");
    }
});


module.exports = router;