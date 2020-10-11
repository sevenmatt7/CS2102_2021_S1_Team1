const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authorize");

router.get("/", authorize, async (req, res) => {
    try {
        //req.user has the payload from the authorize middleware
        const user = await pool.query("SELECT full_name FROM users WHERE email = $1", [req.user.email]);
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("There is a problem with the server");
    }
})


module.exports = router;
