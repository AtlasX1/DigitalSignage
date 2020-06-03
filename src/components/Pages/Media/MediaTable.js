import React, { Component } from 'react'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
import { isEqual, get as _get } from 'lodash'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
import { translate } from 'react-i18next'
import { compose, bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import {
  withStyles,
  Table,
  TableBody,
  Tooltip,
  Button
} from '@material-ui/core'
// import { CheckRounded, CloseRounded } from '@material-ui/icons'

import { TablePaper } from 'components/Paper'
import {
  TableLibraryCell,
  TableLibraryFooter,
  TableLibraryRow,
  TableLibraryHead,
  TableLibraryRowActionButton,
  DateTimeView
} from 'components/TableLibrary'
import { Checkbox } from 'components/Checkboxes'
import { ActiveStatusChip, InactiveStatusChip } from 'components/Chip'
import LibraryTypeIcon from 'components/LibraryTypeIcon'
import { LibraryLoader } from 'components/Loaders'
import {
  getMediaItemsAction,
  getMediaLibraryPref,
  putMediaLibraryPref,
  getMediaPreview,
  showMediaPreview
} from 'actions/mediaActions'
import { formatBytes, sortByOrder } from 'utils'
import { mediaService } from 'services'
import { getConfigMediaCategory } from 'actions/configActions'
import { getFeatureNameById } from 'utils/mediaUtils'
import { mediaFileSubTypes } from 'constants/api'
import { disabledPreviewMediaFeatures } from 'constants/media'
import { labelToSec, secToLabel } from 'utils/secToLabel'

const styles = () => ({
  root: {
    width: '100%',
    boxShadow: 'none'
  },
  table: {
    minWidth: 1020,
    minHeight: 1000
  },
  name: {
    fontWeight: 'bold'
  },
  toggleApprovedIcon: {
    width: 24,
    height: 24,
    cursor: 'pointer'
  },
  approved: { color: '#3cd480' },
  unapproved: { color: '#ff533d' },
  typeIcon: {
    cursor: 'pointer'
  }
})

// TODO Rename [rows] state to columns in all table components
class MediaTable extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    enqueueSnackbar: PropTypes.func.isRequired,
    getMediaItemsAction: PropTypes.func,
    getMediaLibraryPref: PropTypes.func,
    putMediaLibraryPref: PropTypes.func,
    library: PropTypes.object,
    preference: PropTypes.object
  }

  state = {
    loading: true,
    order: 'desc',
    orderBy: 'updatedAt',
    selected: [],
    data: [],
    meta: {},
    page: 1,
    rowsPerPage: 10,
    emptyRowHeight: 0,
    statuses: {},
    columns: [
      { id: 'feature', label: 'Type' },
      { id: 'title', label: 'Name' },
      { id: 'group', label: 'Group' },
      { id: 'duration', label: 'Duration', align: 'center' },
      { id: 'updatedAt', label: 'Updated On', align: 'center' },
      { id: 'size', label: 'Size (MB)', align: 'center' },
      { id: 'status', label: 'Status', align: 'center' }
      // { id: 'approved', label: 'Approved', align: 'center' }
    ]
  }

  componentDidMount() {
    const {
      getConfigMediaCategory,
      getMediaItemsAction,
      getMediaLibraryPref,
      library,
      preference,
      configMediaCategory,
      queryParams
    } = this.props
    const { page, rowsPerPage, order, orderBy } = this.state
    if (!_get(configMediaCategory, '.response.length', false)) {
      getConfigMediaCategory()
    }
    getMediaItemsAction({
      ...queryParams,
      page,
      limit: rowsPerPage,
      order,
      sort: orderBy
    })
    if (!preference.response) {
      getMediaLibraryPref()
    }
    if (library.response) {
      this.setData(library.response.data)
      this.setMeta(library.response.meta)
    }
    if (preference.response) {
      this.setStatuses(preference.response)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { page, rowsPerPage, order, orderBy } = this.state
    if (
      page !== prevState.page ||
      rowsPerPage !== prevState.rowsPerPage ||
      order !== prevState.order ||
      orderBy !== prevState.orderBy
    ) {
      const { getMediaItemsAction, queryParams } = this.props

      getMediaItemsAction({
        ...queryParams,
        page: page,
        limit: rowsPerPage,
        order,
        sort: orderBy
      })
    }

    if (
      this.props.library !== prevProps.library &&
      this.props.library.response
    ) {
      this.setData(this.props.library.response.data)
      this.setMeta(this.props.library.response.meta)
    }

    if (this.state.meta !== prevState.meta) {
      this.handleEmptyRow()
    }

    if (this.state.selected !== prevState.selected) {
      this.props.onChangeSelection(this.state.selected.length)
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { preference } = this.props

    if (nextProps.preference.response) {
      if (
        !preference.response ||
        !isEqual(preference.response, nextProps.preference.response)
      ) {
        this.setStatuses(nextProps.preference.response)
        return false
      }
    }

    return true
  }

  setData = data => {
    this.setState({ data })
  }

  setMeta = meta => {
    this.setState({ meta })
  }

  setStatuses = pref => {
    if (!pref) return

    const entity = pref.find(p => p.entity === 'MediaLibrary')
    const statuses = entity && entity.gridColumn ? entity.gridColumn : {}

    const columns = sortByOrder(statuses, this.state.columns)
    this.setState({ statuses, loading: false, columns })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }
    this.setState({ order, orderBy })
  }

  handleSelectAllClick = event => {
    event.target.checked
      ? this.setState(state => ({
          selected: state.data.map(row => row.id)
        }))
      : this.setState({ selected: [] })
  }

  handleSelect = (_, id) =>
    this.state.selected.includes(id)
      ? this.setState({
          selected: this.state.selected.filter(row => row !== id)
        })
      : this.setState({ selected: [...this.state.selected, id] })

  handleClick = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    this.setState({ selected: newSelected })
  }

  handlePageChange = ({ selected }) => {
    this.setState({ page: selected + 1 })
  }

  handlePressJumper = event => {
    if (event.target.value) {
      const page = parseInt(event.target.value, 10)
      this.setState({ page })
    }
  }

  handleChangeRowsPerPage = rowsPerPage => {
    this.setState({ rowsPerPage })
  }

  handleEmptyRow = () => {
    const { count } = this.state.meta
    const rowHeight = 90
    const tableHeight = window.innerHeight - 380
    const emptyRowHeight = tableHeight - count * rowHeight

    this.setState({ emptyRowHeight })
  }

  toggleApproveStatus = mediaId => {
    const { enqueueSnackbar, t } = this.props
    const newData = this.state.data.map(item => {
      if (item.id === mediaId) {
        item.approved = !item.approved
        enqueueSnackbar(
          `${item.title} is ${
            item.approved
              ? t('Media approved Snackbar title')
              : t('Media unapproved Snackbar title')
          }`,
          {
            variant: 'default',
            action: (
              <Button color="secondary" size="small">
                {t('Undo')}
              </Button>
            ),
            onClick: () => this.toggleApproveStatus(item.id)
          }
        )
        return item
      }
      return item
    })

    this.setState({ data: newData })
  }

  editRow = media => {
    const { history, configMediaCategory } = this.props
    const { id: mediaId, feature } = media
    const { id: featureId, name } = feature
    const isFileType = mediaFileSubTypes.includes(name)
    if (isFileType) {
      const fileCategory = isFileType && 'general'
      const fileSubCategory = isFileType && 'file'
      history.push(
        `/media-library/media/edit/${fileCategory}/${fileSubCategory}/${mediaId}`
      )
    } else {
      const featureName = getFeatureNameById(configMediaCategory, featureId)
      history.push(
        `/media-library/media/edit/${featureName}/${name.toLowerCase()}/${mediaId}`
      )
    }
  }

  deleteRow = async (media, index) => {
    const { enqueueSnackbar, t } = this.props
    const { data } = this.state

    const newData = data.filter(el => el.id !== media.id)

    enqueueSnackbar(`${media.title} ${t('Snackbar is removed')}`, {
      variant: 'default',
      action: (
        <Button color="secondary" size="small">
          {t('Undo')}
        </Button>
      ),
      onClick: () => this.addRow(media, index),
      onExited: () => mediaService.deleteMediaLibraryItem({ mediaId: media.id })
    })

    this.setState({ data: newData })
  }

  addRow = (row, index) => {
    const { enqueueSnackbar, t } = this.props
    const { data: newData } = this.state

    newData.push(row)

    enqueueSnackbar(`${row.title} ${t('Snackbar is added')}`, {
      variant: 'default',
      action: (
        <Button color="secondary" size="small">
          {t('Undo')}
        </Button>
      ),
      onClick: () => this.deleteRow(row, index)
    })

    this.setState({ data: newData })
  }

  handleColumnChange = (index, value) => {
    const { putMediaLibraryPref } = this.props
    const { columns, statuses } = this.state

    const id = columns[index].id

    let data
    if (id in statuses) {
      data = update(statuses, {
        [id]: {
          $merge: { display: value }
        }
      })
    } else {
      data = update(statuses, {
        $merge: { [id]: { display: value } }
      })
    }

    putMediaLibraryPref(data)
  }

  handleReorder = async result => {
    const { putMediaLibraryPref } = this.props
    const { columns, statuses } = this.state

    if (result.source !== null && result.destination !== null) {
      const column = columns[result.source.index]

      const index = result.source.index
      const destIndex = result.destination.index

      await this.setState(
        update(this.state, {
          columns: {
            $splice: [
              [index, 1],
              [destIndex, 0, column]
            ]
          }
        })
      )

      let data = statuses
      this.state.columns.forEach((c, i) => {
        if (data[c.id]) {
          data = update(data, {
            [c.id]: {
              $merge: { sortOrder: i }
            }
          })
        } else {
          data = update(data, {
            $merge: {
              [c.id]: {
                sortOrder: i
              }
            }
          })
        }
      })

      putMediaLibraryPref(data)
    }
  }

  generateGroups(groups) {
    return <div>{groups[0].title}</div>
  }

  handlePreviewClick = (previewId, feature) => {
    if (disabledPreviewMediaFeatures.includes(feature.name)) {
      return
    }

    const { mediaPreview, getMediaPreview, showMediaPreview } = this.props
    if (mediaPreview.id !== previewId || mediaPreview.error) {
      getMediaPreview(previewId)
    } else {
      showMediaPreview()
    }
  }

  render() {
    const { classes, t } = this.props
    const {
      loading,
      data,
      order,
      orderBy,
      selected,
      rowsPerPage,
      columns,
      statuses,
      meta
    } = this.state

    const { currentPage, perPage, lastPage } = meta

    const filter = id => {
      return statuses[id] && statuses[id].display !== undefined
        ? statuses[id].display
        : true
    }

    return loading ? (
      <LibraryLoader />
    ) : (
      <TablePaper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableLibraryHead
              noType
              editRows={true}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              allSelected={
                this.state.selected.length === this.state.data.length
              }
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              columns={columns}
              filter={filter}
              handleColumnChange={this.handleColumnChange}
              handleReorder={this.handleReorder}
            />
            <TableBody>
              {data.map((row, index) => {
                return (
                  <TableLibraryRow
                    key={row.id}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                  >
                    <TableLibraryCell
                      padding="checkbox"
                      onClick={event => this.handleSelect(event, row.id)}
                    >
                      <Checkbox
                        checked={this.state.selected.includes(row.id)}
                      />
                    </TableLibraryCell>

                    {columns
                      .filter(c => filter(c.id))
                      .map(c => {
                        switch (c.id) {
                          case 'feature':
                            return (
                              <TableLibraryCell
                                align="center"
                                padding="checkbox"
                                key={c.id}
                              >
                                <div>
                                  <Tooltip title={row.feature.name}>
                                    <LibraryTypeIcon
                                      color={row.feature.color}
                                      iconHelperClass={row.feature.icon}
                                      wrapHelperClass={classes.typeIcon}
                                      onClick={() =>
                                        this.handlePreviewClick(
                                          row.id,
                                          row.feature
                                        )
                                      }
                                    />
                                  </Tooltip>
                                </div>
                              </TableLibraryCell>
                            )
                          case 'title':
                            return (
                              <TableLibraryCell
                                key={c.id}
                                className={classes.name}
                              >
                                {row.title}
                              </TableLibraryCell>
                            )
                          case 'group':
                            return (
                              <TableLibraryCell key={c.id} align="left">
                                {row.group && this.generateGroups(row.group)}
                              </TableLibraryCell>
                            )
                          case 'duration':
                            return (
                              <TableLibraryCell key={c.id} align="center">
                                {row.duration === '00:00:00'
                                  ? 'N/A'
                                  : secToLabel(labelToSec(row.duration))}
                              </TableLibraryCell>
                            )
                          case 'updatedAt':
                            return (
                              <TableLibraryCell key={c.id} align="center">
                                <DateTimeView date={row.updatedAt} />
                              </TableLibraryCell>
                            )
                          case 'size':
                            return (
                              <TableLibraryCell key={c.id} align="center">
                                {row.size === '0.000'
                                  ? 'N/A'
                                  : formatBytes(Number(row.size), 2)}{' '}
                              </TableLibraryCell>
                            )
                          case 'status':
                            return (
                              <TableLibraryCell key={c.id} align="center">
                                {row.status ? (
                                  <ActiveStatusChip label={t('Active')} />
                                ) : (
                                  <InactiveStatusChip label={t('Inactive')} />
                                )}
                              </TableLibraryCell>
                            )
                          // case 'approved':
                          //   return (
                          //     <TableLibraryCell
                          //       key={c.id}
                          //       align="center"
                          //       onClick={() => this.toggleApproveStatus(row.id)}
                          //     >
                          //       {row.approval ? (
                          //         <Tooltip
                          //           title={t('Media approved Tooltip title')}
                          //           placement="top"
                          //         >
                          //           <CheckRounded
                          //             className={[
                          //               classes.toggleApprovedIcon,
                          //               classes.approved
                          //             ].join(' ')}
                          //           />
                          //         </Tooltip>
                          //       ) : (
                          //         <Tooltip
                          //           title={t('Media unapproved Tooltip title')}
                          //           placement="top"
                          //         >
                          //           <CloseRounded
                          //             className={[
                          //               classes.toggleApprovedIcon,
                          //               classes.unapproved
                          //             ].join(' ')}
                          //           />
                          //         </Tooltip>
                          //       )}
                          //     </TableLibraryCell>
                          //   )
                          default:
                            return null
                        }
                      })}

                    <TableLibraryCell align="right">
                      <TableLibraryRowActionButton
                        actionLinks={[
                          {
                            label: t('Add to Playlist Media action'),
                            clickAction: f => f
                          },
                          {
                            label: t('Edit action'),
                            clickAction: () => this.editRow(row, index)
                          },
                          { divider: true },
                          {
                            label: t('Delete Media action'),
                            icon: 'icon-bin',
                            clickAction: () => this.deleteRow(row, index)
                          }
                        ]}
                      />
                    </TableLibraryCell>
                  </TableLibraryRow>
                )
              })}
              <TableLibraryRow style={{ height: '100%' }} />
            </TableBody>
          </Table>
        </div>
        <TableLibraryFooter
          page={currentPage}
          perPage={parseInt(perPage, 10)}
          pageCount={lastPage}
          data={data}
          selected={selected}
          allSelected={this.state.selected.length === this.state.data.length}
          onSelectAllClick={this.handleSelectAllClick}
          rowsPerPage={rowsPerPage}
          onPageChange={this.handlePageChange}
          onPressJumper={this.handlePressJumper}
          handleChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </TablePaper>
    )
  }
}

const mapStateToProps = ({ media, config }) => ({
  library: media.library,
  mediaPreview: media.preview,
  preference: media.preference,
  configMediaCategory: config.configMediaCategory
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getMediaItemsAction,
      getMediaLibraryPref,
      getMediaPreview,
      showMediaPreview,
      putMediaLibraryPref,
      getConfigMediaCategory
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  withSnackbar,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MediaTable)
