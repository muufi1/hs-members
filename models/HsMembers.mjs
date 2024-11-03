const _member_username = Symbol('username');
const _member_callingname = Symbol('callingname');
const _member_email = Symbol('email');

export class Member {
    constructor(username, name, email) {
        this[_member_username] = username;
        this[_member_callingname] = name;
        this[_member_email] = email;
    }
    
    get username() { return this[_member_username]; }
    get callingname() { return this[_member_callingname]; }
    set callingname(newName) { this[_member_callingname] = newName; }
    get email() { return this[_member_email]; }
    set email(newEmail) { this[_member_email] = newEmail; }
}

export class AbstractMembersStore {
    // async close() { }
    async update(username, name, email) { }
    // async create(key, name, email) { }
    async readByKey(key, value) { }
    async readByUsername(value) { }
    async readByEmail(value) { }
    // async destroy(key) { }
    // async keylist() { }
    // async count() { } 
}
