import React from 'react'
import PropTypes from 'prop-types'

import { Route, Redirect } from 'react-router-dom'

import { getToken, getUserType } from '../../utils'

import { apiConstants } from '../../constants'
import getUrlPrefix from 'utils/permissionUrls'

const SystemRoute = ({ component: Component, propsComponent, ...rest }) => {
  const logged = !!getToken()

  const type = getUserType()
  const system = type === apiConstants.SYSTEM_USER

  return (
    <Route
      {...rest}
      render={props =>
        !logged ? (
          <Redirect to="/sign-in" />
        ) : system ? (
          <Component {...props} {...propsComponent} />
        ) : (
          <Redirect to={getUrlPrefix('dashboard')} />
        )
      }
    />
  )
}

SystemRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
}

export default SystemRoute
