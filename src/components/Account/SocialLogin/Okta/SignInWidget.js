import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import OktaSignIn from '@okta/okta-signin-widget'
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css'
import Logo from '../../../../common/assets/images/okta-logo.png'

export default class OktaSignInWidget extends Component {
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this)
    this.widget = new OktaSignIn({
      baseUrl: this.props.baseUrl,
      redirect_uri: `${window.location.origin}/login/okta/callback`,
      authParams: {
        display: 'page',
        responseType: 'code',
        grantType: 'authorization_code'
      },
      language: 'en',
      i18n: {
        en: {
          'primaryauth.title': 'Sign in to Xhibit'
        }
      },
      logo: Logo
    })
    this.widget.renderEl({ el }, this.props.onSuccess, this.props.onError)
  }

  componentWillUnmount() {
    this.widget.remove()
  }

  render() {
    return <div />
  }
}
