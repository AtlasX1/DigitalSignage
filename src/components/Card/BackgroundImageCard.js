import React, { useCallback } from 'react'
import { translate } from 'react-i18next'
import classNames from 'classnames'

import { withStyles, Typography } from '@material-ui/core'

import Card from './Card'

const styles = ({ palette, type }) => ({
  cardRoot: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    border: 'solid 1px #e6eaf4',
    boxShadow: '0 2px 4px 0 #e1e3ec',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  select: {
    border: `solid 2px ${palette[type].buttons.white.hover.border}`
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
    padding: 0,
    flexGrow: 1
  },
  screenshotWrap: {
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#3d3d3d',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '0 0 8px 8px'
  },
  screenshot: {
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

const BackgroundImageCard = ({
  className,
  classes,
  title,
  src,
  isSelect = false,
  t,
  id,
  onSelectImage = f => f
}) => {
  const handleClickImage = useCallback(() => onSelectImage(id), [
    id,
    onSelectImage
  ])

  return (
    <Card
      icon={false}
      title={title}
      rootClassName={classNames(classes.cardRoot, className, {
        [classes.select]: isSelect
      })}
      headerClasses={[classes.moreInfoCardHeader]}
      headerTextClasses={[classes.moreInfoCardHeaderText]}
      onClick={handleClickImage}
    >
      <div className={classes.content}>
        <div
          className={classNames(
            classes.screenshotWrap,
            !src && classes.noScreenshot
          )}
        >
          {src ? (
            <img className={classes.screenshot} src={src} alt="" />
          ) : (
            <Typography className={classes.noScreenshotText}>
              {t('No Screenshot Available')}
            </Typography>
          )}
        </div>
      </div>
    </Card>
  )
}

export default translate('translations')(
  withStyles(styles)(BackgroundImageCard)
)
