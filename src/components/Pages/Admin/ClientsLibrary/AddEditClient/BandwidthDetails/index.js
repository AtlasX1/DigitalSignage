import React, { useEffect } from 'react'
import { withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'

import { Card } from 'components/Card'
import BandwidthStorage from './BandwidthStorage'
import BandwidthPlans from './BandwidthPlans'
import useBandwidthPlans from 'hooks/tableLibrary/useBandwidthPlans'
import moment from 'moment'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { useFormik } from 'formik'
import { BANDWIDTH_DETAILS } from 'constants/clientsConstants'
import { userRoleLevels } from 'constants/api'

const styles = ({ palette, type }) => ({
  bandwidthWrap: {
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`
  }
})

const BandwidthDetails = ({
  item,
  classes,
  level,

  t,
  isEdit,
  isStartCollecting = false,
  onFailCollecting = f => f,
  invokeCollector = f => f,

  doReset = false,
  afterReset = f => f
}) => {
  const plans = useBandwidthPlans()

  //TODO Implement Validation Schema
  const form = useFormik({
    initialValues: {
      card: {
        storageFull: 10,
        storageLastAllocated: 10,
        renewDate: moment().format('L'),
        expirationDate: moment()
      },
      chart: [
        {
          name: 'bandwidth',
          all: 100,
          active: 50,
          inactive: 50
        }
      ]
    },

    onSubmit: values => {
      //TODO Uncomment when we need this data
      invokeCollector(BANDWIDTH_DETAILS, { ...plans.selectedPlan })
    }
  })

  useEffect(() => {
    if (isStartCollecting) {
      form.handleSubmit()
    }
    // eslint-disable-next-line
  }, [isStartCollecting])

  useEffect(() => {
    if (!isEmpty(item) && isEdit) {
      if (item.unlimitedBandwidth) {
        plans.togglePlan({ target: { value: 'unlimitedBandwidth' } })
      }
    }
    // eslint-disable-next-line
  }, [item, isEdit])

  useEffect(() => {
    if (doReset) {
      form.handleReset({})
      afterReset(BANDWIDTH_DETAILS)
    }
    // eslint-disable-next-line
  }, [doReset])

  useEffect(() => {
    if (isStartCollecting) {
      form.handleSubmit()
    }
    // eslint-disable-next-line
  }, [isStartCollecting])

  useEffect(() => {
    if (!isEmpty(form.errors)) {
      onFailCollecting()
    }
    // eslint-disable-next-line
  }, [form.errors])

  useEffect(() => {
    if (!isEmpty(item)) {
      const { bandwidthDetail } = item

      if (bandwidthDetail && !isEmpty(bandwidthDetail)) {
        const {
          total,
          lastAllocated,
          used,
          remaining,
          renewalDate
        } = bandwidthDetail

        form.setFieldValue('card', {
          storageFull: total,
          storageLastAllocated: lastAllocated,
          renewDate: moment(renewalDate).format('L'),
          expirationDate: moment()
        })

        form.setFieldValue('chart', [
          {
            name: 'bandwidth',
            active: used,
            inActive: remaining
          }
        ])
      }
    }
    // eslint-disable-next-line
  }, [item])

  return (
    <Card
      icon={false}
      shadow={false}
      radius={false}
      flatHeader
      title={t('Bandwidth Details')}
      rootClassName={classes.bandwidthWrap}
    >
      {isEdit && (
        <BandwidthStorage
          level={level}
          card={form.values.card}
          chart={form.values.chart}
          onChange={form.handleChange}
        />
      )}
      {level !== userRoleLevels.enterprise && <BandwidthPlans plans={plans} />}
    </Card>
  )
}

const mapStateToProps = ({
  clients: {
    item: { response: item }
  }
}) => ({
  item
})

export default translate('translations')(
  withStyles(styles)(connect(mapStateToProps, null)(BandwidthDetails))
)
