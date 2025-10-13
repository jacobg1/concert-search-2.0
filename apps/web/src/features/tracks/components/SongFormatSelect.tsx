import { useState } from 'react'
import { Typography, Button, type SxProps } from '@mui/material'
import { MediaFormat } from '../../../app/interface'
import { changeMediaFormat } from '../../selectedConcert/selectedConcertSlice'
import { useAppSelector, useAppDispatch } from '../../../app/hooks'
import { CloseEditIcon } from './CloseEditIcon'

const formatSelectStyles: SxProps = {
  color: 'black',
  background: '#bed5ff',
  width: { xs: '30%', sm: '20%' },
  maxWidth: '150px',
  display: { xs: 'none', md: 'flex' },
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: 0,
  cursor: 'auto',
  '& .close-icon': {
    fontSize: '1.3rem',
    stroke: '#000000',
    strokeWidth: '1.5px',
  },
  '&:hover': {
    background: '#bed5ff',
  },
}

export default function SongFormatSelect(): JSX.Element {
  const { mediaFormat } = useAppSelector((state) => state.individualConcert)
  const dispatch = useAppDispatch()
  const [isOpen, openMenu] = useState(false)

  return (
    <Button variant="contained" size="large" sx={formatSelectStyles}>
      <CloseEditIcon isOpen={isOpen} openMenu={openMenu} />
      {!isOpen ? (
        <Typography variant="body1">
          {mediaFormat.toLocaleUpperCase()}
        </Typography>
      ) : (
        Object.values(MediaFormat).map((fmt) => (
          <Typography
            key={fmt}
            variant="body1"
            style={{
              cursor: 'pointer',
              fontWeight: fmt === mediaFormat ? '700' : '400',
            }}
            onClick={() => dispatch(changeMediaFormat(fmt))}
          >
            {fmt.toLocaleUpperCase()}
          </Typography>
        ))
      )}
    </Button>
  )
}
