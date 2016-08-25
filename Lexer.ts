import * as Promise from "bluebird";
import {ReadLine} from "readline";
import {Token} from "./Token";

export class Lexer {
    static regexPat:string = "\\s*((//.*)|([0-9]+)|(\"(\\\\\"|\\\\\\\\|\\n|[^\"])*\")"+ "|[A-Z_a-z][A-Z_a-z0-9]*|==|<=|>=|&&|\\|\\||[+<>.,\/#!$%\^&\*;:{}=\-_`~()])?";
    private pattern:RegExp = new RegExp(Lexer.regexPat,"g")
    private queue:Token[] = []; 
    private hasMore:Boolean = true;
            // var lineReader = require('readline').createInterface({
        //     input: require('fs').createReadStream('file.in')
        // });
    private reader:ReadLine;
    private lineNum = 0;
    private curLine:string;

    constructor(r:ReadLine){
        this.reader = r;
        console.log("reg",this.pattern);
        r.on('line', (line) => {
            this.lineNum++;
            console.log('Line from file:', line,this.lineNum);
            this.readLine(line,this.lineNum);
        }).on("close",()=>
            this.hasMore= false
        );
    }
    read(){
        var b = this.fillQueue(0)
        if(b)
            return this.queue.shift() 
        else
            return Token.EOF;

    }
    peek(i:number){
        var b = this.fillQueue(i); 
        if(b)
            return this.queue[i]; 
        else
            return Token.EOF;
    }
    /**
     * 
     */
    fillQueue(i:number){
        while(i>=this.queue.length){
            if(this.hasMore){
                console.log("await")
                console.log("after await")
            }
            else{
                return false;
            }
        }
        return true;
    }
    readLine(line:string,lineNo:number){
        this.pattern.lastIndex = 0;
        var regRes:RegExpExecArray = this.pattern.exec(line);
        while(regRes&&regRes[0]){
            console.log(regRes);
            this.addToken(lineNo,regRes)
            regRes =  this.pattern.exec(line)
        }
        this.queue.push(new IdToken(lineNo,Token.EOL));
    }
    addToken(lineNo:number,matcher:RegExpExecArray){
        var m:string = matcher[1];
        if(m){
            if(matcher[2]==null) {//if not a comment
                var token :Token;
                if(matcher[3]){
                    token = new NumToken(lineNo,parseInt(m))
                }else if (matcher[4]){
                    token = new StrToken(lineNo,this.toStringLiteral(m));
                }else{
                    token = new IdToken(lineNo,m);
                }
                this.queue.push(token);
            }

        }

    }
    protected toStringLiteral(s:string):string{
        return s;
    }
}
class NumToken extends Token{
    private value:number;
    constructor(line:number,v:number){
        super(line);
        this.value = v;
    }
    isNumber(){
        return true;
    }
    get text(){
        return this.value.toString();
    }
    get number(){
        return this.value;
    }
}

class StrToken extends Token{
    private value:string;
    constructor(line:number,str:string){
        super(line);
        this.value = str;
    }
    isString(){
        return true;
    }
    get text(){
        return this.value;
    }
}

class IdToken extends Token{
    private value:string;
    constructor(line:number,str:string){
        super(line);
        this.value = str;
    }
    isIdentifier(){
        return true;
    }
    get text(){
        return this.value;
    }
}