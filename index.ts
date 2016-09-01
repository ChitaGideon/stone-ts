import {Evaluator,init} from './BasicEvaluator';
import {BasicEnv} from './Environment';
import {ASTree} from './ast/ASTree';
import {BasicParser} from './BasicParser';
import LineByLine = require('line-by-line');
import {createInterface} from "readline";
import {createReadStream} from "fs";
import * as Promise from "bluebird";
import {Lexer} from './Lexer';
import {Token} from './Token';

const dataPath = "./testdata/test2.stone"
class Startup {
    public static main(): number {
        // var reader = new LineByLine("./testdata/test2.stone");
        var l:Lexer = new Lexer(createInterface({input: createReadStream(dataPath)}));
        var basicParser:BasicParser = new BasicParser();
        setTimeout(function() {
            // for (var token:Token; (token=l.read(),token!= Token.EOF);) {
            //     console.log("=>",token.text);
            // }
            while(l.peek(0) != Token.EOF){
                var ast:ASTree  =  basicParser.parse(l);
                console.log(ast.toString());
            }
        }, 1000);
        console.log("close1");
        return 0;
    }
    public static interpreter(): number {
        // var reader = new LineByLine("./testdata/test2.stone");
        init();
        var l:Lexer = new Lexer(createInterface({input: createReadStream(dataPath)}));
        var basicParser:BasicParser = new BasicParser();
        var env = new BasicEnv();
        setTimeout(function() {
            // for (var token:Token; (token=l.read(),token!= Token.EOF);) {
            //     console.log("=>",token.text);
            // }
            while(l.peek(0) != Token.EOF){
                var ast:any  =  basicParser.parse(l);
                console.log("eval:",ast.toString());
                let res = (<Evaluator>ast).eval(env);
                console.log("=>",res.toString());
            }
        }, 1000);
        console.log("close1");
        return 0;
    }
}

Startup.interpreter();