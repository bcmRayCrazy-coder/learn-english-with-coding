import { TokenType } from './tokenType';

export enum ASTTypes {
    PROGRAM = 'Program',
}
export interface AstBody {
    type: TokenType;
    value?: string;
    name?: string;
    params?: AstBody[];
}
export interface AST {
    type: ASTTypes;
    body: AstBody[];
}
