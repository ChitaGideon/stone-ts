import {ASTList} from './ASTList';
import {ASTree} from './ASTree';

export class WhileStmnt extends ASTList{
    condition():ASTree{
        return this.child(0);
    }
    body():ASTree{
        return this.child(1);
    }
    toString():string{
        return "(while " + this.condition() + " " + this.body() + ")";
    }
}