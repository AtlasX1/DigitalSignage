import React from 'react'
import PropTypes from 'prop-types'

const CubeIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="24"
    height="24"
    fill={fill}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 3H8L2 9V22H15L21 16V3ZM13 20H4V11H13V20ZM5 9H13L17 5H9L5 9Z"
    />
  </svg>
)

CubeIcon.propTypes = {
  fill: PropTypes.string
}

export default CubeIcon
