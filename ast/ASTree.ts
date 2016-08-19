abstract class ASTree {
    abstract child(i:number):ASTree;
    abstract numChildren(i:number):number;
    abstract children():ASTree[]
    abstract location():string
}