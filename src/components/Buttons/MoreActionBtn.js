import React, { useCallback } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { WhiteButton } from 'components/Buttons'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import Popup from 'components/Popup'

const styles = ({ palette, type, typography }) => ({
  actionIcons: {
    marginRight: '17px'
  },
  iconColor: {
    marginRight: '9px',
    fontSize: '14px',
    color: palette[type].pageContainer.header.button.iconColor
  },
  optionBtn: {
    height: 30,
    fontSize: 14,
    lineHeight: '14px',
    cursor: 'pointer',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    fontFamily: typography.fontFamily,
    color: palette[type].header.rightAction.iconColor,

    '&:hover': {
      color: palette[type].tableLibrary.body.cell.color
    }
  },
  container: {
    padding: 10
  }
})
const MoreActionsBtn = ({ t, classes, options = [], onClick }) => {
  const dropdownStyle = {
    minWidth: 100
  }

  const handleClickOption = useCallback(
    value => {
      onClick(value)
    },
    [onClick]
  )

  return (
    <Popup
      on="click"
      position="bottom right"
      contentStyle={dropdownStyle}
      trigger={
        <WhiteButton
          className={classNames(classes.actionIcons, 'hvr-radial-out')}
        >
          <i
            className={classNames(
              classes.iconColor,
              'icon-navigation-show-more-vertical'
            )}
          />
          {t('More table action')}
        </WhiteButton>
      }
    >
      <div className={classes.container}>
        {options.map(({ value, label }) => (
          <div
            key={`more-action-option-${value}`}
            className={classNames(classes.optionBtn)}
            onClick={handleClickOption.bind(null, value)}
          >
            {label}
          </div>
        ))}
      </div>
    </Popup>
  )
}

MoreActionsBtn.propTypes = {
  options: PropTypes.array.isRequired
}

MoreActionsBtn.defaultProps = {
  options: []
}

export default translate('translations')(withStyles(styles)(MoreActionsBtn))
