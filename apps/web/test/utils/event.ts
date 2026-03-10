export function createTestEvent(mockTarget: string) {
  const testEvent = new MouseEvent('click')

  return {
    ...testEvent,
    currentTarget: mockTarget,
    isDefaultPrevented: () => false,
    isPropagationStopped: () => false,
    persist: () => null,
    nativeEvent: testEvent,
  } as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>
}

export function getPlayPauseAction(payload: string) {
  return {
    type: 'selectedConcert/setPlayerState',
    payload
  }
}

export function selectedConcertAction(name: string, payload?: string) {
   return {
    type: `selectedConcert/${name}`,
    payload
  }
}
