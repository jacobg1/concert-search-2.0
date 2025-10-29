import { Box } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import ConcertListDisplay from './features/concerts/ConcertListDisplay'
import BandAndYearSelect from './features/concertSelect/BandAndYearSelect'
import SelectedConcertDisplay from './features/selectedConcert/SelectedConcertDisplay'
import { AppHeader } from './AppHeader'
import { theme } from './app/theme'
import { AppStyles } from './AppStyles'
import { ErrorDisplay } from './ErrorDisplay'
import { Provider } from 'react-redux'
import { setupStore } from './app/store'

const store = setupStore()

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AppStyles theme={theme} />
        <Box>
          <ErrorDisplay />
          <AppHeader />
          <BandAndYearSelect />
          <ConcertListDisplay />
          <SelectedConcertDisplay />
        </Box>
      </ThemeProvider>
    </Provider>
  )
}

export default App
