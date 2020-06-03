import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import {
  Dialog,
  withStyles,
  Typography,
  IconButton,
  Grid,
  Tooltip
} from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'

import { TabToggleButton, TabToggleButtonGroup } from 'components/Buttons'
import { ModalPaper } from 'components/Paper'

import {
  getDeviceReboot,
  getDeviceSleepMode,
  clearGetDeviceRebootInfo,
  clearGetDeviceSleepModeInfo
} from 'actions/deviceActions'

import RebootForm from './RebootForm'
import SleepModeForm from './SleepModeForm'

const styles = theme => {
  const { palette, type } = theme
  return {
    dialogPaper: {
      overflow: 'visible',
      background: 'transparent'
    },
    paper: {
      width: 600,
      padding: '25px 30px',
      position: 'relative'
    },
    title: {
      fontSize: 25,
      color: palette[type].pages.devices.rebootModal.title.color,
      marginBottom: 15
    },
    closeButton: {
      position: 'absolute',
      right: 30,
      top: 15
    },
    closeIcon: {
      color: palette[type].sideModal.header.titleColor
    },
    infoContainer: {
      marginBottom: 10
    },
    infoText: {
      flex: 1,
      fontSize: 15
    },
    infoLabel: {
      color: palette[type].pages.devices.rebootModal.info.label.color
    },
    infoValue: {
      fontWeight: 600,
      color: palette[type].pages.devices.rebootModal.info.value.color
    },
    checkboxLabel: {
      fontSize: 15
    },
    checkboxContainer: {
      position: 'relative',
      left: -15,
      flex: 1
    },
    checkboxInputs: {
      flex: 1
    },
    inputContainer: {
      width: 75
    },
    selectContainer: {
      width: 'calc(100% - 95px)'
    },
    containerMB: {
      marginBottom: 25
    },
    button: {
      width: 100,

      '&:first-child': {
        marginRight: 10
      }
    },
    tabConatiner: {
      marginBottom: '1rem'
    },
    tabTooltipFix: {
      display: 'none'
    }
  }
}

export const modalTabs = {
  REBOOT: 'reboot',
  SLEEP_MODE: 'sleep'
}

const RebootModal = ({
  t,
  device,
  classes,
  open = false,
  handleClose = f => f,
  rebootReducer,
  sleepModeReducer,
  getDeviceReboot,
  getDeviceSleepMode,
  clearGetDeviceRebootInfo,
  clearGetDeviceSleepModeInfo
}) => {
  const id = device ? device.id : null

  const [selectedTab, setSelectedTab] = useState(modalTabs.REBOOT)
  const [rebootData, setRebootData] = useState({})
  const [initialRebootValues, setInitialRebootValues] = useState({})
  const [initialSleepModeValues, setInitialSleepModeValues] = useState({})

  const getCurrentDate = useMemo(() => moment().format('YYYY:MM:DD HH:mm'), [])

  useEffect(() => {
    if (!rebootReducer.response) {
      getDeviceReboot(id)
    }
    if (!sleepModeReducer.response) {
      getDeviceSleepMode(id)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (rebootReducer.response) {
      const { response } = rebootReducer
      setRebootData(response)
      const { rebootDetails } = response
      const newFormValues = {
        ...rebootDetails,
        rebootAt: rebootDetails.rebootAt || getCurrentDate,
        rebootAfterUnit: rebootDetails.rebootAfterUnit || '',
        rebootAfterValue: rebootDetails.rebootAfterValue || '',
        ignoreMediaDownloading: Boolean(rebootDetails.ignoreMediaDownloading)
      }
      setInitialRebootValues(newFormValues)

      clearGetDeviceRebootInfo()
    } else if (rebootReducer.error) {
      clearGetDeviceRebootInfo()
    }
    // eslint-disable-next-line
  }, [rebootReducer])

  useEffect(() => {
    if (sleepModeReducer.response) {
      const { response } = sleepModeReducer

      const newFormValues = response.reduce(
        (formValues, { day, startTime, endTime }) => ({
          ...formValues,
          [day]: {
            startTime,
            endTime
          }
        }),
        {}
      )

      setInitialSleepModeValues(newFormValues)

      clearGetDeviceSleepModeInfo()
    } else if (rebootReducer.error) {
      clearGetDeviceSleepModeInfo()
    }
    // eslint-disable-next-line
  }, [sleepModeReducer])

  const hasSleepModeFeature = useMemo(
    () =>
      device.feature &&
      device.feature.some(feature => feature.name === 'SleepMode'),
    [device]
  )

  const handleTabChange = (event, tab) => {
    if (tab) {
      setSelectedTab(tab)
    }
  }

  const tabs = [
    <TabToggleButton key={modalTabs.REBOOT} value={modalTabs.REBOOT}>
      {t('Reboot device tab')}
    </TabToggleButton>,
    hasSleepModeFeature ? (
      <TabToggleButton key={modalTabs.SLEEP_MODE} value={modalTabs.SLEEP_MODE}>
        {t('Sleep Mode device tab')}
      </TabToggleButton>
    ) : (
      <Tooltip
        key={`${modalTabs.SLEEP_MODE}_disabled`}
        title={t('This is a PREMIUM feature')}
      >
        <span>
          <TabToggleButton disabled className={classes.tabTooltipFix} value="">
            {''}
          </TabToggleButton>
          <TabToggleButton value={modalTabs.SLEEP_MODE} disabled>
            {t('Sleep Mode device tab')}
          </TabToggleButton>
        </span>
      </Tooltip>
    )
  ]

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      classes={{
        paper: classes.dialogPaper
      }}
    >
      <ModalPaper className={classes.paper}>
        <Typography className={classes.title}>
          {t('Reboot Device modal title')}
        </Typography>

        <IconButton className={classes.closeButton} onClick={handleClose}>
          <CloseIcon className={classes.closeIcon} />
        </IconButton>

        <Grid container justify="center" className={classes.tabConatiner}>
          <TabToggleButtonGroup
            exclusive
            value={selectedTab}
            onChange={handleTabChange}
          >
            {tabs}
          </TabToggleButtonGroup>
        </Grid>

        {selectedTab === modalTabs.REBOOT && (
          <RebootForm
            id={id}
            handleClose={handleClose}
            data={rebootData}
            initialRebootValues={initialRebootValues}
          />
        )}
        {selectedTab === modalTabs.SLEEP_MODE && (
          <SleepModeForm
            id={id}
            handleClose={handleClose}
            initialValues={initialSleepModeValues}
          />
        )}
      </ModalPaper>
    </Dialog>
  )
}

RebootModal.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  device: PropTypes.object,
  rebootReducer: PropTypes.object,
  getDeviceReboot: PropTypes.func,
  clearGetDeviceRebootInfo: PropTypes.func
}

const mapStateToProps = ({ device }) => ({
  rebootReducer: device.reboot,
  sleepModeReducer: device.sleepMode
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDeviceReboot,
      getDeviceSleepMode,
      clearGetDeviceRebootInfo,
      clearGetDeviceSleepModeInfo
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RebootModal))
)
