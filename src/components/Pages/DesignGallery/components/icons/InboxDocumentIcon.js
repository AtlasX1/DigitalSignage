import React from 'react'
import PropTypes from 'prop-types'

const InboxDocumentIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="8" y="6" width="8" height="2" />
    <rect x="8" y="9" width="8" height="2" />
    <path d="M20 13H18V4H6V13H4V2H20V13Z" />
    <path d="M15.858 15C15.412 16.723 13.861 18 12 18C10.139 18 8.588 16.723 8.142 15H2V22H22V15H15.858Z" />
  </svg>
)

InboxDocumentIcon.propTypes = {
  fill: PropTypes.string
}

export default InboxDocumentIcon
