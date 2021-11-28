import { Typography, Box, Popover } from '@mui/material'
import { TrackMetaData } from '../trackInterface'
import { useState, MouseEvent } from 'react'

export default function ConcertMeta({
  title,
  creator,
  description,
  venue,
  source,
  date,
}: TrackMetaData): JSX.Element {
  const [htmlEl, setHtmlEl] = useState<HTMLParagraphElement | null>(null)
  const handleClick = (event: MouseEvent<HTMLParagraphElement>) => {
    setHtmlEl(event.currentTarget)
  }

  return (
    <Box
      sx={{
        width: '90%',
        cursor: 'pointer',
        '& p': {
          margin: '0 0 10px',
          width: '90%',

          textAlign: 'left',
          fontWeight: 'bold',
          color: 'white',
        },
      }}
    >
      <Typography
        sx={{ cursor: 'pointer' }}
        component="p"
        onClick={handleClick}
      >
        {title}
      </Typography>
      <Popover
        sx={{ cursor: 'pointer' }}
        id="concert-meta-popover"
        open={Boolean(htmlEl)}
        anchorEl={htmlEl}
        onClose={() => setHtmlEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box
          sx={{
            p: 1,
            border: '2px solid #ffffff',
            cursor: 'default',
            '& p': {
              margin: '5px',
            },
            '& span': {
              fontWeight: 'bold',
            },
          }}
        >
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
