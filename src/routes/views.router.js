import express from 'express'
import userDAO from '../daos/user.dao.js'
import productDAO from '../daos/product.dao.js'

const router = express.Router()

// Authenticate
async function authenticateUser(req, res, next) {
    if (req.session.user) {
        // El usuario está autenticado, pasa al siguiente middleware o ruta
        next();
    } else {
        // El usuario no está autenticado, redirige a la página de inicio de sesión
        res.redirect("/login");
    }
}

// Middleware Login Active
function publicRoutes(req, res, next) {
    if (req.session.user) {
        res.redirect("/profile");
    } else {
        next();
    }
}

// Home
router.get('/home', async (req, res) => {
    try {
        const products = await productDAO.getLimit(4)
        res.render('home', {
            products: products
        })
    } catch(error) {
        console.log("-- OCURRIO UN ERROR --" + error);
        res.status(500).send({
            status: "error",
            message: "Ha ocurrido un error al obtener los productos."
        });
    }
})

router.get('/register', publicRoutes, (req, res) => {
    res.render('register', {style: "form.css"})
})

router.get('/failregister', async (req, res) => {
    console.log("Failed Register")
    res.send({error:"Failed"})
})

router.get('/login', publicRoutes, (req, res) => {
    res.render('login', {style: "form.css"})
})

router.get('/faillogin', (req, res) => {
    res.send({error:"Failed Login"})
})

router.get('/profile', authenticateUser, async (req, res) => {
    let userData = req.session.user
    
    res.render('profile', {
        first_name: userData.first_name,
        email: userData.email,
        age: userData.age,
        admin: userData.admin
    });
})

export default router