const _member_key = Symbol('key');
const _member_name = Symbol('name');
const _member_email = Symbol('email');

export class Member {
    constructor(key, name, email) {
        this[_member_key] = key;
        this[_member_name] = name;
        this[_member_email] = email;
    }
    
    get key() { return this[_member_key]; }
    get name() { return this[_member_name]; }
    set name(newName) { this[_member_name] = newName; }
    get email() { return this[_member_email]; }
    set email(newEmail) { this[_member_email] = newEmail; }
}

export class AbstractMembersStore {
    async close() { }
    async update(key, name, email) { }
    async create(key, name, email) { }
    async read(key) { }
    async destroy(key) { }
    async keylist() { }
    async count() { } 
}
