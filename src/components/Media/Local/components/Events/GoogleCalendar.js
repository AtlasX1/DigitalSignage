import React from 'react'

import { withStyles, Grid } from '@material-ui/core'

import { FormControlInput } from '../../../../Form/index'

const styles = () => ({
  formControlRootClass: {
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 0
  }
})

const GoogleCalendar = ({ classes }) => (
  <Grid container>
    <Grid item xs={12}>
      <FormControlInput
        formControlRootClass={classes.formControlRootClass}
        label={'Calendar ID:'}
        fullWidth={true}
      />
    </Grid>
  </Grid>
)

export default withStyles(styles)(GoogleCalendar)
