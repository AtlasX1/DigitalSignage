import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import { Card } from 'components/Card'

import CheckboxListItem from '../CheckboxListItem'
import { FormControlSelect } from 'components/Form'
import useClientPackagesOptions from 'hooks/tableLibrary/useClientPackageOptions'
import { useFormik } from 'formik'
import useSelectedList from 'hooks/tableLibrary/useSelectedList'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'
import * as Yup from 'yup'
import { PREMIUM_FEATURES } from 'constants/clientsConstants'

const styles = ({ palette, type }) => ({
  container: {
    overflow: 'auto',
    borderLeft: `1px solid ${palette[type].sideModal.content.border}`
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridColumnGap: '15px'
  },
  stretch: {
    gridColumnStart: 1,
    gridColumnEnd: 3
  }
})

const PremiumFeatures = ({
  classes,
  t,
  featuresList,
  invokeCollector = f => f,
  onFailCollecting = f => f,
  isStartCollecting = false,
  isEdit = false,
  doReset = false,
  afterReset = f => f,
  item
}) => {
  const [backup, setBackup] = useState({})
  const ids = useMemo(() => featuresList.map(({ id }) => id), [featuresList])
  const selectedList = useSelectedList(ids)
  const clientPackages = useClientPackagesOptions()
  const translate = useMemo(
    () => ({
      featurePackageId: t('Feature Package')
    }),
    [t]
  )

  const form = useFormik({
    initialValues: {
      featurePackageId: ''
    },
    validationSchema: Yup.object().shape({
      featurePackageId: Yup.number().required('Enter field')
    }),
    onSubmit: values => {
      invokeCollector('premiumFeatures', {
        ...values,
        clientFeature: selectedList.selectedIds
      })
    }
  })

  useEffect(() => {
    if (!isEmpty(form.errors)) {
      onFailCollecting()
    }
    // eslint-disable-next-line
  }, [form.errors])

  useEffect(() => {
    if (isStartCollecting) {
      form.handleSubmit()
    }
    // eslint-disable-next-line
  }, [isStartCollecting])

  useEffect(() => {
    if (!isEmpty(item) && isEdit) {
      const { featurePackage, feature } = item

      setBackup({
        featurePackageId: featurePackage.id,
        selectedList: feature.map(({ id }) => id)
      })
    }
    // eslint-disable-next-line
  }, [item, isEdit])

  useEffect(() => {
    if (!isEmpty(backup)) {
      selectedList.selectIds(backup.selectedList)
      form.setFieldValue('featurePackageId', backup.featurePackageId)
    }
    // eslint-disable-next-line
  }, [backup])

  useEffect(() => {
    if (doReset) {
      if (isEdit) {
        selectedList.selectIds(backup.selectedList)
        form.setFieldValue('featurePackageId', backup.featurePackageId)
      } else {
        form.handleReset({})
        selectedList.clear()
      }

      afterReset(PREMIUM_FEATURES)
    }
    // eslint-disable-next-line
  }, [doReset])

  const handleToggle = useCallback(
    (value, id) => {
      selectedList.toggle(id)
    },
    [selectedList]
  )

  const handleChangeFeaturePackage = useCallback(
    ({ target: { name, value } }) => {
      const findPackage = Number.parseInt(value)
      form.setFieldValue(name, value)
      selectedList.clear()

      if (value) {
        if (!isEmpty(item) && findPackage === item.featurePackage.id) {
          selectedList.selectIds(item.feature.map(({ id }) => id))
        } else if (
          isEmpty(item) ||
          (!isEmpty(item) && findPackage !== item.featurePackage.id)
        ) {
          const featuresIds = clientPackages.getFeatureIds(value)
          selectedList.selectIds(featuresIds)
        }
      }
    },
    [clientPackages, form, item, selectedList]
  )

  return (
    <Card
      icon={false}
      shadow={false}
      radius={false}
      flatHeader
      title={t('Premium Features')}
      rootClassName={classes.container}
    >
      <div className={classes.content}>
        <FormControlSelect
          label={translate.featurePackageId}
          name="featurePackageId"
          formControlContainerClass={classes.stretch}
          formControlLabelClass={classes.label}
          options={clientPackages.values}
          value={form.values.featurePackageId}
          handleChange={handleChangeFeaturePackage}
          error={form.errors.featurePackageId}
          onBlur={form.handleBlur}
          touched={form.touched.featurePackageId}
        />
        {featuresList.map(({ alias, id }) => (
          <CheckboxListItem
            id={id}
            key={`premium-feature-${id}-${selectedList.isSelect(id)}`}
            label={alias}
            value={selectedList.isSelect(id)}
            onChange={handleToggle}
          />
        ))}
      </div>
    </Card>
  )
}

const mapStateToProps = ({
  clients: {
    item: { response: item }
  },
  clientPackage: {
    items: { response: clientPackages }
  },
  config: {
    configFeatureClient: { response: featuresList }
  }
}) => ({
  featuresList,
  clientPackages,
  item
})

export default translate('translations')(
  withStyles(styles)(connect(mapStateToProps, null)(PremiumFeatures))
)
