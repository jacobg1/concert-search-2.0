import { AutocompleteRenderInputParams, TextField } from '@mui/material'
import { SxProps } from '@mui/system'

const textFieldStyles: SxProps = {
  '& input': {
    fontWeight: 'bold',
    '&::placeholder': {
      opacity: 1,
    },
    '&::selection': {
      background: 'none',
    },
  },
}

export default function ConcertTextField(
  props: AutocompleteRenderInputParams & { placeholder: string }
): JSX.Element {
  return <TextField {...props} sx={textFieldStyles} variant="outlined" />
}
