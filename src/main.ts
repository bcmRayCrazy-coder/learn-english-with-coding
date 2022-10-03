import { readFileSync } from 'fs';
import path from 'path';
import { LEWCCompiler } from './compiler/LEWCCompiler';

var compiler = new LEWCCompiler(
    readFileSync(path.join(__dirname, '../test.lewc')).toString('utf-8')
);
var tokens = compiler.tokenize();
console.log(tokens);
var ast = compiler.parse(tokens);
console.log(ast);
debugger;
