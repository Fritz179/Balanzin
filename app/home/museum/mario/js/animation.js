export function createAnimation(frames, framelength) {
  return function resolveFrame(dist) {
    const frameIndex = Math.floor(dist / framelength % frames.length)
    return frames[frameIndex]
  }
}
