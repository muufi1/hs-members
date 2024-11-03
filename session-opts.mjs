// import { generateKey } from 'node:crypto';
// let secretKey;
// generateKey('hmac', { length: 256 }, (err, key) => {
//     if (err) throw err;
//     console.log(key.export().toString('hex'));
// })

import dotenv from "dotenv";
dotenv.config();

export default {
    resave: false,
    cookie: {
        maxAge: 1800000, // 30min
        secure: true // require https
    },
    saveUninitialized: false,
    secret: process.env.SECRET_KEY,
    store: sessionStore
}
