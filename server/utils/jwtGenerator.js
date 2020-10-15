const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_email, acc_type) {
    const payload = {
        user: {
            email: user_email,
            acc_type: acc_type
        }
    };

    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "1h"})
}

module.exports = jwtGenerator;