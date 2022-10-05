import { CalleeType } from './calleeType';
import { TokenType } from './tokenType';

export enum ASTTypes {
    PROGRAM = 'Program',
}

export interface AstVisitorValue {
    enter?: (node: AstBody | AST, parent: AstBody | AST | null) => void;
    exit?: (node: AstBody | AST, parent: AstBody | AST | null) => void;
}
export interface Callee {
    type: CalleeType;
    name: string;
}
export interface AstBody {
    type: TokenType;
    value?: string;
    name?: string;
    params?: AstBody[];
    body?: AstBody[];
    _context?: AstBody[];
    arguments?: [];
    callee?: Callee;
    expression?: AstBody;
}
export interface AST {
    type: ASTTypes;
    body: AstBody[];
    _context?: AstBody[];
    value?: string;
    name?: string;
}
