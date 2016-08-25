import {ASTList} from './ASTList';
import {ASTLeaf} from './ASTLeaf';
import {ASTree} from './ASTree';

/**
 * BinaryExpr
 */
export class BinaryExpr extends ASTList{
    constructor(c:ASTree[]) {
        super(c);
    }
    left(){
        return this.child(0);
    }
    right(){
        return this.child(2);
    }
    operator(){
        return (this.child(1) as ASTLeaf).token.text;
    }
}