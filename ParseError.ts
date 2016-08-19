import {Token} from "./Token";
export class ParseError extends Error{
        constructor(t:Token,msg:string=""){
            super(msg);
        }
        location(t:Token){
            if(t == Token.EOF){
                return "the last line";
            }else{
                return "\""+t.text+"\" at line "+t.lineNumber;
            }
        }
}