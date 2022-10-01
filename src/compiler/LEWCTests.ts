import { CONNECTRegExp } from "./types/connects";

export default {
    WHITESPACE: /\s/,
    NUMBERS: /[0-9]/,
    STRINGDOUBLEQUOTE: /"/,
    STRINGSINGLEQUOTE: /'/,
    LEFTPAREN: /\(/,
    RIGHTPAREN: /\)/,
    ENDPAREN: /\./,
    LETTERS: /[a-z]/i,
    CONNECT: CONNECTRegExp,
    UPPERCASELETTER: /[A-Z]/
};
