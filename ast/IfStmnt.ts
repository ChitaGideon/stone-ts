import {ASTList} from './ASTList';


export class IfStmnt extends ASTList {
    condition(){
        return this.child(0);
    }
    thenBlock(){
        return this.child(1);
    }
    elseBlock(){
        return this.numChildren()>2?this.child(2):null;
    }
    toString(){
        return "(if " + this.condition() + " " + this.thenBlock() +  " else " + this.elseBlock() + ")";
    }

}