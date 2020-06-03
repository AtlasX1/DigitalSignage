import React, { useMemo } from 'react'
import { BlueButton, WhiteButton } from 'components/Buttons'
import classNames from 'classnames'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import PropTypes from 'prop-types'

const styles = ({ palette, type }) => ({
  actionSubmit: {
    width: 142,
    paddingTop: 9,
    paddingBottom: 9
  },
  actionCancel: {
    marginLeft: 20,
    borderColor: palette[type].sideModal.action.button.border,
    boxShadow: 'none',
    backgroundImage: palette[type].sideModal.action.button.background,
    color: palette[type].sideModal.action.button.color
  }
})

const FooterLayout = ({
  t,
  classes,
  isUpdate = false,
  isPending = false,
  onSubmit = f => f,
  onReset = f => f
}) => {
  const translate = useMemo(
    () => ({
      update: t('Update'),
      pending: t('Pending'),
      save: t('Save'),
      reset: t('Reset')
    }),
    [t]
  )

  return (
    <>
      <BlueButton
        type="submit"
        className={classes.actionSubmit}
        onClick={onSubmit}
        disabled={isPending}
      >
        {isPending
          ? translate.pending
          : isUpdate
          ? translate.update
          : translate.save}
      </BlueButton>
      <WhiteButton
        className={classNames(classes.actionSubmit, classes.actionCancel)}
        onClick={onReset}
      >
        {translate.reset}
      </WhiteButton>
    </>
  )
}

FooterLayout.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  isUpdate: PropTypes.bool,
  isPending: PropTypes.bool,
  titleSubmit: PropTypes.string,
  disabledSubmit: PropTypes.bool
}

export default translate('translations')(withStyles(styles)(FooterLayout))
