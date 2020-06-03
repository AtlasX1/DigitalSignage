import React from 'react'
import PropTypes from 'prop-types'

const AlignHCenterIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.00024 -0.000183105V6.99982H3.99924V4.99982L0.000244141 7.99982L3.99924 10.9998V8.99982H7.00024V15.9998H9.00024V8.99982H11.9992V10.9998L16.0002 7.99982L11.9992 4.99982V6.99982H9.00024V-0.000183105H7.00024Z"
    />
  </svg>
)

AlignHCenterIcon.propTypes = {
  fill: PropTypes.string
}

export default AlignHCenterIcon
