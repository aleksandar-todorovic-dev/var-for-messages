export const inspirationSetIndexes = [0, 1, 2] as const

export type InspirationSetIndex =
  (typeof inspirationSetIndexes)[number]

export function pickInspirationSetIndex(
  randomValue: number,
): InspirationSetIndex {
  return Math.floor(
    randomValue * inspirationSetIndexes.length,
  ) as InspirationSetIndex
}

export function createRandomInspirationSetIndex(): InspirationSetIndex {
  return pickInspirationSetIndex(Math.random())
}
