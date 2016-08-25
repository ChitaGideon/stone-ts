import {Token} from "./Token";
export class ParseError extends Error{
    constructor(t:Token,msg?:string){
        msg||(msg = ParseError.location(t));
        super(msg);
    }
    static location(t:Token){
        if(t == Token.EOF){
            return "the last line";
        }else{
            return "\""+t.text+"\" at line "+t.lineNumber;
        }
    }
}