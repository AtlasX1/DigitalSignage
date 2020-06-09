import React, { useEffect, useState } from 'react'
import { translate } from 'react-i18next'
import { Route, withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'

import { SideTabs, SideTab, TabIcon } from 'components/Tabs'
import MediaDropLayout from './MediaDropLayout'
import { withStyles, Grid } from '@material-ui/core'
import { getConfigMediaCategory } from 'actions/configActions'

const styles = theme => {
  const { palette, type } = theme
  return {
    createPlaylistContent: {
      height: '100%'
    },
    createPlaylistTabsWrap: {
      borderRight: `1px solid ${palette[type].sideModal.content.border}`
    },
    sideModalContent: {
      overflow: 'auto'
    }
  }
}

const CreatePlaylistLayout = ({ t, classes, routePath, match, children }) => {
  const { id } = match.params
  const dispatch = useDispatch()
  const configMediaCategory = useSelector(
    ({ config }) => config.configMediaCategory
  )
  const [selectedTab, setSelectedTab] = useState('General')
  const handleChange = (event, selectedTab) => {
    setSelectedTab(selectedTab)
  }
  useEffect(() => {
    dispatch(getConfigMediaCategory())
    // eslint-disable-next-line
  }, [])

  return (
    <Grid container wrap="nowrap" className={classes.createPlaylistContent}>
      <Grid item className={classes.createPlaylistTabsWrap}>
        <SideTabs value={selectedTab} onChange={handleChange}>
          {configMediaCategory.response &&
            configMediaCategory.response.length &&
            configMediaCategory.response.map(item => (
              <SideTab
                key={`tab_${item.name}`}
                disableRipple={true}
                icon={<TabIcon iconClassName={item.icon} />}
                label={t(`${item.name} Tab`)}
                value={item.name}
              />
            ))}
        </SideTabs>
      </Grid>
      <Grid item xs>
        <Route
          path={routePath}
          render={props => (
            <MediaDropLayout {...props} tabName={selectedTab} playlistId={id}>
              {children}
            </MediaDropLayout>
          )}
        />
      </Grid>
    </Grid>
  )
}

export default compose(
  translate('translations'),
  withStyles(styles),
  withRouter
)(CreatePlaylistLayout)
