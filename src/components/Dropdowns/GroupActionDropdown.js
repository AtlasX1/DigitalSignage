import React, { useState, useEffect, useCallback } from 'react'
import { translate } from 'react-i18next'
import update from 'immutability-helper'

import { withSnackbar } from 'notistack'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Button, Grid, List, Typography, withStyles } from '@material-ui/core'
import Tooltip from 'components/Tooltip'

import {
  DropdownHoverListItem,
  DropdownHoverListItemIcon,
  DropdownHoverListItemText
} from 'components/Dropdowns'
import { UserNameView } from 'components/TableLibrary'

import { CheckboxSwitcher } from 'components/Checkboxes'

import Loader from 'components/Loader'

import { getItems } from 'actions/usersActions'

import {
  getGroupPermission,
  clearGetGroupPermissionInfo,
  putGroupPermission,
  clearPutGroupPermissionInfo
} from 'actions/groupActions'

const styles = theme => {
  const { palette, type } = theme
  return {
    header: {
      padding: '20px 15px 15px',
      borderBottom: `1px solid ${palette[type].groupCard.dropdown.border}`,
      background: palette[type].groupCard.dropdown.background,
      borderRadius: '8px 8px 0 0'
    },
    title: {
      fontWeight: 'bold',
      color: palette[type].groupCard.dropdown.color
    },
    headerLabel: {
      fontSize: '13px',
      color: '#74809a',

      '&:last-child': {
        paddingRight: 20
      }
    },
    contentWrap: {
      padding: '0 15px',
      height: '225px',
      maxHeight: '225px',
      overflowY: 'auto',
      background: palette[type].groupCard.dropdown.content.background
    },
    contentItem: {
      flexWrap: 'nowrap',
      '&:not(:last-child)': {
        borderBottom: `1px solid ${palette[type].groupCard.dropdown.border}`
      }
    },
    userName: {
      lineHeight: '38px',
      color: palette[type].groupCard.dropdown.content.color,
      maxWidth: '20ch',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    },
    switcherBase: {
      height: '38px'
    },
    footer: {},
    groupColorsWrap: {
      padding: '10px 20px',
      borderTop: `1px solid ${palette[type].groupCard.dropdown.border}`,
      borderBottom: `1px solid ${palette[type].groupCard.dropdown.border}`
    },
    groupColors: {
      paddingTop: '10px'
    },
    groupColor: {
      width: '14px',
      height: '14px',
      marginRight: '10px',
      border: '3px solid transparent',
      borderRadius: '100%'
    },
    loaderContainer: {
      minHeight: 50,
      padding: 50
    },
    loaderTitle: {
      fontSize: 15
    },
    switchContainer: {
      flexShrink: 0
    }
  }
}

const defaultColors = [
  '#ff7b25',
  '#c077fd',
  '#3983ff',
  '#4fd688',
  '#ff3d84',
  '#535d73',
  '#ff833d',
  '#c6b72d',
  '#f5a623',
  '#7ed321',
  '#50e3c2',
  '#4a90e2',
  '#bd10e0',
  '#f8e71c'
]

