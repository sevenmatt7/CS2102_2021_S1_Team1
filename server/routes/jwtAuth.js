const pool = require("../db");

const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorize = require("../middleware/authorize");

//register a user
router.post("/register", validInfo, async (req, res) => {
    try {
        //step 1: destructure req.body to get name, email, password, address, profile pic
        let { name, email, password, address, acc_type, emp_type } = req.body;
        let assigned_result;
        let base_price;
        const default_profile_pic = 'https://i.ibb.co/RYdWRxv/default-pic.png';

        //step 2: check if user exists (throw error)
        const user = await pool.query("SELECT * from users WHERE email = $1", [email]);

        if (user.rows.length !== 0) {
            return res.status(401).json("A user with the email is already registered!")
        }

        //step 3: encrypt the user's password using bcrypt
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const encryptedPassword = await bcrypt.hash(password, salt);

        //step 4: enter new user into database
        const newUser = await pool.query(
            "INSERT INTO Users (full_name, email, user_password, profile_pic_address, user_address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, email, encryptedPassword, default_profile_pic, address]);
        
        // This block of code executes when there are no admins registered in the system
        // It will register an admin with email admin@mail.com with password 123
        const check_for_admin = await pool.query("SELECT * FROM PCSAdmins");
        if (!check_for_admin.rows.length) {
            let adminSalt = await bcrypt.genSalt(saltRound);
            let adminPassword = await bcrypt.hash('123', adminSalt);
            pool.query(
                "INSERT INTO Users (full_name, email, user_password, profile_pic_address, user_address) VALUES ('Admin', 'admin@mail.com', $1, $2, ' ') RETURNING *",
                [adminPassword, default_profile_pic]);
            pool.query("INSERT INTO PCSAdmins (admin_email) VALUES ('admin@mail.com')")
        }

        
        //insert user into respective account table
        if (acc_type === "petowner") {
            pool.query("INSERT INTO PetOwners (owner_email) VALUES ($1)", [email])
        } else if (acc_type === "caretaker") {
            pool.query("INSERT INTO Caretakers (caretaker_email, employment_type) VALUES ($1, $2)", [email, emp_type])
            assigned_result = await pool.query("SELECT assign_to_admin($1, $2)", [email, emp_type])
        } else if (acc_type === "both") {
            pool.query("INSERT INTO Caretakers (caretaker_email, employment_type) VALUES ($1, $2)", [email, emp_type])
            pool.query("INSERT INTO PetOwners (owner_email) VALUES ($1)", [email])
            assigned_result = await pool.query("SELECT assign_to_admin($1, $2)", [email, emp_type])
            acc_type = 'caretaker';
        }
        
        
        //insert into offers_services table if is a full-time caretaker (default entire year period)
        const today = new Date();
        const yyyy = today.getFullYear(); //in yyyy format
        const year = yyyy.toString();
        const default_start_date = year + "-01-01";
        const default_end_date = year + "-12-31";
        if (acc_type === 'caretaker' && emp_type === "fulltime") {
            base_price = assigned_result.rows[0]['assign_to_admin'];
            pool.query("INSERT INTO Offers_Services (caretaker_email, employment_type, service_avail_from, service_avail_to, type_pref, daily_price) \
            VALUES ($1, $2, $3, $4, $5, $6)", [email, emp_type, default_start_date, default_end_date, 'dog', base_price])
            pool.query("INSERT INTO Offers_Services (caretaker_email, employment_type, service_avail_from, service_avail_to, type_pref, daily_price) \
            VALUES ($1, $2, $3, $4, $5, $6)", [email, emp_type, default_start_date, default_end_date, 'cat', base_price])
            pool.query("INSERT INTO Offers_Services (caretaker_email, employment_type, service_avail_from, service_avail_to, type_pref, daily_price) \
            VALUES ($1, $2, $3, $4, $5, $6)", [email, emp_type, default_start_date, default_end_date, 'bird', base_price])
            pool.query("INSERT INTO Offers_Services (caretaker_email, employment_type, service_avail_from, service_avail_to, type_pref, daily_price) \
            VALUES ($1, $2, $3, $4, $5, $6)", [email, emp_type, default_start_date, default_end_date, 'rabbit', base_price])
            pool.query("INSERT INTO Offers_Services (caretaker_email, employment_type, service_avail_from, service_avail_to, type_pref, daily_price) \
            VALUES ($1, $2, $3, $4, $5, $6)", [email, emp_type, default_start_date, default_end_date, 'reptile', base_price]) 
        }

        //step 5: generate jwt token
        const jwtToken = jwtGenerator(newUser.rows[0].email, acc_type);
        res.json({ jwtToken, acc_type, emp_type });

    } catch (err) {
        console.error(err.message);
        res.status(406)
        res.json(err.message);
    }
});

//register a pet
router.post("/registerpet", validInfo, async (req, res) => {
    try {
        //step 1: destructure req.body to get details
        const { pet_name, special_req, pet_type, gender } = req.body;

        //get user_email from jwt token
        const jwtToken = req.header("token")
        const user_email = jwt.verify(jwtToken, process.env.jwtSecret).user.email;
        console.log(user_email)

        const newPet = await pool.query(
            "INSERT INTO Owns_Pets (owner_email, pet_name, special_req, pet_type, gender) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [user_email, pet_name, special_req, pet_type, gender]);

        res.json(newPet.rows[0].pet_name);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("A server error has been encountered");
    }
});

//login a user 
router.post("/login", validInfo, async (req, res) => {
    try {
        const {email, password, acc_type} = req.body;
        let user_in_category;
        let emp_type = "";
        const user = await pool.query("SELECT * from users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(401).json("You are not registered!")
        }
        
        if (acc_type === "petowner") {
            user_in_category = await pool.query("SELECT * from PetOwners WHERE owner_email = $1", [email]);
            if (user_in_category.rows.length === 0) {
                return res.status(401).json("You are not registered as a pet owner!")
            } 
        } else if (acc_type === "caretaker") {
            user_in_category = await pool.query("SELECT * from Caretakers WHERE caretaker_email = $1", [email]);
            if (user_in_category.rows.length === 0) {
                return res.status(401).json("You are not registered as a caretaker!")
            } 
            emp_type = user_in_category.rows[0].employment_type;
        } else {
            user_in_category = await pool.query("SELECT * from PCSAdmins WHERE admin_email = $1", [email]); 
            if (user_in_category.length === 0) {
                return res.status(401).json("You are not registered as an admin!")
            } 
        }    
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

        if (!validPassword) {
            return res.status(401).json("Password or email is incorrect")
        }
        const jwtToken = jwtGenerator(user.rows[0].email, acc_type);
        res.json({ jwtToken, acc_type, emp_type });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("A server error has been encountered");
    }
})

router.post("/verify", authorize, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("A server error has been encountered");
    }
})

module.exports = router;