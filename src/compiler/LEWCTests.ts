import { CONNECTRegExp } from "./types/connects";

export default {
    WHITESPACE: /\s/,
    NUMBERS: /[0-9]/,
    STRINGDOUBLEQUOTE: /"/,
    STRINGSINGLEQUOTE: /'/,
    LEFTPAREN: /\(/,
    RIGHTPAREN: /\)/,
    LETTERS: /[a-z]/i,
    CONNECT: CONNECTRegExp,
};
