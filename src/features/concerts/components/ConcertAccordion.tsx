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
        id={`concert-${identifier}-header`}
        aria-controls={`concert-${identifier}-header`}
        expandIcon={<ExpandMoreIcon color="primary" />}
      >
        <Typography variant="h2">{title}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <PlayConcertButton identifier={identifier} playConcert={playConcert} />
        <Typography variant="body1" style={{ marginTop: '30px' }}>
          {description}
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}
