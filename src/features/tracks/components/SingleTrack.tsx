import { ListItemButton, ListItemText, Checkbox } from '@mui/material'
import { SxProps } from '@mui/system'
import React from 'react'
import { background } from '../../../app/background'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { playNewTrack } from '../../selectedConcert/selectedConcertSlice'

const listItemStyles: SxProps = {
  background,
  margin: '4px 0',
  border: '2px solid black',
  textTransform: 'capitalize',
}

const listItemTextSyles: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  '& span': {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  '& p': {
    color: '#1c1d20',
    alignSelf: 'end',
    marginRight: '10px',
  },
}

interface SingleTrackProps {
  name: string
  title: string
  length: string
}

export default function SingleTrack({
  name,
  title,
  length,
}: SingleTrackProps): JSX.Element {
  const dispatch = useAppDispatch()
  const clickHandler = (e: React.SyntheticEvent): void => {
    dispatch(playNewTrack(name))
  }

  const { currentTrackName } = useAppSelector(
    (state) => state.individualConcert.currentlyPlayingTrack
  )

  return (
    <ListItemButton
      dense
      sx={listItemStyles}
      key={name}
      selected={currentTrackName === name}
    >
      <ListItemText
        sx={listItemTextSyles}
        id={name}
        primary={title}
        secondary={length}
        onClick={clickHandler}
      />
      {/* 
      <Checkbox
        edge="end"
        checked={false}
        value="checkbox"
        inputProps={{ 'aria-labelledby': name }}
      /> */}
    </ListItemButton>
  )
}
