import {ASTree} from './ast/ASTree';


class StoneError extends Error {
    constructor(m: string, t:ASTree = null) {
        super(m + "\t" + t && t.location());
    }    
}