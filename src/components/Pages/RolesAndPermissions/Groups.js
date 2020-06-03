import { Grid, Typography, withStyles } from '@material-ui/core'
import { withSnackbar } from 'notistack'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { translate } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  putRolePermissionByIdAction,
  clearGetRolePermissionByIdAction,
  clearPutRolePermissionByIdAction
} from '../../../actions/roleActions'
import { WhiteButton } from '../../Buttons'
import FormControlInput from '../../Form/FormControlInput'
import ActionBar from './ActionBar'
import { Group } from './Group'
import { Toggle } from './Toggle'

const styles = theme => {
  const { palette, type } = theme
  return {
    header: {
      display: 'grid',
      grid: '1fr / 1fr max-content',
      justifyItems: 'stretch',
      background: palette[type].pages.rbac.header.background,
      width: '100%',
      borderTop: 'none',
      borderBottom: `1px solid ${palette[type].pages.rbac.header.border}`
    },
    searchRoot: {
      margin: '0px'
    },
    searchContainer: {
      padding: '8px'
    },
    subHeader: {
      display: 'grid',
      grid: '1fr / repeat(2,1fr)',
      justifyContent: 'end',
      alignItems: 'end',
      margin: '10px',
      padding: '0 0 8px 8px',
      borderBottom: `1px solid ${palette[type].pages.rbac.header.border}`
    },
    title: {
      color: '#74809A',
      fontSize: '15px',
      justifySelf: 'start'
    },
    permissions: {
      display: 'grid',
      gridColumn: '1 / 4'
    },
    permissionsContent: {
      display: 'grid',
      grid: 'auto / repeat(3,1fr)',
      padding: '8px 0 8px 8px'
    },
    groups: {
      display: 'grid',
      grid: '1fr / repeat(3, 1fr)',
      gridGap: '8px',
      padding: '0 10px 10px'
    },

    inputIcon: {
      position: 'absolute',
      color: palette[type].pages.rbac.primary,
      right: '0',
      fontSize: '1.2rem',
      lineHeight: '38px',
      marginRight: '8px'
    },
    expandCollapse: {
      margin: '8px'
    },
    actionBar: {
      justifyContent: 'flex-end'
    }
  }
}

