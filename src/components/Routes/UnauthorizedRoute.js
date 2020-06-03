import React from 'react'
import PropTypes from 'prop-types'

import { Route, Redirect } from 'react-router-dom'

import { getToken } from '../../utils'
import getUrlPrefix from 'utils/permissionUrls'

const UnauthorizedRoute = ({ component: Component, ...rest }) => {
  const logged = !!getToken()
  return (
    <Route
      {...rest}
      render={props =>
        !logged ? (
          <Component {...props} />
        ) : (
          <Redirect to={getUrlPrefix('dashboard')} />
        )
      }
    />
  )
}

UnauthorizedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
}

export default UnauthorizedRoute
