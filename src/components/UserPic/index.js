import React from 'react'
import { withStyles, Avatar } from '@material-ui/core'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { CLIENT_ADMIN, SUPER_ADMIN } from 'constants/roles'
import moment from 'moment'

const styles = () => ({
  root: {
    position: 'relative',
    display: 'inline-block',

    '&::after': {
      content: "''",
      display: 'block',
      position: 'absolute',
      top: '5px',
      right: '-2px',
      width: 12,
      height: 12,
      border: '2px solid #fff',
      borderRadius: '100%'
    }
  },

  userOffline: {
    '&::after': {
      backgroundColor: 'gray'
    }
  },
  userOnline: {
    '&::after': {
      backgroundColor: '#3cd480'
    }
  },
  loginWithinWeek: {
    '&::after': {
      backgroundColor: '#D35E37'
    }
  },

  typedAvatar: {
    width: 52,
    height: 52,
    border: '5px solid gray'
  },

  avatar: {
    width: 57,
    height: 57
  },
  clientAdmin: {
    borderColor: '#ff7b25'
  },
  superAdmin: {
    borderColor: '#3983ff'
  }
})

const UserPic = ({
  classes,
  status,
  lastLogin,
  role,
  userName = '',
  imgSrc
}) => {
  if (lastLogin) {
    if (moment().diff(moment(lastLogin), 'hours') <= 24) {
      status = 'online'
    } else if (moment().diff(moment(lastLogin), 'days') > 7) {
      status = 'inactive'
    }
  } else {
    status = 'inactive'
  }
  return (
    <div
      className={classNames(classes.root, classes.userOffline, {
        [classes.userOnline]: status === 'online' || status === 'Active',
        [classes.loginWithinWeek]:
          lastLogin &&
          moment().diff(moment(lastLogin), 'days') <= 7 &&
          moment().diff(moment(lastLogin), 'hours') > 24
      })}
    >
      <Avatar
        alt={userName}
        src={imgSrc}
        className={classNames({
          [classes.avatar]: !role,
          [classes.typedAvatar]: role,
          [classes.clientAdmin]: role === CLIENT_ADMIN,
          [classes.superAdmin]: role === SUPER_ADMIN
        })}
      />
    </div>
  )
}

UserPic.propTypes = {
  status: PropTypes.string
}

export default withStyles(styles)(UserPic)
