import React, { useCallback, useState } from 'react'
import { Typography, withStyles } from '@material-ui/core'
import { WhiteButton } from 'components/Buttons'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import SelectBackgroundDialog from 'components/Modal/SelectBackgroundDialog'
import classNames from 'classnames'

const styles = ({ palette, type }) => ({
  btn: {
    padding: '0.5px 16px',
    height: '41px'
  },
  text: {
    fontWeight: 'bold',
    color: palette[type].sideModal.action.button.color
  },
  sectionHeaderPadding: {
    padding: '0 0 0 13px'
  },
  icon: {
    fontSize: '16px',
    marginRight: '10px'
  }
})

const FormControlBackgroundSelect = ({
  classes,
  onChange,
  name,
  style,
  value,
  t
}) => {
  const [open, toggleOpen] = useState(false)

  const handleOpenDialog = useCallback(() => {
    toggleOpen(true)
  }, [])

  const handleCloseDialog = useCallback(() => {
    toggleOpen(false)
  }, [])

  const handleClickSave = useCallback(
    value => {
      onChange({ target: { name, value } })
      toggleOpen(false)
    },
    [name, onChange]
  )

  return (
    <>
      <WhiteButton
        style={style}
        className={classes.btn}
        onClick={handleOpenDialog}
      >
        <i className={classNames(classes.icon, 'icon-cloud-image')} />
        <Typography className={classes.text}>
          {t('Select Background')}
        </Typography>
      </WhiteButton>

      <SelectBackgroundDialog
        open={open}
        values={value}
        onClickSave={handleClickSave}
        onCloseModal={handleCloseDialog}
      />
    </>
  )
}

export default compose(
  translate('translations'),
  withStyles(styles)
)(FormControlBackgroundSelect)
