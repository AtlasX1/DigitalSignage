import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Typography } from '@material-ui/core'

import Card from './Card'

const styles = theme => ({
  cardRoot: {
    padding: 0,
    border: 'solid 1px #e6eaf4',
    boxShadow: '0 2px 4px 0 #e1e3ec',
    borderRadius: '7px'
  },
  moreInfoCardHeader: {
    padding: '0 20px',
    marginBottom: 0,
    borderBottom: 'solid 1px #e4e9f3',
    backgroundColor: '#f9fafc',
    borderRadius: '8px 8px 0 0'
  },
  moreInfoCardHeaderText: {
    fontSize: '14px',
    fontWeight: 'bold',
    lineHeight: '50px',
    color: '#0f2147'
  },
  content: {
    padding: 0
  },
  screenshotWrap: {
    backgroundColor: '#3d3d3d'
  },
  screenshot: {
    width: '100%',
    height: 'auto',
    maxHeight: '200px'
  },
  noScreenshot: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
  },
  noScreenshotText: {
    lineHeight: '200px',
    color: 'rgba(255, 255, 255, 0.3)'
  },
  footer: {
    padding: '5px 18px',
    backgroundColor: '#f9fafc',
    borderRadius: '0 0 7px 7px'
  },
  footerText: {
    color: '#3f3f3f'
  }
})

class ChannelScreenPreviewsCard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  render() {
    const {
      t,
      classes,
      channel: { channel, lastUpdated, URL }
    } = this.props

    return (
      <Card
        icon={false}
        title={channel}
        rootClassName={classes.cardRoot}
        headerClasses={[classes.moreInfoCardHeader]}
        headerTextClasses={[classes.moreInfoCardHeaderText]}
      >
        <div className={classes.content}>
          <div
            className={[
              classes.screenshotWrap,
              !URL && classes.noScreenshot
            ].join(' ')}
          >
            {URL ? (
              <img className={classes.screenshot} src={URL} alt="" />
            ) : (
              <Typography className={classes.noScreenshotText}>
                No Screenshot Available
              </Typography>
            )}
          </div>
        </div>
        <footer className={classes.footer}>
          <Typography className={classes.footerText}>
            {t('Last Updated', { lastUpdated })}
          </Typography>
        </footer>
      </Card>
    )
  }
}

export default translate('translations')(
  withStyles(styles)(ChannelScreenPreviewsCard)
)
