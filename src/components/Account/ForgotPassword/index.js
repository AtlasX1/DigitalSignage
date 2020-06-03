import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { Link as RouterLink, Route } from 'react-router-dom'

import { withStyles, Grid, Link, Typography } from '@material-ui/core'

import RecoveryForm from './RecoveryForm'
import ResetForm from './ResetForm'
import ExpiredForm from './ExpiredForm'

import BackgroundImage from '../../../common/assets/images/sign-in.jpg'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      position: 'relative',
      overflow: 'hidden',
      width: '100vw',
      height: '100vh',
      background: `url("${BackgroundImage}") no-repeat`,
      backgroundSize: 'cover',

      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        backgroundImage: 'linear-gradient(#00e7c1, #00d0e6)'
      },

      '&::before': {
        top: 0,
        left: '-100%',
        right: '70%',
        bottom: 0,
        transform: 'skewX(20deg)'
      },

      '&::after': {
        top: '-10%',
        right: 0,
        width: '400px',
        height: '50%',
        opacity: '.8',
        transform: 'skewX(70deg)'
      }
    },
    formWrap: {
      display: 'inline-block',
      position: 'absolute',
      top: '50%',
      left: '120px',
      zIndex: 2,
      width: '640px',
      padding: '250px 35px 25px',
      background: palette[type].pages.singIn.background,
      transform: 'translateY(-50%)'
    },
    formLink: {
      margin: '0 10px'
    },
    formLinkText: {
      fontSize: '13px',
      color: '#0076b9'
    },
    footerGrid: {
      marginBottom: '35px'
    },
    footerText: {
      color: '#888996',
      textAlign: 'center'
    }
  }
}

const ForgotPassword = ({ t, classes }) => {
  return (
    <div className={classes.root}>
      <div className={classes.formWrap}>
        <Route path="/forgot-password" component={RecoveryForm} />
        <Route path="/password-reset/:token/:email" component={ResetForm} />
        <Route path="/password-expired/:token/:email" component={ExpiredForm} />

        <footer>
          <Grid container justify="center" className={classes.footerGrid}>
            <Grid item>
              <Link
                to="/privacy-policy"
                component={RouterLink}
                className={classes.formLink}
              >
                <Typography className={classes.formLinkText}>
                  {t('Privacy Policy footer link')}
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Link
                to="/terms-conditions"
                component={RouterLink}
                className={classes.formLink}
              >
                <Typography className={classes.formLinkText}>
                  {t('Term and Conditions footer link')}
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Link
                to="/about"
                component={RouterLink}
                className={classes.formLink}
              >
                <Typography className={classes.formLinkText}>
                  {t('About Mvix footer link')}
                </Typography>
              </Link>
            </Grid>
          </Grid>
          <Typography className={classes.footerText}>
            If you have any e-Learning queries, please feel free to contact the
            e-Learning team on
            <Link href="tel:+18663104923">+1 866.310.4923</Link> or
            alternatively email us on{' '}
            <Link href="/support">support.mvixusa.com</Link>
          </Typography>
        </footer>
      </div>
    </div>
  )
}

ForgotPassword.propTypes = {
  classes: PropTypes.object
}

export default translate('translations')(withStyles(styles)(ForgotPassword))
