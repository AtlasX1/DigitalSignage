import React, { useMemo } from 'react'
import { translate } from 'react-i18next'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { whiteLabelUtils } from 'utils/index'

const styles = () => ({
  mainFooter: {
    marginTop: 33,
    marginBottom: 70,
    padding: '0 8px'
  },
  mainFooterNavigationLink: {
    marginRight: '1rem',
    textDecoration: 'none',
    display: 'inline-block'
  },
  mainFooterText: {
    transform: 'translate(0, 1.5px) scale(0.75)',
    fontSize: '0.75rem',
    color: '#bac0cd',
    lineHeight: '1.6667em',
    fontWeight: '400'
  },
  footerCopyright: {
    marginRight: 10,
    verticalAlign: 'middle'
  },
  footerRightContainer: {
    display: 'flex',
    alignItems: 'center'
  }
})

const Footer = ({ classes, t }) => {
  const [whiteLabelReducer] = useSelector(state => [state.whiteLabel])
  const whiteLabelInfo = useMemo(() => {
    return whiteLabelUtils.parseReducer(whiteLabelReducer)
  }, [whiteLabelReducer])
  return (
    <footer className={classes.mainFooter}>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <nav>
            <a
              href={whiteLabelInfo.privacyPolicy.link}
              className={classes.mainFooterNavigationLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography component="span" className={classes.mainFooterText}>
                {t('Privacy Policy footer link')}
              </Typography>
            </a>
            <a
              href={whiteLabelInfo.termsCondition.link}
              className={classes.mainFooterNavigationLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography component="span" className={classes.mainFooterText}>
                {t('Term and Conditions footer link')}
              </Typography>
            </a>
            <a
              href={whiteLabelInfo.aboutPage.link}
              className={classes.mainFooterNavigationLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography component="span" className={classes.mainFooterText}>
                {t('About Mvix footer link')}
              </Typography>
            </a>
          </nav>
        </Grid>
        <Grid item className={classes.footerRightContainer}>
          <Typography
            className={classNames(
              classes.mainFooterText,
              classes.footerCopyright
            )}
            component="p"
            variant="body1"
          >
            {whiteLabelInfo.copyrightText}
          </Typography>
          <img src={whiteLabelInfo.footerLogo} alt="Footer Logo" />
        </Grid>
      </Grid>
    </footer>
  )
}

export default translate('translations')(withStyles(styles)(Footer))
