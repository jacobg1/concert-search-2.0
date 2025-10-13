import { type SetStateAction } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'

interface CloseEditIconProps {
  isOpen: boolean
  openMenu: (value: SetStateAction<boolean>) => void
}

export function CloseEditIcon({ isOpen, openMenu }: CloseEditIconProps) {
  if (isOpen) {
    return (
      <CloseIcon
        className="close-icon"
        fontSize="medium"
        style={{ cursor: 'pointer' }}
        onClick={() => openMenu(!isOpen)}
      />
    )
  }
  return (
    <EditIcon
      fontSize="medium"
      style={{ cursor: 'pointer' }}
      onClick={() => openMenu(!isOpen)}
    />
  )
}
