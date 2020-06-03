import React, { useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'

const CustomScrollbars = ({ children, ...props }) => {
  const [hovering, setHovering] = useState(false)

  const Track = ({ style }) => (
    <div
      style={{
        ...style,
        right: '2px',
        bottom: '2px',
        top: '2px',
        borderRadius: '3px',
        opacity: hovering ? 1 : 0,
        transition: 'opacity 500ms ease 0s',
        zIndex: 10
      }}
    />
  )

  const Thumb = ({ style }) => (
    <div
      style={{
        ...style,
        height: '40px',
        backgroundColor: '#25252550',
        borderRadius: 'inherit',
        cursor: 'pointer'
      }}
    />
  )

  return (
    <Scrollbars
      renderTrackVertical={style => Track(style)}
      renderThumbVertical={style => Thumb(style)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      autoHide
      {...props}
    >
      {children}
    </Scrollbars>
  )
}

export { CustomScrollbars as Scrollbars }
