import {ASTree} from './ASTree';
import {Token} from "../token"

export class ASTLeaf extends ASTree{
    private static empty:ASTree[] = [];
    protected _token:Token;
    constructor(t:Token){
        super();
        this._token = t;
    }
    child(i:number):ASTree{
        throw new Error("haha ~");

    }
    numChildren():number{
        return 0;
    }
    children():ASTree[]{
        return ASTLeaf.empty;
    }
    location():string{
        return "at line "+this.token.lineNumber;
    }
    get token():Token{
        return this._token;
    }
    toString(){
        return this.token.text;
    }

}