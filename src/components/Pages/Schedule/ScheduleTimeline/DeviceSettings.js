import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { SingleDatePicker } from 'react-dates'
import moment from 'moment'

import { withStyles, Grid, Divider } from '@material-ui/core'

import { FormControlInput, FormControlSelect } from '../../../Form'
import { CheckboxSwitcher } from '../../../Checkboxes'
import {
  WhiteButton,
  BlueButton,
  TabToggleButton,
  TabToggleButtonGroup
} from '../../../Buttons'
import {
  DropdownHoverListItem,
  DropdownHoverListItemIcon,
  DropdownHoverListItemText
} from '../../../Dropdowns'

const styles = theme => ({
  root: {
    padding: '20px 15px 10px 15px'
  },
  action: {
    width: '90%'
  },
  actionContainer: {
    marginBottom: '20px'
  },
  label: {
    fontSize: '13px',
    transform: 'translate(0, 1.5px)',
    fontWeight: '300'
  },
  labelContainer: {
    marginTop: 10
  },
  tabsWrap: {
    marginBottom: '20px'
  },
  tabGroup: {
    width: '100%'
  },
  tabButton: {
    flex: '50%'
  },
  divider: {
    margin: '0 -15px'
  },
  switchContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  },
  datePickerContainer: {
    marginBottom: 20,
    justifyContent: 'flex-end'
  }
})

const DeviceSettings = ({ classes, t }) => {
  const [tab, setTab] = useState('clone')
  const [date, setDate] = useState(moment())
  const [dateFocused, setDateFocused] = useState(false)

  return (
    <form className={classes.root}>
      <Grid
        className={classes.tabsWrap}
        container
        alignContent="center"
        justify="center"
      >
        <TabToggleButtonGroup
          exclusive
          value={tab}
          onChange={(e, value) => setTab(value)}
          className={classes.tabGroup}
        >
          <TabToggleButton value="clone" className={classes.tabButton}>
            {t('Clone Screen')}
          </TabToggleButton>
          <TabToggleButton value="repeat" className={classes.tabButton}>
            {t('Set Repeat')}
          </TabToggleButton>
        </TabToggleButtonGroup>
      </Grid>
      {tab === 'clone' && (
        <>
          <FormControlInput
            id="device-mac"
            fullWidth={true}
            label={'MAC'}
            formControlLabelClass={classes.label}
          />
          <FormControlSelect
            id="device-status"
            fullWidth={true}
            placeholder="All"
            label={'Status'}
            formControlLabelClass={classes.label}
          />
          <FormControlSelect
            id="device-source"
            fullWidth={true}
            placeholder="Dev-Multiple"
            label={'Source Screen'}
            formControlLabelClass={classes.label}
          />
          <FormControlSelect
            id="device-destination"
            fullWidth={true}
            placeholder="Select Screen"
            label={'Destination Screen'}
            formControlLabelClass={classes.label}
          />

          <Grid container className={classes.actionContainer}>
            <Grid item xs={6}>
              <BlueButton className={classes.action}>{'OK'}</BlueButton>
            </Grid>
            <Grid item xs={6}>
              <WhiteButton className={classes.action}>{'CANCEL'}</WhiteButton>
            </Grid>
          </Grid>

          <Divider className={classes.divider} />

          <DropdownHoverListItem
            component="button"
            onClick={f => f}
            disableGutters
          >
            <DropdownHoverListItemIcon>
              <i className={'icon-bin'} />
            </DropdownHoverListItemIcon>
            <DropdownHoverListItemText primary="Delete today's schedules" />
          </DropdownHoverListItem>
        </>
      )}
      {tab === 'repeat' && (
        <>
          <CheckboxSwitcher
            label={t('Enable Repeat')}
            value={true}
            formControlLabelClass={classes.label}
            formControlRootClass={classes.switchContainer}
          />

          <Divider />

          <FormControlSelect
            id="content-frequency"
            fullWidth={true}
            placeholder="Weekly"
            label={'Frequency'}
            formControlLabelClass={classes.label}
            formControlContainerClass={classes.labelContainer}
          />
          <FormControlSelect
            id="content-repeat-until"
            fullWidth={true}
            placeholder="All"
            label={'Repeat Until'}
            formControlLabelClass={classes.label}
          />

          <Grid container className={classes.datePickerContainer}>
            <SingleDatePicker
              id="active-on"
              showDefaultInputIcon
              inputIconPosition="after"
              anchorDirection="left"
              placeholder={date.toString()}
              date={date}
              onDateChange={setDate}
              focused={dateFocused}
              onFocusChange={({ focused }) => setDateFocused(focused)}
            />
          </Grid>

          <Grid container className={classes.actionContainer}>
            <Grid item xs={6}>
              <BlueButton className={classes.action}>{'OK'}</BlueButton>
            </Grid>
            <Grid item xs={6}>
              <WhiteButton className={classes.action}>{'CANCEL'}</WhiteButton>
            </Grid>
          </Grid>
        </>
      )}
    </form>
  )
}

DeviceSettings.propTypes = {
  classes: PropTypes.object.isRequired
}

export default translate('translations')(withStyles(styles)(DeviceSettings))
