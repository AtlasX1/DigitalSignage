import React from 'react'
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
    transform: 'translate(0, 1.5px)',
    fontWeight: '300'
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

const TemplateSearchForm = ({ t, classes }) => {
  return (
    <form className={classes.root}>
      <FormControlInput
        id="template-name"
        fullWidth={true}
        label={t('File Name')}
        formControlLabelClass={[classes.label, classes.labelTransform].join(
          ' '
        )}
      />
      <FormControlSelect
        id="template-group"
        fullWidth={true}
        label={t('Group')}
        formControlLabelClass={[classes.label, classes.labelTransform].join(
          ' '
        )}
      />
      <FormControlSelect
        id="template-duration"
        fullWidth={true}
        label={t('Duration')}
        formControlLabelClass={[classes.label, classes.labelTransform].join(
          ' '
        )}
      />
      <FormControlDateRangePickers
        id="updated-on"
        label={t('Play Time')}
        dividerText={t('To')}
        formControlLabelClass={classes.label}
        formControlDividerTextClass={classes.datepickerDivider}
        startDatePlaceholderText={'00:00:00'}
        endDatePlaceholderText={'00:00:00'}
      />
      <FormControlInput
        id="template-size"
        label={t('Size')}
        formControlLabelClass={[classes.label, classes.labelTransform].join(
          ' '
        )}
      />
      <CheckboxSwitcher
        id="template-status"
        label={t('Status')}
        formControlLabelClass={classes.label}
      />
      <CheckboxSwitcher
        id="template-approved"
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

export default translate('translations')(withStyles(styles)(TemplateSearchForm))
