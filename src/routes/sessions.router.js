import express from 'express'
import userDAO from '../daos/user.dao.js';
import userSchema from '../models/user.schema.js';
import session from "express-session";

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
    // Get Info
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let age = req.body.age;
    let password = req.body.password;
    //let password2 = req.body.password2

    if (!first_name || !last_name || !email || !age || !password) {
        res.redirect("/register")
    }

    let email_used = await userDAO.getUserByEmail(email);

    if (email_used) {
        res.redirect("/register")
    } else {
        await userDAO.insert(first_name, last_name, age, email, password)
        res.redirect("/login")
    }
})

router.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        res.redirect('/login')
    } 

    let user = await userDAO.getUserByCreds(email, password);

    if(!user){
        res.redirect("/login");
    } else {
        req.session.user = user
        console.log(`iniciaste sesión exitosamente ${user.first_name}`)
        res.redirect("/profile")
    }
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