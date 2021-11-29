import { ListItemButton, ListItemText, Checkbox } from '@mui/material'
import { SxProps } from '@mui/system'
import { background } from '../../../app/background'

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
  return (
    <ListItemButton dense sx={listItemStyles} key={name}>
      <ListItemText
        sx={listItemTextSyles}
        id={name}
        primary={title}
        secondary={length}
        onClick={(e) => console.log(e.target)}
      />

      <Checkbox
        edge="end"
        checked={false}
        value="checkbox"
        inputProps={{ 'aria-labelledby': name }}
      />
    </ListItemButton>
  )
}