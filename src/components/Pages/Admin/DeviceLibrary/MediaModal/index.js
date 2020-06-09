import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import {
  withStyles,
  Dialog,
  Typography,
  IconButton,
  Grid
} from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'

import { ModalPaper } from 'components/Paper'
import { TabToggleButtonGroup, TabToggleButton } from 'components/Buttons'
import EmergencyAlert from './EmergencyAlert'
import CapAlert from './CapAlert'

import { isEmpty, isEqual, isNumber } from 'utils/generalUtils'

const styles = ({ palette, type }) => ({
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
  toggleButtonsContainer: {
    marginBottom: 20
  }
})

function MediaModal({
  t,
  id,
  open,
  handleClose,
  classes,
  isEmergencyEnabled,
  isCapEnabled
}) {
  const [currentTab, setCurrentTab] = useState(0)
  const tabs = useMemo(() => {
    return [
      {
        title: t('Emergency Alert'),
        enabled: isEmergencyEnabled,
        component: EmergencyAlert
      },
      {
        title: t('CAP Alert'),
        enabled: isCapEnabled,
        component: CapAlert
      }
    ]
  }, [t, isCapEnabled, isEmergencyEnabled])

  const enabledTabs = useMemo(() => {
    return tabs
      .filter(({ enabled }) => enabled)
      .map((tab, index) => ({ id: index, ...tab }))
  }, [tabs])

  const handleTabChange = useCallback(
    (_, newTab) => {
      if (isNumber(newTab)) {
        setCurrentTab(newTab)
      }
    },
    [setCurrentTab]
  )

  const renderTabButtons = useMemo(() => {
    return enabledTabs.map(({ title, id }) => {
      return (
        <TabToggleButton value={id} key={id}>
          {title}
        </TabToggleButton>
      )
    })
  }, [enabledTabs])

  const renderTab = useMemo(() => {
    if (isEmpty(enabledTabs)) return null
    const { component: Component } = enabledTabs.find(({ id }) => {
      return isEqual(id, currentTab)
    })
    return <Component id={id} />
  }, [currentTab, enabledTabs, id])

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
          {t('Device media associations')}
        </Typography>

        <IconButton className={classes.closeButton} onClick={handleClose}>
          <CloseIcon className={classes.closeIcon} />
        </IconButton>

        <Grid container direction="column">
          <Grid
            container
            justify="center"
            className={classes.toggleButtonsContainer}
          >
            <TabToggleButtonGroup
              value={currentTab}
              exclusive
              onChange={handleTabChange}
            >
              {renderTabButtons}
            </TabToggleButtonGroup>
          </Grid>

          <Grid container direction="column">
            {renderTab}
          </Grid>
        </Grid>
      </ModalPaper>
    </Dialog>
  )
}

MediaModal.propTypes = {
  id: PropTypes.number,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  isEmergencyEnabled: PropTypes.bool,
  isCapEnabled: PropTypes.bool
}

MediaModal.defaultProps = {
  open: false,
  handleClose: f => f,
  isEmergencyEnabled: true,
  isCapEnabled: true
}

export default compose(
  translate('translations'),
  withStyles(styles)
)(MediaModal)
