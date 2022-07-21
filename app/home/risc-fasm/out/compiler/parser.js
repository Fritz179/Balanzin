import { isRegister } from '../assert.js';
export default function parse(source) {
    const parsed = [];
    source.split('\n').forEach((text, i) => {
        let trimmed = text.trim();
        // remove comment
        const commentMatch = trimmed.match(/(?<=;).*/);
        if (commentMatch)
            trimmed = trimmed.slice(0, commentMatch.index - 1).trim();
        const comment = commentMatch?.[0] || '';
        // remove place
        const placeMatch = trimmed.match(/.*(?=:)/);
        if (placeMatch)
            trimmed = trimmed.slice(placeMatch[0].length + 1).trim();
        const place = placeMatch?.[0] || '';
        // check if it's a directive
        const isDirective = trimmed[0] == '.';
        if (isDirective)
            trimmed = trimmed.slice(1);
        // separate inst
        const instMatch = trimmed.match(/^[a-zA-Z0-9_-]+/);
        if (instMatch)
            trimmed = trimmed.slice(instMatch[0].length).trim();
        const inst = instMatch?.[0];
        // separate args
        const rest = trimmed.length ? trimmed.split(',').map(arg => arg.trim()) : [];
        const args = rest.map((arg) => {
            // number
            const number = Number(arg);
            if (!Number.isNaN(number)) {
                return {
                    type: 'number',
                    value: number,
                    exec: number,
                    original: arg,
                };
            }
            // char
            if (arg.match(/'.'/)) {
                return {
                    type: 'number',
                    value: arg.charCodeAt(1),
                    exec: arg.charCodeAt(1),
                    original: arg.charAt(1),
                };
            }
            // string
            if (arg.match(/".*"/)) {
                return {
                    type: 'string',
                    value: arg.slice(1, -1),
                    original: arg,
                    exec: -1
                };
            }
            // @ts-ignore keyword
            if (isRegister(arg)) {
                return {
                    type: 'register',
                    value: arg,
                    original: arg,
                    exec: arg
                };
            }
            // probably const
            const constExpr = arg.split(/\s/);
            return {
                type: 'const',
                value: constExpr,
                original: arg,
                exec: -1
            };
        });
        if (inst) {
            parsed.push({
                type: isDirective ? 'directive' : 'code',
                place,
                inst,
                args,
                comment,
                lineText: text,
                lineNumber: i,
            });
        }
        else {
            parsed.push({
                type: 'text',
                place,
                comment,
                lineText: text,
                lineNumber: i,
            });
        }
    });
    return parsed;
}
