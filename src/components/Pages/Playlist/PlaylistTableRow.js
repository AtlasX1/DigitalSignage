import React, { useCallback, useMemo } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { Link } from 'react-router-dom'

import { deletePlaylist as deleteItem } from 'actions/playlistActions'
import { Tooltip, withStyles } from '@material-ui/core'

import {
  TableLibraryCell,
  TableLibraryRow,
  TableLibraryRowActionButton
} from 'components/TableLibrary'
import LibraryTypeIcon from 'components/LibraryTypeIcon'
import { Checkbox } from 'components/Checkboxes'
import { ActiveStatusChip, InactiveStatusChip } from 'components/Chip'

import routeByName from 'constants/routes'

import { checkData } from 'utils/tableUtils'
import { playlistConstants } from 'constants/index'
import { secToLabel, labelToSec } from 'utils/secToLabel'

const styles = () => ({
  previewLink: {
    display: 'block',
    textDecoration: 'none'
  }
})

const TableRow = ({
  t,
  classes,
  selected,
  deleteItem,
  columns,
  row,
  onToggleSelect = f => f,
  onUnselect = f => f,
  onClone = f => f
}) => {
  const {
    id,
    title,
    group,
    createdBy,
    noOfFiles,
    status,
    playlistType,
    duration
  } = row

  const translate = useMemo(
    () => ({
      edit: t('Edit action'),
      clone: t('Clone Playlist action'),
      preview: t('Preview Playlist action'),
      del: t('Delete'),
      permission: t('Permissions link'),
      formatDate: t('Banners expirationDate format')
    }),
    [t]
  )
  const handleSelect = useCallback(() => {
    onToggleSelect(id)
  }, [id, onToggleSelect])

  const handleDeleteRow = useCallback(() => {
    deleteItem(id)
    onUnselect(id)
  }, [deleteItem, id, onUnselect])

  const handleClone = useCallback(() => {
    onClone({
      open: true,
      id: id,
      title: `Copy of ${title}`
    })
  }, [id, onClone, title])

  const actionLinks = useMemo(
    () => [
      {
        label: translate.clone,
        clickAction: handleClone
      },
      {
        label: translate.preview,
        to: routeByName.playlist.previewWithId(id)
      },
      {
        label: translate.edit,
        to: {
          pathname: routeByName.playlist.editWithId(id),
          state: row
        }
      },
      { divider: true },
      {
        label: translate.del,
        icon: 'icon-bin',
        clickAction: handleDeleteRow
      }
    ],
    [
      translate.clone,
      translate.preview,
      translate.edit,
      translate.del,
      handleClone,
      id,
      row,
      handleDeleteRow
    ]
  )

  return (
    <TableLibraryRow hover role="checkbox" tabIndex={-1} selected={selected}>
      <TableLibraryCell padding="checkbox" onClick={handleSelect}>
        <Checkbox checked={selected} />
      </TableLibraryCell>

      {columns
        .filter(({ display }) => display)
        .map(({ id: column }) => {
          switch (column) {
            case 'playlistType':
              const playlistTypeInfo =
                playlistConstants.playlistTypes[playlistType] || {}
              return (
                <TableLibraryCell
                  align="center"
                  padding="checkbox"
                  key={`cell-playlist-${column}`}
                >
                  <Tooltip title={playlistTypeInfo.title}>
                    <LibraryTypeIcon
                      component={Link}
                      to={routeByName.playlist.previewWithId(id)}
                      className={classes.previewLink}
                      color={playlistTypeInfo.color}
                      icon={playlistTypeInfo.icon}
                      iconHelperClass={playlistTypeInfo.iconHelperClass}
                    />
                  </Tooltip>
                </TableLibraryCell>
              )
            case 'title': {
              return (
                <TableLibraryCell
                  key={`cell-playlist-${column}`}
                  style={{ fontWeight: 'bold' }}
                >
                  {checkData(title)}
                </TableLibraryCell>
              )
            }
            case 'group': {
              return (
                <TableLibraryCell key={`cell-playlist-${column}`}>
                  {group ? group.map(f => f.title).join(', ') : 'None'}
                </TableLibraryCell>
              )
            }
            case 'duration':
              return (
                <TableLibraryCell
                  key={`cell-playlist-${column}`}
                  align="center"
                >
                  {duration === '00:00:00'
                    ? 'N/A'
                    : secToLabel(labelToSec(duration))}
                </TableLibraryCell>
              )
            case 'createdBy': {
              return (
                <TableLibraryCell key={`cell-playlist-${column}`}>
                  {createdBy
                    ? createdBy.firstName + ' ' + createdBy.lastName
                    : 'None'}
                </TableLibraryCell>
              )
            }
            case 'noOfFiles': {
              return (
                <TableLibraryCell
                  key={`cell-playlist-${column}`}
                  align="center"
                >
                  {checkData(noOfFiles)}
                </TableLibraryCell>
              )
            }
            case 'status': {
              return (
                <TableLibraryCell
                  key={`cell-playlist-${column}`}
                  align="center"
                >
                  {status === 'Active' ? (
                    <ActiveStatusChip label={t('Active')} />
                  ) : (
                    <InactiveStatusChip label={t('Inactive')} />
                  )}
                </TableLibraryCell>
              )
            }
            default:
              return null
          }
        })}

      <TableLibraryCell align="right">
        <TableLibraryRowActionButton actionLinks={actionLinks} />
      </TableLibraryCell>
    </TableLibraryRow>
  )
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deleteItem
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  connect(null, mapDispatchToProps)
)(TableRow)
