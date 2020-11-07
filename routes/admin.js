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
        const emp_type = req.query.employment_type;
        let query = "SELECT DISTINCT full_name, avg_rating, Caretakers.caretaker_email, employment_type, base_price \
                    FROM Manages LEFT JOIN Users ON Manages.caretaker_email = Users.email \
                    LEFT JOIN Caretakers ON users.email = Caretakers.caretaker_email \
                    WHERE admin_email = $1";
        if (emp_type === 'fulltime') {
            query += "AND employment_type = 'fulltime'"
        } else if (emp_type === 'parttime') {
            query += "AND employment_type = 'parttime'"
        }
        const searches = await pool.query(query, [admin_email]);
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

// admin to get statistics for site
router.get("/stats", async (req, res) => {
    try {
        const jwtToken = req.header("token")
        const caretakers = await pool.query("SELECT COUNT(*), employment_type FROM Caretakers GROUP BY employment_type");
        const owners = await pool.query("SELECT q4.pet_type, q4.count, q3.sum \
                                            FROM (SELECT COUNT(DISTINCT p.owner_email) AS sum FROM petowners p) AS q3, \
                                                (SELECT c.pet_type AS pet_type, COUNT(q1.pet_type) AS COUNT \
                                                    FROM Categories C, \
                                                        (SELECT owner_email, pet_type FROM Owns_Pets GROUP BY owner_email, pet_type) AS q1 \
                                                    WHERE c.pet_type = q1.pet_type \
                                                    GROUP BY c.pet_type, q1.pet_type) AS q4;")
        const petownerDistribution = await pool.query("SELECT user_area, COUNT(*) \
                                                        FROM users INNER JOIN petowners ON users.email = petowners.owner_email \
                                                        GROUP BY user_area;")
        const caretakerDistribution = await pool.query("SELECT user_area, COUNT(*) \
                                                        FROM users INNER JOIN caretakers ON users.email = caretakers.caretaker_email \
                                                        GROUP BY user_area;")
        res.json({ caretaker: caretakers.rows, owner: owners.rows, petownerDistribution: petownerDistribution.rows, caretakerDistribution: caretakerDistribution.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("A server error has been encountered");
    }
});


module.exports = router;