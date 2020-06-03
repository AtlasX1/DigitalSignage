import React, { Component } from 'react'
import OktaSignInWidget from './SignInWidget'
import { withAuth } from '@okta/okta-react'
import { loginOktaAction } from '../../../../actions/authenticationActions'
import { connect } from 'react-redux'

class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.onSuccess = this.onSuccess.bind(this)
    this.onError = this.onError.bind(this)

    this.state = {
      authenticated: false
    }
    this.checkAuthentication()
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated()
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated })
    }
  }

  componentDidUpdate() {
    this.checkAuthentication()
  }

  onSuccess(res) {
    this.props.auth._oktaAuth.token
      .getWithoutPrompt({
        sessionToken: res.session.token,
        responseType: ['token', 'id_token'],
        scopes: ['openid', 'profile']
      })
      .then(async tokens => {
        for (let token of tokens) {
          if (token.accessToken) {
            this.props.loginOktaAction({
              provider: 'okta',
              token: token.accessToken
            })
          }
        }
      })
  }

  onError(err) {
    //todo error handler
  }

  render() {
    if (this.state.authenticated) return null
    return (
      <OktaSignInWidget
        baseUrl={process.env.REACT_APP_OKTA_BASE_URL}
        onSuccess={this.onSuccess}
        onError={this.onError}
      />
    )
  }
}

const mapDispatchToProps = {
  loginOktaAction
}

const mapStateToProps = ({ login }) => ({ login })

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(LoginForm))
