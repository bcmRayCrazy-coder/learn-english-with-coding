import { LEWCCompiler } from './LEWCCompiler';
import { AST } from './types/ast';
import { token } from './types/token';

export default function (code: string, mute: boolean) {
    function log(...msg: any[]) {
        if (!mute) console.log(msg);
    }

    log('初始化编译器');
    var compiler: LEWCCompiler = new LEWCCompiler(code);
    log('转换标识');
    var tokens: token[] = compiler.tokenize();
    log('解析标识');
    var ast: AST = compiler.parse(tokens);
}
