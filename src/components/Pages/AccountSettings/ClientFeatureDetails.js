import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography, withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'

import { ClientSettingsFeaturesLoader } from '../../Loaders'
import { CheckboxSwitcher } from '../../Checkboxes'
import { Card } from '../../Card'

const styles = ({ palette, type }) => ({
  card: {
    background: 'transparent'
  },
  detailRow: {
    borderBottom: `1px solid ${palette[type].pages.accountSettings.clientDetails.row.border}`
  },
  detailLabel: {
    color: '#74809a',
    lineHeight: '42px'
  },
  featureCheckboxSwitcher: {
    height: '40px'
  }
})

const ClientFeatureDetails = ({
  t,
  classes,
  featurePackage,
  availableFeatures,
  featuresList,
  loading
}) => {
  return (
    <Card
      icon={false}
      shadow={false}
      radius={false}
      flatHeader={true}
      title={t('Premium Features')}
      rootClassName={classes.card}
    >
      {loading ? (
        <ClientSettingsFeaturesLoader />
      ) : (
        <Grid container>
          {featurePackage.clientFeature &&
            featurePackage.clientFeature.map((feature, index) => (
              <Grid item xs={6} key={`feature-${index}`}>
                <Grid
                  className={classes.detailRow}
                  container
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography className={classes.detailLabel}>
                      {feature.alias}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <CheckboxSwitcher
                      value={feature.status === 'Active'}
                      switchBaseClass={classes.featureCheckboxSwitcher}
                    />
                  </Grid>
                </Grid>
              </Grid>
            ))}
          {featuresList &&
            featuresList.map((feature, index) => (
              <Grid item xs={6} key={`feature-${index}`}>
                <Grid
                  className={classes.detailRow}
                  container
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography className={classes.detailLabel}>
                      {feature.alias}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <CheckboxSwitcher
                      value={
                        !!availableFeatures.find(f => f.name === feature.name)
                      }
                      switchBaseClass={classes.featureCheckboxSwitcher}
                    />
                  </Grid>
                </Grid>
              </Grid>
            ))}
        </Grid>
      )}
    </Card>
  )
}

ClientFeatureDetails.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default translate('translations')(
  withStyles(styles)(ClientFeatureDetails)
)
