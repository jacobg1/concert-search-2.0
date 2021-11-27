import { AutocompleteRenderInputParams, TextField } from '@mui/material'

const textFieldStyles = {
  '& input': {
    fontWeight: 'bold',
    '&::placeholder': {
      opacity: 1,
    },
    '&::selection': {
      background: 'none',
    },
  },
} as const

export default function ConcertTextField(
  props: AutocompleteRenderInputParams & { placeholder: string }
) {
  return <TextField {...props} sx={textFieldStyles} variant="outlined" />
}
