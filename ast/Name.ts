import {Token} from "../token"
import {ASTLeaf} from "./ASTLeaf"
/**
 * Name
 */
class Name extends ASTLeaf{
    constructor(t:Token) {
        super(t);
    }
    get name():string{
        return this.token.text;
    }
}