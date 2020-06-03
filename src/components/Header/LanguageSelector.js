import React, { useEffect, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { Typography, Grid, withStyles } from '@material-ui/core'
import { useEventListener } from 'hooks'
import languages from 'constants/languages'
import { setLanguage } from '../../utils/language'

const styles = theme => {
  const { type, palette } = theme
  return {
    container: {
      height: 'calc(100vh - 80px)',
      width: '100%',
      position: 'absolute',
      top: 80,
      padding: '20px',
      backgroundColor: palette[type].languageSelector.background
    },
    wrapper: {
      margin: '0 auto',
      maxWidth: 1600
    },
    title: {
      fontSize: '4rem',
      fontWeight: 'bold',
      color: palette[type].languageSelector.color,
      margin: '50px 0'
    },
    languageContainer: {
      height: 50,
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 50
    },
    flag: {
      width: 48,
      height: 48,
      color: palette[type].header.account.color,
      marginRight: 24
    },
    languageName: {
      fontSize: '2rem',
      color: palette[type].languageSelector.color
    },
    singleLanguageContainer: {
      cursor: 'pointer',
      background: 'transparent'
    }
  }
}

const LanguageSelector = ({ t, classes, setLanguageSelectorIsOpen, route }) => {
  const isFirstRun = useRef(true)
  const keypressHandler = useCallback(
    e => {
      if (e.key === 'Escape') {
        setLanguageSelectorIsOpen(false)
      }
    },
    [setLanguageSelectorIsOpen]
  )

  useEventListener('keydown', keypressHandler)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    setLanguageSelectorIsOpen(false)
    //eslint-disable-next-line
  }, [route])

  const onLanguageChange = async code => {
    await setLanguage(code)
    setLanguageSelectorIsOpen(false)
  }

  return (
    <Grid className={classes.container}>
      <Grid container direction="row" wrap="wrap" className={classes.wrapper}>
        <Grid item xs={12}>
          <Typography variant="h1" className={classes.title}>
            {t('Select Language')}:
          </Typography>
        </Grid>
        {languages.map(({ code, name, icon }) => (
          <Grid key={code} item xs={3} className={classes.languageContainer}>
            <Grid
              container
              justify="flex-start"
              direction="row"
              alignItems="center"
              className={classes.singleLanguageContainer}
              onClick={() => onLanguageChange(code)}
            >
              <img src={icon} className={classes.flag} alt={name} />
              <Typography className={classes.languageName}>{name}</Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}

LanguageSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  setLanguageSelectorIsOpen: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired
}

export default translate('translations')(withStyles(styles)(LanguageSelector))
