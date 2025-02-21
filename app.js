const express = require('express')
const session = require("express-session");
const passport = require("passport");
const { Pool } = require('pg');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
require("dotenv").config({ path: "./.env" })

const index = require('./routes/index')
const signup = require('./routes/signup');

const app = express()
const PORT = process.env.PORT
require('dotenv').config({ path: '../.env' })

const pool = new Pool({
    connectionString: `postgresql://mhamed:${process.env.PASSWORD}@localhost:5432/members`
})

app.use(session({
    store: new (require('connect-pg-simple')(session))({
        pool: pool,
        tableName: "session", // Use the manually created table
    }),
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 } // 14 days
}));
app.use(passport.session());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs");
app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/style.css')
})

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
        const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = rows[0];

        if (!user) {
            return done(null, false, { usernameErr: "Invalid username", passwordErr: "" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
        // passwords do not match!
            return done(null, false, { passwordErr: "Invalid password", usernameErr: "" })
        }
       
            return done(null, user);
        } catch(err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = rows[0];

        done(null, user);
    } catch(err) {
        done(err);
    }
});

app.get("/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
});


//login route
app.get("/login", (req, res) => {
    res.render('login', { 
        user: req.user,
        usernameErr: "",
        passwordErr: ""
    })
})

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.render("login", { 
                user: req.user, 
                usernameErr: info.usernameErr,
                passwordErr: info.passwordErr
            });
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect("/");
        });
    })(req, res, next);
});

app.use('/', index)
app.use('/signup', signup)

app.get('*', (req, res) => {
    res.status(404).render("404", { user: req.user })
})

app.listen(PORT, console.log(`app is listening on port: ${PORT}`))
