export default function assert(cond: any, msg: string): asserts cond {
  if (!cond) throw msg
}