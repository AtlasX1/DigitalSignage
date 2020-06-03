import React, { useCallback, useMemo } from 'react'
import { translate } from 'react-i18next'
import { withSnackbar } from 'notistack'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { LocalOffer } from '@material-ui/icons'

import { withStyles, Grid, Paper, Typography } from '@material-ui/core'

import { Checkbox } from '../Checkboxes'
import { TableLibraryRowActionButton } from '../TableLibrary'

import { deleteItem } from 'actions/tagsActions'
import PropTypes from 'prop-types'
import getUserRoleLevel from 'utils/getUserRoleLevel'
import getUrlPrefix from 'utils/permissionUrls'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      padding: '10px',
      margin: '5px 10px',
      borderRadius: '6px',
      borderLeft: '5px solid #3983ff',
      border: `1px solid ${palette[type].tagCard.border}`,
      backgroundColor: palette[type].tagCard.background,
      boxShadow: `0 2px 4px 0 ${palette[type].tagCard.shadow}`
    },
    checkboxWrap: {
      marginRight: '20px'
    },
    label: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: palette[type].tagCard.label.color
    },
    itemCount: {
      width: '37px',
      marginRight: '35px',
      fontSize: '14px',
      lineHeight: '24px',
      textAlign: 'center',
      color: palette[type].tagCard.item.color,
      backgroundColor: palette[type].tagCard.item.background
    },
    actionBtn: {
      minWidth: '61px',
      paddingLeft: '10px',
      paddingRight: '10px',
      color: palette[type].tagCard.button.color,
      boxShadow: '0 1px 0 0 rgba(216, 222, 234, 0.5)',

      '&:hover': {
        borderColor: '#1c5dca',
        backgroundColor: '#1c5dca',
        color: '#fff'
      }
    },
    actionBtnIcon: {
      width: 18,
      height: 18
    },
    iconLocalOffer: {
      color: '#ADB7C9',
      cursor: 'pointer',
      marginRight: '26px',
      '&:hover': {
        color: '#1C5DCA'
      }
    }
  }
}

const TagCard = ({
  t,
  tag,
  classes,
  deleteItem,
  selected,
  onToggleSelect,
  onUnselect
}) => {
  const handleDeleteClick = useCallback(() => {
    deleteItem(tag.id)
    onUnselect(tag.id)
  }, [tag.id, deleteItem, onUnselect])

  const handleClickSelect = useCallback(() => {
    onToggleSelect(tag.id)
  }, [tag.id, onToggleSelect])

  const renderReportList = useMemo(() => {
    if (tag.report === undefined) return null
    return (
      <Grid item>
        <TableLibraryRowActionButton
          actionLinks={[
            {
              label: t('Devices'),
              to: '/device-library/list',
              data: tag.tag,
              value: tag.report.device
            },
            { divider: true },
            {
              label: t('Users'),
              to: getUrlPrefix('users-library'),
              data: tag.tag,
              value: tag.report.user
            },
            { divider: true },
            {
              label: t('Media'),
              to: '/media-library',
              data: tag.tag,
              value: tag.report.media
            },
            { divider: true },
            {
              label: t('Playlists'),
              to: '/playlist-library',
              data: tag.tag,
              value: tag.report.playlist
            },
            { divider: true },
            {
              label: t('Templates'),
              to: '/template-library/list',
              data: tag.tag,
              value: tag.report.template
            },
            { divider: true },
            {
              label: t('Schedules'),
              to: '/schedule-library',
              data: tag.tag,
              value: tag.report.schedule
            }
          ]}
          trigger={<LocalOffer className={classes.iconLocalOffer} />}
        />
      </Grid>
    )
  }, [classes, tag.tag, tag.report, t])

  return (
    <Paper
      className={classes.root}
      style={{ borderLeftColor: tag.attributes.tagBgColor }}
    >
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Grid container alignItems="center">
            <Grid
              item
              className={classes.checkboxWrap}
              onClick={handleClickSelect}
            >
              <Checkbox checked={selected} />
            </Grid>
            <Grid item>
              <Typography
                className={classes.label}
                style={{ color: tag.attributes.tagTextColor }}
              >
                {tag.tag}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container alignItems="center">
            {renderReportList}
            <Grid item>
              <TableLibraryRowActionButton
                actionLinks={[
                  {
                    label: t('Edit action'),
                    to: `/${getUserRoleLevel()}/tags-library/${tag.id}/edit`,
                    data: { tag }
                  },
                  { divider: true },
                  {
                    label: t('Delete Tag action'),
                    icon: 'icon-bin',
                    clickAction: handleDeleteClick
                  }
                ]}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

TagCard.propTypes = {
  tag: PropTypes.object.isRequired
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deleteItem
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(withSnackbar(connect(null, mapDispatchToProps)(TagCard)))
)
