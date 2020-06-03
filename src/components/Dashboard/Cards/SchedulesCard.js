import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import { withStyles, Grid } from '@material-ui/core'

import { ColoredBoxCard } from '../../Card'

const styles = {
  cardWrapper: {
    width: 330,
    marginBottom: '20px'
  }
}

const SchedulesCard = ({
  t,
  info,
  classes,
  dragging,
  hoverClassName,
  draggingClassName
}) => {
  const [data, setData] = useState({ active: 0, inactive: 0 })

  useEffect(() => {
    if (info.response && info.response.schedule) {
      setData(info.response.schedule)
    }
  }, [info])

  return (
    <Grid item className={classes.cardWrapper}>
      <ColoredBoxCard
        cardTitle={t('Dashboard Card Title Schedules')}
        cardMenuItems={[
          { label: t('Create New Schedule dashboard action'), url: '' },
          {
            label: t('Schedule Library dashboard action'),
            url: '/schedule-library'
          }
        ]}
        activeBoxColor={'blue'}
        activeBoxCount={data.active}
        inActiveBoxCount={data.inactive}
        cardRootClassName={[
          hoverClassName,
          dragging ? draggingClassName : ''
        ].join(' ')}
      />
    </Grid>
  )
}

SchedulesCard.propTypes = {
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
  withStyles(styles)(connect(mapStateToProps)(SchedulesCard))
)
