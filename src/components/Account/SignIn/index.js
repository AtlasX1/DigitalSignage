import React, { useMemo } from 'react'
import { translate } from 'react-i18next'
import { useSelector } from 'react-redux'
import { withStyles, Typography } from '@material-ui/core'
import { withSnackbar } from 'notistack'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Form from './Form'
import IpAddress from './IpAddress'
import AccountModal from '../AccountModal'
import SocialPanel from '../SocialLogin/SocialPanel'
import { apiConstants } from 'constants/index'
import { whiteLabelUtils } from 'utils/index'
import { isEqual } from 'utils/generalUtils'

function styles({ palette, type }) {
  return {
    systemView: {
      background: '#121212'
    },
    container: {
      width: '569px',
      padding: '0 65px'
    },
    logoImage: {
      width: '104px',
      height: '32px',
      marginBottom: '120px'
    },
    formTitle: {
      fontWeight: 'bold',
      marginBottom: '55px',
      color: palette[type].pages.singIn.color
    }
  }
}

function SignIn({ t, classes, userType, title, displayIp, theme }) {
  const whiteLabelReducer = useSelector(({ whiteLabel }) => whiteLabel)

  const whiteLabelInfo = useMemo(() => {
    return whiteLabelUtils.parseReducer(whiteLabelReducer)
  }, [whiteLabelReducer])

  const isLightLogo = useMemo(
    () => theme.type === 'dark' && whiteLabelInfo.headerLogoLight,
    [theme.type, whiteLabelInfo.headerLogoLight]
  )

  const isSystemUser = useMemo(
    () => isEqual(userType, apiConstants.SYSTEM_USER),
    [userType]
  )

  return (
    <AccountModal
      rootClassName={classNames({
        [classes.systemView]: isSystemUser
      })}
    >
      <div className={classes.container}>
        <header>
          <img
            className={classes.logoImage}
            src={
              isLightLogo
                ? whiteLabelInfo.headerLogoLight
                : whiteLabelInfo.headerLogo
            }
            alt="Logo"
          />
          <Typography className={classes.formTitle} variant="h2" gutterBottom>
            {t(title)}
          </Typography>
        </header>
        <Form isIpVisible={displayIp} userType={userType} />
        {displayIp && <IpAddress />}
        <SocialPanel renderOptions={whiteLabelInfo.sso} />
      </div>
    </AccountModal>
  )
}

SignIn.propTypes = {
  userType: PropTypes.string,
  enqueueSnackbar: PropTypes.func,
  title: PropTypes.string,
  displayIp: PropTypes.bool,
  system: PropTypes.bool
}

SignIn.defaultProps = {
  title: 'Login',
  displayIp: false
}

export default compose(
  translate('translations'),
  withStyles(styles, { withTheme: true }),
  withSnackbar
)(SignIn)
