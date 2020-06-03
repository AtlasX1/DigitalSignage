import React from 'react'
import { translate } from 'react-i18next'
import { useDrop } from 'react-dnd'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles, Typography, Grid } from '@material-ui/core'

import UploadMediaSVG from 'common/icons/img_drag_drop_files_playlist.svg'

const styles = ({ palette, type }) => {
  return {
    root: {
      margin: '15px 30px'
    },
    dropFilesWrap: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '90px',
      marginTop: '30px',
      padding: '20px',
      borderWidth: '1px',
      borderStyle: 'dashed',
      background: palette[type].sideModal.background,
      color: '#0378ba',
      outline: 'none',
      transition: 'border .2s ease-in-out'
    },
    dropzoneText: {
      margin: '25px 0 0 20px',
      fontSize: '14px',
      color: '#0378ba'
    },
    errorBorder: {
      borderColor: 'red'
    },
    errorText: {
      fontSize: '12px',
      color: 'red'
    },
    canDrop: {
      borderWidth: 2
    },
    isOver: {
      borderColor: '#3ef05f'
    },
    hidden: {
      opacity: 0,
      cursor: 'default'
    }
  }
}

const UploadPlaylistFiles = ({
  t,
  classes,
  error,
  touched,
  getMediaItem,
  addItem,
  accept,
  hidden,
  containerHeight
}) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept,
    drop: e => moveItem(e.id),
    collect: monitor => ({
      canDrop: !!monitor.canDrop(),
      isOver: !!monitor.isOver()
    })
  })

  const moveItem = id => {
    const item = getMediaItem(id)
    addItem(item)
  }

  return (
    <div
      className={classNames(classes.root, { [classes.hidden]: hidden })}
      ref={drop}
      style={containerHeight ? { height: containerHeight } : undefined}
    >
      <div
        className={classNames(classes.dropFilesWrap, {
          [classes.errorBorder]: error && touched,
          [classes.canDrop]: canDrop,
          [classes.isOver]: isOver
        })}
      >
        <Grid container justify="center" alignContent="center">
          <Grid item>
            <img
              src={UploadMediaSVG}
              alt={t('Drag and drop files to playlist')}
            />
          </Grid>
          <Grid item>
            <Typography className={classes.dropzoneText}>
              {t('Drag and drop files to playlist')}
            </Typography>
            {!!error && !!touched && (
              <Typography className={classes.errorText}>{error}</Typography>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

UploadPlaylistFiles.propTypes = {
  getMediaItem: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  hidden: PropTypes.bool,
  containerHeight: PropTypes.number
}

export default translate('translations')(
  withStyles(styles)(UploadPlaylistFiles)
)
