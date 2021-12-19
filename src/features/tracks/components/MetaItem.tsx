import { Typography } from '@mui/material'

interface MetaItemProps {
  label: string
  value: string
}
export function MetaItem({ label, value }: MetaItemProps): JSX.Element {
  return (
    <Typography>
      <span>{label}</span>: {value}
    </Typography>
  )
}
