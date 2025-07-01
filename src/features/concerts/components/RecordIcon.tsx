/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import { Box, type SxProps } from '@mui/material'
import recordPlayer from '../../../images/vinyl.svg'

const spin = keyframes`
	100% {
		transform: rotate(360deg);
	}
`

const iconHolderStyles: SxProps = {
  width: '100%',
  position: 'relative',
}

export function RecordIcon(): JSX.Element {
  return (
    <Box sx={iconHolderStyles}>
      <img
        css={css`
          width: 180px;
          position: absolute;
          top: 50px;
          left: 0;
          right: 0;
          margin: auto;
          animation: ${spin} 3s linear infinite;
        `}
        src={recordPlayer}
        alt="record-icon"
      />
    </Box>
  )
}
