import React from 'react'

const microsoftLoginProcessing = () => {
  function getParsedQuery() {
    return window.location.hash.indexOf('#') === 0
      ? parseQueryString(window.location.hash.substr(1))
      : {}
  }

  function parseQueryString(queryString) {
    let data = {},
      pairs,
      pair,
      separatorIndex,
      escapedKey,
      escapedValue,
      key,
      value

    if (!queryString) {
      return data
    }

    pairs = queryString.split('&')

    for (let i = 0; i < pairs.length; i++) {
      pair = pairs[i]
      separatorIndex = pair.indexOf('=')

      if (separatorIndex === -1) {
        escapedKey = pair
        escapedValue = null
      } else {
        escapedKey = pair.substr(0, separatorIndex)
        escapedValue = pair.substr(separatorIndex + 1)
      }

      key = decodeURIComponent(escapedKey)
      value = decodeURIComponent(escapedValue)

      data[key] = value
    }

    return data
  }

  const fragment = getParsedQuery()

  window.location.hash = fragment.state || ''

  window.opener.authScope.authCompletedCB(fragment)

  window.close()

  return <div>Processing...</div>
}

export default microsoftLoginProcessing
