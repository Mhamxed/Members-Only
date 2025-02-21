const { getUserByID, getMessages } = require('../db/queries')
const timeAgo = require('../helpers/timeago')
const anon = require('../helpers/anonuser')

async function getMessagesArray() {
    let res = []
    const messages = await getMessages()
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i]
        const message_ = message.message
        const date = timeAgo(message.date)
        const user = await getUserByID(message.user_id)
        const msg = { 
            message: message_, 
            date: date, 
            fullname: user.fullname, 
            username: user.username
        }
        res.push(msg)
    }
    return res.reverse()
}

async function getAnonMessages() {
    let res = []
    const messages = await getMessages()
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i]
        const message_ = message.message
        const date = timeAgo(message.date)
        const user = await getUserByID(message.user_id)
        const fullname = await anon(user.fullname)
        const username = await anon(user.username)
        const msg = { 
            message: message_, 
            date: date, 
            fullname: fullname, 
            username: username
        }
        res.push(msg)
    }
    return res.reverse()
}

module.exports = {
    getMessagesArray,
    getAnonMessages
}


