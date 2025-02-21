const { body, validationResult } = require("express-validator");
const { Router } = require('express')
const { getMessages, getUserByID, insertMessage } = require('../db/queries')
const { getMessagesArray, getAnonMessages } = require('../helpers/getmessages')
const index = Router()

index.get('/', async (req, res) => {
    if (req.user) {
        let data = null
        await getMessagesArray().then(res => data = res)
        return res.render('index', { user: req.user, messages: data})
    } else {
        let data = null
        await getAnonMessages().then(res => data = res)
        return res.render('index', { user: req.user, messages: data})
    }
})

index.get('/create-message', (req, res) => {
    if (req.user) {
        res.render('message', { user: req.user, error: ""})
    } else {
        res.status(401).render('404', { user: req.user })
    }
})


const validateMessage = [
    body("message").trim()
    .not().isEmpty()
    .withMessage("Post can not be empty!")
]

index.post('/create-message',
    validateMessage,
    async (req, res) => {
        try {
            const errors = validationResult(req).array()
            if (errors.length !== 0) {
                const error = errors[0]
                return res.render('message', { user: res.user, error: error.msg })
            }
            const message = req.body.message
            let date = new Date()
            const user_id = req.user.id
            await insertMessage(message, date, user_id)
            res.redirect('/')
        } catch(err) {
            console.error(err)
        }
})

module.exports = index;