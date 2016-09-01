import {ASTLeaf} from './ASTLeaf';
import {ASTList} from './ASTList';

export class StringLiteral extends ASTLeaf {
    get value() {
        return this.token.text;
    }
}