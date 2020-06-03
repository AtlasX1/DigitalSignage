import React from 'react'
import PropTypes from 'prop-types'

import { Route, Redirect } from 'react-router-dom'

import { getToken, getUserType } from '../../utils'

import { apiConstants } from '../../constants'
import getUrlPrefix from 'utils/permissionUrls'

const ORGRoute = ({ component: Component, ...rest }) => {
  const logged = !!getToken()

  const type = getUserType()
  const org = type === apiConstants.ORG_USER

  return (
    <Route
      {...rest}
      render={props =>
        !logged ? (
          <Redirect to="/sign-in" />
        ) : org ? (
          <Component {...props} />
        ) : (
          <Redirect to={getUrlPrefix('dashboard')} />
        )
      }
    />
  )
}

ORGRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
}

export default ORGRoute
