import { Box } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import ConcertListDisplay from './features/concerts/ConcertListDisplay'
import BandAndYearSelect from './features/concertSelect/BandAndYearSelect'
import SelectedConcertDisplay from './features/selectedConcert/SelectedConcertDisplay'
import { AppHeader } from './AppHeader'
import { theme } from './app/theme'
import { AppStyles } from './AppStyles'

function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <AppStyles theme={theme} />
      <Box>
        <AppHeader />
        <BandAndYearSelect />
        <ConcertListDisplay />
        <SelectedConcertDisplay />
      </Box>
    </ThemeProvider>
  )
}

export default App
