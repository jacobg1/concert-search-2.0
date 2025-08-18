function durationFormat(
  durationValue: number
): [number, number, (x: number) => string] {
  const calcMinutes = Math.floor(durationValue / 60)
  const calcSecondsLeft = Math.floor(durationValue - calcMinutes * 60)

  const addZero = (time: number): string => {
    return time <= 9 ? `0${time}` : `${time}`
  }

  return [calcMinutes, calcSecondsLeft, addZero]
}

export function handleTrackDuration(durationValue: string): string {
  // Value is already formatted
  if (durationValue.includes(':')) {
    return durationValue
  }
  // Value needs formatting
  const [calcMinutes, calcSecondsLeft, addZero] = durationFormat(
    parseInt(durationValue, 10)
  )
  return `${addZero(calcMinutes)}:${addZero(calcSecondsLeft)}`
}

export function handleTrackProgressDuration(durationValue: number): string {
  const [calcMinutes, calcSecondsLeft, addZero] = durationFormat(durationValue)

  return `${calcMinutes}:${addZero(calcSecondsLeft)}`
}

export function filterHTMLText(text?: string): string {
  if (!text) return ''

  try {
    const exp = /(<([^>]+)>)/gi
    return text.replace(exp, '')
  } catch {
    return text
  }
}
