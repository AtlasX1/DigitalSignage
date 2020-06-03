import { Grid, Typography, withStyles } from '@material-ui/core'
import { KeyboardArrowDown, Settings } from '@material-ui/icons'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { translate } from 'react-i18next'
import { Link } from 'react-router-dom'
import { WhiteButton } from '../../Buttons'
import {
  DropdownHoverListItem,
  DropdownHoverListItemIcon,
  DropdownHoverListItemText
} from '../../Dropdowns'
import FormControlInput from '../../Form/FormControlInput'
import Popup from '../../Popup'

const styles = theme => {
  const { palette, type } = theme
  return {
    searchContainer: {
      background: palette[type].pages.rbac.header.background,
      padding: '8px',
      borderTop: 'none',
      borderBottom: `1px solid ${palette[type].pages.rbac.header.border}`
    },
    searchRoot: {
      margin: '0px'
    },
    inputIcon: {
      position: 'absolute',
      right: '0',
      fontSize: '1.2rem',
      lineHeight: '38px',
      marginRight: '8px',
      color: palette[type].pages.rbac.primary
    },
    role: {
      height: '85px',
      padding: '10px 10px 10px 15px',
      borderBottom: `1px solid ${palette[type].pages.rbac.header.border}`,
      overflow: 'hidden',
      '&:hover': {
        '& > div > i ': {
          color: palette[type].pages.rbac.roles.hover.color
        }
      },
      '&.active': {
        background: palette[type].pages.rbac.roles.active.background,
        '& > div > i ': {
          color: palette[type].pages.rbac.roles.active.color
        }
      }
    },
    roleIcon: {
      fontSize: '26px',
      color: '#9394A0'
    },
    roleContent: {
      lineHeight: '1.25',
      marginLeft: '10px',
      overflow: 'hidden'
    },
    chip: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    name: {
      fontSize: '14px',
      fontWeight: 'bold',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      color: palette[type].pages.rbac.emphasis
    },
    description: {
      maxHeight: '34px',
      fontSize: '12px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      color: '#8A8EA3'
    },
    roleOption: {
      minWidth: '61px',
      paddingLeft: '10px',
      paddingRight: '10px',
      background: palette[type].pages.rbac.roles.chip.background,
      color: palette[type].pages.rbac.roles.chip.color,
      border: `1px solid ${palette[type].pages.rbac.roles.chip.border}`,
      boxShadow: palette[type].pages.rbac.roles.chip.shadow,
      '&:hover': {
        borderColor: '#1C5DCA',
        background: '#1C5DCA',
        color: '#FFF'
      }
    },
    roleOptionIcon: {
      width: 18,
      height: 18
    }
  }
}
const Roles = ({ t, classes, roleData = [], roleEventHandler = f => f }) => {
  const [activeRole, setActiveRole] = useState('')
  const [roles, setRoles] = useState([])
  const [search, setSearch] = useState('')
  const [cache, setCache] = useState([])

  useEffect(() => {
    if (search.length > 0) {
      const filter = new RegExp(`${search}`, 'i')
      if (cache.length < 1) {
        setCache(roles)
      }
      const filteredRoles = roleData.filter(key => {
        return filter.test(key.displayName) || filter.test(key.description)
      })
      setRoles([...filteredRoles])
    } else if (search.length < 1 && cache.length > 0) {
      setRoles(cache)
      setCache([])
    } //eslint-disable-next-line
  }, [search])

  useEffect(() => {
    roleData && roleData.length > 0 ? setRoles(roleData) : setRoles([])
  }, [roleData])

  const cloneRole = role => {
    roleEventHandler('clone-role', role)
  }

  const editRole = role => {
    roleEventHandler('edit-role', role)
  }

  const deleteRole = index => {
    setRoles(roles.filter((_, roleIndex) => roleIndex !== index))
  }

  return (
    <>
      <FormControlInput
        icon={<i className={`icon-search ${classes.inputIcon}`} />}
        formControlContainerClass={classes.searchContainer}
        handleChange={e => setSearch(e.target.value)}
        formControlInputRootClass={classes.inputRoot}
        formControlLabelClass={classes.inputLabel}
        formControlRootClass={classes.searchRoot}
        formControlInputClass={classes.input}
        placeholder={t('Search Roles')}
        value={search}
      />
      {roles &&
        roles.length > 0 &&
        roles.map((role, index) => (
          <Grid
            item
            container
            xs={12}
            wrap="nowrap"
            direction="row"
            alignItems="center"
            key={`${role.name}-${index}`}
            onClick={() => {
              setActiveRole(role)
              roleEventHandler('select-role', role)
            }}
            className={`${classes.role} ${
              activeRole.name === role.name && 'active'
            }`}
          >
            <Grid item xs={1}>
              <i className={`icon-user-settings ${classes.roleIcon}`} />
            </Grid>
            <Grid
              title={role.description}
              item
              xs={8}
              className={classes.roleContent}
            >
              <Typography className={classes.name}>
                {role.displayName}
              </Typography>
              <Typography className={classes.description}>
                {role.description}
              </Typography>
            </Grid>
            <Grid item xs={3} className={classes.chip}>
              <Popup
                position="bottom right"
                trigger={
                  <WhiteButton className={classes.roleOption}>
                    <Settings className={classes.roleOptionIcon} />
                    <KeyboardArrowDown className={classes.roleOptionIcon} />
                  </WhiteButton>
                }
                contentStyle={{
                  width: 'auto',
                  borderRadius: 6,
                  animation: 'fade-in 500ms'
                }}
              >
                <Grid item>
                  <DropdownHoverListItem
                    component={Link}
                    to={'/system/roles-permissions/modify-role/clone'}
                    onClick={() => cloneRole(role)}
                  >
                    <DropdownHoverListItemText primary={t('Clone')} />
                  </DropdownHoverListItem>
                  <DropdownHoverListItem
                    component={Link}
                    to={'/system/roles-permissions/modify-role/edit'}
                    onClick={() => editRole(role)}
                  >
                    <DropdownHoverListItemText primary={t('Edit')} />
                  </DropdownHoverListItem>
                  <DropdownHoverListItem onClick={() => deleteRole(index)}>
                    <DropdownHoverListItemIcon>
                      <i className="icon-bin" />
                    </DropdownHoverListItemIcon>
                    <DropdownHoverListItemText primary={t('Delete User')} />
                  </DropdownHoverListItem>
                </Grid>
              </Popup>
            </Grid>
          </Grid>
        ))}
    </>
  )
}

Roles.propTypes = {
  classes: PropTypes.object
}

export default translate('translations')(withStyles(styles)(Roles))
