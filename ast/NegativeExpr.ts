import {ASTList} from './ASTList';

export class NegativeExpr extends ASTList{
    operand(){
        return this.child(0);
    }
    toString(){
        return "-"+this.operand();
    }
}