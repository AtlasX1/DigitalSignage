import React, { useEffect, useState, useCallback } from 'react'
import { translate } from 'react-i18next'
import { Link, Route, withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import { withStyles, Grid } from '@material-ui/core'

import { SideModal } from 'components/Modal'
import { SideTabs, SideTab, TabIcon } from 'components/Tabs'

import Tab from './Tabs/Tab'

import { permissionsUtils, reducerUtils } from 'utils/index'
import { useActions } from 'hooks/index'
import { getTemplateGroupsAction } from 'actions/templateActions'
import { getMediaGroupsAction } from 'actions/mediaActions'
import { getPlaylistGroupsAction } from 'actions/playlistActions'
import { getScheduleGroupsAction } from 'actions/scheduleActions'
import { getDeviceGroupsAction } from 'actions/deviceActions'

const styles = ({ palette, type }) => ({
  permissionsContent: {
    height: '100%'
  },
  permissionsTabsWrap: {
    borderRight: `1px solid ${palette[type].sideModal.content.border}`
  }
})

const tabs = [
  {
    icon: 'icon-adhesive-tape',
    label: 'Media',
    value: 'media',
    groupsAction: getMediaGroupsAction
  },
  {
    icon: 'icon-navigation-filter-video',
    label: 'Playlist',
    value: 'playlist',
    groupsAction: getPlaylistGroupsAction
  },
  {
    icon: 'icon-content-view-agenda',
    label: 'Template',
    value: 'template',
    groupsAction: getTemplateGroupsAction
  },
  {
    icon: 'icon-calendar-1',
    label: 'Schedules',
    value: 'schedule',
    groupsAction: getScheduleGroupsAction
  },
  {
    icon: 'icon-computer-screen-1',
    label: 'Device',
    value: 'device',
    groupsAction: getDeviceGroupsAction
  }
  // {
  //   icon: 'icon-cursor-dial',
  //   label: 'Channels',
  //   value: 'channel',
  //   component: ChannelsTab
  // }
]

const UserPermissions = ({
  t,
  classes,
  match,
  location,
  getPermissionsFn = f => f,
  putPermissionsFn = f => f,
  isGroups = false,
  getReducerName = 'permission',
  putReducerName = 'putPermission',
  clearGetPermissionFn = f => f
}) => {
  const { id, entity } = match.params
  const [name, setName] = useState('')
  const [tab, setTab] = useState(entity)
  const [routes] = useState(permissionsUtils.routesConfig(isGroups, id))
  const [permissions, setPermissions] = useState([])
  const [filteredPermissions, setFilteredPermissions] = useState([])

  const getName = useCallback(() => {
    if (location.state && location.state.name) {
      setName(location.state.name)
    }
  }, [location, setName])

  useEffect(getName, [getName])

  const [
    getPermissionsAction,
    putPermissionsAction,
    clearGetPermissionAction
  ] = useActions(
    [getPermissionsFn, putPermissionsFn, clearGetPermissionFn],
    [getPermissionsFn, putPermissionsFn, clearGetPermissionFn]
  )

  const reducerCallback = useCallback(
    state => {
      return [state.users[getReducerName], state.users[putReducerName]]
    },
    [getReducerName, putReducerName]
  )

  const [permissionReducer, putPermissionReducer] = useSelector(reducerCallback)

  const getPermissions = useCallback(
    entity => {
      getPermissionsAction(
        permissionsUtils.createGetReqObj(isGroups, id, entity)
      )
    },
    [getPermissionsAction, id, isGroups]
  )

  const onPermissionsChangeResponse = useCallback(response => {
    setPermissions(per => permissionsUtils.update(per, response.data) || per)
  }, [])

  const onPermissionsChange = useCallback(() => {
    reducerUtils.parse(permissionReducer, onPermissionsChangeResponse)
  }, [permissionReducer, onPermissionsChangeResponse])

  const onPutPermissionResponse = useCallback(() => {
    getPermissions(entity)
  }, [getPermissions, entity])

  const onPutPermissionChange = useCallback(() => {
    reducerUtils.parse(putPermissionReducer, onPutPermissionResponse)
  }, [putPermissionReducer, onPutPermissionResponse])

  useEffect(() => {
    getPermissions('media')
    getPermissions('playlist')
    getPermissions('template')
    getPermissions('schedule')
    getPermissions('device')
  }, [getPermissions])
  useEffect(onPermissionsChange, [onPermissionsChange])
  useEffect(onPutPermissionChange, [onPutPermissionChange])

  const handleChange = useCallback((e, newTab) => setTab(newTab), [setTab])

  const filterPermissions = useCallback(() => {
    setFilteredPermissions(permissionsUtils.filter(entity, permissions))
  }, [entity, permissions])

  useEffect(filterPermissions, [filterPermissions])

  const putPermissions = useCallback(
    data => {
      putPermissionsAction(permissionsUtils.createPutReqObj(isGroups, id, data))
    },
    [putPermissionsAction, id, isGroups]
  )

  // TODO Refactor
  const onReadChange = useCallback(
    (value, groupId) => {
      putPermissions(permissionsUtils.change(true, value, groupId, permissions))
    },
    [permissions, putPermissions]
  )

  const onWriteChange = useCallback(
    (value, groupId) => {
      putPermissions(
        permissionsUtils.change(false, value, groupId, permissions)
      )
    },
    [permissions, putPermissions]
  )

  useEffect(() => {
    return clearGetPermissionAction
  }, [clearGetPermissionAction])

  return (
    <SideModal
      width="78%"
      title={t('Permissions modal title', { userName: name })}
      closeLink={routes.getCloseLink()}
    >
      <Grid container className={classes.permissionsContent}>
        <Grid item className={classes.permissionsTabsWrap}>
          <SideTabs value={tab} onChange={handleChange}>
            {tabs.map((tab, index) => (
              <SideTab
                key={index}
                disableRipple
                icon={<TabIcon iconClassName={tab.icon} />}
                component={Link}
                label={t(tab.label)}
                value={tab.value}
                to={routes.getLink(tab.value)}
              />
            ))}
          </SideTabs>
        </Grid>
        <Grid item xs>
          {tabs.map((tab, index) => (
            <Route
              key={index}
              path={routes.getMatch(tab.value)}
              render={props => (
                <Tab
                  {...props}
                  groupsAction={tab.groupsAction}
                  entity={tab.value}
                  permissions={filteredPermissions}
                  onReadChange={onReadChange}
                  onWriteChange={onWriteChange}
                />
              )}
            />
          ))}
        </Grid>
      </Grid>
    </SideModal>
  )
}

UserPermissions.propTypes = {
  getPermissionsFn: PropTypes.func,
  putPermissionsFn: PropTypes.func,
  isGroups: PropTypes.bool,
  getReducerName: PropTypes.string,
  putReducerName: PropTypes.string,
  clearGetPermissionFn: PropTypes.func
}

export default compose(
  translate('translations'),
  withStyles(styles),
  withRouter
)(UserPermissions)
