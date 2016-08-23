import {ASTLeaf} from './ASTLeaf';
import {ASTList} from './ASTList';


class VarStmnt extends ASTList {
    name(){
        return (<ASTLeaf>this.child(0)).token.text;
    }
    type(){
        return this.child(1);
    }
    initializer(){
        return this.child(2);
    }
    toString(){
        return "(var " + this.name() + " " + this.type() + " " + this.initializer() + ")";
    }
}