import {Token} from "../token"

export class ASTList extends ASTree{
    protected _children:ASTree[];
    constructor(list:ASTree[]){
        super();
        this._children = list;
    }
    child(i:number):ASTree{
        return this._children[0];
    }
    numChildren():number{
        return this._children.length;
    }
    children():ASTree[]{
        return this._children;
    }
    location():string{
        for (var index = 0; index < this._children.length; index++) {
            var element = this._children[index];
            var str:string = element.location();
            if(str){
                return str;
            }
        }
    }

}