import { Member, AbstractMembersStore } from "./Members.js";

const members = [];

export class InMemoryMembersStore extends AbstractMembersStore {

    async close() {
        
    }
    
    async update(key, name, email) {
        members[key] = new Member(key, name, email);
        return members[key];
    }
    
    async create(key, name, email) {
        members[key] = new Member(key, name, email);
        return members[key];
    }
    
    async read(key) {
        if (members[key]) return members[key];
        else throw new Error(`Member ${key} does not exist`);
    }
    
    async destroy(key) {
        if (members[key]) {
            delete members[key];
        } else throw new Error(`Member ${key} does not exist`);
    }
    
    async keylist() {
        return Object.keys(members);
    }
    
    async count() {
        return members.length;
    }
}
