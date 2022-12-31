import { useState, useLayoutEffect } from 'react'

export function useResize(maxWidth: number) {
  const [windowSize, setWindowSize] = useState([0, 0])

  useLayoutEffect(() => {
    const setSize = () => {
      const { innerHeight, innerWidth } = window
      const width = innerWidth < maxWidth ? innerWidth : maxWidth
      setWindowSize([innerHeight, width])
    }
    window.addEventListener('resize', setSize)
    setSize()
    return () => window.removeEventListener('resize', setSize)
  }, [])

  return windowSize
}
