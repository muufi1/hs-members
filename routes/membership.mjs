import { default as express } from 'express';
import { MembersStore as members } from '../models/members-store.mjs';
import { ensureAuthenticated } from './users.mjs';

export const router = express.Router();

// List all memberships with User's email
router.get('/', ensureAuthenticated, async (req, res, next) => {
    try {
        const memberships = await members.readByEmail(req.body.email);

    } catch (err) {next(err); }
})

// Save Member (update)
router.post('/save', ensureAuthenticated, async (req, res, next) => {
    try {
        let member;
        member = await members.update(req.body.memberkey,
            req.body.name, req.body.email
        );
        // }
        res.redirect('/members/view?key=' + req.body.memberkey);
    } catch (err) { next(err); }
});

// Read Member (read)
router.get('/view', ensureAuthenticated, async (req, res, next) => {
    try {
        let member = await members.readByUsername(req.query.key);
        res.render('memberview', {
            title: member ? member.callingname : "",
            memberkey: req.query.key,
            user: req.user,
            member: member
        });
    } catch (err) { next(err); }
});

// Edit Member (update)
router.get('/edit', ensureAuthenticated, async (req, res, next) => {
    try {
        const member = await members.readByUsername(req.query.key);
        res.render('memberedit', {

            title: member ? ("Edit " + member.callingnamename) : "Add a Member",
            docreate: false,
            memberkey: req.query.key, 
            user: req.user,
            member: member
        });
    } catch (err) { next(err); }
});
