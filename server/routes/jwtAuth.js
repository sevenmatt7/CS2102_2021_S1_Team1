const pool = require("../db");

const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");

//register a user
router.post("/register", async (req, res) => {
    try {
        //step 1: destructure req.body to get name, email, password, address, profile pic
        const { name, email, password, profile_pic, address} = req.body;

        //step 2: check if user exists (throw error)
        const user = await pool.query("SELECT * from users WHERE email = $1", [email]);
        
        if (user.rows.length !== 0) {
            return res.status(401).send("A user with the email is already registered!")
        }

        //step 3: encrypt the user's password using bcrypt
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const encryptedPassword = await bcrypt.hash(password, salt);

        //step 4: enter new user into database
        const newUser = await pool.query(
            "INSERT INTO Users (full_name, email, user_password, profile_pic_address, user_address) VALUES ($1, $2, $3, $4, $5) RETURNING *" , 
            [name, email, encryptedPassword, profile_pic, address] );
        
        //step 5: generate jwt token
        const jwtToken = jwtGenerator(newUser.rows[0].user_id);
        res.json({jwtToken});

    } catch (err) {
        console.error(err.message);
        res.status(500).send("A server error has been encountered");
    }
});

module.exports = router;