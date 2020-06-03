import React, { useCallback, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { withStyles, Typography } from '@material-ui/core'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import PlanItem from './PlanItem'
import { WhiteButton } from 'components/Buttons'
import SliderItem from './SliderItem'

const styles = ({ palette, type }) => ({
  bandwidthAction: {
    marginTop: '25px'
  },
  bandwidthActionIcon: {
    marginRight: '10px',
    fontSize: '14px',
    color: palette[type].pages.clients.addClient.button.iconColor
  },
  totalContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  bandwidthSliderTotal: {
    marginRight: 15,
    fontSize: '20px',
    fontWeight: 'bold',
    color: palette[type].card.titleColor
  }
})

const BandwidthPlans = ({ classes, t, plans }) => {
  const translate = useMemo(
    () => ({
      total: t('Total'),
      slidersValue: t('Bandwidth Slider value: '),
      gb: t('GB')
    }),
    [t]
  )
  const [showSliders, toggleShowSliders] = useState(false)

  const handleClickAssignBandwidth = useCallback(() => {
    toggleShowSliders(value => !value)
  }, [])

  const bandwidthBtn = useMemo(
    () => (showSliders ? t('Hide Bandwidth') : t('Assign Bandwidth')),
    [showSliders, t]
  )
  return (
    <>
      {plans.values.map((plan, index) => (
        <PlanItem
          key={`plan-item-${plan.value}-${plan.selected}`}
          plan={plan}
          onChange={plans.togglePlan}
          onChangeBandwidth={plans.changeCustomBandwidth}
          isLast={plans.values.length - 1 === index}
        />
      ))}

      <WhiteButton
        className={classes.bandwidthAction}
        onClick={handleClickAssignBandwidth}
      >
        <i
          className={`${classes.bandwidthActionIcon} icon-computer-screen-1`}
        />
        {bandwidthBtn}
      </WhiteButton>

      {showSliders &&
        plans.sliders.map((slider, index) => (
          <SliderItem
            key={`slider-item-${index}`}
            isLast={plans.sliders.length - 1 === index}
            slider={slider}
            onChangeSliderValue={plans.changeSliders}
          />
        ))}
      {showSliders && (
        <div className={classes.totalContainer}>
          <Typography className={classes.bandwidthSliderTotal}>
            {translate.total}
          </Typography>
          <Typography className={classes.bandwidthSliderTotal}>
            {translate.slidersValue} {plans.totalSlidersValue} {translate.gb}
          </Typography>
        </div>
      )}
    </>
  )
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default translate('translations')(
  withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(BandwidthPlans)
  )
)
