import passport from "passport";
import local  from "passport-local";
import userSchema from "../models/user.schema.js";
import { createHash, isValidPassword } from "./crypt.js";
import GitHubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy;

const initializePassport = () =>{
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'}, async (req,username,password,done) => {
            const {first_name, last_name, email, age} = req.body;
            try{
                let user = await userSchema.findOne({email:username})
                if(user) {
                    console.log("Ese correo electronico ya esta registrado")
                    return done(null, false)
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                let result = await userSchema.create(newUser)
                return done(null, result)
            } catch(error) {
                return done("Error al obtener el usuario: "+ error)
            }
        }
    ))

    passport.use('login', new LocalStrategy({usernameField:'email'}, async(username, password, done) => {
        try {
            const user = await userSchema.findOne({eamil:username})
            if (!user) {
                console.log("El usuario no existe")
                return done (null, false)
            }
            if(!isValidPassword(user, password)) return done(null, fasle);
            return done(null,user);
        }catch(error) {
            return done(error)
        }
    }))

    // GITHUB STRATEGY
    passport.use('github', new GitHubStrategy({
        clientID: 'a2d4cd0361e6c0ae7bbf',
        clientSecret: 'edf54f8bc7434ee218698a6d86388085ee277e3c',
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            let user = await userSchema.findOne({email:profile._json.email})
            if(!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email:profile._json.email,
                    age: 0,
                    password: ''
                }
                let result = await userSchema.create(newUser)
                done(null, result)
            } else {
                done(null, user)
            }
        } catch(error) {
            return done(error)
        }

        User.findOrCreate({ githubId: profile.id }, function (err, user) {
            return done(err, user);
        });
        }
    ));

    passport.serializeUser((user, done) =>{
        done(null, user._id);
    });

    passport.deserializeUser( async(id, done) => {
        let user = await userSchema.findById(id);
        done(null, user);
    })

}

export default initializePassport
