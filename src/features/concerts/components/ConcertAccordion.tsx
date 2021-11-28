import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { ConcertAccordionProps } from '../concertListInterface'
import PlayConcertButton from './PlayConcertButton'
import { useAppDispatch } from '../../../app/hooks'
import { fetchSelectedConcert } from '../../selectedConcert/selectedConcertSlice'

export default function ConcertAccordion({
  identifier,
  title,
  description,
  expanded,
  handleChange,
}: ConcertAccordionProps): JSX.Element {
  const dispatch = useAppDispatch()
  const playConcert = (identifier: string) => {
    dispatch(fetchSelectedConcert(identifier))
  }
  return (
    <Accordion
      expanded={expanded === identifier}
      onChange={handleChange(identifier)}
      TransitionProps={{
        timeout: 250,
        unmountOnExit: true,
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
        <PlayConcertButton identifier={identifier} playConcert={playConcert} />
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
