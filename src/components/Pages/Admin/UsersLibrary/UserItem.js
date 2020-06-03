import React from 'react'
import PropTypes from 'prop-types'

import { translate } from 'react-i18next'
import classNames from 'classnames'
import { useDrag } from 'react-dnd'

import { withStyles, Typography } from '@material-ui/core'

import { dndConstants } from 'constants/index'
import EmailLink from 'components/EmailLink'

const styles = theme => {
  const { palette, type } = theme
  return {
    userItemWrap: {
      display: 'table-row',
      '&:not(:last-child)': {
        borderBottom: `1px solid ${palette[type].sideModal.content.border}`
      }
    },
    userTitle: {
      display: 'table-cell',
      padding: 15,
      fontSize: 14,
      fontWeight: 'bold',
      lineHeight: '36px',
      color: palette[type].sideModal.tabs.item.titleColor
    },
    name: {
      whiteSpace: 'nowrap'
    },
    email: {
      width: '100%'
    }
  }
}

const UserItem = ({ classes, user }) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: dndConstants.usersItemTypes.USER_ITEM,
      id: user.id
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const opacity = isDragging ? 0 : 1

  return (
    <div ref={drag} className={classes.userItemWrap} style={{ opacity }}>
      <Typography className={classNames(classes.userTitle, classes.name)}>
        {user.firstName + ' ' + user.lastName}
      </Typography>
      <Typography className={classNames(classes.userTitle, classes.email)}>
        <EmailLink email={user.email} />
      </Typography>
    </div>
  )
}

UserItem.propTypes = {
  classes: PropTypes.object,
  user: PropTypes.object
}

export default translate('translations')(withStyles(styles)(UserItem))
