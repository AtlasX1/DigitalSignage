import React, { useMemo } from 'react'
import { Typography, withStyles } from '@material-ui/core'
import { WhiteButton } from 'components/Buttons/index'
import { compose } from 'redux'
import { translate } from 'react-i18next'

const styles = ({ palette, type, typography }) => ({
  previewMediaBtn: {
    marginTop: 45,
    maxWidth: '147px',
    padding: '10px 25px 8px',
    border: `1px solid ${palette[type].sideModal.action.button.border}`,
    backgroundImage: palette[type].sideModal.action.button.background,
    borderRadius: '4px',
    boxShadow: 'none'
  },
  previewMediaText: {
    ...typography.lightText[type]
  }
})

const PreviewButton = ({ classes, onClick = f => f, text = 'Preview', t }) => {
  const translate = useMemo(() => t(text), [t, text])
  return (
    <WhiteButton className={classes.previewMediaBtn} onClick={onClick}>
      <Typography className={classes.previewMediaText}>{translate}</Typography>
    </WhiteButton>
  )
}

export default compose(
  translate('translations'),
  withStyles(styles)
)(PreviewButton)
