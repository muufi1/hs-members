import path from 'path';
import util from 'util';
import { default as express } from 'express';
import { default as passport } from 'passport';
import { default as passportLocal } from 'passport-local';
const LocalStrategy = passportLocal.Strategy;
import * as usersModel from '../models/users-superagent.mjs';
import { sessionCookieName } from '../app.mjs';

export const router = express.Router();

import DBG from 'debug';
const debug = DBG('hs-members:router-users');
const error = DBG('hs-members:error-users');

export function initPassport(app) {
    app.use(passport.initialize());
    app.use(passport.session());
}

export function ensureAuthenticated(req, res, next) {
    try {
        // req.user is set by Passport in the deserialize function
        if (req.user) next();
        else res.redirect('/');
    } catch (e) { next(e); }
}

router.get('/login', function(req, res, next) {
    try {
        res.render('login', { title: "Kirjaudu jäsentietopalveluun",
            loginEmail: req.body.email, user: req.user, });
    } catch (e) { next(e); }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/membership', // SUCCESS: go to member info view
    failureRedirect: '/', // FAIL: go to front page
}));

router.get('/logout', function(req, res, next) {
    try {
        req.session.destroy();
        req.logout();
        res.clearCookie(sessionCookieName);
        res.redirect('/');
    } catch (e) { next(e); }
});

passport.use(new LocalStrategy(
    async (email, password, done) => {
        try {
            let check = await usersModel.passwordCheck(email, password);
            if (check) {
                done(null, { id: check.email, username: check.email });
            } else {
                done(null, false, check.message);
            }
        } catch (e) { done(e); }
    }
));

passport.serializeUser(function(user, done) {
    try {
        done(null, user.email);
    } catch (e) { done(e); }
});

passport.deserializeUser(async (email, done) => {
    try {
        let user = await usersModel.find(email);
        done(null, user);
    } catch (e) { done(e); }
});
