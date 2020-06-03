import { useCallback, useMemo, useState } from 'react'

const useBandwidthPlans = () => {
  const [plans, changePlans] = useState([
    {
      label: 'Unlimited Bandwidth',
      value: 'unlimitedBandwidth',
      selected: false
    },
    {
      label: 'Base (2GB)',
      value: 'base',
      selected: true
    },
    {
      label: 'Standard (5GB)',
      value: 'standard',
      selected: false
    },
    {
      label: 'Pro (10GB)',
      value: 'pro',
      selected: false
    },
    {
      label: 'Signature (100GB)',
      value: 'signature',
      selected: false
    },
    {
      label: 'Custom',
      value: 'custom',

      bandwidth: '',
      selected: false
    }
  ])

  const [sliders, changeSliders] = useState([
    {
      title: '4GB Upgrade',
      subTitle: '4.000GB',
      value: 0,
      maxValue: 4
    },
    {
      title: '12GB Upgrade',
      subTitle: '12.000GB',
      value: 0,
      maxValue: 12
    },
    {
      title: '10GB Upgrade',
      subTitle: '10.000GB',
      value: 0,
      maxValue: 10
    },
    {
      title: 'Premium - Legacy CMS',
      subTitle: '4.000GB',
      value: 0,
      maxValue: 4
    },
    {
      title: 'Complimentary 1GB',
      subTitle: '1.000GB',
      value: 0,
      maxValue: 1
    },
    {
      title: 'Standard CMS Package',
      subTitle: '4.000GB',
      value: 0,
      maxValue: 4
    },
    {
      title: 'Base CMS Package',
      subTitle: '4.000GB',
      value: 0,
      maxValue: 4
    }
  ])

  const handleChangeSliders = useCallback(({ title, value }) => {
    changeSliders(sliders =>
      sliders.map(slider =>
        slider.title === title ? { ...slider, value } : slider
      )
    )
  }, [])

  const handleTogglePlan = useCallback(({ target: { value } }) => {
    changePlans(plans =>
      plans.map(plan =>
        plan.value === value
          ? { ...plan, selected: true }
          : { ...plan, selected: false }
      )
    )
  }, [])

  const handleChangeCustomBandwidth = useCallback(({ target: { value } }) => {
    changePlans(plans =>
      plans.map(plan =>
        plan.value === 'custom' ? { ...plan, bandwidth: value } : plan
      )
    )
  }, [])

  const totalSlidersValue = sliders.reduce(
    (accum, { value }) => (accum += value),
    0
  )

  const selectedPlan = useMemo(() => {
    return plans.find(({ selected }) => selected === true).value ===
      'unlimitedBandwidth'
      ? { unlimitedBandwidth: true }
      : { unlimitedBandwidth: false }
  }, [plans])

  return {
    values: plans,
    sliders,
    togglePlan: handleTogglePlan,
    changeCustomBandwidth: handleChangeCustomBandwidth,
    changeSliders: handleChangeSliders,
    selectedPlan,
    totalSlidersValue
  }
}

export default useBandwidthPlans
