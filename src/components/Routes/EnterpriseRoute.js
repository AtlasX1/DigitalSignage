import React from 'react'
import PropTypes from 'prop-types'

import { Route, Redirect } from 'react-router-dom'

import { getToken } from 'utils'
import getUrlPrefix from 'utils/permissionUrls'
import useUserRole from 'hooks/tableLibrary/useUserRole'

const EnterpriseRoute = ({ component: Component, ...rest }) => {
  const logged = !!getToken()
  const role = useUserRole()
  if (!logged) {
    return <Redirect to="/sign-in" />
  }

  return (
    <Route
      {...rest}
      render={props =>
        role.enterprise ? (
          <Component {...props} />
        ) : (
          <Redirect to={getUrlPrefix('dashboard')} />
        )
      }
    />
  )
}

EnterpriseRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
}

export default EnterpriseRoute
