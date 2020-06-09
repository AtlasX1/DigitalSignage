import {
  Grid,
  IconButton,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  withStyles
} from '@material-ui/core'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import classNames from 'classnames'
import { CheckboxSelectAll, CheckboxSwitcher } from 'components/Checkboxes'
import Popup from 'components/Popup'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { translate } from 'react-i18next'
import { TableLibraryCell } from './index'

const tableHeadStyles = theme => {
  const { palette, type } = theme
  return {
    filterIconRoot: {
      marginRight: '7px',
      padding: '8px 12px',
      color: palette[type].tableLibrary.head.iconColor
    },
    filterSwitchContainer: {
      width: '100%'
    },
    filterSwitchLabel: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      cursor: 'grab',
      textAlign: 'left',
      whiteSpace: 'nowrap'
    },
    tableHeaderCellLabel: {
      whiteSpace: 'nowrap',

      '&:hover': {
        fontWeight: 700
      }
    },
    draggable: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'grab'
    },
    dragIcon: {
      width: '40px',
      opacity: 0.5
    },
    headerCellCentered: {
      '& > span': {
        paddingLeft: 20
      }
    },
    headerCellCustom: {
      paddingLeft: '0px',
      paddingRight: '0px'
    }
  }
}

const columnWidths = {
  feature: 36,
  duration: 170,
  size: 170,
  noOfFiles: 170
}

class TableLibraryHead extends Component {
  static propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired,
    onSelectAllClick: PropTypes.func,
    allSelected: PropTypes.bool,
    columns: PropTypes.array.isRequired,
    handleColumnChange: PropTypes.func,
    handleReorder: PropTypes.func,
    order: PropTypes.string,
    orderBy: PropTypes.string,
    filter: PropTypes.func
  }

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render() {
    const {
      t,
      classes,
      allSelected,
      onSelectAllClick,
      order,
      orderBy,
      columns,
      noType,
      editRows,
      actionRow,
      handleColumnChange,
      handleReorder = f => f,
      filter = f => f
    } = this.props

    const dropdownStyle = {
      width: 200
    }

    return (
      <TableHead>
        <TableRow>
          {onSelectAllClick ? (
            <TableLibraryCell
              style={{ paddingBottom: '6px', width: 24 }}
              padding="checkbox"
            >
              <CheckboxSelectAll
                indeterminate={false}
                checked={allSelected}
                onChange={onSelectAllClick}
              />
            </TableLibraryCell>
          ) : null}
          {noType ? null : <TableLibraryCell padding="none" />}
          {columns
            .filter(c => filter(c.id))
            .map(column => {
              const hasDisplay = column.hasOwnProperty('display')

              if (hasDisplay && !column.display) return null

              return (
                <TableLibraryCell
                  key={column.id}
                  align={column.align || 'left'}
                  sortDirection={orderBy === column.id ? order : false}
                  padding={column.noPaddings ? 'dense' : null}
                  className={classNames({
                    [classes.headerCellCentered]: column.align === 'center',
                    [classes.headerCellCustom]: column.customPadding
                  })}
                  style={{
                    paddingBottom: '8px',
                    ...(columnWidths.hasOwnProperty(column.id) && {
                      width: columnWidths[column.id]
                    })
                  }}
                >
                  <TableSortLabel
                    className={classNames(
                      'Enhanced-table-head__table-sort-label',
                      classes.tableHeaderCellLabel
                    )}
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {t(column.label)}
                  </TableSortLabel>
                </TableLibraryCell>
              )
            })}
          {editRows ? (
            <TableLibraryCell align="right" padding="none">
              <div>
                <Popup
                  on="click"
                  position="bottom right"
                  contentStyle={dropdownStyle}
                  trigger={
                    <IconButton
                      className={`hvr-grow ${classes.filterIconRoot}`}
                    >
                      <i className="icon-navigation-show-more-vertical" />
                    </IconButton>
                  }
                >
                  <DragDropContext onDragEnd={handleReorder}>
                    <Grid container direction="column">
                      <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef}>
                            {columns.map((column, index) => (
                              <Draggable
                                key={`table-head-row-filter-${column.id}`}
                                draggableId={`table-head-row-filter-${column.id}`}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {
                                      <div className={classes.draggable}>
                                        <DragIndicatorIcon
                                          classes={{ root: classes.dragIcon }}
                                        />
                                        <CheckboxSwitcher
                                          key={`table-head-row-filter-${column.id}`}
                                          switchContainerClass={
                                            classes.filterSwitchContainer
                                          }
                                          formControlRootClass={
                                            classes.filterSwitchLabel
                                          }
                                          id="template-status"
                                          label={t(column.label)}
                                          value={
                                            column.hasOwnProperty('display')
                                              ? column.display
                                              : filter(column.id)
                                          }
                                          handleChange={value =>
                                            handleColumnChange(column.id, value)
                                          }
                                          isFormLabel={false}
                                        />
                                      </div>
                                    }
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </Grid>
                  </DragDropContext>
                </Popup>
              </div>
            </TableLibraryCell>
          ) : actionRow ? (
            <TableCell />
          ) : null}
        </TableRow>
      </TableHead>
    )
  }
}

export default translate('translations')(
  withStyles(tableHeadStyles)(TableLibraryHead)
)
