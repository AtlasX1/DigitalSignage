import { memo, useMemo } from 'react'
import propTypes from 'prop-types'
import { truncateStringUtils } from 'utils'

const UserNameView = ({ firstName = '', lastName = '', maxLength = 15 }) => {
  const name = useMemo(
    () =>
      `${truncateStringUtils.truncateWithEllipsis(
        firstName,
        maxLength
      )} ${truncateStringUtils.truncateWithEllipsis(lastName, maxLength)}`,
    [firstName, lastName, maxLength]
  )

  return name
}

UserNameView.propTypes = {
  firstName: propTypes.string,
  lastName: propTypes.string,
  maxLength: propTypes.number
}

export default memo(UserNameView)
