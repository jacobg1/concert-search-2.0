import { Typography, Box, Popover } from '@mui/material'
import { TrackMetadata } from '../trackInterface'
import { SxProps } from '@mui/system'
import { MetaItem } from './MetaItem'
import { usePopover } from '../../../app/hooks'

const metaContainerStyles: SxProps = {
  width: '90%',
  cursor: 'pointer',
  '& p': {
    margin: '0 0 10px',
    width: '90%',
    textAlign: 'left',
    color: 'white',
  },
}

const popoverContainerStyles: SxProps = {
  p: 1,
  border: '2px solid #ffffff',
  cursor: 'default',
  '& p': {
    fontSize: '1rem',
    margin: '10px 5px',
  },
  '& span': {
    fontWeight: 'bold',
  },
}

const popoverStyles: SxProps = {
  cursor: 'pointer',
  display: 'flex',
  flexWrap: 'wrap',
  maxWidth: '1000px',
}

export default function ConcertMeta({
  title,
  creator,
  description,
  venue,
  source,
  date,
  numTracks,
}: TrackMetadata): JSX.Element {
  const [htmlEl, isOpen, handleOpen, handleClose] =
    usePopover<HTMLParagraphElement>()

  const metaItems = [
    { label: 'Band', value: creator },
    { label: 'Date', value: date },
    { label: 'Venue', value: venue },
    { label: 'Tracks', value: numTracks },
    { label: 'Description', value: description },
    { label: 'Source', value: source },
  ]

  return (
    <Box sx={metaContainerStyles}>
      <Typography
        sx={{ cursor: 'pointer', fontSize: '1.1rem' }}
        component="p"
        onClick={handleOpen}
      >
        {title}
      </Typography>
      <Popover
        sx={popoverStyles}
        id="concert-meta-popover"
        open={isOpen}
        anchorEl={htmlEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={popoverContainerStyles}>
          {metaItems.map(({ label, value }, i) => {
            return value ? (
              <MetaItem key={`metaItem-${i}`} label={label} value={value} />
            ) : null
          })}
        </Box>
      </Popover>
    </Box>
  )
}
