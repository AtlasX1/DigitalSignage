import React, { useState, useEffect, useCallback } from 'react'
import { translate } from 'react-i18next'
import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withSnackbar } from 'notistack'
import { withStyles, Grid, Typography } from '@material-ui/core'

import { Card } from 'components/Card'
import { CheckboxSwitcher } from 'components/Checkboxes'
import Loader from 'components/Loader'

import { useActions } from 'hooks/index'
import { reducerUtils, permissionsUtils } from 'utils/index'

const styles = ({ palette, type }) => ({
  tabWrap: {
    height: '100%',
    padding: '40px 0 0',
    borderTop: `1px solid ${palette[type].sideModal.content.border}`
  },
  tabContentWrap: {
    padding: '0 30px'
  },

  header: {
    border: `solid 1px ${palette[type].sideModal.content.border}`,
    backgroundColor: palette[type].sideModal.action.background,
    marginBottom: '10px'
  },
  headerText: {
    width: '100%',
    fontWeight: 'bold',
    lineHeight: '42px',
    color: '#0f2147'
  },
  permissionsHeadingText: {
    fontSize: '15px',
    textAlign: 'center',
    lineHeight: '40px',
    color: '#74809a'
  },
  permissionsList: {
    borderTop: `1px solid ${palette[type].sideModal.content.border}`,
    padding: '0 0 0 30px'
  },
  permissionRow: {
    borderBottom: `1px solid ${palette[type].sideModal.action.border}`,
    height: '42px'
  },
  permissionLabel: {
    color: '#74809a'
  },
  permissionCheckboxSwitcher: {
    height: '40px'
  },
  loaderContainer: {
    minHeight: 100
  },
  loaderTitle: {
    fontSize: 20
  }
})

const Tab = ({
  t,
  classes,
  entity = 'playlist',
  groupsAction,
  permissions = [],
  onReadChange = f => f,
  onWriteChange = f => f
}) => {
  const selectorCallback = useCallback(state => [state[entity].groups], [
    entity
  ])

  const [groupsReducer] = useSelector(selectorCallback)

  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(true)
  const [groups, setGroups] = useState({ data: [] })

  const [getGroupsAction] = useActions([groupsAction], [groupsAction])

  const hideLoading = useCallback(() => setLoading(false), [])

  const getGroups = useCallback(() => {
    reducerUtils.checkReducer(groupsReducer, getGroupsAction)
  }, [getGroupsAction, groupsReducer])

  const onGroupsChange = useCallback(() => {
    reducerUtils.parse(groupsReducer, setGroups, () => {}, hideLoading)
  }, [groupsReducer, hideLoading])

  useEffect(getGroups, [getGroups])
  useEffect(onGroupsChange, [onGroupsChange])

  const getIsRead = useCallback(
    id => {
      return permissionsUtils.checkboxValue(true, id, permissions)
    },
    [permissions]
  )

  const getIsWrite = useCallback(
    id => {
      return permissionsUtils.checkboxValue(false, id, permissions)
    },
    [permissions]
  )

  return loading ? (
    <Loader
      titleClassName={classes.loaderTitle}
      containerClassName={classes.loaderContainer}
    />
  ) : (
    <Grid
      container
      direction="column"
      alignItems="stretch"
      className={classes.tabWrap}
    >
      <Grid item className={classes.tabContentWrap}>
        <Card
          icon={false}
          grayHeader={true}
          shadow={false}
          radius={false}
          removeSidePaddings={true}
          headerSidePaddings={true}
          removeNegativeHeaderSideMargins={true}
          headerClasses={[classes.header]}
          headerTextClasses={[classes.headerText]}
          titleComponent={
            <CheckboxSwitcher
              label={t('Allow')}
              value={allowed}
              handleChange={setAllowed}
            />
          }
        >
          <Grid container>
            <Grid item xs={6}>
              <Grid container justify="flex-end">
                <Grid item xs={2}>
                  <Typography className={classes.permissionsHeadingText}>
                    {t('Read')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography className={classes.permissionsHeadingText}>
                    {t('Write')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container className={classes.permissionsList}>
            <Grid item xs={6}>
              <Grid container>
                {groups.data.map((group, index) => (
                  <Grid item xs={12} key={`permission-${index}`}>
                    <Grid
                      className={classes.permissionRow}
                      container
                      justify="space-between"
                      alignItems="center"
                    >
                      <Grid item xs={6}>
                        <Typography className={classes.permissionLabel}>
                          {group.title}
                        </Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Grid container>
                          <Grid item xs={6}>
                            <CheckboxSwitcher
                              value={getIsRead(group.id)}
                              handleChange={value =>
                                onReadChange(value, group.id)
                              }
                            />
                          </Grid>
                          <Grid item xs={5}>
                            <CheckboxSwitcher
                              value={getIsWrite(group.id)}
                              handleChange={value =>
                                onWriteChange(value, group.id)
                              }
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )
}

Tab.propTypes = {
  entity: PropTypes.string,
  items: PropTypes.array,
  groupsAction: PropTypes.func,
  permissions: PropTypes.array,
  onReadChange: PropTypes.func,
  onWriteChange: PropTypes.func
}

export default compose(
  translate('translations'),
  withStyles(styles),
  withSnackbar
)(Tab)
