import * as express from 'express';
import { MembersStore as members } from '../app.js';
export const router = express.Router();

// GET home page
router.get('/', async (req, res, next) => {
    // console.log('GET request received')
    try {
        const keylist = await members.keylist();
        // console.log(`keylist ${util.inspect(keylist)}`);
        const keyPromises = keylist.map(key => {
            return members.read(key);
        });
        const memberlist = await Promise.all(keyPromises);
        res.render('index', { title: 'Members', memberlist: memberlist });
    } catch (err) { next(err); }
});
