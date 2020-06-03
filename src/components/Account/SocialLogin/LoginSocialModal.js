import React from 'react'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'

import {
  loginUserAction,
  clearLoginInfo
} from '../../../actions/authenticationActions'

import LoginForm from './Okta/LoginForm'

import { Security } from '@okta/okta-react'

const LoginSocialModal = ({ t, classes, ...props }) => {
  function onAuthRequired({ history }) {
    history.push('/login')
  }

  return (
    <Dialog
      className="socialModal"
      open={props.isOpen}
      aria-labelledby="customized-dialog-title"
    >
      <DialogContent>
        <Security
          issuer={process.env.REACT_APP_OKTA_ISSUER}
          clientId={process.env.REACT_APP_OKTA_CLIENT_ID}
          redirectUri={`${window.location.origin}/login/okta/callback`}
          onAuthRequired={onAuthRequired}
          pkce={true}
        >
          <LoginForm />
        </Security>
      </DialogContent>
    </Dialog>
  )
}

const mapStateToProps = ({ login }) => ({ login })

const mapDispatchToProps = dispatch =>
  bindActionCreators({ loginUserAction, clearLoginInfo }, dispatch)

export default translate('translations')(
  connect(mapStateToProps, mapDispatchToProps)(LoginSocialModal)
)
