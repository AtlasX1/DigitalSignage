import React from 'react'
import PropTypes from 'prop-types'

const PlaylistIcon = ({ fill = 'currentColor' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M15.018 7.482L10.018 9.112C9.709 9.213 9.5 9.5 9.5 9.825V13C8.672 13 8 13.672 8 14.5C8 15.328 8.672 16 9.5 16C10.328 16 11 15.328 11 14.5V10.369L14.5 9.228V12C13.672 12 13 12.672 13 13.5C13 14.328 13.672 15 14.5 15C15.328 15 16 14.328 16 13.5V8.195C16 7.955 15.885 7.728 15.69 7.588C15.495 7.448 15.244 7.407 15.018 7.482Z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 4H18C19.103 4 20 4.898 20 6V18C20 19.103 19.103 20 18 20H6C4.897 20 4 19.103 4 18V6C4 4.898 4.897 4 6 4ZM6 6V18H18.001L18 6H6Z"
    />
    <rect x="21" y="6" width="2" height="12" />
    <rect x="1" y="6" width="2" height="12" />
  </svg>
)

PlaylistIcon.propTypes = {
  fill: PropTypes.string
}

export default PlaylistIcon
