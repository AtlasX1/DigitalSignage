import React, { useMemo } from 'react'
import { Grid, withStyles } from '@material-ui/core'
import { BlueButton, WhiteButton } from 'components/Buttons'
import { translate } from 'react-i18next'

const styles = theme => ({
  submit: {
    width: '90%'
  },
  reset: {
    width: '90%',
    marginRight: 'unset !important'
  }
})

const Footer = ({ t, classes, onSubmit = f => f, onReset = f => f }) => {
  const translate = useMemo(
    () => ({
      action: t('Search Action'),
      reset: t('Search Reset Action')
    }),
    [t]
  )
  return (
    <Grid container>
      <Grid item xs={6}>
        <BlueButton className={classes.submit} type="submit" onClick={onSubmit}>
          {translate.action}
        </BlueButton>
      </Grid>
      <Grid item xs={6}>
        <WhiteButton className={classes.reset} onClick={onReset}>
          {translate.reset}
        </WhiteButton>
      </Grid>
    </Grid>
  )
}

export default translate('translations')(withStyles(styles)(Footer))
