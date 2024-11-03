import util from 'util';
import { default as pool } from '../dbconn.mjs';
import { Member, AbstractMembersStore } from './HsMembers.mjs';
import { default as DBG } from 'debug';
const debug = DBG('members:members-mariadb');
const error = DBG('members:error-mariadb');
import dotenv from 'dotenv';
dotenv.config();

export default class MariaDBMembersStore extends AbstractMembersStore {

    async update(username, name, email) {
        try {
            const db = await pool.getConnection();
            const member = new Member(username, name, email);
            await db.query(
                `update ${process.env.DB_TABLE} set callingname = ?, email = ? where username = ?`,
                [name, email.trim(), username]
            );
            db.close();
            return member;
        } catch (err) {
            console.error("Error in transaction: ", err);
        }
    }
    
    async readByKey(key, value) {
        try {
            const db = await pool.getConnection();
            const rows = await db.query(
                `select username, callingname, email from ${process.env.DB_TABLE} where ${key} = ?`,
                [value]
            );
            const memberlist = [];
            rows.forEach(row => {
                memberlist.push(new Member(row.username, row.callingname, row.email));
            });
            db.close();
            return memberlist;
        } catch (err) {
            console.error("Error in transaction: ", err);
        }
    }

    async readByEmail(value) {
        return this.readByKey('email', value);
    }
    
    async readByUsername(value) {
        try {
            const db = await pool.getConnection();
            const rows = await db.query(
                `select username, callingname, email from ${process.env.DB_TABLE} where username = ?`,
                [value]
            );
            const member = new Member(rows[0].username, rows[0].callingname, rows[0].email);
            db.close();
            return member;
        } catch (err) {
            console.error("Error in transaction: ", err);
        }
    }
}
