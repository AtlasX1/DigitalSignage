import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import { WhiteButton, BlueButton } from '../../Buttons'
import { CheckboxSwitcher } from '../../Checkboxes'
import {
  FormControlInput,
  FormControlSelect,
  FormControlDateRangePickers
} from '../../Form'

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
    fontWeight: '300',
    transform: 'none'
  },
  labelTransform: {
    transform: 'translate(0, 1.5px)'
  },
  datepickerDivider: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#4c5057'
  }
})

class PlaylistSearchForm extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { classes, t } = this.props

    return (
      <form className={classes.root}>
        <FormControlInput
          id="playlist-file-name"
          fullWidth={true}
          label={t('File Name')}
          formControlLabelClass={[classes.label, classes.labelTransform].join(
            ' '
          )}
        />
        <FormControlSelect
          id="playlist-group"
          fullWidth={true}
          label={t('Group')}
          formControlLabelClass={[classes.label, classes.labelTransform].join(
            ' '
          )}
        />
        <FormControlDateRangePickers
          id="updated-on"
          label={t('Media search updated on')}
          dividerText={t('To')}
          formControlLabelClass={classes.label}
          formControlDividerTextClass={classes.datepickerDivider}
        />
        <FormControlInput
          id="playlist-size"
          label={t('Size')}
          formControlLabelClass={[classes.label, classes.labelTransform].join(
            ' '
          )}
        />
        <CheckboxSwitcher
          id="playlist-status"
          label={t('Status')}
          formControlLabelClass={classes.label}
        />
        <CheckboxSwitcher
          id="playlist-approved"
          label={t('Approved')}
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

export default translate('translations')(withStyles(styles)(PlaylistSearchForm))
