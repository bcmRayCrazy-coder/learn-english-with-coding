import { TokenType } from './tokenType';

export enum ASTTypes {
    PROGRAM = 'Program',
}

export interface AstVisitorValue {
    enter?: (node: AstBody | AST, parent: AstBody | AST | null) => void;
    exit?: (node: AstBody | AST, parent: AstBody | AST | null) => void;
}
export interface AstBody {
    type: TokenType;
    value?: string;
    name?: string;
    params?: AstBody[];
    body?: AstBody[];
}
export interface AST {
    type: ASTTypes;
    body: AstBody[];
}
