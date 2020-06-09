import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import update from 'immutability-helper'
import { withRouter } from 'react-router'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { withSnackbar } from 'notistack'
import {
  withStyles,
  Grid,
  Typography,
  List,
  ListItemIcon,
  ListItemText,
  ListItem
} from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import { Settings } from '@material-ui/icons'

import Card from './Card'
import { ActiveStatusChip, InactiveStatusChip } from '../Chip'
import { WhiteButton } from '../Buttons'
import { DropdownHover } from '../Dropdowns'
import { Checkbox } from '../Checkboxes'
import DeviceMoreInfoCard from './DeviceMoreInfoCard'
import RebootModal from 'components/Pages/Admin/DeviceLibrary/RebootModal'
import MediaModal from 'components/Pages/Admin/DeviceLibrary/MediaModal'
import DeviceCardAlerts from 'components/Pages/Admin/DeviceLibrary/DeviceCardAlerts'

import { getUrlPrefix } from 'utils/index'
import { routeByName } from 'constants/index'
import { useCustomSnackbar } from 'hooks'
import { isEqual, isFalsy } from 'utils/generalUtils'

const styles = ({ palette, type, typography }) => ({
  deviceWrap: {
    padding: '10px'
  },
  cardRoot: {
    padding: 0,
    border: `solid 1px ${palette[type].deviceCard.border}`,
    boxShadow: `0 2px 4px 0 ${palette[type].deviceCard.shadow}`,
    borderRadius: '7px',
    position: 'relative'
  },
  moreInfoMenuDropdownContainer: {
    width: '360px'
  },
  cardHeader: {
    padding: '50px 20px 15px',
    marginBottom: 0,
    backgroundColor: palette[type].deviceCard.header.background,
    borderRadius: '7px 7px 0 0'
  },
  cardHeaderText: {
    fontSize: '16px'
  },
  cardIconButton: {
    fontSize: '18px'
  },
  content: {
    padding: '20px 20px 45px'
  },
  detailRow: {
    height: '32px',
    borderBottom: `1px solid ${palette[type].deviceCard.row.background}`
  },
  detailLabel: {
    ...typography.lightText[type]
  },
  detailValue: {
    ...typography.darkAccent[type]
  },
  footer: {
    padding: '15px 18px',
    backgroundColor: palette[type].deviceCard.footer.background,
    borderRadius: '0 0 7px 7px'
  },
  footerCheckbox: {
    marginRight: '10px'
  },
  actionDropdown: {
    overflow: 'hidden'
  },
  rowActionBtn: {
    minWidth: '32px',
    paddingLeft: '5px',
    paddingRight: '5px',
    boxShadow: '0 1px 0 0 rgba(216, 222, 234, 0.5)',
    color: palette[type].deviceCard.button.color,

    '&:hover': {
      borderColor: '#1c5dca',
      backgroundColor: '#1c5dca',
      color: '#f5f6fa'
    }
  },
  rowActionBtnIcon: {
    width: 18,
    height: 18
  },
  cardActionList: {
    width: '485px',
    display: 'flex',
    flexDirection: 'row'
  },
  actionBtnLink: {
    flex: '1 1 auto',
    flexDirection: 'column',
    width: 100,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    minWidth: '60px',

    '&:not(:last-child)': {
      borderRight: `1px solid ${palette[type].deviceCard.border}`
    }
  },
  actionBtnIconWrap: {
    margin: '15px 0'
  },
  actionBtnIcon: {
    fontSize: '24px',
    color: '#74809a'
  },
  rebootDeviceColor: {
    color: '#d31712'
  },
  actionBtnText: {
    ...typography.lightText[type]
  },
  alertsComponentWrapper: {
    position: 'absolute',
    top: 20,
    left: 20
  }
})

const popupContentStyle = {
  width: 424,
  animation: 'fade-in 200ms'
}

function isEmergencyId({ id }) {
  return isEqual(id, 30)
}

function isCapId({ id }) {
  return isEqual(id, 42)
}

