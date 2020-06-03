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
import React, { useCallback, useEffect, useState } from 'react'
import { translate } from 'react-i18next'
import { Link } from 'react-router-dom'

import i18n from '../../i18n'
import { BlueButton, WhiteButton } from 'components/Buttons'
import { FormControlInput } from 'components/Form'
import UserPic from 'components/UserPic'

const styles = ({ palette, type }) => ({
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
    padding: '24px 16px',
    margin: '0px'
  },
  input: {
    margin: '0 8px 0 0'
  }
})

const NoteDialog = ({
  t,
  classes,
  match: { params },
  closeLink,
  dialogTitle,
  noteData,
  postNoteReducer,
  getNotesAction,
  postNoteAction,
  clearGetNoteInfo,
  clearPostNoteInfo
}) => {
  const [inputValue, setInputValue] = useState('')
  const [multiline, setMultiline] = useState(false)

  useEffect(() => {
    const { id } = params
    getNotesAction(id)
    return () => {
      clearGetNoteInfo()
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const { id } = params
    if (postNoteReducer.response) {
      clearPostNoteInfo()
      getNotesAction(id)
    }
    // eslint-disable-next-line
  }, [postNoteReducer])

  useEffect(() => {
    if (
      encodeURIComponent(inputValue).match(/(%0A)+/) &&
      inputValue.length > 0
    ) {
      setMultiline(true)
    } else {
      setMultiline(false)
    }
  }, [inputValue])

  const handleInputChange = useCallback(
    ({ currentTarget: { value } }) => setInputValue(value),
    []
  )

  const handleInputFocus = useCallback(() => {
    if (multiline && inputValue.length > 0) {
      setInputValue(inputValue + '\n')
    }
  }, [multiline, inputValue])

  const handleInputKeyUp = useCallback(
    key => {
      if (!multiline && key.keyCode === 13) {
        setMultiline(true)
      }
    },
    [multiline]
  )

  const handleClearInput = useCallback(() => {
    setInputValue('')
  }, [])

  const handleAddNote = useCallback(() => {
    const { id } = params
    if (inputValue.length > 0) {
      postNoteAction({ id, message: String(inputValue) })
      setInputValue('')
    }
  }, [inputValue, params, postNoteAction])

  return (
    <Dialog classes={{ paper: classes.container }} open fullWidth>
      <DialogTitle className={classes.header} disableTypography>
        <Grid item container direction="column">
          <Typography className={classes.title} component="h2">
            {dialogTitle}
          </Typography>
          <Typography className={classes.subtitle} component="h2">
            {noteData.name}
          </Typography>
        </Grid>

        <IconButton className={classes.close} component={Link} to={closeLink}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className={classes.content}>
        {noteData &&
          noteData.length > 0 &&
          noteData.map(note => (
            <Grid key={note.id} container className={classes.rowContainer}>
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
                  >
                    {`${note.user.firstName} ${note.user.lastName}`}
                  </Typography>
                  <Typography className={classes.time} component="h2">
                    {`${new Date(note.time).toLocaleDateString(i18n.language)} |
                        ${new Date(note.time).toLocaleTimeString(
                          i18n.language,
                          {
                            hour: '2-digit',
                            minute: '2-digit'
                          }
                        )}`}
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
          autoFocus
          fullWidth={true}
          placeholder={t('Add Note')}
          multiline={multiline}
          formControlRootClass={classes.input}
          rows={multiline ? 0 : 2}
          value={inputValue}
          handleChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyUp={handleInputKeyUp}
        />
        <BlueButton onClick={handleAddNote}>{t('Add Note')}</BlueButton>
        <WhiteButton onClick={handleClearInput}>{t('Clear')}</WhiteButton>
      </DialogActions>
    </Dialog>
  )
}

NoteDialog.propTypes = {
  classes: PropTypes.object,
  getDeviceNotesAction: PropTypes.func,
  postDeviceNoteAction: PropTypes.func
}

export default translate('translations')(withStyles(styles)(NoteDialog))
