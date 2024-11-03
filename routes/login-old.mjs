import { default as express } from 'express';
import { MembersStore as members } from '../models/members-store.mjs';
import { sendLoginkey } from '../mailer/mailer.mjs';
import { testRecipient } from '../mailer/mailer-opts.mjs';
import session from 'express-session';

export const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        let email = req.body.email;
        const foundRows = await members.readByEmail(email);
        console.log(foundRows);
        console.log(`osumia: ${foundRows.length}`);
        const success = (foundRows.length > 0) ? true : false;
        if (success) {
            req.session.loginEmail = email;
            req.session.passwd = "1361"; // generate random digits
            req.session.touch(); // refresh expiration 
            sendLoginkey(req.session.passwd, testRecipient);
        }
        res.render('login', {
            loginEmail: email,
            loginAllowed: success
        })
    } catch (err) { next(err); }
});
