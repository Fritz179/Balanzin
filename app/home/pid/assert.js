export default function assert(cond, msg) {
    if (!cond)
        throw msg;
}
