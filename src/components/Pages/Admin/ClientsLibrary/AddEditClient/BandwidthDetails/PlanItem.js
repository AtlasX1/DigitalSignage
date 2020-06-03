import React, { useMemo } from 'react'
import { withStyles } from '@material-ui/core'
import { Radio, Typography } from '@material-ui/core'
import { translate } from 'react-i18next'
import classNames from 'classnames'

import { FormControlInput } from 'components/Form'

const styles = ({ palette, type }) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  corner: {
    borderBottom: `0.5px solid ${palette[type].sideModal.content.border}`
  },
  bandwidthPlan: {
    lineHeight: '42px',
    color: '#74809a'
  },
  bandwidthCustomPlanFormControlRoot: {
    margin: '10px 0'
  },
  bandwidthPlanRadio: {
    color: '#535d73 !important'
  },
  bandwidthPlanRadioChecked: {
    color: '#41cb71 !important'
  }
})

const PlanItem = ({
  classes,
  plan: { selected, label, value, bandwidth },
  isLast = false,
  onChange: handleChange,
  onChangeBandwidth: handleChangeBandwidth,
  t
}) => {
  const translate = useMemo(
    () => ({
      gb: t('GB'),
      custom: t('Custom')
    }),
    [t]
  )
  return (
    <div
      className={classNames(classes.container, {
        [classes.corner]: !isLast
      })}
    >
      <Typography className={classes.bandwidthPlan}>{t(label)}</Typography>
      {t(label) === translate.custom && selected ? (
        <FormControlInput
          fullWidth
          value={bandwidth}
          handleChange={handleChangeBandwidth}
          placeholder={translate.gb}
          formControlRootClass={classes.bandwidthCustomPlanFormControlRoot}
        />
      ) : (
        <Radio
          id="bandwidth-plan"
          name="bandwidth-plan"
          checked={selected}
          value={value}
          onChange={handleChange}
          classes={{
            root: classes.bandwidthPlanRadio,
            checked: classes.bandwidthPlanRadioChecked
          }}
        />
      )}
    </div>
  )
}

export default translate('translations')(withStyles(styles)(PlanItem))
