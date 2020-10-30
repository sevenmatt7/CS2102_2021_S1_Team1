const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authorize");

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

module.exports = router;