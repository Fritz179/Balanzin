export const REG_TO_NUM = {};
export const NUM_TO_REG = ['pc', 'sp', 'si', 'di', 'a', 'b', 'c', 'ram'];
NUM_TO_REG.forEach((el, i) => REG_TO_NUM[el] = i);
export default function parse(source) {
    const parsed = [];
    source.split('\n').forEach((text, i) => {
        let trimmed = text.trim();
        // remove comment
        const commentMatch = trimmed.match(/(?<=;).*/);
        if (commentMatch)
            trimmed = trimmed.slice(0, commentMatch.index - 1).trim();
        const comment = commentMatch ? commentMatch[0] : '';
        // remove place
        const placeMatch = trimmed.match(/.*(?=:)/);
        if (placeMatch)
            trimmed = trimmed.slice(placeMatch[0].length + 1).trim();
        const place = placeMatch ? placeMatch[0] : '';
        // separate inst
        const instMatch = trimmed.match(/[a-zA-Z0-9_-]+/);
        if (instMatch)
            trimmed = trimmed.slice(instMatch[0].length).trim();
        const inst = instMatch ? instMatch[0] : '';
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
            // keyword
            if (NUM_TO_REG.includes(arg)) {
                return {
                    type: 'register',
                    value: arg,
                    original: arg,
                    exec: arg
                };
            }
            // probably const
            return {
                type: 'const',
                value: arg,
                original: arg,
                exec: -1
            };
        });
        parsed.push({
            inst,
            args,
            place,
            comment,
            lineText: text,
            lineNumber: i,
            bytePos: -1,
            opcode: -1,
            multiLine: false,
            prevLines: '',
            printLine: '',
        });
    });
    return parsed;
}
