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

// router.delete("/delete", async (req, res) => {
//     try {
//         const jwtToken = req.header("token");
//         const user_email = jwt.verify(jwtToken, process.env.jwtSecret).user.email;
//         const acc_type = req.header("acc_type");
        
//         let deleteUser;
//         if (acc_type === "petowner") {
//             deleteUser = await pool.query(
//                 "DELETE FROM Users \
//                 WHERE email = $1 \
//                 AND pet_name = $2 \
//                 AND \
//                 (SELECT 1 FROM Transactions_Details \
//                 WHERE (owner_email = $1 AND (t_status = 1 OR t_status = 3)) \
//                 IS NULL \
//                 ",
//                 [user_email]
//             );
//         } else if (acc_type === "caretaker") {
//             deleteUser = await pool.query(
//                 "DELETE FROM Users \
//                 WHERE email = $1 \
//                 AND pet_name = $2 \
//                 AND \
//                 (SELECT 1 FROM Transactions_Details \
//                 WHERE (caretaker_email = $1 AND (t_status = 1 OR t_status = 3)) \
//                 IS NULL \
//                 ",
//                 [user_email]
//             );
//         }

//         res.json("Deleted item!");
//     } catch (err) {
//         console.log(err.message);
//         res.json(err.message);
//     }
// });
module.exports = router;