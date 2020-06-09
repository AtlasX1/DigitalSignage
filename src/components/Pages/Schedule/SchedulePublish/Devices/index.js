import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid, Table, TableBody } from '@material-ui/core'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { FormControlInput } from 'components/Form'

import Item from './Item'
import { useDispatch, useSelector } from 'react-redux'
import { getDeviceItemsAction } from 'actions/deviceActions'
import { LibraryLoader } from 'components/Loaders'
import { TableLibraryPagination } from 'components/TableLibrary'
import { BlueButton } from '../../../../Buttons'

const styles = ({ typography }) => ({
  devicesCardContainer: {
    height: 'calc(100% - 116px)',
    overflowY: 'auto'
  },
  paginationWrapper: {
    display: 'flex',
    justifyContent: 'center'
  },
  loaderWrapper: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(255,255,255,.7)',
    zIndex: 99
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
    marginBottom: 0,
    marginRight: 16
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
    padding: 5
  },
  itemsContainer: {
    maxHeight: 'calc(100% - 45px)',
    overflowY: 'auto'
  },
  pagination: {
    marginTop: 'auto'
  }
})

const Devices = ({ t, classes, values, selectedDevices, onSelectedChange }) => {
  const dispatchAction = useDispatch()

  const [deviceReducer, { currentPage, lastPage }] = useSelector(state => [
    state.device.library.response,
    state.device.meta
  ])

  const [search, setSearch] = useState('')

  const [page, setPage] = useState(1)

  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [loading, setLoading] = useState(true)

  const [data, setData] = useState([])

  useEffect(
    () => {
      setLoading(true)
      dispatchAction(
        getDeviceItemsAction({
          page,
          limit: rowsPerPage,
          ...(search && { name: search })
        })
      )
    },
    //eslint-disable-next-line
    [page, rowsPerPage]
  )

  useEffect(() => {
    if (deviceReducer.length) {
      setData(deviceReducer)
    }
    setLoading(false)
  }, [deviceReducer])

  const handleChange = (item, value) => {
    const newSelectedDevices = value
      ? [...selectedDevices, item]
      : selectedDevices.filter(({ id }) => id !== item.id)

    onSelectedChange(newSelectedDevices)
  }

  const handleSearch = () => {
    dispatchAction(
      getDeviceItemsAction({
        ...(search && { name: search }),
        limit: 10
      })
    )
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
          className={classes.inputsContainer}
          justify={'space-between'}
        >
          <Grid item xs={9}>
            <FormControlInput
              value={search}
              fullWidth={true}
              placeholder={t('Search Devices')}
              handleChange={e => setSearch(e.target.value)}
              formControlRootClass={classes.inputContainer}
              formControlInputRootClass={classes.inputRoot}
              icon={
                <i className={`icon-beauty-hand-mirror ${classes.inputIcon}`} />
              }
            />
          </Grid>
          <Grid item xs={2}>
            <BlueButton fullWidth={true} onClick={handleSearch}>
              {t('Search')}
            </BlueButton>
          </Grid>
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
                  isSelected={values.deviceList.includes(i.id)}
                  handleChange={value => handleChange(i, value)}
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
