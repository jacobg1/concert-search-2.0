import type { RefObject } from 'react'
import type { MediaHandler, PlayerState } from '../../src/app/interface'
import type { CreateMockAudioElProps } from '../types'
import type { AppStore } from '../../src/app/store'

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

export function createMockAudioEl(
  props: CreateMockAudioElProps
): RefObject<HTMLMediaElement> {
  return {
    current: {
      volume: 50,
      duration: 40,
      currentTime: 20,
      paused: true,
      played: false,
      onloadedmetadata: jest.fn(),
      ontimeupdate: jest.fn(),
      onstalled: jest.fn(),
      play: () => Promise.resolve(),
      pause: () => Promise.resolve(),
      ...props,
    },
  } as unknown as RefObject<HTMLMediaElement>
}

export function getPlayerState(store: AppStore): PlayerState {
  const {
    individualConcert: { playerState },
  } = store.getState()

  return playerState
}
