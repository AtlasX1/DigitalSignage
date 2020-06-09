import React, { useEffect, useCallback, useRef, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import {
  Typography,
  Grid,
  withStyles,
  Dialog,
  IconButton,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { BlueButton, WhiteButton } from 'components/Buttons'
import { useEventListener } from 'hooks'
import languages from 'constants/languages'
import { getLanguage, setLanguage } from '../../utils/language'

const styles = theme => {
  const { type, palette } = theme
  return {
    dialogContainer: {
      background: 'transparent'
    },
    headerContainer: {
      margin: '0px',
      padding: '0px',
      backgroundColor: palette[type].card.greyHeader.background,
      borderBottom: `1px solid ${palette[type].pages.adminSettings.content.border}`
    },
    header: {
      height: '58px'
    },
    title: {
      fontSize: '18px',
      lineHeight: '30px',
      fontWeight: 'bold',
      color: palette[type].card.titleColor,
      paddingLeft: '32px'
    },
    closeButton: {
      position: 'relative',
      right: '20px',
      color: palette[type].card.greyHeader.color
    },

    contentRoot: {
      padding: '0px !important',
      backgroundColor: palette[type].languageSelector.background
    },
    content: {
      display: 'flex',
      height: '100%',
      width: '100%',
      margin: '16px 0',
      padding: '32px 16px 32px 30px',
      backgroundColor: palette[type].languageSelector.background
    },

    languageContainer: {
      height: '50px',
      maxHeight: '50px',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      margin: '16px 0'
    },
    singleLanguageContainer: {
      cursor: 'pointer',
      background: 'transparent',
      transition: 'opacity 400ms',
      opacity: 0.5,
      '&:hover': {
        opacity: 1,
        '& > p': {
          fontWeight: 'bold',
          color: palette[type].card.titleColor
        }
      }
    },
    selectedLanguage: {
      opacity: 1,
      '& > p': {
        fontWeight: 'bold',
        color: palette[type].card.titleColor
      }
    },

    flag: {
      width: 48,
      height: 48,
      color: palette[type].header.account.color
    },
    languageName: {
      fontSize: '24px',
      paddingLeft: '12px',
      transition: 'all 400ms',
      color: palette[type].languageSelector.color
    },

    actionBar: {
      margin: '0px',
      padding: '16px 30px',
      backgroundColor: palette[type].sideModal.action.background,
      borderTop: `1px solid ${palette[type].pages.adminSettings.content.border}`
    },
    actionButton: {
      minWidth: '100px',
      padding: '6px 14px',
      margin: '0px',
      '&:first-child': {
        marginRight: '12px'
      }
    },
    actionLabel: {
      fontSize: '13px',
      lineHeight: '22px'
    },
    actionButtonReset: {
      borderColor: palette[type].sideModal.action.button.border,
      boxShadow: 'none',
      backgroundImage: palette[type].sideModal.action.button.background,
      color: palette[type].sideModal.action.button.color,
      '&:hover': {
        color: '#fff',
        background: '#006198',
        borderColor: '#006198'
      }
    }
  }
}

const LanguageSelector = ({ t, classes, setLanguageSelectorIsOpen, route }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const initialLanguage = useMemo(() => getLanguage(), [])
  const isFirstRun = useRef(true)
  const closeModal = () => setLanguageSelectorIsOpen(false)

  const keypressHandler = useCallback(
    e => {
      if (e.key === 'Escape') {
        closeModal()
      }
    },
    // eslint-disable-next-line
    [setLanguageSelectorIsOpen]
  )

  useEventListener('keydown', keypressHandler)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    closeModal()
    //eslint-disable-next-line
  }, [route])
  // eslint-disable-next-line
  useEffect(() => void setSelectedLanguage(initialLanguage), [])

  const onLanguageChange = async code => {
    await setLanguage(code)
  }

  return (
    <Dialog
      open
      onClose={closeModal}
      maxWidth={'lg'}
      classes={{ paper: classes.dialogContainer }}
    >
      <DialogTitle disableTypography className={classes.headerContainer}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.header}
        >
          <Typography variant="h1" className={classes.title}>
            {t('Select Language')}
          </Typography>
          <IconButton className={classes.closeButton} onClick={closeModal}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>

      <DialogContent classes={{ root: classes.contentRoot }}>
        <Grid
          container
          direction="row"
          wrap="wrap"
          justify="flex-start"
          alignItems="center"
          className={classes.content}
        >
          {languages.map(({ code, name, icon }) => (
            <Grid key={code} item xs={3} className={classes.languageContainer}>
              <Grid
                container
                justify="flex-start"
                direction="row"
                alignItems="center"
                className={[
                  classes.singleLanguageContainer,
                  code === selectedLanguage ? classes.selectedLanguage : ''
                ].join(' ')}
                onClick={() => setSelectedLanguage(code)}
              >
                <img src={icon} className={classes.flag} alt={name} />
                <Typography className={classes.languageName}>{name}</Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions className={classes.actionBar}>
        <BlueButton
          classes={{ root: classes.actionButton, label: classes.actionLabel }}
          onClick={() => onLanguageChange(selectedLanguage)}
        >
          {t('Save')}
        </BlueButton>
        <WhiteButton
          classes={{
            root: [classes.actionButton, classes.actionButtonReset].join(' '),
            label: classes.actionLabel
          }}
          onClick={() => {
            setSelectedLanguage(initialLanguage)
            onLanguageChange(initialLanguage)
          }}
        >
          {t('Reset')}
        </WhiteButton>
      </DialogActions>
    </Dialog>
  )
}

LanguageSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  setLanguageSelectorIsOpen: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired
}

export default translate('translations')(withStyles(styles)(LanguageSelector))
