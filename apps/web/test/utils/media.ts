import type { MediaHandler } from '../../src/app/interface'

export function findAction(
  action: MediaHandler['action'],
  handlers: MediaHandler[]
): MediaHandler {
  const findAction = handlers.find((handler) => handler.action === action)
  if (!findAction) throw new Error('Missing action')
  return findAction
}

export function checkMediaSession(expected: MediaSessionPlaybackState) {
  expect(navigator.mediaSession.playbackState).toBe(expected)
}
