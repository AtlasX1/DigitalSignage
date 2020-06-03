import React, { useEffect, useRef } from 'react'
import { Typography, withStyles } from '@material-ui/core'

const styles = ({ palette, type }) => ({
  bannerPreviewTitle: {
    marginBottom: '10px',
    fontSize: '13px',
    color: palette[type].formControls.label.color
  },
  bannerPreview: {
    padding: '0 10px',
    marginBottom: '15px',
    minHeight: '250px',
    border: `1px solid ${palette[type].pages.banners.preview.border}`,
    color: palette[type].formControls.label.color,
    wordBreak: 'break-word'
  },
  container: {
    padding: '0 10px'
  }
})

const TextPreview = ({ classes, label, text }) => {
  const ref = useRef(null)
  useEffect(() => {
    if (text) {
      ref.current.innerHTML = text
    } else {
      ref.current.innerHTML = ''
    }
  }, [text])
  return (
    <div className={classes.container}>
      <Typography className={classes.bannerPreviewTitle}>{label}</Typography>
      <div ref={ref} className={classes.bannerPreview}></div>
    </div>
  )
}

export default withStyles(styles)(TextPreview)
