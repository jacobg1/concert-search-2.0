import { useState, MouseEvent } from 'react'
import { PopoverHandler } from '../interface'

export function usePopover<T>(): [
  T | null,
  boolean,
  PopoverHandler<T>,
  PopoverHandler<T>,
] {
  const [htmlEl, setHtmlEl] = useState<T | null>(null)
  const isOpen = Boolean(htmlEl)

  const handleOpen = (event: MouseEvent<T>) => {
    setHtmlEl(event.currentTarget)
  }

  const handleClose = () => {
    setHtmlEl(null)
  }

  return [htmlEl, isOpen, handleOpen, handleClose]
}
