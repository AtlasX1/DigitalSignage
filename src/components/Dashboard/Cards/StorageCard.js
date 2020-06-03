import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { isArray } from 'lodash'

import { connect } from 'react-redux'

import { withStyles, Grid } from '@material-ui/core'

import { Card } from '../../Card'
import { StorageBarChart, StoragePieChart } from '../../Charts'

const styles = {
  cardWrapper: {
    width: 901,
    marginBottom: '20px'
  },
  cardBorder: {
    borderWidth: 2,
    borderStyle: 'solid'
  }
}

const storagePieChartData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 }
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
        value: Object.values(e)[0]
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
          <StoragePieChart chartData={storagePieChartData} />
          <StorageBarChart chartData={data} />
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
