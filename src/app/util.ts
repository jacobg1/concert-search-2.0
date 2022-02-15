export function durationFormat(
  durationValue: number
): [number, number, (x: number) => string] {
  const calcMinutes = Math.floor(durationValue / 60)
  const calcSecondsLeft = Math.floor(durationValue - calcMinutes * 60)

  const addZero = (time: number): string => {
    return time <= 9 ? `0${time}` : `${time}`
  }

  return [calcMinutes, calcSecondsLeft, addZero]
}
