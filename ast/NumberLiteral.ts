import {Token} from "../token"
import {ASTLeaf} from "./ASTLeaf"

/**
 * NumberLiteral
 */
export class NumberLiteral extends ASTLeaf {
    constructor(t:Token) {
        super(t);
    }
    get value(){
        return this.token.text;
    }
}