import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { isArray } from 'lodash'

import { connect } from 'react-redux'

import { withStyles, Grid } from '@material-ui/core'

import { Card } from '../../Card'
import { StorageBarChart, StoragePieChart } from '../../Charts'
import { parseLocaleNumberValue } from 'utils/numbers'

const styles = {
  cardWrapper: {
    width: 901,
    marginBottom: '20px'
  },
  cardBorder: {
    borderWidth: 2,
    borderStyle: 'solid'
  },
  storagePieChart: {
    width: '20%'
  },
  storageBarChart: {
    width: '80%'
  }
}

const storagePieChartData = [
  { id: 'Group A', label: 'Group A', value: 400 },
  { id: 'Group B', label: 'Group B', value: 300 },
  { id: 'Group C', label: 'Group C', value: 300 },
  { id: 'Group D', label: 'Group D', value: 200 }
]

const StorageCard = ({
  t,
  info,
  classes,
  dragging,
  hoverClassName,
  draggingClassName
}) => {
  const [data, setData] = useState([])

  useEffect(() => {
    if (info.response && info.response.storage) {
      let storage = info.response.storage
      storage = isArray(storage) ? storage : [{ ...storage }]

      const arr = storage.map(e => ({
        name: Object.keys(e)[0],
        value: parseLocaleNumberValue(Object.values(e)[0]),
        displayValue: Object.values(e)[0]
      }))

      setData(arr)
    }
  }, [info])

  return (
    <Grid item className={classes.cardWrapper}>
      <Card
        showMenuOnHover
        title={t('Dashboard Card Title Storage')}
        menuItems={[{ label: t('Contact Us dashboard action'), url: '' }]}
        rootClassName={[hoverClassName, dragging ? draggingClassName : ''].join(
          ' '
        )}
      >
        <Grid container justify="space-between">
          <div className={classes.storagePieChart}>
            <StoragePieChart chartData={storagePieChartData} />
          </div>
          <div className={classes.storageBarChart}>
            <StorageBarChart chartData={data} />
          </div>
        </Grid>
      </Card>
    </Grid>
  )
}

StorageCard.propTypes = {
  draggingClassName: PropTypes.string,
  hoverClassName: PropTypes.string,
  classes: PropTypes.object,
  dragging: PropTypes.bool,
  info: PropTypes.object
}

const mapStateToProps = ({ dashboard }) => ({
  info: dashboard.info
})

export default translate('translations')(
  withStyles(styles)(connect(mapStateToProps, null)(StorageCard))
)
