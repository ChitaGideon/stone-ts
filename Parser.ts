import {Token} from './Token';
import {ASTList} from './ast/ASTList';
import {ASTLeaf} from "./ast/ASTLeaf"
import {Lexer} from './Lexer';
import {ParseError} from './ParseError';

class Parser {
    static factoryName:string = "create";
    protected elements:Element[];
    private type:new (list:ASTree[])=>ASTree;

	constructor(clazz:new (list:ASTree[])=>ASTree,elements?:Element[]) {
        this.type = clazz;
        this.elements = elements;
	}
    reset(clazz:new (list:ASTree[])=>ASTree){
        this.elements = [];
        this.type = clazz;
    }
    number(clazz?:new ()=>ASTLeaf){
        this.elements.push(new NumToken(clazz))
        return this;
    }
    

    parse(lexer:Lexer):ASTree{
        var res:ASTree[] = [];
        for (var element of this.elements) {
            element.parse(lexer,res);
        }
        return new this.type(res);
    }
    match(lexer:Lexer):boolean{
        if(this.elements.length==0){
            return true;
        }else{
            return this.elements[0].match(lexer);
        }
    }
}
abstract class Element {
    abstract parse(lexer: Lexer, res: ASTree[]);
    abstract match(lexer: Lexer):boolean;
}
class Tree extends Element{
    protected parser:Parser;
    constructor(p:Parser){
        super();
        this.parser = p;
    }
    parse(lexer:Lexer,res:ASTree[]){
        res.push(this.parser.parse(lexer));
    }
    match(lexer:Lexer){
        return this.parser.match(lexer);

    }
}
class OrTree extends Element{
    protected parsers:Parser[];
    constructor(p:Parser[]){
        super();
        this.parsers = p;
    }
    choose(lexer:Lexer):Parser{
        this.parsers.forEach(element => {
            if(element.match(lexer)){
                return element;
            }
        });
        return null;
    }
    parse(lexer:Lexer,res:ASTree[]){
        var p : Parser = this.choose(lexer);
        if(p)
            return res.push(p.parse(lexer))
        else 
            throw new ParseError(lexer.peek(0));
    }
    match(lexer:Lexer){
        return this.choose(lexer)!=null;
    }
}
class Repeat extends Element {
    protected parser:Parser;
    protected onlyOnce:boolean;
    constructor(p:Parser,onlyOnce:boolean){
        super();
        this.parser=p;
        this.onlyOnce = onlyOnce;
    }
    parse(lexer:Lexer,res:ASTree[]){
        while(this.parser.match(lexer)){
            var t:ASTree = this.parser.parse(lexer)
            if(t instanceof ASTList || (<ASTList>t).numChildren() >0){
                res.push(t);
            }
            if(this.onlyOnce){
                break;
            }
        }

    }
    match(lexer:Lexer):boolean{
        return this.parser.match(lexer);
    }

}
abstract class AToken extends Element{

    protected type:{new():ASTLeaf};
	constructor(type:{new():ASTLeaf}) {
        super()
	}
    parse(lexer:Lexer,res:ASTree[]){
        var t:Token = lexer.read();
        if(this.test(t)){
            var leaf:ASTLeaf = new this.type();
            res.push(leaf);
        }else{
            throw new ParseError(t);
        }

    }
    match(lexer:Lexer):boolean{
        return this.test(lexer.peek(0));
    }
    abstract test(t:Token):boolean;
    
}
class IdToken extends AToken {
    reserved:Set<string>

	constructor(type:{new():ASTLeaf},r:Set<string>) {
        super(type);
        this.reserved = r||new Set<string>();
	}
    test(t:Token){
        return t.isIdentifier() && !this.reserved.has(t.text);
    }
}
class NumToken extends AToken {
	constructor(type:{new():ASTLeaf}) {
        super(type);
	}
    test(t:Token):boolean{
        return t.isNumber();
    }
}

class StrToken extends AToken {
	constructor(type:{new():ASTLeaf}) {
        super(type);
	}
    test(t:Token):boolean{
        return t.isString();
    }
}

class Leaf extends Element {
    tokens:string[]
	constructor(pat:string[]) {
        super();
        this.tokens = pat;
	}
    parse(lexer:Lexer,res:ASTree[]){
        var t:Token = lexer.read();
        if(t.isIdentifier()){
            for (var token of this.tokens) {
                if(token==t.text){
                    this.find(res,t);
                    return ;
                }
            }
        }
        if(this.tokens.length>0){
            throw new ParseError(t,this.tokens[0]+" expected.")
        }else{
            throw new ParseError(t);
        }
    }
    find(res:ASTree[],t:Token){
        res.push(new ASTLeaf(t));
    }
    match(lexer:Lexer):boolean{
        var t:Token = lexer.peek(0);
        if(t.isIdentifier()){
            for (var index = 0; index < this.tokens.length; index++) {
                var element = this.tokens[index];
                if(element == t.text){
                    return true;
                }
            }
        }
        return false;
    }
}
class Skip extends Leaf {
    constructor(t:string[]){
        super(t)
    }
    find(res:ASTree[],t:Token){

    }
}
class Precedence {
    value:number;
    leftAssoc:boolean;

	constructor(v:number,a:boolean) {
        this.value = v;
        this.leftAssoc = a;
	}
}
class Operators extends Map<string,Precedence>{
    static LEFT:boolean = true;
    static RIGHT:boolean = false;
    add(name:string,prec:number,leftAssoc:boolean){
        this.set(name,new Precedence(prec,leftAssoc))
    }
}
class Expr extends Element {
    protected type:{new (l:ASTree[]):ASTList};
    protected ops:Operators;
    protected factor:Parser;
	constructor(clazz:{new (l:ASTree[]):ASTList},exp:Parser,map:Operators) {
        super()
        this.type = clazz;
        this.factor = exp;
        this.ops = map;
	}
    parse(lexer:Lexer,res:ASTree[]){
        var right:ASTree = this.factor.parse(lexer);
        var prec:Precedence ;
        while (prec=this.nextOperator(lexer),prec!=null) {
            right = this.doShift(lexer,right,prec.value)
        }
        res.push(right);
    }
    doShift(lexer:Lexer,left:ASTree,prec:number):ASTree{
        var list:ASTree[] = [];
        list.push(left);
        list.push(new ASTLeaf(lexer.read()));
        var right:ASTree = this.factor.parse(lexer);
        var next:Precedence ;
        while ((next = this.nextOperator(lexer),next!=null) && this.rightIsExpr(prec,next)) {
            right = this.doShift(lexer,right,next.value);
        }
        list.push(right);
        return new this.type(list);
    }
    nextOperator(lexer:Lexer):Precedence{
        var t:Token = lexer.peek(0);
        if(t.isIdentifier()){
            return this.ops.get(t.text);
        }else{
            return null;
        }
    }
    match(lexer:Lexer){
        return this.factor.match(lexer);
    }
    rightIsExpr(prec:number,nextPrec:Precedence){
        return nextPrec.leftAssoc?prec<nextPrec.value:prec<=nextPrec.value;
    }
    
}
