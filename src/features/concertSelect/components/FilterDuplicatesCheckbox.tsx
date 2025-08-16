import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material'
import { ChangeEvent } from 'react'
import CheckBoxOutlineBlankSharpIcon from '@mui/icons-material/CheckBoxOutlineBlankSharp'
import CheckBoxSharpIcon from '@mui/icons-material/CheckBoxSharp'
import { setFilterDuplicates } from '../concertSelectSlice'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'

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
            id="filter-duplicates"
            checked={filterDuplicates}
            onChange={handleChange}
            icon={<CheckBoxOutlineBlankSharpIcon />}
            checkedIcon={<CheckBoxSharpIcon />}
            slotProps={{ input: { 'aria-label': 'filter duplicates' } }}
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
