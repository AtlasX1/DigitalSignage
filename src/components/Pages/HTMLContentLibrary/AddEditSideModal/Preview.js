import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import { isObject as _isObject } from 'lodash'

const styles = ({ palette, type, typography }) => ({
  wrapper: {
    padding: 15,
    height: 'inherit',
    borderRadius: '4px',
    backgroundColor: palette[type].formControls.input.background,
    border: `1px solid ${palette[type].formControls.input.border}`,
    fontFamily: typography.fontFamily
  },
  title: {
    fontSize: 16,
    color: palette[type].formControls.label.color
  },
  content: {
    height: 'inherit',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    maxWidth: '100%',
    maxHeight: '100%'
  }
})

const Preview = ({ classes, t, content }) => {
  const image = useMemo(() => {
    if (content && _isObject(content)) {
      return URL.createObjectURL(content)
    } else return content
  }, [content])

  return (
    <div className={classes.wrapper}>
      <span className={classes.title}>{t('Preview')}</span>
      <div className={classes.content}>
        <img src={image} className={classes.img} alt="" />
      </div>
    </div>
  )
}

Preview.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

export default translate('translations')(withStyles(styles)(Preview))
