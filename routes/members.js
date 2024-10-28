import { default as express } from 'express';
import { MembersStore as members } from '../models/members-store.js';

export const router = express.Router();

// Add Member
router.get('/add', (req, res, next) => {
    res.render('memberedit', {
        title: "Add a Member",
        docreate: true,
        memberkey: '',
        member: undefined
    });
});

// Save Member (update)
router.post('/save', async (req, res, next) => {
    try {
        let member;
        if (req.body.docreate == "create") {
            member = await members.create(req.body.memberkey,
                req.body.name, req.body.email
            );
        } else {
            member = await members.update(req.body.memberkey,
                req.body.name, req.body.email
            );
        }
        res.redirect('/members/view?key=' + req.body.memberkey);
    } catch (err) { next(err); }
});

// Read Member (read)
router.get('/view', async (req, res, next) => {
    try {
        let member = await members.read(req.query.key);
        res.render('memberview', {
            title: member ? member.name : "",
            memberkey: req.query.key, member: member
        });
    } catch (err) { next(err); }
});

// Edit Member (update)
router.get('/edit', async (req, res, next) => {
    try {
        const member = await members.read(req.query.key);
        res.render('memberedit', {

            title: member ? ("Edit " + member.name) : "Add a Member",
            docreate: false,
            memberkey: req.query.key, member: member
        });
    } catch (err) { next(err); }
});

// Ask to Delete Member (destroy)
router.get('/destroy', async (req, res, next) => {
    try {
        const member = await members.read(req.query.key);
        res.render('memberdestroy', {
            title: member ? member.name : "",
            memberkey: req.query.key, member: member
        });
    } catch (err) { next(err); }
});

// Really Destroy Member (destroy)
router.post('/destroy/confirm', async (req, res, next) => {
    try {
        await members.destroy(req.body.memberkey);
        res.redirect('/');
    } catch (err) { next(err); }
});
