import * as dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import passport from "passport";
import { Database } from "./db/Database";
import { setupPassport } from "./passport-setup";

const app = express();
const port = 8080;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
}))

// define a route handler for the default home page
app.get( "/", (_, res) => {
    res.write("Hello!");
    res.end()
});


const isLoggedIn = (req: any, res: any, next: any) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Example protected and unprotected routes
app.get('/', (_, res) => res.send('Example Home page!'))

app.get('/failed', (_, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome mr ${req.user}!`))

// Auth Routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  (_, res) => {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

// start the express server
app.listen(port, async () => {
    const db = new Database();
    await db.init();

    // Add google auth credentials
    await setupPassport()

    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
});