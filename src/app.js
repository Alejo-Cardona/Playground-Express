import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import { engine } from "express-handlebars"
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

import __dirname from './utils.js'

import routerProducts from "./routes/products.router.js";
import routerSessions from "./routes/sessions.router.js";
import routerViews from "./routes/views.router.js";
import bodyParser from "body-parser";

//const express = require('express')
const app = express()
const port = 8080

// Session
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb://127.0.0.1:27017/test",
        mongoOptions:{useNewUrlParser:true, useUnifiedTopology:true},
        ttl: 1800
    }),
    secret:"Code2324",
    resave:true,
    saveUninitialized:true
}))

app.get('/', (req, res) => {
    res.redirect("/home")
})

// -- Middlewares --
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static( __dirname + '/public'))

// Handlebars
app.engine('handlebars', engine());
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.set('view options', { layout: 'main' });

// Routers
app.use("/api/products", routerProducts)
app.use("/api/sessions", routerSessions)
app.use("", routerViews)

// Cookie Parser
//app.use(cookieParser());
app.use(cookieParser());

// Conexion con la DB
mongoose.connect("mongodb://127.0.0.1:27017/test")
.then(() => console.log('Conexión exitosa a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// RULES
//create cookie
app.get('/getCookie', (req, res) => {
    console.log(req.signedCookies.MyCookie)
    res.send("OK")
})

//set cookie
app.post('/setCookie', (req, res) => {

    // levanto info
    let email = req.body.email
    let username = req.body.username

    let cookieValue = {
        [username]: email 
    }

    res.cookie("MyCookie", JSON.stringify(cookieValue),{maxAge:10000, signed:true}).send("OK")
})

// delete cookie
app.get('/deleteCookie', (req, res) => {
    res.clearCookie("MyCookie").send("OK")
})

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`)
})