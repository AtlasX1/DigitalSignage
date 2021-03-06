import React from 'react'
import { Typography, withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'

const styles = ({ typography, type }) => ({
  selectTitle: {
    ...typography.darkAccent[type],
    fontSize: '1.125rem'
  },
  selectSubTitle: {
    ...typography.darkAccent[type],
    fontSize: '1rem'
  }
})

const PageTitle = ({ t, title, classes, selectedCount }) => {
  return (
    <div key="selectTitle" style={{ display: 'flex', alignItems: 'center' }}>
      <Typography component="h2" className={classes.selectTitle}>
        {title}
      </Typography>
      {'\u00A0'}

      {!selectedCount || (
        <Typography
          component="h3"
          variant="subtitle1"
          className={classes.selectSubTitle}
        >
          {`| ${selectedCount} ${t('selected')}`}
        </Typography>
      )}
    </div>
  )
}

PageTitle.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired
}

PageTitle.propDefault = {
  selectedCount: 0,
  title: ''
}

export default translate('translations')(withStyles(styles)(PageTitle))
