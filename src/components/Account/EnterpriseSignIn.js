import React from 'react'

import SignIn from './SignIn'

import { apiConstants } from '../../constants'

const EnterpriseSignIn = ({ ...props }) => (
  <SignIn {...props} userType={apiConstants.userRoleLevels.enterprise} />
)

export default EnterpriseSignIn
