import { Grid, Paper, Typography, withStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { CheckboxSwitcher } from '../../Checkboxes'
import { PermissionChip } from '../../Chip'
import { DropdownHoverListItem } from '../../Dropdowns'
import Popup from '../../Popup'

const placeholders = ['read', 'create', 'update', 'delete']

export const Toggle = withStyles(theme => {
  const { palette, type } = theme
  return {
    container: {
      display: 'grid',
      grid: '1fr / 86px 184px',
      gap: '8px',
      alignItems: 'center'
    },
    containerMaster: {
      display: 'grid',
      grid: '1fr / max-content minmax(100px,min-content)',
      justifyContent: 'end'
    },
    name: {
      color: palette[type].pages.rbac.primary,
      textTransform: 'capitalize',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      lineHeight: '1.25'
    },
    nameMaster: {
      fontWeight: 'bold',
      lineHeight: '1.75',
      fontSize: '12px'
    },
    permissions: {
      display: 'flex',
      flexFlow: 'row wrap',
      width: 'auto',
      minHeight: '30px',
      minWidth: '190px',
      border: `solid 1px ${palette[type].pages.rbac.toggle.border}`,
      background: palette[type].pages.rbac.background,
      padding: '2.5px',
      '&:hover': {
        boxShadow: palette[type].pages.rbac.shadow
      }
    },
    permissionsMaster: {
      flexFlow: 'row nowrap'
    },

    switchBase: {
      height: '20px'
    },
    switchRoot: {
      transform: 'translateX(16px)'
    },
    switchContainer: {
      width: '100%'
    },

    controlRoot: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between'
    },
    controlLabel: {
      color: 'inherit'
    }
  }
})(({ classes, type, title = '', data = {}, handler = f => f }) => {
  const [permissions, setPermissions] = useState([])

  useEffect(() => {
    if (Object.keys(data).length > 0 && type !== 'master') {
      const actions = Object.values(data)[0].reduce(
        (accumulator, permission) => {
          accumulator[permission.action] = permission
          return accumulator
        },
        {}
      )
      const permissions = placeholders.map(key =>
        actions.hasOwnProperty(key)
          ? actions[key]
          : { action: key, attached: false, placeholder: true }
      )
      setPermissions(permissions)
    } else if (Object.keys(data).length > 0 && type === 'master') {
      const permissions = []
      for (let value of placeholders) {
        const actionState = data
          .filter(({ action }) => action === value)
          .every(action => action.attached === false)
        permissions.push({ action: value, attached: !actionState })
      }
      setPermissions(permissions)
    }
    //eslint-disable-next-line
  }, [data])

  const handleChange = (value, id) => {
    permissions.filter(p => p.id === id)[0].attached = !value
    setPermissions([...permissions])
  }

  const masterToggle = (action, value) => {
    const mutated = permissions.map(key => {
      if (key.action === action) {
        key.attached = !value
      }
      return key
    })
    setPermissions(mutated)
    handler(action, !value)
  }

  return type === 'master' ? (
    <Grid
      container
      className={`${classes.container} ${classes.containerMaster}`}
    >
      <Typography
        component="h3"
        className={`${classes.name} ${classes.nameMaster}`}
      >
        {title}
      </Typography>
      <Paper
        elevation={0}
        className={`${classes.permissions} ${classes.permissionsMaster}`}
      >
        {permissions.length > 0 &&
          permissions.map((permission, index) => {
            return (
              <PermissionChip
                clickHandler={() =>
                  masterToggle(permission.action, permission.attached)
                }
                key={`permission-chip-${index}`}
                active={permission.attached}
                value={permission.action}
              />
            )
          })}
      </Paper>
    </Grid>
  ) : (
    <Grid container className={classes.container}>
      <Typography
        title={title.toLowerCase()}
        className={classes.name}
        component="h3"
      >
        {title}
      </Typography>
      <Popup
        on="hover"
        arrow={false}
        trigger={
          <Paper elevation={0} className={classes.permissions}>
            {permissions.length > 0 &&
              permissions.map((permission, index) => {
                return (
                  <PermissionChip
                    key={`permission-chip-${index}`}
                    active={permission.attached}
                    value={permission.action}
                  />
                )
              })}
          </Paper>
        }
      >
        <Grid item>
          {permissions.length > 0 &&
            permissions.map(
              permission =>
                permission.hasOwnProperty('placeholder') === false && (
                  <DropdownHoverListItem key={`permission-id-${permission.id}`}>
                    <CheckboxSwitcher
                      label={permission.action}
                      switchContainerClass={classes.switchContainer}
                      formControlRootClass={classes.controlRoot}
                      formControlLabelClass={classes.controlLabel}
                      switchBaseClass={classes.switchBase}
                      switchRootClass={classes.switchRoot}
                      handleChange={() =>
                        handleChange(permission.attached, permission.id)
                      }
                      value={permission.attached}
                    />
                  </DropdownHoverListItem>
                )
            )}
        </Grid>
      </Popup>
    </Grid>
  )
})

Toggle.propTypes = {
  classes: PropTypes.object
}
