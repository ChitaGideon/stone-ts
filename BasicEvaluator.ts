import {ASTList} from './ast/ASTList';
import {StoneError} from './StoneError';
import {BasicEnv, Environment} from './Environment';
import {ASTree} from './ast/ASTree';
import {WhileStmnt} from './ast/WhileStmnt';
import {NullStmnt} from './ast/NullStmnt';
import {IfStmnt} from './ast/IfStmnt';
import {Name} from './ast/Name';
import {NumberLiteral} from './ast/NumberLiteral';
import {NegativeExpr} from './ast/NegativeExpr';
import {BinaryExpr} from './ast/BinaryExpr';
import {BlockStmnt} from './ast/BlockStmnt';
import {PrimaryExpr} from './ast/PrimaryExpr';
import {StringLiteral} from './ast/StringLiteral';
import {Lexer} from './Lexer';
import {Token} from './Token';

export interface Evaluator {
    eval(env: Environment): any;
}
export function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype || baseCtor).forEach(name => {
            derivedCtor.prototype[name] = (baseCtor.prototype || baseCtor)[name];
        });
    });
}
const isNumber = (n)=>{
    return parseFloat(n)==n;
}
export function init() {

    applyMixins(ASTList, [{ eval(env:Environment){ throw new StoneError("can not eval",this) } }])
    const valueEvaluator = { eval (env: Environment){ return this.value }}
    applyMixins(NumberLiteral, [valueEvaluator])
    applyMixins(StringLiteral, [valueEvaluator])

    applyMixins(Name, [{
        eval (env: Environment) {
            var obj = env.get(this.name);
            if (obj) {
                return obj;
            }
            throw new StoneError("undefined name:" + this.name, this)
        }
    }])
    applyMixins(NegativeExpr, [{
        eval (env: Environment) {
            var v: any = (<Evaluator>(this.operand())).eval(env);
            if (isNumber(v)) {
                return -v;
            }
            throw new StoneError("bad type for -", this);
        }
    }])

    applyMixins(BinaryExpr, [{
        computeAssign(env: Environment, rvalue: any) {
            let left = this.left();
            if (left instanceof Name) {
                env.put((<Name>left).name, rvalue);
                return rvalue;
            } else {
                throw new StoneError("bad assignment:", this);
            }
        },
        computeOp(left: any, op: string, right: any) {
            if (isNumber(left) && isNumber(right)) {
                return this.computeNumber(parseFloat(left), op, parseFloat(right));
            } else
                if (op == "+") {
                    return (left + right).toString();
                } else if (op == "==") {
                    return left == right;
                } else
                    throw new StoneError("bad type : "+ op, this);
        },
        computeNumber(left: number, op: string, right: number): number | boolean {
            let a = left;
            let b = right;
            switch (op) {
                case "+":
                    return a + b;
                case "-":
                    return a - b;
                case "*":
                    return a * b;
                case "/":
                    return a / b;
                case "%":
                    return a % b;
                case "==":
                    return a == b;
                case ">":
                    return a > b;
                case "<":
                    return a < b;
                default:
                    throw new StoneError("bad operator", this);
            }

        },
        eval(env: Environment) {
            // var v:any = (<Evaluator>(this.operand())).eval(env);
            var op: string = (<BinaryExpr>this).operator();
            let right = (<Evaluator>this.right()).eval(env);
            if ("=" == op) {
                return this.computeAssign(env, right);
            } else {
                let left = (<Evaluator>this.left()).eval(env);
                return this.computeOp(left, op, right);
            }
        }
    }])

    applyMixins(BlockStmnt, [{
        eval (env: Environment) {
            let result = 0;
            this.children().forEach(element => {
                if (!(element instanceof NullStmnt)) {
                    // console.log("!!",element,element.toString(),this.children());
                    result = (<Evaluator>element).eval(env);
                }
            });
            return result;
        }
    }])

    applyMixins(IfStmnt, [{
        eval (env: Environment) {
            let c = (<Evaluator>this.condition()).eval(env);
            if (c) {
                return (<Evaluator>this.thenBlock()).eval(env);
            } else {
                let b = this.elseBlock();
                if (!b) {
                    return 0;
                } else {
                    return (<Evaluator>b).eval(env);
                }
            }
        }
    }])

    applyMixins(WhileStmnt, [{
        eval (env: Environment) {
            let result = 0;
            while (true) {
                let c = (<Evaluator>this.condition()).eval(env);
                if (!c) {
                    return result;
                } else {
                    result = (<Evaluator>this.body()).eval(env);
                }
            }
        }
    }])

}
