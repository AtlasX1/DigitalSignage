import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { translate } from 'react-i18next'
import { Typography, Grid } from '@material-ui/core'
import { unstable_Box as Box } from '@material-ui/core/Box'

const useStyles = makeStyles({
  wrapper: {
    color: '#242424',
    overflow: 'hidden',
    lineHeight: 1,
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '10px 14px',
    marginBottom: '4px'
  },
  title: {
    display: 'inline-flex',
    maxWidth: '100%',
    fontSize: '25px',
    lineHeight: '1',
    overflow: 'hidden',
    marginBottom: '4px'
  },
  text: {
    display: 'inline-flex',
    maxWidth: '100%',
    fontSize: '14px',
    lineHeight: '19px',
    overflow: 'hidden'
  }
})

const FontCombinationPreview = ({ t, main, secondary, secondaryText }) => {
  const classes = useStyles()

  return (
    <Grid container direction="row">
      <Typography component="div" className={classes.wrapper}>
        <Box
          fontWeight={500}
          className={classes.title}
          style={{ fontFamily: main }}
        >
          {main + ' & ' + secondary}
        </Box>
        <Box
          fontWeight={400}
          className={classes.text}
          style={{ fontFamily: secondary }}
        >
          {secondaryText}
        </Box>
      </Typography>
    </Grid>
  )
}

export default translate('translations')(FontCombinationPreview)
