import { Typography, Box, Popover } from '@mui/material'
import { TrackMetaData } from '../trackInterface'
import { SxProps } from '@mui/system'
import { usePopover } from '../../../app/hooks'

const metaContainerStyles: SxProps = {
  width: '90%',
  cursor: 'pointer',
  '& p': {
    margin: '0 0 10px',
    width: '90%',
    textAlign: 'left',
    fontWeight: 'bold',
    color: 'white',
  },
}

const popoverContainerStyles: SxProps = {
  p: 1,
  border: '2px solid #ffffff',
  cursor: 'default',
  '& p': {
    margin: '5px',
  },
  '& span': {
    fontWeight: 'bold',
  },
}

const popoverStyles: SxProps = {
  cursor: 'pointer',
  display: 'flex',
  flexWrap: 'wrap',
}

export default function ConcertMeta({
  title,
  creator,
  description,
  venue,
  source,
  date,
}: TrackMetaData): JSX.Element {
  const [htmlEl, isOpen, handleOpen, handleClose] =
    usePopover<HTMLParagraphElement>()

  return (
    <Box sx={metaContainerStyles}>
      <Typography sx={{ cursor: 'pointer' }} component="p" onClick={handleOpen}>
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
          <Typography>
            <span>Band</span>: {creator}
          </Typography>
          <Typography>
            <span>Date</span>: {date}
          </Typography>
          <Typography>
            <span>Venue</span>: {venue}
          </Typography>
          {description && (
            <Typography>
              <span>Description</span>: {description}
            </Typography>
          )}
          {source && (
            <Typography>
              <span>Source</span>: {source}
            </Typography>
          )}
        </Box>
      </Popover>
    </Box>
  )
}
