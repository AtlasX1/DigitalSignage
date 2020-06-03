import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { connect } from 'react-redux'

import { withStyles, Grid } from '@material-ui/core'

import { MapsCard } from '../../Card'

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

const LocationCard = ({
  t,
  info,
  classes,
  dragging,
  hoverClassName,
  draggingClassName
}) => {
  const [data, setData] = useState([])

  useEffect(() => {
    if (info.response && info.response.location) {
      const location = info.response.location
      const arr = location
        .filter(l => !!l.lat && !!l.long)
        .map(l => ({ ...l, lat: +l.lat, long: +l.long }))

      setData(arr)
    }
  }, [info])

  return (
    <Grid item className={classes.cardWrapper}>
      <MapsCard
        title={t('Dashboard Card Title Location')}
        markers={data}
        rootClassName={[hoverClassName, dragging ? draggingClassName : ''].join(
          ' '
        )}
      />
    </Grid>
  )
}

LocationCard.propTypes = {
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
  withStyles(styles)(connect(mapStateToProps, null)(LocationCard))
)
