import React, { useMemo } from 'react'
import { Typography, withStyles } from '@material-ui/core'
import { SingleHorizontalBarChart } from 'components/Charts'
import { FormControlSingleDatePicker } from 'components/Form'
import { translate } from 'react-i18next'
import { userRoleLevels } from 'constants/api'

const styles = ({ palette, type }) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '3fr 4fr',
    borderRadius: '7px'
  },
  stretch: {
    gridColumnStart: 1,
    gridColumnEnd: 3
  },
  bandwidthChartLabelLeft: {
    fontSize: '37px',
    lineHeight: '30px',
    color: palette[type].charts.bandwidth.leftLabel.color
  },
  bandwidthChartLabelLeftSmall: {
    fontSize: '22px'
  },
  bandwidthChartLabelGrey: {
    justifySelf: 'end',
    color: '#74809a'
  },
  bandwidthChartLabelBottom: {
    marginTop: '20px',
    marginBottom: '20px',
    color: '#74809a',
    textAlign: 'right'
  },
  bandwidthChartLabelBottomRenewDate: {
    fontSize: '15px',
    color: palette[type].charts.bandwidth.leftLabel.color
  },
  expirationDate: {
    alignSelf: 'center'
  }
})

const BandwidthStorage = ({
  classes,
  t,
  onChange: handleChange,
  card,
  chart,
  level
}) => {
  const translate = useMemo(
    () => ({
      gb: t('GB'),
      last: t('Last allocated bandwidth'),
      auto: t('Your account bandwidth'),
      will: t('will auto-renew on'),
      date: t('Expiration Date')
    }),
    [t]
  )

  return (
    <div className={classes.container}>
      <Typography className={classes.bandwidthChartLabelLeft}>
        {card.storageFull}
        <span
          className={classes.bandwidthChartLabelLeftSmall}
        >{` ${translate.gb}`}</span>
      </Typography>

      <Typography className={classes.bandwidthChartLabelGrey}>
        {translate.last}
        <strong>{` ${card.storageLastAllocated}${translate.gb}`}</strong>
      </Typography>

      <SingleHorizontalBarChart
        width={level === userRoleLevels.system ? 470 : 390}
        height={20}
        chartData={chart}
        fillColors={['#ffc200', '#3cd480']}
        chartWrapClassName={classes.stretch}
      />

      <FormControlSingleDatePicker
        name="card.expirationDate"
        value={card.expirationDate}
        label="Expire date"
        handleChange={handleChange}
        inputIconPosition="after"
        anchorDirection="right"
        classContainer={classes.expirationDate}
      />

      <Typography className={classes.bandwidthChartLabelBottom}>
        <span>{translate.auto}</span>
        <br />
        <span>{translate.will}</span>
        <br />
        <strong className={classes.bandwidthChartLabelBottomRenewDate}>
          {card.renewDate}
        </strong>
      </Typography>
    </div>
  )
}

export default translate('translations')(withStyles(styles)(BandwidthStorage))
