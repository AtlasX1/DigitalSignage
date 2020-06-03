import React, { useCallback } from 'react'
import { Typography, withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import classNames from 'classnames'

import SliderInputRange from 'components/Form/SliderInputRange'

const styles = ({ palette, type }) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 0'
  },
  assignBandwidthLabelPlan: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: palette[type].formControls.label.color
  },
  assignBandwidthLabel: {
    fontSize: '13px',
    color: '#74809a'
  },
  assignBandwidthLabelValue: {
    fontSize: '13px',
    color: '#74809a',
    textAlign: 'right'
  },
  btmCorner: {
    borderBottom: `0.5px solid ${palette[type].sideModal.content.border}`
  }
})

const SliderItem = ({
  classes,
  t,
  slider: { title, subTitle, maxValue, value },
  onChangeSliderValue = f => f,
  isLast = false
}) => {
  const handleChangeSliderValue = useCallback(
    value => {
      onChangeSliderValue({ value, title })
    },
    [onChangeSliderValue, title]
  )

  return (
    <div
      className={classNames(classes.container, {
        [classes.btmCorner]: !isLast
      })}
    >
      <div>
        <Typography className={classes.assignBandwidthLabelPlan}>
          {title}
        </Typography>
        <Typography className={classes.assignBandwidthLabel}>
          {subTitle}
        </Typography>
      </div>
      <div>
        <SliderInputRange
          formatLabel={() => ''}
          name={title}
          maxValue={maxValue}
          minValue={0}
          value={value}
          input={false}
          step={1}
          onChange={handleChangeSliderValue}
          // inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
          // classNames={{ inputRange: '250px' }}
        />
        <Typography className={classes.assignBandwidthLabelValue}>
          {value}
        </Typography>
      </div>
    </div>
  )
}

export default translate('translations')(withStyles(styles)(SliderItem))
