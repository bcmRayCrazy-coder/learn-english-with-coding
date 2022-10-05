import LEWCTests from './LEWCTests';
import { AST, AstBody, ASTTypes, AstVisitorValue } from './types/ast';
import { CalleeType } from './types/calleeType';
import { token } from './types/token';
import { TokenType } from './types/tokenType';

export class LEWCCompiler {
    /**
     * 输入代码
     */
    input: string = '';

    /**
     * 初始化编译器
     * @param input 输入代码
     */
    constructor(input: string) {
        this.input = input;
    }

    /**
     * 解析代码
     */
    tokenize() {
        // 编译光标
        var current = 0;
        // 已解析内容
        var tokens: token[] = [];

        var tests = LEWCTests;

        // 遍历代码
        while (current < this.input.length) {
            // 目前字符
            var char = this.input[current];

            // 匹配类型
            if (tests.LEFTPAREN.test(char)) {
                // 左括号

                tokens.push({
                    type: TokenType.Paren,
                    value: '(',
                });
                current++;
                // 跳转到下一个循环
                continue;
            } else if (tests.RIGHTPAREN.test(char)) {
                // 右括号

                tokens.push({
                    type: TokenType.Paren,
                    value: ')',
                });
                current++;
                continue;
            } else if (tests.ENDPAREN.test(char)) {
                // 句号

                tokens.push({
                    type: TokenType.Paren,
                    value: '.',
                });
                current++;
                continue;
            } else if (tests.WHITESPACE.test(char)) {
                // 空格

                current++;
                continue;
            } else if (tests.NUMBERS.test(char)) {
                // 数字

                var value = '';
                // 循环以检测多位数
                while (tests.NUMBERS.test(char)) {
                    value += char;
                    char = this.input[++current];
                }
                tokens.push({
                    type: TokenType.Number,
                    value,
                });
                continue;
            } else if (tests.STRINGDOUBLEQUOTE.test(char)) {
                // 字符串

                var value = '';
                char = this.input[++current];

                while (!tests.STRINGDOUBLEQUOTE.test(char)) {
                    value += char;
                    char = this.input[++current];
                }

                // 跳过引号
                char = this.input[++current];

                tokens.push({ type: TokenType.String, value });
                continue;
            } else if (tests.STRINGSINGLEQUOTE.test(char)) {
                // 字符串2

                var value = '';
                char = this.input[++current];

                while (!tests.STRINGSINGLEQUOTE.test(char)) {
                    value += char;
                    char = this.input[++current];
                }

                // 跳过引号
                char = this.input[++current];

                tokens.push({ type: TokenType.String, value });
                continue;
            } else if (tests.UPPERCASELETTER.test(char)) {
                // 函数名

                var value = '';

                // 转小写
                char = this.input[current++];
                value += char.toLowerCase();

                char = this.input[current];

                while (tests.LETTERS.test(char)) {
                    value += char;
                    char = this.input[++current];
                }

                if (tests.CONNECT.test(value)) {
                    // 连接符

                    tokens.push({
                        type: TokenType.Connect,
                        value,
                    });
                } else {
                    tokens.push({
                        type: TokenType.CallExpressionAtTokenize,
                        value,
                    });
                }
                current++;
                continue;
            } else if (tests.LETTERS.test(char)) {
                // 函数名写法2

                var value = '';

                while (tests.LETTERS.test(char)) {
                    value += char;
                    char = this.input[++current];
                }

                if (tests.CONNECT.test(value)) {
                    // 连接符

                    tokens.push({
                        type: TokenType.Connect,
                        value,
                    });
                } else {
                    tokens.push({
                        type: TokenType.Name,
                        value,
                    });
                }
                current++;
                continue;
            }

            // 无法解析
            throw new TypeError('无法解析的字符: ' + char);
        }
        return tokens;
    }

