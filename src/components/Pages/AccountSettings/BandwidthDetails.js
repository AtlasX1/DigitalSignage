import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography, withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import { Card } from '../../Card'
import { SingleHorizontalBarChart } from '../../Charts'
import moment from 'moment'
import { ClientSettingsBandwidthLoader } from '../../Loaders'

const styles = ({ palette, type }) => ({
  card: {
    background: 'transparent'
  },
  bandwidthChartWrap: {
    borderRadius: '7px'
  },
  bandwidthChartLabelsWrap: {
    marginTop: '10px',
    marginBottom: '20px'
  },
  bandwidthChartLabelLeft: {
    fontSize: '37px',
    lineHeight: '30px',
    color: palette[type].pages.accountSettings.bandwidth.leftLabel.color
  },
  bandwidthChartLabelLeftSmall: {
    fontSize: '22px'
  },
  bandwidthChartLabelGrey: {
    color: '#74809a'
  },
  bandwidthChartLabelBottom: {
    marginTop: '10px',
    marginBottom: '20px',
    color: '#74809a'
  },
  textBlue: {
    color: '#0076B9'
  }
})

const BandwidthDetails = ({ t, classes, bandwidthDetail, loading }) => {
  return (
    <Card
      icon={false}
      shadow={false}
      radius={false}
      flatHeader={true}
      title={t('Bandwidth Details')}
      rootClassName={classes.card}
    >
      {loading ? (
        <ClientSettingsBandwidthLoader />
      ) : (
        <>
          <Grid
            container
            className={classes.bandwidthChartLabelsWrap}
            justify="space-between"
            alignItems="flex-end"
          >
            <Grid item>
              <Typography className={classes.bandwidthChartLabelLeft}>
                {bandwidthDetail.used}
                <span className={classes.bandwidthChartLabelLeftSmall}>
                  {t('GB')}
                </span>
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.bandwidthChartLabelGrey}>
                {t('Last allocated bandwidth')}
                <strong>{` ${bandwidthDetail.total}${t('GB')}`}</strong>
              </Typography>
            </Grid>
          </Grid>

          <SingleHorizontalBarChart
            width={545}
            height={20}
            chartData={[
              {
                name: 'bandwidth',
                active: +bandwidthDetail.used,
                inactive: +bandwidthDetail.remaining
              }
            ]}
            fillColors={['#ffc200', '#3cd480']}
            chartWrapClassName={classes.bandwidthChartWrap}
          />
          <Typography className={classes.bandwidthChartLabelBottom}>
            {`${t('Your account bandwidth will auto-renew on')} `}
            <strong className={classes.textBlue}>
              {moment(bandwidthDetail.renewalDate).format('DD MMM YYYY')}
            </strong>
          </Typography>
        </>
      )}
    </Card>
  )
}
BandwidthDetails.propTypes = {
  bandwidthDetail: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

export default translate('translations')(withStyles(styles)(BandwidthDetails))
