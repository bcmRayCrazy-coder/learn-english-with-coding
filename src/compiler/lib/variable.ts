import { AstBody } from "../types/ast";
import { TokenType } from "../types/tokenType";
import { generate } from "./generater";

let variables:Record<string,AstBody> = {};

export function set(params:AstBody[]|undefined) {
    if(!params) throw new Error('Set语句缺少宾语');
    if(params.length != 3||params[1].value!='to') throw new Error('Set语法错误');

    var key = generate(params[0]);
    if(key.type!=TokenType.String||!key.value) throw new Error('Set语法错误');

    variables[key.value] = generate(params[2]);
}

export function get(params:AstBody[]|undefined):AstBody{
    if(!params) throw new Error('Get语句缺少宾语');
    if(params.length != 1) throw new Error('Get语法错误');

    var key = generate(params[0]);
    if(key.type!=TokenType.String||!key.value) throw new Error('Get语法错误');

    return variables[key.value];
}