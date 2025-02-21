const { Client } = require('pg')
require('dotenv').config({ path: '../.env' })

const client = new Client({
    host: process.env.HOST,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
})

const users = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        fullname VARCHAR ( 255 ),
        username VARCHAR ( 255 ),
        password TEXT
    );
`

const messages = `
    CREATE TABLE IF NOT EXISTS messages (   
        message TEXT,
        date DATE NOT NULL,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
`

const session = `
    CREATE TABLE IF NOT EXISTS session (
    sid VARCHAR(255) PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMPTZ NOT NULL
);
`

async function populatedb() {
    try {
        await client.connect()
        await client.query(users)
        await client.query(messages)
        await client.query(session)
        await client.end()
    } catch (err) {
        console.error(err)
    }
}

populatedb()