    /**
     * 将代码解析为ast
     * @param tokens 解析的代码tokens
     */
    parse(tokens: token[]): AST {
        var current = 0;
        var ast: AST = {
            type: ASTTypes.PROGRAM,
            body: [],
        };

        // 解析其中部分token
        function walk(): AstBody {
            var token = tokens[current];
            switch (token.type) {
                case TokenType.Number:
                    current++;
                    return {
                        type: TokenType.Number,
                        value: token.value,
                    };

                case TokenType.String:
                    current++;
                    return {
                        type: TokenType.String,
                        value: token.value,
                    };

                case TokenType.Paren:
                    if (LEWCTests.LEFTPAREN.test(token.value)) {
                        // 向下解析
                        token = tokens[++current];

                        // 函数
                        var node: AstBody = {
                            type: TokenType.CallExpression,
                            name: token.value,
                            params: [],
                        };
                        // 函数内部
                        token = tokens[++current];

                        // 括号未闭合
                        while (
                            token.type !== TokenType.Paren ||
                            (token.type === TokenType.Paren &&
                                token.value !== ')')
                        ) {
                            if (token.type === TokenType.Connect) {
                                // 连词

                                node.params?.push({
                                    type: TokenType.Connect,
                                    value: tokens[current++].value,
                                });
                            }
                            node.params?.push(walk());
                            token = tokens[current];
                        }

                        current++;
                        return node;
                    }

                case TokenType.CallExpressionAtTokenize:
                    if (LEWCTests.LETTERS.test(token.value)) {
                        // 向下解析
                        token = tokens[current];

                        // 函数
                        var node: AstBody = {
                            type: TokenType.CallExpression,
                            name: token.value,
                            params: [],
                        };
                        // 函数内部
                        token = tokens[++current];

                        // 括号未闭合
                        while (
                            token.type !== TokenType.Paren ||
                            (token.type === TokenType.Paren &&
                                token.value !== '.')
                        ) {
                            if (token.type === TokenType.Connect) {
                                // 连词

                                node.params?.push({
                                    type: TokenType.Connect,
                                    value: tokens[current++].value,
                                });
                            }
                            node.params?.push(walk());
                            token = tokens[current];
                        }

                        current++;
                        return node;
                    }

                default:
                    throw new TypeError(
                        '未知类型: ' +
                            token.type +
                            ' 位于字符串: ' +
                            token.value
                    );
            }
        }

        while (current < tokens.length) {
            ast.body.push(walk());
        }
        return ast;
    }

    traverser(ast: AST, visitor: Record<TokenType, AstVisitorValue>) {
        function traverseArray(array: AstBody[], parent: AstBody | AST) {
            array.forEach((child) => {
                traverseNode(child, parent);
            });
        }

        function traverseNode(
            node: AstBody | AST,
            parent: AstBody | AST | null
        ) {
            var methods = visitor[node.type];

            // 拥有对应入口函数
            if (methods && methods.enter) {
                methods.enter(node, parent);
            }

            // 分割
            switch (node.type) {
                case ASTTypes.PROGRAM:
                    if (node.body) traverseArray(node.body, node);

                    break;

                case TokenType.CallExpression:
                    if (node.params) traverseArray(node.params, node);
                    break;

                case TokenType.Number:
                case TokenType.String:
                case TokenType.Connect:
                    // 不是函数,跳过
                    break;

                default:
                    throw new TypeError('未知的类型: ' + node.type);
            }

            // 出口
            if (methods && methods.exit) {
                methods.exit(node, parent);
            }
        }
        traverseNode(ast, null);
    }

    transformer(ast: AST) {
        let newAst: AST = {
            type: ASTTypes.PROGRAM,
            body: [],
        };
        ast._context = newAst.body;
        this.traverser(ast, {
            [TokenType.Number]: {
                enter(node, parent) {
                    if (parent?._context) {
                        parent._context.push({
                            type: TokenType.Number,
                            value: node.value,
                        });
                    }
                },
            },
            [TokenType.String]: {
                enter(node, parent) {
                    if (parent?._context) {
                        parent._context.push({
                            type: TokenType.String,
                            value: node.value,
                        });
                    }
                },
            },
            [TokenType.CallExpression]: {
                enter(node, parent) {
                    if (node.name) {
                        let expression: AstBody = {
                            type: TokenType.CallExpression,
                            callee: {
                                type: CalleeType.Identifier,
                                name: node.name,
                            },
                            arguments: [],
                        };
                        node._context = expression.arguments;
                        if (parent?.type !== TokenType.CallExpression) {
                            expression = {
                                type: TokenType.ExpressionStatement,
                                expression: expression,
                            };
                        }
                        parent?._context?.push(expression);
                    }
                },
            },
            [TokenType.Paren]: {},
            [TokenType.Name]: {},
            [TokenType.Connect]: {},
            [TokenType.CallExpressionAtTokenize]: {},
            [TokenType.Program]: {},
            [TokenType.ExpressionStatement]: {},
        });

        return newAst;
    }
}
