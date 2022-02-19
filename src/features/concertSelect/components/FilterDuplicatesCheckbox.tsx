import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material'
import { ChangeEvent } from 'react'
import CheckBoxOutlineBlankSharpIcon from '@mui/icons-material/CheckBoxOutlineBlankSharp'
import CheckBoxSharpIcon from '@mui/icons-material/CheckBoxSharp'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { setFilterDuplicates } from '../concertSelectSlice'

export default function FilterDuplicatesCheckbox(): JSX.Element {
  const dispatch = useAppDispatch()
  const { filterDuplicates } = useAppSelector((state) => state.concertSelect)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilterDuplicates(event.target.checked))
  }

  return (
    <FormGroup style={{ alignSelf: 'center' }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={filterDuplicates}
            onChange={handleChange}
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
