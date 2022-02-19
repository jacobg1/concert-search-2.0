import { Typography, Button } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { MediaFormat } from '../../../app/interface'
import { changeMediaFormat } from '../../selectedConcert/selectedConcertSlice'
import { useState } from 'react'
import { SxProps } from '@mui/system'

const formatSelectStyles: SxProps = {
  color: 'black',
  background: '#bed5ff',
  width: { xs: '30%', sm: '20%' },
  maxWidth: '150px',
  display: 'flex',
  justifyContent: 'space-around',
  padding: 0,
  cursor: 'auto',
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
      <EditIcon
        fontSize="medium"
        style={{ cursor: 'pointer' }}
        onClick={() => openMenu(!isOpen)}
      />
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