const DeviceCard = ({
  t,
  id,
  classes,
  device,
  isSelected,
  selected,
  setSelected,
  enqueueSnackbar,
  closeSnackbar,
  role,
  handleAlertClick
}) => {
  const showSnackbar = useCustomSnackbar(t, enqueueSnackbar, closeSnackbar)
  const [rebootDevice, setRebootDevice] = useState(false)
  const [mediaDialog, setMediaDialog] = useState(false)
  const [isEmergencyEnabled, isCapEnabled] = useMemo(() => {
    const { feature } = device
    return [feature.some(isEmergencyId), feature.some(isCapId)]
  }, [device])
  const isMediaDisabled = useMemo(() => {
    return isFalsy(isEmergencyEnabled, isCapEnabled)
  }, [isEmergencyEnabled, isCapEnabled])

  // TODO refactor
  const handleClick = useCallback(
    (event, id) => {
      const index = selected.indexOf(id)

      if (index !== -1) {
        setSelected(
          update(selected, {
            $splice: [[index, 1]]
          })
        )
      } else {
        setSelected(
          update(selected, {
            $push: [id]
          })
        )
      }
    },
    [setSelected, selected]
  )

  const handleCopy = useCallback(() => {
    showSnackbar('Copied successfully')
  }, [showSnackbar])

  const renderDeviceCardAlerts = useMemo(() => {
    return (
      device.activeEmergencyAlert && (
        <DeviceCardAlerts
          alertId={device.activeEmergencyAlert}
          deviceId={device.id}
          handleAlertClick={handleAlertClick}
        />
      )
    )
  }, [device, handleAlertClick])

  return (
    <section className={classes.deviceWrap}>
      <Card
        title={device.name}
        menuDropdownContainerClassName={classes.moreInfoMenuDropdownContainer} // This is for More Info dropdown
        menuDropdownComponent={<DeviceMoreInfoCard device={device} />}
        popupContentStyle={popupContentStyle}
        rootClassName={classes.cardRoot}
        headerClasses={[classes.cardHeader]}
        headerTextClasses={classes.cardHeaderText}
        iconButtonClassName={classes.cardIconButton}
      >
        {renderDeviceCardAlerts}
        <div className={classes.content}>
          {!role.org && (
            <Grid
              className={classes.detailRow}
              container
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography className={classes.detailLabel}>
                  {t('Device Account')}
                </Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.detailValue}>
                  {device.client && device.client.name}
                </Typography>
              </Grid>
            </Grid>
          )}
          <Grid
            className={classes.detailRow}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography className={classes.detailLabel}>
                {t('Device Location')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.detailValue}>
                {device.city} {device.state}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            className={classes.detailRow}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography className={classes.detailLabel}>
                {t('Device Last Reboot')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.detailValue}>
                {device.lastReboot}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            className={classes.detailRow}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography className={classes.detailLabel}>
                {t('Device Last Check-in')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.detailValue}>
                {device.lastCheckIn}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            className={classes.detailRow}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography className={classes.detailLabel}>
                {t('Device Firmware')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.detailValue}>
                {device.firmware}
              </Typography>
            </Grid>
          </Grid>
        </div>
        <footer className={classes.footer}>
          <Grid container justify="space-between">
            <Grid item>
              <Grid container>
                <Grid
                  item
                  className={classes.footerCheckbox}
                  onClick={event => handleClick(event, id)}
                >
                  <Checkbox checked={isSelected} />
                </Grid>
                <Grid item>
                  {device.status === 'Active' ? (
                    <ActiveStatusChip label={t('Active')} />
                  ) : (
                    <InactiveStatusChip label={t('Inactive')} />
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <DropdownHover
                menuClassName={classes.actionDropdown}
                buttonHoverColored={true}
                dropSide="bottomCenter"
                ButtonComponent={
                  <WhiteButton className={classes.rowActionBtn}>
                    <Settings className={classes.rowActionBtnIcon} />
                  </WhiteButton>
                }
                MenuComponent={
                  <List
                    component="nav"
                    disablePadding={true}
                    className={classes.cardActionList}
                  >
                    <CopyToClipboard text={device.lanIP} onCopy={handleCopy}>
                      <ListItem button className={classes.actionBtnLink}>
                        <ListItemIcon className={classes.actionBtnIconWrap}>
                          <i
                            className={`icon-file-copy ${classes.actionBtnIcon}`}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('Copy IP')}
                          classes={{ primary: classes.actionBtnText }}
                        />
                      </ListItem>
                    </CopyToClipboard>
                    <ListItem
                      button
                      className={classes.actionBtnLink}
                      component={RouterLink}
                      to={getUrlPrefix(routeByName.device.goToEditGrid(id))}
                    >
                      <ListItemIcon className={classes.actionBtnIconWrap}>
                        <i
                          className={`icon-pencil-write ${classes.actionBtnIcon}`}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={t('Edit')}
                        classes={{ primary: classes.actionBtnText }}
                      />
                    </ListItem>
                    {role.org && (
                      <ListItem
                        button
                        className={classes.actionBtnLink}
                        onClick={() => setMediaDialog(true)}
                        disabled={isMediaDisabled}
                      >
                        <ListItemIcon className={classes.actionBtnIconWrap}>
                          <i
                            className={`icon-files-landscape-video ${classes.actionBtnIcon}`}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('Media')}
                          classes={{ primary: classes.actionBtnText }}
                        />
                      </ListItem>
                    )}
                    <ListItem
                      button
                      className={classes.actionBtnLink}
                      onClick={() => setRebootDevice(true)}
                    >
                      <ListItemIcon className={classes.actionBtnIconWrap}>
                        <i
                          className={`icon-power-button-1 ${[
                            classes.rebootDeviceColor,
                            classes.actionBtnIcon
                          ].join(' ')}`}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={t('Reboot')}
                        classes={{ primary: classes.actionBtnText }}
                      />
                    </ListItem>
                    {role.system && (
                      <ListItem button className={classes.actionBtnLink}>
                        <ListItemIcon className={classes.actionBtnIconWrap}>
                          <i className={`icon-bin ${classes.actionBtnIcon}`} />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('Delete')}
                          classes={{ primary: classes.actionBtnText }}
                        />
                      </ListItem>
                    )}
                  </List>
                }
              />
            </Grid>
          </Grid>
        </footer>
      </Card>

      {rebootDevice && (
        <RebootModal
          device={device}
          open={rebootDevice}
          handleClose={() => setRebootDevice(false)}
        />
      )}

      {mediaDialog && (
        <MediaModal
          id={id}
          open={mediaDialog}
          isEmergencyEnabled={isEmergencyEnabled}
          isCapEnabled={isCapEnabled}
          handleClose={() => setMediaDialog(false)}
        />
      )}
    </section>
  )
}

DeviceCard.propTypes = {
  classes: PropTypes.object
}

export default translate('translations')(
  withStyles(styles)(withSnackbar(withRouter(DeviceCard)))
)
