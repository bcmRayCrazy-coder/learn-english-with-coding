import { AstBody } from "../types/ast";
import { TokenType } from "../types/tokenType";
import { CallMappings } from "./lib";

export function generate(node:AstBody):AstBody{
    switch (node.type) {
        case TokenType.CallExpression:
            if (!node.name) throw new Error('无头句');

            var func = CallMappings[node.name];
            if (func) {
                var back:AstBody|void = func(node.params);
                if(!back) back = {
                    type:TokenType.Void
                }
                return back;
            }else{
                throw new Error('未定义的句头: '+node.name);
            }

        case TokenType.Number:
        case TokenType.String:
        case TokenType.Void:
            return node;

        default:
            throw new Error('未知的类型: ' + node);
    }
}