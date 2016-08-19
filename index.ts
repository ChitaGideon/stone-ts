import LineByLine = require('line-by-line');
import {createInterface} from "readline";
import {createReadStream} from "fs";
import * as Promise from "bluebird";
import {Lexer} from "./Lexer";
import {Token} from "./Token";

const dataPath = "./testdata/test1.stone"
class Startup {
    public static main(): number {
        var reader = new LineByLine("./testdata/test1.stone");
        var l:Lexer = new Lexer(createInterface({input: createReadStream(dataPath)}));
        setTimeout(function() {
            for (var token:Token; (token=l.read(),token!= Token.EOF);) {
                console.log("=>",token.text);
            }
            
        }, 1000);
        console.log("close1");
        return 0;
    }
}

Startup.main();