import React from 'react'
import SignIn from './SignIn'
import { apiConstants } from 'constants/index'

function SystemSignIn({ ...props }) {
  return (
    <SignIn
      {...props}
      userType={apiConstants.SYSTEM_USER}
      title="System Login"
      displayIp
    />
  )
}

export default SystemSignIn
