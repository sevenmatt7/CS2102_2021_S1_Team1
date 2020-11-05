const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authorize");
const jwt = require("jsonwebtoken");

router.get("/", authorize, async (req, res) => {
    try {
        //req.user has the payload from the authorize middleware
        const user = await pool.query("SELECT * FROM Users WHERE email = $1 RETURNING *", [req.user.email]);
        console.log(user)
        res.json(user.rows[0]);
    } catch (err) {
        res.status(500).json("There is a problem with the server");
    }
});

//edit selected user details
router.put("/edituser", async (req, res) => {
    try {
        const { full_name, user_address, profile_pic_address, user_area } = req.body;
        const jwtToken = req.header("token")
        const user_email = jwt.verify(jwtToken, process.env.jwtSecret).user.email;

        const editedUser = await pool.query(
            "UPDATE Users SET (full_name, user_address, profile_pic_address, user_area) = ($1, $2, $3, $4) \
            WHERE email = $5 RETURNING *" ,
            [full_name, user_address, profile_pic_address, user_area, user_email]);

        res.json(editedUser.rows);
    } catch (err) {
        console.log(err.message);
    }
});

module.exports = router;