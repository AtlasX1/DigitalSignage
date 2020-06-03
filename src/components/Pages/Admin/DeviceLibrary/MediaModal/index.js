import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { translate } from 'react-i18next'

import {
  withStyles,
  Dialog,
  Typography,
  IconButton,
  Grid
} from '@material-ui/core'

import { Close as CloseIcon } from '@material-ui/icons'

import { ModalPaper } from '../../../../Paper'

import { TabToggleButtonGroup, TabToggleButton } from '../../../../Buttons'

import MediaStatus from './MediaStatus'
import EmergencyAlert from './EmergencyAlert'
import CapAlert from './CapAlert'

import {
  getAlertTypesAction,
  clearGetAlertTypesInfoAction
} from '../../../../../actions/configActions'

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

const MediaModal = ({
  t,
  id,
  open = false,
  handleClose = f => f,
  classes,
  alertTypesReducer,
  getAlertTypesAction
}) => {
  const [tab, setTab] = useState('media')

  const handleTabChange = (e, type) => {
    if (type) setTab(type)
  }

  useEffect(() => {
    if (!alertTypesReducer.response) {
      getAlertTypesAction()
    }
    // eslint-disable-next-line
  }, [])

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
              value={tab}
              exclusive
              onChange={handleTabChange}
            >
              <TabToggleButton value="media">
                {t('Media Status')}
              </TabToggleButton>
              <TabToggleButton value="emergency">
                {t('Emergency Alert')}
              </TabToggleButton>
              <TabToggleButton value="cap">{t('CAP Alert')}</TabToggleButton>
            </TabToggleButtonGroup>
          </Grid>

          <Grid container direction="column">
            {tab === 'media' && <MediaStatus />}
            {tab === 'emergency' && <EmergencyAlert id={id} />}
            {tab === 'cap' && <CapAlert id={id} />}
          </Grid>
        </Grid>
      </ModalPaper>
    </Dialog>
  )
}

MediaModal.propTypes = {
  id: PropTypes.number,
  open: PropTypes.bool,
  handleClose: PropTypes.func
}

const mapStateToProps = ({ config }) => ({
  alertTypesReducer: config.alertTypes
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getAlertTypesAction,
      clearGetAlertTypesInfoAction
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MediaModal))
)
