import { default as DBG } from 'debug';
const debug = DBG('hs-members:members-store');
const error = DBG('hs-members:error-store');

let _MembersStore;

export async function useModel(model) {
    try {
        let MembersStoreModule = await import(`./members-${model}.js`);
        let MembersStoreClass = MembersStoreModule.default;
        _MembersStore = new MembersStoreClass();
        return _MembersStore;
    } catch (err) {
        throw new Error(`No recognized MembersStore in ${model} because ${err}`);
    }
}

export { _MembersStore as MembersStore };
