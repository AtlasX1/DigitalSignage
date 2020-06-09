import React, { useCallback, useMemo } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { Link } from 'react-router-dom'

import { deleteSchedule as deleteItem } from 'actions/scheduleActions'
import { Tooltip, withStyles } from '@material-ui/core'

import {
  TableLibraryCell,
  TableLibraryRow,
  TableLibraryRowActionButton
} from 'components/TableLibrary'
import { Checkbox } from 'components/Checkboxes'
import { ActiveStatusChip, InactiveStatusChip } from 'components/Chip'
import LibraryTypeIcon from 'components/LibraryTypeIcon'

import routeByName from 'constants/routes'

import { checkData } from 'utils/tableUtils'
import { scheduleConstants } from 'constants/index'
import LibraryTagChips from '../../../components/LibraryTagChips'

const styles = ({ typography, type }) => ({
  previewLink: {
    textDecoration: 'none'
  },
  workingDaysWrap: {
    display: 'grid',
    grid: '1fr / repeat(7,1fr)',
    gap: '3px'
  },
  workingDay: {
    display: 'inline-block',
    background: '#74809a',
    borderRadius: '50%',
    textAlign: 'center',
    lineHeight: '20px',
    fontWeight: 'bold',
    fontSize: '12px',
    color: '#fff',
    width: '20px',
    height: '20px',
    '&.active': {
      background: '#0379bb'
    }
  },
  name: {
    ...typography.darkAccent[type]
  }
})

const TableRow = ({
  t,
  classes,
  selected,
  deleteItem,
  columns,
  row: {
    id,
    title,
    group,
    duration,
    workingDays,
    orientation,
    status,
    scheduleType,
    specificDates,
    allDate,
    tag
  },
  onToggleSelect = f => f,
  onUnselect = f => f,
  onClone = f => f
}) => {
  const translate = useMemo(
    () => ({
      edit: t('Edit action'),
      clone: t('Clone Playlist action'),
      del: t('Delete')
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
        label: translate.edit,
        to: routeByName.schedule.editWithId(id)
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
      translate.edit,
      translate.del,
      handleClone,
      id,
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
            case 'scheduleType':
              const scheduleTypeInfo =
                scheduleConstants.scheduleTypes[scheduleType] ||
                scheduleConstants.scheduleTypes.Timed
              return (
                <TableLibraryCell
                  align="center"
                  padding="checkbox"
                  key={column}
                >
                  <Tooltip title={scheduleTypeInfo.title}>
                    <LibraryTypeIcon
                      component={Link}
                      to={routeByName.schedule.editWithId(id)}
                      className={classes.previewLink}
                      color={scheduleTypeInfo.color}
                      icon={scheduleTypeInfo.icon}
                      iconHelperClass={scheduleTypeInfo.iconHelperClass}
                    />
                  </Tooltip>
                </TableLibraryCell>
              )
            case 'title':
              return (
                <TableLibraryCell key={column} className={classes.name}>
                  {checkData(title)}
                </TableLibraryCell>
              )
            case 'group':
              return (
                <TableLibraryCell key={column}>
                  {checkData(group ? group.map(f => f.title).join(', ') : '')}
                </TableLibraryCell>
              )
            case 'duration':
              return (
                <TableLibraryCell key={column}>
                  {checkData(duration)}
                </TableLibraryCell>
              )
            case 'workingDates':
              return (
                <TableLibraryCell
                  key={column}
                  title={
                    specificDates.length &&
                    specificDates.map(date => `${date}`).join('\n')
                  }
                  align="center"
                >
                  {allDate
                    ? t('All dates')
                    : specificDates.length
                    ? t('Specific dates')
                    : 'N/A'}
                </TableLibraryCell>
              )
            case 'workingDays':
              return (
                <TableLibraryCell key={column} align="center">
                  <div className={classes.workingDaysWrap}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                      (day, index) => {
                        return (
                          <span
                            key={index}
                            className={`${classes.workingDay} ${
                              workingDays.length &&
                              workingDays.split(',').includes(day)
                                ? 'active'
                                : ''
                            }`}
                          >
                            {day[0]}
                          </span>
                        )
                      }
                    )}
                  </div>
                </TableLibraryCell>
              )
            case 'workingTime':
              return <TableLibraryCell key={column} align="center" />
            case 'orientation':
              return (
                <TableLibraryCell key={column} align="center">
                  {checkData(orientation, 'N/A')}
                </TableLibraryCell>
              )
            case 'status':
              return (
                <TableLibraryCell key={column} align="center">
                  {status === 'Active' ? (
                    <ActiveStatusChip label={t('Active')} />
                  ) : (
                    <InactiveStatusChip label={t('Inactive')} />
                  )}
                </TableLibraryCell>
              )
            case 'tag':
              return (
                <TableLibraryCell key={column} align="center">
                  <LibraryTagChips tags={tag} />
                </TableLibraryCell>
              )
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
