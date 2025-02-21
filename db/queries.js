const pool = require('./pool')

async function getMessages() {
    const data = await pool.query("SELECT * FROM messages;")
    return data.rows
}

async function getUserByID(id) {
    const data = await pool.query("SELECT * FROM users WHERE id=$1", [id])
    return data.rows[0]
}

async function insertMessage(message, date, user_id) {
    await pool.query(`INSERT INTO messages (message, date, user_id) 
        VALUES ($1, $2, $3)`, [message, date, user_id])
}

async function doesUsernameAlreadyExists(username) {
    const data = await pool.query(`SELECT * FROM users WHERE username=$1`, [username])
    return data.rows.length !== 0
}

module.exports = {
    getMessages,
    getUserByID,
    insertMessage,
    doesUsernameAlreadyExists
}