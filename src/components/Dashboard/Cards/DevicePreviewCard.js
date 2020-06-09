import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import moment from 'moment'
import { withRouter } from 'react-router'
import routeByName from 'constants/routes'
import classNames from 'classnames'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { Card } from 'components/Card'
import MediaHtmlCarousel from 'components/Media/MediaHtmlCarousel'

const styles = ({ typography, type }) => ({
  cardWrapper: {
    width: 330,
    marginBottom: 20
  },
  cardHeader: {
    marginBottom: 10
  },
  previewArea: {
    width: 272,
    height: 173
  },
  sliderRoot: {
    width: '100%'
  },
  sliderItem: {
    width: '100%',
    height: '100%'
  },
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain'
  },
  lastUpdated: {
    ...typography.lightText[type],
    fontSize: '0.75rem'
  }
})

const openInNewWindow = url => window.open(url, '_blank')

const DevicePreviewCard = ({
  t,
  history,
  info,
  classes,
  dragging,
  hoverClassName,
  draggingClassName
}) => {
  const [data, setData] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (info.response && info.response.devicePreview) {
      setData(info.response.devicePreview)
    }
  }, [info])

  const settings = {
    autoplay: true,
    autoplaySpeed: 7000,
    slidesToShow: 1,
    dots: true,
    arrows: false,
    afterChange: setActiveIndex
  }

  const slides = data.map(({ name, uri, alias }) => ({
    name,
    content: <img src={uri} alt={alias} className={classes.image} />
  }))
  return (
    <Grid item className={classes.cardWrapper}>
      <Card
        title={data[activeIndex] ? data[activeIndex].alias : ''}
        rootClassName={classNames(hoverClassName, {
          [draggingClassName]: dragging
        })}
        iconClassName="icon-search"
        headerClasses={[classes.cardHeader]}
        onClickFunction={() => {
          history.push(routeByName.device.screenPreview)
        }}
        dropdown={false}
      >
        <Grid container justify="center" className={classes.previewArea}>
          <MediaHtmlCarousel
            onSlideClick={() => {
              openInNewWindow(data[activeIndex] && data[activeIndex].uri)
            }}
            slides={slides}
            settings={settings}
            customClasses={{
              root: classes.sliderRoot,
              sliderItem: classes.sliderItem
            }}
          />
        </Grid>
        <Typography className={classes.lastUpdated}>
          Last Updated:{' '}
          {data[activeIndex]
            ? data[activeIndex].lastUpdate
              ? moment(data[activeIndex].lastUpdate).format(
                  'HH:mm, Do MMM, YYYY'
                )
              : 'N/A'
            : ''}
        </Typography>
      </Card>
    </Grid>
  )
}

DevicePreviewCard.propTypes = {
  draggingClassName: PropTypes.string,
  hoverClassName: PropTypes.string,
  classes: PropTypes.object,
  dragging: PropTypes.bool,
  info: PropTypes.object
}

const mapStateToProps = ({ dashboard }) => ({
  info: dashboard.info
})

export default compose(
  translate('translations'),
  withStyles(styles),
  connect(mapStateToProps, null),
  withRouter
)(DevicePreviewCard)