const Groups = ({
  t,
  classes,
  role,
  rolePermissions = [],
  enqueueSnackbar
}) => {
  const [ungroupedPermissions, setUngroupedPermissions] = useState([])
  const [groupedPermissions, setGroupedPermissions] = useState([])
  const [permissions, setPermissions] = useState([])
  const [expanded, setExpandState] = useState({})
  const [search, setSearch] = useState('')
  const [cache, setCache] = useState([])

  const [pendingUpdate, setPendingUpdate] = useState(null)

  const permissionsUpdated = useSelector(({ role: { put: rolePutResponse } }) =>
    rolePutResponse && Object.keys(rolePutResponse).length > 0
      ? rolePutResponse
      : null
  )

  const dispatch = useDispatch()

  const updatePermissions = useCallback(
    (role, permissions) => {
      setPendingUpdate(role)
      if (role.lockedPermissions) {
        enqueueSnackbar(t("Can't Edit Locked Role"), {
          variant: 'warning'
        })
      } else {
        const formattedPermissions = permissions
          .filter(permission => permission.attached === true)
          .reduce(
            (accumulator, value) => {
              accumulator.permissionIds.push(value.id)
              return accumulator
            },
            { permissionIds: [] }
          )
        dispatch(putRolePermissionByIdAction(role.id, formattedPermissions))
      }
    }, //eslint-disable-next-line
    [dispatch]
  )

  const clearPermissionsById = useCallback(() => {
    dispatch(clearGetRolePermissionByIdAction())
    dispatch(clearPutRolePermissionByIdAction())
  }, [dispatch])

  useEffect(() => {
    if (rolePermissions && rolePermissions.length > 0) {
      setPermissions(rolePermissions)
    }
    return () => clearPermissionsById()
    //eslint-disable-next-line
  }, [rolePermissions])

  useEffect(() => {
    if (
      permissionsUpdated &&
      pendingUpdate &&
      Object.keys(permissionsUpdated).length > 0
    ) {
      const { response, error } = permissionsUpdated
      if (response && Object.values(response).length > 0) {
        enqueueSnackbar(t('Role Permissions Updated'), {
          variant: 'success'
        })
        setPendingUpdate(null)
      } else if (error && Object.values(error).length > 0) {
        enqueueSnackbar(t("Role Permissions Couldn't be Updated"), {
          variant: 'error'
        })
      }
    } //eslint-disable-next-line
  }, [permissionsUpdated])

  useEffect(() => {
    if (permissions.length > 0) {
      const formattedPermissions = permissions.reduce(
        (accumulator, permission) => {
          accumulator[permission.group] =
            accumulator[permission.group] === undefined ||
            accumulator[permission.group] === null
              ? [permission]
              : [...accumulator[permission.group], permission]
          return accumulator
        },
        []
      )

      if (formattedPermissions.group && formattedPermissions.group.length > 0) {
        const filter = new RegExp('(client group)+')
        const clientGroup = []
        formattedPermissions.group = formattedPermissions.group.filter(
          permission => {
            if (filter.test(permission.name)) {
              permission.group = 'clientGroup'
              clientGroup.push(permission)
              return false
            } else {
              return true
            }
          }
        )
        if (clientGroup.length > 0) {
          formattedPermissions['clientGroup'] = clientGroup
        }
      }

      const groupFilter = {
        device: 'device',
        group: 'group',
        media: 'media',
        playlist: '(smart)*playlist',
        schedule: 'schedule',
        template: 'template',
        user: 'user',
        client: 'client'
      }

      const splitByUpper = word => {
        if (word && word.length > 0) {
          const upperWithin = new RegExp('(?!^[A-Z])+([A-Z])+')
          const match = word.match(upperWithin)
          return match ? word.replace(upperWithin, ` ${match[0]}`) : word
        } else {
          return null
        }
      }

      let permissionGroups = Object.entries(groupFilter)
        .map(([group, filter]) => {
          const rule = new RegExp(
            group === 'playlist' ? `${filter}` : `^${filter}+`,
            'i'
          )
          const matchedGroup = Object.keys(formattedPermissions).reduce(
            (accumulator, name) => {
              const exactMatch = new RegExp(`^${filter}$`)
              let formattedName = exactMatch.test(name)
                ? null
                : name.replace(group, '')
              formattedName = splitByUpper(formattedName)
              if (rule.test(name)) {
                accumulator = [
                  ...accumulator,
                  { [formattedName || name]: formattedPermissions[name] }
                ]
                delete formattedPermissions[name]
              }
              return accumulator
            },
            []
          )
          return matchedGroup.length > 0 && { [group]: matchedGroup }
        })
        .filter(Boolean)

      permissionGroups.ungrouped = Object.entries(formattedPermissions).reduce(
        (accumulator, [key, value]) => [
          ...accumulator,
          { [splitByUpper(key)]: value }
        ],
        []
      )

      setUngroupedPermissions(permissionGroups.ungrouped)

      const expandState = permissionGroups.reduce(
        (accumulator, value) => {
          accumulator[Object.keys(value)[0]] = true
          return accumulator
        },
        { all: true, ungrouped: true }
      )

      setExpandState(expandState)

      const chunks = []
      const spliceMagnitude = Math.ceil(permissionGroups.length / 3)
      while (permissionGroups.length > 0) {
        chunks.push(permissionGroups.splice(0, spliceMagnitude))
      }

      setGroupedPermissions([...chunks])
    }
  }, [permissions])

  useEffect(() => {
    if (search.length > 0) {
      const filter = new RegExp(`${search}`, 'i')
      if (cache.length < 1) {
        setCache(permissions)
      }
      const filteredPermissions = rolePermissions.filter(key =>
        filter.test(key.group)
      )
      setPermissions([...filteredPermissions])
    } else if (search.length < 1 && cache.length > 0) {
      setPermissions(cache)
      setCache([])
    } //eslint-disable-next-line
  }, [search])

  useEffect(() => {
    if (Object.entries(expanded).length > 0) {
      const current = expanded.all
      const all = Object.entries(expanded)
        .filter(([key, value]) => key !== 'all')
        .every(([key, value]) => value === !current)
      if (all) {
        toggleExpandState('all')
      }
    } //eslint-disable-next-line
  }, [expanded])

  const toggleExpandState = state => {
    let derivedState = expanded
    switch (state) {
      case 'all':
        derivedState.all = !expanded.all
        for (let item in expanded) {
          expanded[item] = derivedState.all
        }
        setExpandState(Object.assign({}, expanded, derivedState))
        break
      case 'ungrouped':
        setExpandState(
          Object.assign({}, expanded, { ungrouped: !expanded.ungrouped })
        )
        break
      default:
        derivedState[state] = !derivedState[state]
        setExpandState(Object.assign({}, expanded, derivedState))
        break
    }
  }

  const toggleMaster = (action, value) => {
    const mutatedActions = permissions.map(key => {
      if (key.action === action) {
        key.attached = value
      }
      return key
    })
    setPermissions(mutatedActions)
  }

  return (
    permissions.length > 0 && (
      <>
        <Grid container className={classes.header}>
          <FormControlInput
            icon={<i className={`icon-search ${classes.inputIcon}`} />}
            formControlContainerClass={classes.searchContainer}
            handleChange={e => setSearch(e.target.value)}
            formControlInputRootClass={classes.inputRoot}
            formControlLabelClass={classes.inputLabel}
            formControlRootClass={classes.searchRoot}
            formControlInputClass={classes.input}
            placeholder={t('Search Features')}
            value={search}
          />
          <WhiteButton
            className={`hvr-radial-out ${classes.expandCollapse}`}
            onClick={() => toggleExpandState('all')}
          >
            {t(`${expanded.all ? 'Collapse' : 'Expand'} All`)}
          </WhiteButton>
        </Grid>

        <Grid item className={classes.subHeader}>
          <Typography className={classes.title} component="h1">
            {t('Features')}
          </Typography>
          <Toggle
            handler={(action, value) => toggleMaster(action, value)}
            title={t('Toggle All')}
            data={permissions}
            type="master"
          />
        </Grid>

        <Grid container className={classes.groups}>
          <Grid item className={classes.permissions}>
            <Group
              classes={{ content: classes.permissionsContent }}
              handler={() => toggleExpandState('ungrouped')}
              groupPermissions={ungroupedPermissions}
              expanded={expanded.ungrouped}
              title={t('Permissions')}
            />
          </Grid>
          {groupedPermissions.map((column, index) => {
            return (
              <Grid key={`column-${index}`} item>
                {Object.values(column).map((permissions, index) => {
                  return (
                    <Group
                      groupPermissions={Object.values(permissions)[0]}
                      expanded={expanded[Object.keys(permissions)[0]]}
                      handler={title => toggleExpandState(title)}
                      title={Object.keys(permissions)[0]}
                      key={`permission-group-${index}`}
                    ></Group>
                  )
                })}
              </Grid>
            )
          })}
        </Grid>
        <ActionBar
          onAction={() => updatePermissions(role, permissions)}
          classes={{ root: classes.actionBar }}
          onCancel={() => setPermissions([])}
          actionName={t('Update')}
        />
      </>
    )
  )
}

Groups.propTypes = {
  classes: PropTypes.object.isRequired
}

export default translate('translations')(
  withStyles(styles)(withSnackbar(Groups))
)
