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
import {Parser, Operators} from './Parser';

const rule = Parser.rule;


export class BasicParser {
    reserved:Set<string> = new Set;
    operators:Operators = new Operators;
    expr0:Parser = rule();

   primary:Parser = rule(PrimaryExpr)
        .or(rule().sep("(").ast(this.expr0).sep(")"),
            rule().number(NumberLiteral),
            rule().identifier(this.reserved,Name),
            rule().string(StringLiteral));
     factor:Parser = rule().or(rule(NegativeExpr).sep("-").ast(this.primary),
                              this.primary);                               
     expr:Parser = this.expr0.expression( this.factor, this.operators,BinaryExpr);

     statement0:Parser = rule();
     block:Parser = rule(BlockStmnt)
        .sep("{").option(this.statement0)
        .repeat(rule().sep(";", Token.EOL).option(this.statement0))
        .sep("}");
     simple:Parser = rule(PrimaryExpr).ast(this.expr);
     statement:Parser = this.statement0.or(
            rule(IfStmnt).sep("if").ast(this.expr).ast(this.block)
                               .option(rule().sep("else").ast(this.block)),
            rule(WhileStmnt).sep("while").ast(this.expr).ast(this.block),
            this.simple);

     program:Parser = rule().or(this.statement, rule(NullStmnt))
                           .sep(";", Token.EOL);

    constructor() {
        this.reserved.add(";");
        this.reserved.add("}");
        this.reserved.add(Token.EOL);

        this.operators.add("=", 1, Operators.RIGHT);
        this.operators.add("==", 2, Operators.LEFT);
        this.operators.add(">", 2, Operators.LEFT);
        this.operators.add("<", 2, Operators.LEFT);
        this.operators.add("+", 3, Operators.LEFT);
        this.operators.add("-", 3, Operators.LEFT);
        this.operators.add("*", 4, Operators.LEFT);
        this.operators.add("/", 4, Operators.LEFT);
        this.operators.add("%", 4, Operators.LEFT);
    }
    parse(lexer:Lexer):ASTree{
        return this.program.parse(lexer);
    }   
}