import React from 'react'
import { withStyles } from '@material-ui/core'
import { shadeColor } from 'utils'
import classNames from 'classnames'

const styles = theme => ({
  typeIconWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    borderRadius: '10px',
    textAlign: 'center'
  },
  typeIcon: {
    fontSize: '20px',
    color: '#fff'
  }
})

const LibraryTypeIcon = ({
  classes,
  color,
  wrapHelperClass,
  iconHelperClass,
  className,
  component: Component,
  icon: Icon,
  ...props
}) => {
  const { typeIcon, typeIconWrap } = classes

  const backgroundImage = color
    ? `linear-gradient(to bottom, ${shadeColor(color, 20)}, ${color})`
    : 'linear-gradient(to bottom, #e5dc58, #c6b72d)'

  return (
    <Component
      className={classNames(typeIconWrap, wrapHelperClass, className)}
      style={{ backgroundImage }}
      {...props}
    >
      {!Icon ? (
        <i
          className={classNames(typeIcon, iconHelperClass, {
            'icon-world-wide-web': !iconHelperClass
          })}
        />
      ) : (
        <Icon className={classNames(typeIcon, iconHelperClass)} />
      )}
    </Component>
  )
}
LibraryTypeIcon.defaultProps = {
  component: ({ children, ...props }) => <div {...props}>{children}</div>,
  icon: null
}

export default withStyles(styles)(LibraryTypeIcon)
