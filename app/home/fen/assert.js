export function assert(condition, message) {
  if (!condition) console.error(message)
}

export function assertLine(info, condition, message) {
  if (!condition) console.error(`${message}\n  at line: ${info.lineNumber}: ${info.originalLine}`)
}
