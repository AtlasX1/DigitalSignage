import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { translate } from 'react-i18next'
import { Typography, Grid } from '@material-ui/core'
import { unstable_Box as Box } from '@material-ui/core/Box'

import { FABRIC_EXAMPLE_TEXT } from '../../../constans'

const useStyles = makeStyles({
  wrapper: {
    color: '#242424',
    overflow: 'hidden',
    lineHeight: 1
  },
  title: {
    display: 'inline-flex',
    maxWidth: '100%',
    fontSize: '29px',
    lineHeight: '1',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginBottom: '4px'
  },
  text: {
    display: 'inline-flex',
    maxWidth: '100%',
    fontSize: '14px',
    lineHeight: '19px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }
})

const FontPreview = ({ t, family, variants }) => {
  const classes = useStyles()

  return (
    <Grid container direction="row">
      <Typography
        component="div"
        className={classes.wrapper}
        style={{
          fontFamily: family,
          fontStyle: variants[0].style === 'italic' ? 'italic' : 'normal'
        }}
      >
        <Box fontWeight={500} className={classes.title}>
          {family}
        </Box>
        <Box fontWeight={400} className={classes.text}>
          {t(FABRIC_EXAMPLE_TEXT)}
        </Box>
      </Typography>
    </Grid>
  )
}

export default translate('translations')(FontPreview)
