export default function assert(condition: any, message?: string): asserts condition {
  if (!condition) {
    console.trace()
    throw message || 'Assertion failed!'
  }
}

export function assertUnimplemented(message: string = 'Unimplemented'): never {
  assert(false, `Unimplemented: ${message}`)
}

export function assertUnreachable(message: string = 'Unreachable'): never {
  assert(false, `Unreachable: ${message}`)
}