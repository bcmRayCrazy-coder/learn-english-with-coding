export let ALLOWCONNECTS: string[] = ['by', 'from', 'to', 'and'];
export let CONNECTRegExp: RegExp = new RegExp(ALLOWCONNECTS.join('|'));
