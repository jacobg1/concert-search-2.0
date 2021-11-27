import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
} from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { ConcertAccordionProps } from '../concertListInterface'

export default function ConcertAccordion({
  identifier,
  title,
  description,
  expanded,
  handleChange,
}: ConcertAccordionProps): JSX.Element {
  return (
    <Accordion
      expanded={expanded === identifier}
      onChange={handleChange(identifier)}
      TransitionProps={{
        timeout: 250,
      }}
      square
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon color="primary" />}
        aria-controls={`concert-${identifier}-header`}
        id={`concert-${identifier}-header`}
      >
        <Typography variant="h2">{title}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Typography variant="subtitle1">
          <Button
            variant="contained"
            color="primary"
            endIcon={
              <PlayArrowIcon sx={{ verticalAlign: 'sub' }} fontSize="small" />
            }
          >
            Play
          </Button>
        </Typography>
        <Typography sx={{ marginTop: '30px' }} variant="body1">
          {description}
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}

// TODO: playlist as mui drawer
// TODO: player as mui drawer?
// TODO: concert rating on accordion tab?
// TODO: order concerts by date (title? may not have date)
