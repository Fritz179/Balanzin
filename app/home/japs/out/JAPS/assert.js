export default function assert(condition, message) {
    if (!condition) {
        console.trace();
        throw message || 'Assertion failed!';
    }
}
export function assertUnimplemented(message = 'Unimplemented') {
    assert(false, `Unimplemented: ${message}`);
}
export function assertUnreachable(message = 'Unreachable') {
    assert(false, `Unreachable: ${message}`);
}
