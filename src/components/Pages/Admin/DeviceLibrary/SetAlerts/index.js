import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { Link, Route, Switch } from 'react-router-dom'
import { withStyles, Grid } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { compose } from 'redux'

import { SideModal } from 'components/Modal'
import { SideTabs, SideTab, TabIcon } from 'components/Tabs'
import { HurricaneTab, CapAlertTab } from './Tabs'

import { getUrlPrefix, deviceAlertsUtils } from 'utils/index'
import { routeByName } from 'constants/index'

const styles = ({ palette, type }) => ({
  addMediaContent: {
    height: '100%'
  },
  addMediaTabsWrap: {
    borderRight: `1px solid ${palette[type].sideModal.content.border}`
  },
  tabContainer: {
    maxHeight: '100%'
  }
})

const SetAlerts = ({ t, classes, location }) => {
  const [alertTypes] = useSelector(state => [state.config.alertTypes.response])
  const [selectedTab, setSelectedTab] = useState(
    deviceAlertsUtils.getTabName(location.pathname)
  )
  const handleChange = useCallback(
    (event, selectedTab) => {
      setSelectedTab(selectedTab)
    },
    [setSelectedTab]
  )
  return (
    <SideModal
      width="78%"
      title={t('Device Alerts')}
      closeLink={getUrlPrefix(routeByName.device.list)}
    >
      <Grid container className={classes.addMediaContent}>
        <Grid item className={classes.addMediaTabsWrap}>
          {!!alertTypes.length && (
            <SideTabs value={selectedTab} onChange={handleChange}>
              <SideTab
                disableRipple={true}
                icon={<TabIcon iconClassName="icon-hat-1" />}
                component={Link}
                label={t('CAP Alert')}
                value="cap-alert"
                to={getUrlPrefix(
                  routeByName.device.alerts.getByName('cap-alert')
                )}
              />
              {alertTypes.map(alert => (
                <SideTab
                  key={alert.id}
                  disableRipple
                  icon={<TabIcon iconClassName={alert.icon} />}
                  component={Link}
                  label={t(alert.name)}
                  value={alert.name.toLowerCase()}
                  to={getUrlPrefix(
                    routeByName.device.alerts.getByName(
                      alert.name.toLowerCase()
                    )
                  )}
                />
              ))}
            </SideTabs>
          )}
        </Grid>
        <Grid item xs className={classes.tabContainer}>
          <Switch>
            <Route
              path={getUrlPrefix(
                routeByName.device.alerts.getByName('cap-alert')
              )}
              component={CapAlertTab}
            />
            <Route
              path={getUrlPrefix(routeByName.device.alerts.match)}
              component={HurricaneTab}
            />
          </Switch>
        </Grid>
      </Grid>
    </SideModal>
  )
}

SetAlerts.propTypes = {
  classes: PropTypes.object
}

export default compose(translate('translations'), withStyles(styles))(SetAlerts)
