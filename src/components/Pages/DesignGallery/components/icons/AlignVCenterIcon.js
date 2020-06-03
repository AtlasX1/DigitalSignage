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
      d="M7.99949 -0.000183105L4.99949 4.00082H6.99949V6.99982H0.000488281V8.99982H6.99949V12.0008H4.99949L7.99949 15.9998L11.0005 12.0008H9.00049V8.99982H15.9995V6.99982H9.00049V4.00082H11.0005L7.99949 -0.000183105Z"
    />
  </svg>
)

AlignHCenterIcon.propTypes = {
  fill: PropTypes.string
}

export default AlignHCenterIcon
