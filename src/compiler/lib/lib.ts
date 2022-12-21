import { AstBody } from '../types/ast';
import { TokenType } from '../types/tokenType';
import { generate } from './generater';
import {set,get} from './variable';

function say(params: AstBody[] | undefined) {
    if(!params) throw new Error('Say语句缺少宾语');
    params?.forEach((v:AstBody)=>{
        v = generate(v);
        if(v.type === TokenType.String||v.type === TokenType.Number){
            console.log(v.value);
        }
    })
}

function add(params:AstBody[]|undefined):AstBody {
    if(!params) throw new Error('Add语句缺少宾语');
    if(params.length != 3||(params[1].type!=TokenType.Connect&&params[1].value!='and'))
        throw new Error('Add语句语法错误');

    params[0] = generate(params[0]);
    params[2] = generate(params[2]);
    if(params[0].type!=TokenType.Number||params[2].type!=TokenType.Number||(!params[0].value)||(!params[2].value))
        throw new Error('Add语句需要传入两个数值');

    var res = Number.parseInt(params[0].value) + Number.parseInt(params[2].value);
    return {
        type:TokenType.Number,
        value:res.toString()
    }
}

function subtract(params:AstBody[]|undefined):AstBody {
    if(!params) throw new Error('Subtract语句缺少宾语');
    if(params.length != 3||(params[1].type!=TokenType.Connect&&params[1].value!='from'))
        throw new Error('Subtract语句语法错误');

    params[0] = generate(params[0]);
    params[2] = generate(params[2]);
    if(params[0].type!=TokenType.Number||params[2].type!=TokenType.Number||(!params[0].value)||(!params[2].value))
        throw new Error('Subtract语句需要传入两个数值');

    var res = Number.parseInt(params[0].value) - Number.parseInt(params[2].value);
    return {
        type:TokenType.Number,
        value:res.toString()
    }
}

function multiply(params:AstBody[]|undefined):AstBody {
    if(!params) throw new Error('Multiply语句缺少宾语');
    if(params.length != 3||(params[1].type!=TokenType.Connect&&params[1].value!='by'))
        throw new Error('Multiply语句语法错误');

    params[0] = generate(params[0]);
    params[2] = generate(params[2]);
    if(params[0].type!=TokenType.Number||params[2].type!=TokenType.Number||(!params[0].value)||(!params[2].value))
        throw new Error('Multiply语句需要传入两个数值');

    var res = Number.parseInt(params[0].value) * Number.parseInt(params[2].value);
    return {
        type:TokenType.Number,
        value:res.toString()
    }
}

function divide(params:AstBody[]|undefined):AstBody {
    if(!params) throw new Error('Divide语句缺少宾语');
    if(params.length != 3||(params[1].type!=TokenType.Connect&&params[1].value!='into'))
        throw new Error('Divide语句语法错误');

    params[0] = generate(params[0]);
    params[2] = generate(params[2]);
    if(params[0].type!=TokenType.Number||params[2].type!=TokenType.Number||(!params[0].value)||(!params[2].value))
        throw new Error('Divide语句需要传入两个数值');

    var res = Number.parseInt(params[0].value) / Number.parseInt(params[2].value);
    return {
        type:TokenType.Number,
        value:res.toString()
    }
}

export const CallMappings: Record<
    string,
    (params: AstBody[] | undefined) => AstBody|void
> = {
    say,
    add,
    subtract,
    multiply,
    divide,
    set,
    get
};
