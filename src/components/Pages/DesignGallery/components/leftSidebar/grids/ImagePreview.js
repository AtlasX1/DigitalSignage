import React from 'react'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'

import { getPreviewUrl } from '../../../utils'

const useStyles = makeStyles({
  itemBg: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundSize: props => props.backgroundSize || 'auto',
    backgroundPosition: props => props.backgroundPosition || 'left top',
    backgroundImage: props =>
      props.isViewBg ? `url(${getPreviewUrl(props.src)})` : 'none',
    '& img': {
      width: '100%',
      height: 'auto',
      maxHeight: '100%'
    }
  }
})

const ImagePreview = props => {
  const { src, name, showAs } = props
  const isViewBg = showAs === 'template' || props.showAs === 'bg'
  const classes = useStyles({ ...props, isViewBg })

  return (
    <div className={classNames(classes.itemBg)}>
      {(showAs === 'svg' || showAs === 'image') && (
        <img src={getPreviewUrl(src)} alt={name} />
      )}
    </div>
  )
}

export default ImagePreview
