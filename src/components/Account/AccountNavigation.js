import React, { useState } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Dialog } from '@material-ui/core'

import AccountNavigationLink from './AccountNavigationLink'
import SuggestionForm from '../Header/SuggestionForm'

const styles = theme => {
  const { palette, type } = theme
  return {
    accountNavigation: {
      display: 'flex',
      alignItems: 'center'
    },
    icon: {
      color: palette[type].header.rightAction.iconColor
    },
    dialog: {
      width: 674,
      background: palette[type].suggestionBox.background
    }
  }
}

const AccountNavigation = ({ classes }) => {
  const [dialog, setDialog] = useState(false)

  const handleClose = () => {
    setDialog(false)
  }

  return (
    <>
      <nav className={classes.accountNavigation}>
        <AccountNavigationLink
          linkIconClassName={[
            'hvr-grow icon-chat-bubble-circle-2',
            classes.icon
          ].join(' ')}
          handleClick={() => setDialog(true)}
        />

        {/* <AccountNavigationLink
          linkIconClassName={['icon-beauty-hand-mirror', classes.icon].join(
            ' '
          )}
        />
        <AccountNavigationLink
          linkIconClassName={['icon-alarm', classes.icon].join(' ')}
        /> */}
      </nav>

      <Dialog
        open={dialog}
        classes={{
          paper: classes.dialog
        }}
        maxWidth={false}
        onClose={handleClose}
      >
        <SuggestionForm />
      </Dialog>
    </>
  )
}

export default translate('translations')(withStyles(styles)(AccountNavigation))
