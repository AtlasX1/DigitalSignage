import React from 'react'
import PropTypes from 'prop-types'
import { withStyles, Typography } from '@material-ui/core'
import { CheckboxSwitcher } from '../../../../Checkboxes'

const styles = ({ palette, type }) => ({
  featureItem: {
    borderBottom: `1px solid ${palette[type].pages.packages.sideModal.item.border}`,
    display: 'flex',
    justifyContent: 'space-between'
  },
  featureItemIconNova: {
    marginRight: '20px',
    fontSize: '19px',
    lineHeight: '42px',
    color: '#74809a'
  },
  featureItemIconMaterial: {
    verticalAlign: 'middle'
  },
  featureItemLabelGroup: {
    display: 'flex',
    alignItems: 'center'
  },
  featureItemLabel: {
    fontSize: '13px',
    lineHeight: '42px',
    color: '#74809a'
  },
  featureSwitcher: {
    height: '42px'
  }
})

const FeatureItem = ({ classes, feature, toggleSwitcher }) => {
  return (
    <div className={classes.featureItem}>
      <div className={classes.featureItemLabelGroup}>
        {!feature.icon || (
          <i
            className={[feature.icon, classes.featureItemIconNova].join(' ')}
          />
        )}
        <Typography className={classes.featureItemLabel}>
          {feature.alias}
        </Typography>
      </div>
      <CheckboxSwitcher
        id={feature.id}
        handleChange={toggleSwitcher}
        value={feature.selected}
        switchBaseClass={classes.featureSwitcher}
      />
    </div>
  )
}

FeatureItem.propTypes = {
  feature: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  toggleSwitcher: PropTypes.func.isRequired
}

export default withStyles(styles)(FeatureItem)
