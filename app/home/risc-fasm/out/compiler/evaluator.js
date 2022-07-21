import { assertLine } from '../assert.js';
var operations;
(function (operations) {
    operations["plus"] = "+";
    operations["minus"] = "-";
    operations["times"] = "*";
    operations["divide"] = "/";
})(operations || (operations = {}));
const tokenToOp = {};
// @ts-ignore
Object.keys(operations).forEach(op => tokenToOp[operations[op]] = op);
const priorities = {
    [operations.plus]: 1,
    [operations.minus]: 1,
    [operations.times]: 2,
    [operations.divide]: 2,
};
function buildGroups(source, isDeep) {
    let output = [];
    let expectOperation = false;
    while (source.length) {
        const token = source.shift();
        const op = tokenToOp[token];
        if (op) {
            assertLine(expectOperation, `Parsing failed, unexpected operatorn ${op}`);
            expectOperation = false;
            output.push({
                type: 'operation',
                operation: token,
                priority: priorities[token]
            });
            continue;
        }
        assertLine(!expectOperation, 'Parsing failed, operator expected');
        expectOperation = true;
        if (token == '(') {
            output.push(buildGroups(source, true));
            continue;
        }
        if (token == ')') {
            assertLine(isDeep, 'No matching `(` found!');
            return { type: 'group', group: output };
        }
        output.push({ type: 'token', token: token });
    }
    assertLine(!isDeep, 'No matching `)` found');
    assertLine(expectOperation, 'Parsing failed, unexpected operation');
    if (output.length == 1)
        return output[0];
    return { type: 'group', group: output };
}
function buildTree(source) {
    if (!Array.isArray(source)) {
        assertLine(source.type != 'operation', 'Unexpected operation');
        if (source.type == 'token')
            return source;
        return buildTree(source.group);
    }
    if (source.length == 1) {
        assertLine(source[0].type == 'token', 'Expected token');
        return source[0];
    }
    // get highes priority operation
    let highesPriority = 0;
    let position = 0;
    let operation = null;
    source.forEach((token, i) => {
        if (token.type == 'operation' && token.priority > highesPriority) {
            highesPriority = token.priority;
            position = i;
            operation = token;
        }
    });
    assertLine(operation != null, 'Invalid position?');
    return {
        type: 'node',
        left: buildTree(source.splice(0, position)),
        operator: operation,
        right: buildTree(source.splice(1)),
    };
}
import { getConst } from './assembler.js';
function evalTree(node) {
    if (node.type == 'token')
        return getConst(node.token);
    switch (node.operator.operation) {
        case operations.plus: return evalTree(node.left) + evalTree(node.right);
        case operations.minus: return evalTree(node.left) - evalTree(node.right);
        case operations.times: return evalTree(node.left) * evalTree(node.right);
        case operations.divide: return Math.round(evalTree(node.left) / evalTree(node.right));
    }
}
export default function evaluate(source) {
    const groups = buildGroups(JSON.parse(JSON.stringify(source)), false);
    const tree = buildTree(groups);
    return evalTree(tree);
}
