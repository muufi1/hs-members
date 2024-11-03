import { default as request } from 'superagent';
import util from 'util';
import url from 'url';
const URL = url.URL;
import DBG from 'debug';
const debug = DBG('hs-members:users-superagent');
const error = DBG('hs-members:error-superagent');

let authid = 'them';
var authcode = 'd4ed43c0-8bd6-4fe2-b358-7c0e230d11ef'; 

function reqURL(path) {
    const requrl = new URL(process.env.USER_SERVICE_URL);
    requrl.pathname = path;
    return requrl.toString();
}

export async function refresh(email) {
    let res = await request 
        .post(reqURL(`/refresh-password`))
        .send({ email: email })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .auth(authid, authcode);
        // .end(err, res => {})
    return res.body;
}

export async function find(email) {
    let res = await request
        .get(reqURL(`/find/${email}`))
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .auth(authid, authcode);
    return res.body;
}

export async function passwordCheck(email, password) {
    let res = await request
        .post(reqURL(`/password-check`))
        .send({ email, password })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .auth(authid, authcode);
    return res.body;
}

export async function revoke(email) {
    let res = await request
        .post(reqURL(`/revoke-password`))
        .send({ email })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .auth(authid, authcode);
    return res.body;
}
