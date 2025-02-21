const { Router } = require('express')
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs')
const pool = require('../db/pool')
const { doesUsernameAlreadyExists } = require('../db/queries')
const findError = require('../helpers/finderror')
const signup = Router()

signup.get("/", (req, res) => {
    res.render('signup', { 
        user: req.user, 
        fullnameErr: "", 
        usernameErr: "",
        passwordErr: ""
    })
})

const validateUser = [
    body("fullname").trim()
        .not().isEmpty()
        .withMessage("Please fill in you full name"),
    body("username").trim()
        .not().isEmpty()
        .withMessage("Please input you username"),
    body("password")
        .not().isEmpty()
        .withMessage("password can not empty")
]

signup.post("/", 
    validateUser,
    async (req, res, next) => {
    try {
        const errors = validationResult(req).array()
        const usernameAlreadyExists = await doesUsernameAlreadyExists(req.body.username)
        if (errors.length !== 0) {
            const fullnameErr = await findError(errors, "fullname")
            const usernameErr = await findError(errors, "username")
            const passwordErr = await findError(errors, "password")
            return res.render('signup', {
                user: req.user,
                fullnameErr: fullnameErr.msg,
                usernameErr: usernameErr.msg,
                passwordErr: passwordErr.msg
            })
        } else if (usernameAlreadyExists) {
            return res.render('signup', {
                user: req.user,
                fullnameErr: "",
                usernameErr: `${req.body.username} is already taken`,
                passwordErr: ""
            })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await pool.query("INSERT INTO users (fullname, username, password) VALUES ($1, $2, $3)", 
            [req.body.fullname, req.body.username, hashedPassword]);
        res.redirect("/");
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = signup;