import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { ConcertAccordionProps } from '../concertListInterface'
import PlayConcertButton from './PlayConcertButton'
import { fetchSelectedConcert } from '../../selectedConcert/selectedConcertSlice'
import { useAppDispatch } from '../../../app/hooks'

export default function ConcertAccordion({
  identifier: concertId,
  title,
  description,
  expanded,
  handleChange,
  source,
}: ConcertAccordionProps): JSX.Element {
  const dispatch = useAppDispatch()
  const playConcert = (concertId: string) => {
    dispatch(fetchSelectedConcert(concertId))
  }
  return (
    <Accordion
      expanded={expanded === concertId}
      onChange={handleChange(concertId)}
      TransitionProps={{
        timeout: 250,
        unmountOnExit: true,
      }}
      square
    >
      <AccordionSummary
        id={`concert-${concertId}-header`}
        aria-controls={`concert-${concertId}-header`}
        expandIcon={<ExpandMoreIcon color="primary" />}
        sx={{
          '& .MuiAccordionSummary-content': {
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          },
        }}
      >
        <Typography variant="h2" width="67%">
          {title}
        </Typography>
        <PlayConcertButton concertId={concertId} playConcert={playConcert} />
      </AccordionSummary>

      <AccordionDetails>
        {source && (
          <>
            <Typography variant="subtitle1" style={{ marginBottom: '3px' }}>
              Source
            </Typography>
            <Typography variant="body1" style={{ marginBottom: '20px' }}>
              {source}
            </Typography>
          </>
        )}
        {description && (
          <>
            <Typography variant="subtitle1" style={{ marginBottom: '3px' }}>
              Track list
            </Typography>
            <Typography variant="body1">{description}</Typography>
          </>
        )}
      </AccordionDetails>
    </Accordion>
  )
}
