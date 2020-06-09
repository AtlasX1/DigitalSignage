import React from 'react'
import { withStyles } from '@material-ui/core'
import { Route } from 'react-router-dom'
import AccountModal from '../AccountModal'
import RecoveryForm from './RecoveryForm'
import ResetForm from './ResetForm'
import ExpiredForm from './ExpiredForm'

function styles() {
  return {
    formWrap: {
      paddingTop: 202
    }
  }
}

function ForgotPassword({ classes }) {
  return (
    <AccountModal formWrapClassName={classes.formWrap}>
      <Route path="/forgot-password" component={RecoveryForm} />
      <Route path="/password-reset/:token/:email" component={ResetForm} />
      <Route path="/password-expired/:token/:email" component={ExpiredForm} />
    </AccountModal>
  )
}

export default withStyles(styles)(ForgotPassword)
