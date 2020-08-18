const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "test123",
    host: "localhost",
    post: 5432,
    database: "sampleapp"
});

module.exports = pool;