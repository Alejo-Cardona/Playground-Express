import express from 'express'
import userDAO from '../daos/user.dao.js';
import userSchema from '../models/user.schema.js';
import session from "express-session";

import { isValidPassword, createHash } from '../utils/crypt.js';
import passport from 'passport'
import authenticate from 'passport'

const router = express.Router()

// Register
router.post('/register', passport.authenticate('register',{failureRedirect:'/failregister'}) ,async (req, res) => {
    res.render('index')
})

// Login
router.post('/login', async (req, res) => {
    if(!req.user) return req.status(400).send({status:"error", error:"invalid credentials"})
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }
    res.render('index')
})

// Github
router.get('/github', passport.authenticate('github',{scope:['user:email']}), async(req, res) => {})
router.get('githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), async(req, res) => {
    req.session.user = req.user
    res.redirect('/')
})




router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            res.status(500).send('Error interno del servidor');
        } else {
            res.redirect('/login'); // Redirige a la página de inicio de sesión u otra página deseada
        }
    });
})

export default router