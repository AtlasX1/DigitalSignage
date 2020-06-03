import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import { WhiteButton, BlueButton } from '../../Buttons'
import { FormControlInput, FormControlSelect } from '../../Form'

const styles = theme => ({
  root: {
    padding: '25px 17px'
  },
  searchAction: {
    width: '90%'
  },
  searchActionText: {
    fontSize: '14px'
  },
  label: {
    fontSize: '13px',
    transform: 'translate(0, 1.5px)',
    fontWeight: '300'
  }
})

class ScheduleSearchForm extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  render() {
    const { classes, t } = this.props

    return (
      <form className={classes.root}>
        <FormControlInput
          id="schedule-name"
          fullWidth={true}
          label={t('Schedule search name')}
          formControlLabelClass={classes.label}
        />
        <FormControlSelect
          id="schedule-group"
          fullWidth={true}
          label={t('Schedule search group')}
          formControlLabelClass={classes.label}
        />
        <FormControlSelect
          id="schedule-device"
          fullWidth={true}
          label={t('Schedule search device')}
          formControlLabelClass={classes.label}
        />
        <FormControlInput
          id="schedule-tags"
          fullWidth={true}
          label={t('Schedule search tags')}
          formControlLabelClass={classes.label}
        />

        <Grid container>
          <Grid item xs={6}>
            <BlueButton className={classes.searchAction}>
              {t('Search Action')}
            </BlueButton>
          </Grid>
          <Grid item xs={6}>
            <WhiteButton className={classes.searchAction}>
              {t('Search Reset Action')}
            </WhiteButton>
          </Grid>
        </Grid>
      </form>
    )
  }
}

export default translate('translations')(withStyles(styles)(ScheduleSearchForm))
