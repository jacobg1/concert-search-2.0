import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material'
import { SxProps } from '@mui/system'
import { ChangeEvent } from 'react'
import CheckBoxOutlineBlankSharpIcon from '@mui/icons-material/CheckBoxOutlineBlankSharp'
import CheckBoxSharpIcon from '@mui/icons-material/CheckBoxSharp'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { setFilterDuplicates } from '../concertSelectSlice'

const checkboxStyles: SxProps = {
  '& .MuiSvgIcon-root': {
    fontSize: '1.6rem',
  },
}

export default function FilterDuplicatesCheckbox(): JSX.Element {
  const dispatch = useAppDispatch()
  const { filterDuplicates } = useAppSelector((state) => state.concertSelect)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilterDuplicates(event.target.checked))
  }

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            checked={filterDuplicates}
            onChange={handleChange}
            sx={checkboxStyles}
            icon={<CheckBoxOutlineBlankSharpIcon />}
            checkedIcon={<CheckBoxSharpIcon />}
            inputProps={{ 'aria-label': 'filter duplicates' }}
          />
        }
        label={
          <Typography style={{ fontWeight: 'bold' }} variant="body1">
            Filter duplicates
          </Typography>
        }
      />
    </FormGroup>
  )
}
