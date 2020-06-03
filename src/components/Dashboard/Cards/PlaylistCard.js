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

const PlaylistCard = ({
  t,
  info,
  classes,
  dragging,
  hoverClassName,
  draggingClassName
}) => {
  const [data, setData] = useState({ active: 0, inactive: 0 })

  useEffect(() => {
    if (info.response && info.response.playlist) {
      setData(info.response.playlist)
    }
  }, [info])

  return (
    <Grid item className={classes.cardWrapper}>
      <ColoredBoxCard
        cardTitle={t('Dashboard Card Title Playlist')}
        cardMenuItems={[
          { label: t('Create New Playlist dashboard action'), url: '' },
          {
            label: t('Playlist Library dashboard action'),
            url: '/playlist-library'
          }
        ]}
        activeBoxColor={'purple'}
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

PlaylistCard.propTypes = {
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
  withStyles(styles)(connect(mapStateToProps, null)(PlaylistCard))
)
