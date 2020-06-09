import React, { memo } from 'react'
import { CircularProgress, withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import { compose } from 'redux'
import { FabBlueButton } from 'components/Buttons'

function styles() {
  return {
    submitButton: {
      minWidth: 166
    },
    circularProgress: {
      width: '20px !important',
      height: '20px !important',
      color: '#fff'
    }
  }
}

function createAttrs(className, type, variant, onClick) {
  return {
    className,
    type,
    variant,
    onClick
  }
}

function SubmitButton({ t, classes, onClick, isLoading }) {
  const attrs = createAttrs(classes.submitButton, 'submit', 'extended', onClick)

  if (isLoading) {
    return (
      <FabBlueButton {...attrs}>
        <CircularProgress className={classes.circularProgress} />
      </FabBlueButton>
    )
  }

  return <FabBlueButton {...attrs}>{t('Sign In')}</FabBlueButton>
}

export default memo(
  compose(translate('translations'), withStyles(styles))(SubmitButton)
)
