export abstract class ASTree {
    abstract child(i:number):ASTree;
    abstract numChildren():number;
    abstract children():ASTree[]
    abstract location():string
    toString(){
        if(this.numChildren())
        {
            if(this.numChildren() !=1){
                return "( "+this.children().map(item=>item.toString()).join(" ")+" )"
            }
            return this.children().map(item=>item.toString()).join(" ")
        }
        return  "";
    }
}