const ActionDropdown = ({
  t,
  id,
  classes,
  colors = defaultColors,
  selectedColor = '',
  onSelectColor,
  onDeleteGroup,
  users,
  getItems,
  groupPermissionReducer,
  getGroupPermission,
  clearGetGroupPermissionInfo,
  putGroupPermissionReducer,
  putGroupPermission,
  clearPutGroupPermissionInfo,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const [loading, setLoading] = useState(true)
  const [permission, setPermission] = useState([])
  const [errorsCount, setErrorsCount] = useState(0)

  useEffect(() => {
    getItems()

    if (!groupPermissionReducer.response) {
      getGroupPermission(id)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (groupPermissionReducer.response) {
      setPermission(groupPermissionReducer.response.data)

      clearGetGroupPermissionInfo()
      setLoading(false)
    } else if (groupPermissionReducer.error) {
      clearGetGroupPermissionInfo()
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [groupPermissionReducer])

  useEffect(() => {
    if (putGroupPermissionReducer.response) {
      getGroupPermission(id)

      showSnackbar(t('Successfully changed'))
      clearPutGroupPermissionInfo()
    } else if (putGroupPermissionReducer.error) {
      let message = t('Error')

      if (putGroupPermissionReducer.error.code === 422) {
        message = putGroupPermissionReducer.error.errors[0]
      }

      showSnackbar(message)
      clearPutGroupPermissionInfo()
      setErrorsCount(errorsCount + 1)
    }
    // eslint-disable-next-line
  }, [putGroupPermissionReducer])

  const showSnackbar = title => {
    enqueueSnackbar(title, {
      variant: 'default',
      action: key => (
        <Button
          color="secondary"
          size="small"
          onClick={() => closeSnackbar(key)}
        >
          {t('OK')}
        </Button>
      )
    })
  }

  const getReadInfo = userId => {
    const per = permission.find(p => p.user && p.user.id === userId)
    if (per && typeof per.readPermission === 'number') {
      return per.readPermission === 1
    }
    return false
  }

  const getWriteInfo = userId => {
    const per = permission.find(p => p.user && p.user.id === userId)
    if (per && typeof per.writePermission === 'number') {
      return per.writePermission === 1
    }
    return false
  }

  // TODO Question: if permission object doesn't include
  // TODO user with this id, it means that his values of read and write 1 or 0
  const handleChange = (userId, value, field) => {
    const val = value ? 1 : 0

    let data = []

    permission.forEach(p => {
      data.push({
        userId: p.user.id,
        readPermission: p.readPermission,
        writePermission: p.writePermission
      })
    })

    const user = data.find(u => u.userId === userId)

    if (user) {
      const i = data.indexOf(user)
      data = update(data, {
        [i]: {
          [field]: { $set: val }
        }
      })
    } else {
      const secondField =
        field === 'readPermission' ? 'writePermission' : 'readPermission'

      data = update(data, {
        $push: [
          {
            userId: userId,
            [field]: val,
            [secondField]: 0
          }
        ]
      })
    }

    putGroupPermission({
      id: id,
      data: data
    })
  }

  const handleDeleteGroup = useCallback(() => {
    onDeleteGroup(id)
  }, [onDeleteGroup, id])

  return (
    <section>
      <header className={classes.header}>
        <Grid container justify="space-between">
          <Grid item>
            <Typography className={classes.title}>
              {t('User Permissions')}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Grid container justify="space-between">
              <Grid item>
                <Typography className={classes.headerLabel}>
                  {t('Read')}
                </Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.headerLabel}>
                  {t('Write')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </header>
      <div className={classes.contentWrap}>
        {loading ? (
          <Loader
            containerClassName={classes.loaderContainer}
            titleClassName={classes.loaderTitle}
          />
        ) : (
          <Grid container direction="column">
            {users &&
              users
                .sort((a, b) => (a.firstName > b.firstName ? 1 : -1))
                .map(
                  user =>
                    !!user.role.restricted && (
                      <Grid
                        key={user.id}
                        container
                        justify="space-between"
                        className={classes.contentItem}
                      >
                        <Grid item>
                          <Tooltip title={user.email}>
                            <Typography className={classes.userName}>
                              <UserNameView
                                firstName={user.firstName}
                                lastName={user.lastName}
                              />
                            </Typography>
                          </Tooltip>
                        </Grid>
                        <Grid item className={classes.switchContainer}>
                          <Grid container justify="flex-end">
                            <Grid item>
                              <CheckboxSwitcher
                                disabled={getReadInfo(user.id)}
                                value={getReadInfo(user.id)}
                                switchBaseClass={classes.switcherBase}
                                handleChange={value =>
                                  handleChange(user.id, value, 'readPermission')
                                }
                              />
                            </Grid>
                            <Grid item>
                              <CheckboxSwitcher
                                value={getWriteInfo(user.id)}
                                switchBaseClass={classes.switcherBase}
                                handleChange={value =>
                                  handleChange(
                                    user.id,
                                    value,
                                    'writePermission'
                                  )
                                }
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    )
                )}
          </Grid>
        )}
      </div>
      <footer className={classes.footer}>
        <div className={classes.groupColorsWrap}>
          <Typography className={classes.title}>{t('Group Color')}</Typography>
          <Grid container className={classes.groupColors}>
            {colors.map((color, i) => (
              <Grid
                key={`color-${i}`}
                item
                className={classes.groupColor}
                onClick={() => onSelectColor(id, color)}
                style={{
                  background: color,
                  borderColor: selectedColor === color ? '#74809a' : color
                }}
              />
            ))}
          </Grid>
        </div>

        <List component="nav" disablePadding={true}>
          <DropdownHoverListItem button onClick={handleDeleteGroup}>
            <DropdownHoverListItemIcon>
              <i className="icon-bin" />
            </DropdownHoverListItemIcon>
            <DropdownHoverListItemText primary={t('Delete')} />
          </DropdownHoverListItem>
        </List>
      </footer>
    </section>
  )
}

const mapStateToProps = ({
  users: {
    items: { response: users, meta }
  },
  group
}) => ({
  users,
  meta,
  groupPermissionReducer: group.permission,
  putGroupPermissionReducer: group.putPermission
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getItems,
      getGroupPermission,
      clearGetGroupPermissionInfo,
      putGroupPermission,
      clearPutGroupPermissionInfo
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(ActionDropdown))
  )
)
