import * as express from 'express';
import { MembersStore as members } from '../models/members-store.mjs';
import { find, refresh } from '../models/users-superagent.mjs';
export const router = express.Router();

// GET home page
router.get('/', async (req, res, next) => {
    // console.log('GET request received')
    try {
        // const keylist = await members.keylist();
        // console.log(`keylist ${util.inspect(keylist)}`);
        // const keyPromises = keylist.map(key => {
        //     return members.read(key);
        // });
        // const memberlist = await Promise.all(keyPromises);
        res.render('index', { title: 'Jäsentietopalvelu – Harmaasudet ry',
            user: req.user ? req.user : undefined
         });
    } catch (err) { next(err); }
});

router.post('/permission', async (req, res, next) => {
    try {
        console.log(req.body);
        const user = await find(req.body.email);
        if (user) {
            const updated = await refresh(user.email);
        }
        console.log(user);
        res.render('login', {
            title: 'Jäsentietopalvelu – Harmaasudet ry',
            loginAllowed: user ? true : false,
            loginEmail: user.email || undefined
        });
    } catch (err) { next(err); }
});
