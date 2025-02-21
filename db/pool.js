const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' })

const pool = new Pool({
    connectionString: `postgresql://mhamed:${process.env.PASSWORD}@localhost:5432/members`
})

module.exports = pool;