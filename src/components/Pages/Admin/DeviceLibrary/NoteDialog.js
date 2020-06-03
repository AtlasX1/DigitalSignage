import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  withStyles
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { translate } from 'react-i18next'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import {
  getDeviceNotesAction,
  postDeviceNoteAction
} from '../../../../actions/deviceActions'
import i18n from '../../../../i18n'
import { BlueButton, WhiteButton } from '../../../Buttons'
import { FormControlInput } from '../../../Form'
import UserPic from '../../../UserPic'
import { getUrlPrefix } from 'utils/index'

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      background: palette[type].body.background,
      boxShadow: `0px 11px 15px -7px ${palette[type].dialog.shadow}20,
                  0px 24px 38px 3px ${palette[type].dialog.shadow}14,
                  0px 9px 46px 8px ${palette[type].dialog.shadow}12`
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: palette[type].dialog.header.background,
      borderBottom: `solid 1px ${palette[type].dialog.border}`,
      padding: '15px 20px'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: palette[type].dialog.title
    },
    subtitle: {
      fontSize: '14px',
      color: palette[type].dialog.subtitle
    },
    close: {
      width: '46px',
      height: '46px',
      margin: '0px',
      padding: '0px',
      color: palette[type].dialog.closeButton
    },
    content: {
      background: palette[type].dialog.background,
      padding: '10px 20px 5px',
      minHeight: '77px'
    },
    rowContainer: {
      display: 'grid',
      grid: '1fr / minmax(160px,auto) 1fr',
      gap: '10px',
      padding: '12px 0',
      borderBottom: `solid 1px ${palette[type].dialog.border}`,
      '&:last-child': {
        borderBottom: 'none'
      }
    },
    userContainer: {
      display: 'grid',
      grid: 'repeat(2, 1fr)/ 1fr'
    },
    avatarRoot: {
      marginRight: '12px',
      gridRow: '1/last'
    },
    avatar: {
      width: 42,
      height: 42
    },
    name: {
      color: palette[type].dialog.title
    },
    time: {
      fontSize: '11px',
      color: palette[type].dialog.subtitle
    },
    message: {
      maxWidth: '400px',
      lineHeight: '1.25',
      overflowWrap: 'break-word',
      overflow: 'hidden',
      whiteSpace: 'pre-line',
      padding: '4px',
      fontSize: '12px',
      color: palette[type].dialog.text
    },
    actionBar: {
      display: 'grid',
      grid: '1fr / 1fr repeat(2,max-content)',
      alignItems: 'center',
      background: palette[type].dialog.header.background,
      borderTop: `solid 1px ${palette[type].dialog.border}`,
      padding: '10px 16px',
      margin: '0px'
    },
    input: {
      margin: '0 8px 0 0'
    }
  }
}

const NoteDialog = ({
  t,
  match,
  classes,
  noteData,
  getDeviceNotesAction,
  postDeviceNoteAction
}) => {
  const [data, setData] = useState({})
  const [input, setInput] = useState('')
  const [multiline, setMultiline] = useState(false)
  const user = useSelector(state => state.user.details.response)

  useEffect(() => {
    if (match.path === getUrlPrefix('device-library/list/note/:id')) {
      getDeviceNotesAction(match.params.id)
      setData({ ...data, id: match.params.id })
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (noteData && noteData.note) {
      if (noteData.note.length >= 1) {
        noteData.note = noteData.note.reverse()
      }
      setData(noteData)
    } else {
    }
  }, [noteData])

  useEffect(() => {
    if (encodeURIComponent(input).match(/(%0A)+/) && input.length > 0) {
      setMultiline(true)
    } else {
      setMultiline(false)
    }
  }, [input])

  const handleChange = event => setInput(event.target.value)

  const addNote = () => {
    if (input.length > 0 && Object.keys(user).length > 0) {
      const newNote = (({
        id,
        firstName,
        lastName,
        email,
        profile,
        status
      }) => ({
        id: data.note && data.note.length ? data.note.length : 0,
        message: String(input),
        user: {
          id,
          firstName,
          lastName,
          email,
          profile,
          status
        },
        time: new Date().toISOString()
      }))(user)
      const mutatedData =
        data && data.note && data.note.length > 0
          ? { ...data, note: [...data.note, newNote] }
          : { ...data, note: [newNote] }
      setData(mutatedData)
      postDeviceNoteAction(data.id, newNote)
    }
    setInput('')
  }

  return (
    <Dialog classes={{ paper: classes.container }} open fullWidth>
      <DialogTitle className={classes.header} disableTypography>
        <Grid item container direction="column">
          <Typography className={classes.title} component="h2">
            {t('Device Notes')}
          </Typography>
          <Typography className={classes.subtitle} component="h2">
            {data.name}
          </Typography>
        </Grid>

        <IconButton
          className={classes.close}
          component={Link}
          to={getUrlPrefix('device-library/list')}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className={classes.content}>
        {data.note &&
          data.note.length > 0 &&
          data.note.map((note, index) => (
            <Grid key={index} container className={classes.rowContainer}>
              <Grid item container>
                <UserPic
                  status={note.user.status === 'Active' ? 'online' : 'offline'}
                  classes={{ root: classes.avatarRoot, avatar: classes.avatar }}
                  src={note.user.profile}
                />
                <Grid item className={classes.infoContainer}>
                  <Typography
                    className={classes.name}
                    component="h1"
                    title={note.user.email}
                  >{`${note.user.firstName} ${note.user.lastName}`}</Typography>
                  <Typography className={classes.time} component="h2">
                    {`${new Date(note.time).toLocaleDateString(i18n.language)} |
                      ${new Date(note.time).toLocaleTimeString(i18n.language, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}`}
                  </Typography>
                </Grid>
              </Grid>
              <Typography component="pre" className={classes.message}>
                {note.message}
              </Typography>
            </Grid>
          ))}
      </DialogContent>
      <DialogActions className={classes.actionBar}>
        <FormControlInput
          id="note-input"
          name="note-input"
          placeholder={t('Add Note')}
          fullWidth={true}
          autoFocus
          onFocus={() => {
            if (multiline && input.length > 0) setInput(input + '\n')
          }}
          multiline={multiline}
          rows={multiline ? 0 : 2}
          value={input}
          formControlRootClass={classes.input}
          handleChange={event => handleChange(event)}
          onKeyUp={key => {
            if (key.keyCode === 13 && multiline === false) {
              setMultiline(true)
            }
          }}
        />
        <BlueButton onClick={() => addNote()}>{t('Add Note')}</BlueButton>
        <WhiteButton onClick={() => setInput('')}>{t('Clear')}</WhiteButton>
      </DialogActions>
    </Dialog>
  )
}

NoteDialog.propTypes = {
  classes: PropTypes.object,
  getDeviceNotesAction: PropTypes.func,
  postDeviceNoteAction: PropTypes.func
}

const mapStateToProps = state => {
  const noteData = state.device.note.response
  return noteData ? { noteData: noteData } : {}
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ getDeviceNotesAction, postDeviceNoteAction }, dispatch)

export default translate('translations')(
  withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NoteDialog))
)
