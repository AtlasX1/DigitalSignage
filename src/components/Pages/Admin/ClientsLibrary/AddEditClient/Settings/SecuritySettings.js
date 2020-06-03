import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, Typography, withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import { CheckboxSwitcher } from '../../../../../Checkboxes'
import { Card } from '../../../../../Card'
import { settingsSecurityField } from './config'

const styles = ({ palette, type }) => ({
  settingRow: {
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`
  },
  settingLabel: {
    lineHeight: '42px',
    color: '#74809a'
  }
})

const SecuritySettings = ({ classes, t, initialData, onChange }) => {
  return (
    <Card
      icon={false}
      dropdown={false}
      grayHeader={true}
      shadow={false}
      radius={false}
      title={t('Security Settings').toUpperCase()}
    >
      {settingsSecurityField.map(({ label, field }) => (
        <Grid
          className={classes.settingRow}
          container
          justify="space-between"
          alignItems="center"
          key={field}
        >
          <Grid item>
            <Typography className={classes.settingLabel}>{t(label)}</Typography>
          </Grid>
          <Grid item>
            <CheckboxSwitcher
              id={field}
              handleChange={onChange}
              value={initialData[field]}
            />
          </Grid>
        </Grid>
      ))}
    </Card>
  )
}

SecuritySettings.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  initialData: PropTypes.object.isRequired
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default translate('translations')(
  withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(SecuritySettings)
  )
)
