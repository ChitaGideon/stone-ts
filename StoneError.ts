import {ASTree} from './ast/ASTree';


export class StoneError extends Error {
    constructor(m: string, t?:ASTree) {
        super(m + "\t" + (t && t.location()));
    }    
}