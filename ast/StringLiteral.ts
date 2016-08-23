import {ASTLeaf} from './ASTLeaf';
import {ASTList} from './ASTList';

export class StringLiteral extends ASTLeaf {
    value(){
        return this.token.text;
    }
}