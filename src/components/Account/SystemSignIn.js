import React from 'react'

import SignIn from './SignIn'

import { apiConstants } from '../../constants'

const SystemSignIn = ({ ...props }) => (
  <SignIn
    {...props}
    userType={apiConstants.SYSTEM_USER}
    title="System Login"
    displayIp
  />
)

export default SystemSignIn
