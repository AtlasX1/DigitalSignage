import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { connect } from 'react-redux'

import { withStyles, Grid } from '@material-ui/core'

import { Card } from '../../Card'
import { MediaBarChart } from '../../Charts'
import { parseLocaleNumberValue } from 'utils/numbers'

const styles = {
  cardWrapper: {
    width: 901,
    marginBottom: '20px'
  },
  cardTransparentBorder: {
    borderColor: 'transparent'
  },
  menuContainer: {
    whiteSpace: 'nowrap'
  }
}

const MediaUsageCard = ({
  t,
  info,
  classes,
  dragging,
  hoverClassName,
  draggingClassName
}) => {
  const [data, setData] = useState([])

  useEffect(() => {
    if (info.response && info.response.mediaUsage) {
      const mediaUsage = info.response.mediaUsage
      const arr = mediaUsage.map(e => ({
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
        title={t('Dashboard Card Title Media')}
        menuItems={[
          { label: t('Add New Media dashboard action'), url: '' },
          { label: t('Media Library dashboard action'), url: '/media-library' }
        ]}
        rootClassName={[hoverClassName, dragging ? draggingClassName : ''].join(
          ' '
        )}
        menuDropdownContainerClassName={classes.menuContainer}
      >
        <MediaBarChart chartData={data} />
      </Card>
    </Grid>
  )
}

MediaUsageCard.propTypes = {
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
  withStyles(styles)(connect(mapStateToProps, null)(MediaUsageCard))
)
