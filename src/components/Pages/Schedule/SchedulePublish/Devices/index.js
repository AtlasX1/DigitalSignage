import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid, Table, TableBody } from '@material-ui/core'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { FormControlInput, FormControlSelect } from 'components/Form'

import Item from './Item'
import { getDeviceItemsAction } from 'actions/deviceActions'
import { LibraryLoader } from 'components/Loaders'
import { TableLibraryPagination } from 'components/TableLibrary'

const styles = ({ typography }) => ({
  devicesCardContainer: {
    height: 'calc(100% - 116px)',
    overflowY: 'auto'
  },
  inputIcon: {
    width: 16,
    position: 'absolute',
    right: '15px',
    color: '#9394A0',
    opacity: 0.5,
    bottom: 10,
    transform: 'scaleX(-1)'
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 0
  },
  inputContainerContainer: {
    width: 'calc(100% - 268px)'
  },
  inputRoot: {
    width: '100%'
  },
  inputLabel: {
    fontSize: 18
  },
  input: {
    color: '#9394A0',
    fontFamily: typography.fontFamily,
    fontSize: 12
  },
  selectIcon: {
    right: 10,
    opacity: 0.5
  },
  selectInput: {
    width: 253,
    paddingLeft: 15,
    fontSize: 12,
    letterSpacing: '-0.01px',
    color: '#9394A0',
    fontFamily: typography.fontFamily,
    lineHeight: '26px',

    '& > p': {
      color: '#494f5c',
      letterSpacing: '-0.01px',
      fontSize: 12,
      marginLeft: 8,
      fontWeight: 400
    }
  },
  inputsContainer: {
    marginBottom: 7,
    paddingLeft: 12
  },
  itemsContainer: {
    maxHeight: 'calc(100% - 45px)',
    overflowY: 'auto'
  },
  pagination: {
    marginTop: 'auto'
  }
})

const devices = [
  { value: 0, label: 'Select by Devices' },
  { value: 1, label: '1' },
  { value: 2, label: '2' }
]

const Devices = ({
  t,
  classes,
  selectedDeviceIds = [],
  onSelectedChange = f => f,
  library,
  meta,
  getDeviceItemsAction
}) => {
  const [search, setSearch] = useState('')
  const [select, setSelect] = useState(0)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  const { currentPage, lastPage } = meta

  useEffect(() => {
    getDeviceItemsAction({
      page,
      limit: rowsPerPage
    })
  }, [getDeviceItemsAction, page, rowsPerPage])

  useEffect(() => {
    if (library.response) {
      setData(library.response)
      setLoading(false)
    }

    //eslint-disable-next-line
  }, [library])

  const handleChange = (id, value) => {
    const newSelectedDevicesIds = value
      ? [...selectedDeviceIds, id]
      : selectedDeviceIds.filter(selectedDeviceId => selectedDeviceId !== id)

    onSelectedChange(newSelectedDevicesIds)
  }

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1)
  }

  const handlePressJumper = event => {
    if (event.target.value) {
      const page = parseInt(event.target.value, 10)
      setPage(page)
    }
  }

  const handleChangeRowsPerPage = rowsPerPage => {
    setRowsPerPage(rowsPerPage)
  }

  if (loading) {
    return <LibraryLoader rowSpacing={74} rowCount={rowsPerPage - 1} />
  }

  return (
    <>
      <Grid
        container
        direction="column"
        className={classes.devicesCardContainer}
      >
        <Grid
          container
          justify="space-between"
          className={classes.inputsContainer}
        >
          <FormControlInput
            value={search}
            placeholder={t('Search Devices')}
            handleChange={e => setSearch(e.target.value)}
            formControlContainerClass={classes.inputContainerContainer}
            formControlRootClass={classes.inputContainer}
            formControlInputRootClass={classes.inputRoot}
            formControlLabelClass={classes.inputLabel}
            formControlInputClass={classes.input}
            icon={
              <i className={`icon-beauty-hand-mirror ${classes.inputIcon}`} />
            }
          />

          <FormControlSelect
            custom
            value={select}
            options={devices}
            handleChange={e => setSelect(e.target.value)}
            marginBottom={false}
            nativeSelectIconClassName={classes.selectIcon}
            inputClasses={{
              input: classes.selectInput
            }}
          />
        </Grid>

        <Grid container direction="column" className={classes.itemsContainer}>
          <Table>
            <TableBody>
              {data.map(i => (
                <Item
                  key={i.id}
                  alias={i.alias}
                  name={i.name}
                  location={`${i.city}, ${i.state}`}
                  lastUpdate={i.updatedAt}
                  status={i.status}
                  isSelected={selectedDeviceIds.includes(i.id)}
                  handleChange={handleChange}
                  id={i.id}
                />
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
      <div className={classes.pagination}>
        <TableLibraryPagination
          pageCount={lastPage}
          dropSide={'topCenter'}
          component="div"
          page={currentPage}
          onPageChange={handlePageChange}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onPressJumper={handlePressJumper}
          displayPaginationOptions={false}
        />
      </div>
    </>
  )
}

Devices.propTypes = {
  classes: PropTypes.object,
  selectedDeviceIds: PropTypes.arrayOf(PropTypes.number),
  onSelectedChange: PropTypes.func
}

const mapStateToProps = ({ device }) => ({
  library: device.library,
  meta: device.meta
})
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDeviceItemsAction
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Devices)
