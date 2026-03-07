import type { RefObject } from 'react'
import type { MediaHandler, PlayerState } from '../../src/app/interface'
import type { CreateMockAudioElProps, TestMockAudioEl } from '../types'
import type { AppStore } from '../../src/app/store'
import { waitFor } from '@testing-library/react'

export function findAction(
  action: MediaHandler['action'],
  handlers: MediaHandler[]
): MediaHandler {
  const findAction = handlers.find((handler) => handler.action === action)
  if (!findAction) throw new Error('Missing action')
  return findAction
}

export function checkMediaSession(expected: MediaSessionPlaybackState) {
  return waitFor(() => {
    expect(navigator.mediaSession.playbackState).toBe(expected)
  })
}

export function createMockAudioEl(
  props?: CreateMockAudioElProps
): RefObject<HTMLMediaElement> {
  return {
    current: {
      volume: 50,
      duration: 40,
      currentTime: 20,
      paused: true,
      played: false,
      onplay: jest.fn(),
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

export async function testAudioElement(
  container: HTMLElement,
  audioEl: TestMockAudioEl,
  nextTrackMock: jest.Mock,
  expectedSrc?: string
) {
  expect(container.querySelector("#musicPlayer")).toBeVisible()

  if (!audioEl?.current) throw new Error("Missing audio ref")
  expect(audioEl.current.src).toBe(expectedSrc)

  audioEl.current.dispatchEvent(new Event("ended"))
  expect(nextTrackMock).toHaveBeenCalled()
}

export function getProgressBar(container: HTMLElement): Element {
  const progressBar = container.querySelector('#progressBar')

  if (!progressBar) {
    throw new Error('Failed to select progress bar')
  }

  return progressBar
}

export function getCanvasHeight(container: HTMLElement): number {
  const getCanvas = container.querySelector("canvas")
  if (!getCanvas) return 0
  return getCanvas.height
}
