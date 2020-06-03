import { Grid, withStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { translate } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import {
  getRolePermissionByIdAction,
  getRolesAction,
  clearGetRolesAction
} from '../../../actions/roleActions'
import { WhiteButton } from '../../Buttons'
import PageContainer from '../../PageContainer'
import { SideTab, SideTabs } from '../../Tabs'
import AddEditRole from './AddEditRole'
import Groups from './Groups'
import Roles from './Roles'

const styles = theme => {
  const { palette, type } = theme
  return {
    pageContainerHeaderOverride: {
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`
    },
    addRoleButton: {
      marginRight: '17px'
    },
    tabs: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    scroller: {
      padding: '55px 0'
    },
    tab: {
      opacity: 1,
      height: '50px',
      margin: '25px -1px 0'
    },
    selected: {
      color: palette[type].pages.rbac.roles.active.color
    },
    icon: {
      fontSize: '28px',
      padding: '0 15px'
    },
    roles: {
      flexDirection: 'column',
      borderLeft: `1px solid ${palette[type].sideModal.content.border}`,
      borderRight: `1px solid ${palette[type].sideModal.content.border}`
    },
    groups: {
      display: 'flex',
      flexFlow: 'column nowrap',
      minHeight: '72vh'
    }
  }
}

const RolesAndPermissions = ({ t, classes }) => {
  const [level, setLevel] = useState('system')
  const [roles, setRoles] = useState([])
  const [role, setRole] = useState({})
  const [rolePermissions, setRolePermissions] = useState([])

  const [storeUser, storeRoles, storePermissions] = useSelector(
    ({
      user: {
        details: { response: userResponse }
      },
      role: {
        role: {
          response: { data: rolesResponse }
        },
        permissionById: { response: permissionsResponse }
      }
    }) => {
      const user = userResponse
        ? {
            id: userResponse.id,
            firstName: userResponse.firstName,
            lastName: userResponse.lastName,
            status: userResponse.status
          }
        : {}
      return [user, rolesResponse || {}, permissionsResponse || {}]
    }
  )

  const dispatch = useDispatch()

  const getRoles = useCallback(
    selectedLevel => {
      dispatch(getRolesAction(selectedLevel))
    },
    [dispatch]
  )

  const getRolePermissions = useCallback(
    id => {
      dispatch(getRolePermissionByIdAction(id))
    },
    [dispatch]
  )

  const clearGetRoles = useCallback(() => {
    dispatch(clearGetRolesAction())
  }, [dispatch])

  useEffect(() => {
    getRoles(level)
    return () => clearGetRoles()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (storeRoles && Object.keys(storeRoles).length > 0) {
      setRoles(storeRoles)
    }
  }, [storeRoles])

  useEffect(() => {
    if (
      role.id &&
      storePermissions &&
      Object.keys(storePermissions).length > 0
    ) {
      setRolePermissions(storePermissions)
    }
  }, [storePermissions, role])

  const handleLevelChange = selectedLevel => {
    setLevel(selectedLevel)
    getRoles(selectedLevel)
    setRole({})
    setRolePermissions([])
  }

  const handleRoleEvent = (event, role) => {
    if (event === 'select-role') {
      getRolePermissions(role.id)
    }
    setRole(role)
  }

  return (
    <PageContainer
      classes={{ pageContainerHeader: classes.pageContainerHeaderOverride }}
      pageTitle={t('Roles And Permissions')}
      ActionButtonsComponent={
        <WhiteButton
          className={`hvr-radial-out ${classes.addRoleButton}`}
          component={Link}
          to={'/system/roles-permissions/modify-role/add'}
        >
          <i className={`icon-user-add`} />
          {t('add Role')}
        </WhiteButton>
      }
      subHeader={false}
    >
      <Grid container justify="flex-end">
        <Grid item xs={2}>
          <SideTabs
            value={level}
            onChange={(_, tab) => handleLevelChange(tab)}
            classes={{ root: classes.tabs, scroller: classes.scroller }}
          >
            <SideTab
              disableRipple
              value="system"
              label={t('System Roles')}
              classes={{ root: classes.tab, selected: classes.selected }}
              icon={<i className={`icon-user-hierarchy1 ${classes.icon}`} />}
            />
            <SideTab
              disableRipple
              value="org"
              label={t('Org Roles')}
              classes={{ root: classes.tab, selected: classes.selected }}
              icon={<i className={`icon-user-group-circle ${classes.icon}`} />}
            />
            <SideTab
              disableRipple
              value="enterprise"
              label={t('Enterprise Roles')}
              classes={{ root: classes.tab, selected: classes.selected }}
              icon={<i className={`icon-network-business ${classes.icon}`} />}
            />
          </SideTabs>
        </Grid>
        <Grid item xs={3} className={classes.roles}>
          <Roles
            roleData={roles}
            roleEventHandler={(event, role) => handleRoleEvent(event, role)}
          />
        </Grid>
        <Grid item xs={7} className={classes.groups}>
          {rolePermissions && rolePermissions.length > 0 && (
            <Groups role={!!role && role} rolePermissions={rolePermissions} />
          )}
        </Grid>
      </Grid>
      <Route
        path="/system/roles-permissions/modify-role/:action"
        render={({ match }) => {
          return (
            <AddEditRole
              role={role}
              metadata={{
                level: level,
                user: storeUser,
                roles: storeRoles,
                permissions: rolePermissions
              }}
              action={match && match.params.action}
            />
          )
        }}
      />
    </PageContainer>
  )
}

RolesAndPermissions.propTypes = {
  classes: PropTypes.object
}

export default translate('translations')(
  withStyles(styles)(RolesAndPermissions)
)
