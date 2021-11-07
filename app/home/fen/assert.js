export function assert(condition, message) {
  if (!condition) console.log(message)
}

export function assertLine(info, condition, message) {
  if (!condition) console.log(`${message}\n  at line: ${info.lineNumber}: ${info.originalLine}`)
}
