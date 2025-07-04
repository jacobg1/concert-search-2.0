/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import { Box, type SxProps } from '@mui/material'
import recordPlayer from '../../../../public/vinyl.svg'
import Image from 'next/image'

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
      <Image
        width={200}
        height={180}
        css={css`
          width: 180px;
          position: absolute;
          top: 50px;
          left: 0;
          right: 0;
          margin: auto;
          animation: ${spin} 3s linear infinite;
        `}
        src={recordPlayer.src}
        alt="record-icon"
      />
    </Box>
  )
}
