export class Token {
    static EOF: Token = new Token(-1);
    static EOL = '\n';
    _lineNumber:number;
    constructor(line: number) {
        this.lineNumber = line;
    }
    set lineNumber(line:number){
        this._lineNumber = line;
    }
    isEOF (){
        console.log("isEOF",this._lineNumber==-1)
        return this._lineNumber==-1
    }
    isIdentifier(){
        return false;
    }
    isNumber(){
        return false;
    }
    isString(){
        return false;
    }
    get text(){
        return ""
    }
    get number():number{
        throw new Error("not number token");
    }
}