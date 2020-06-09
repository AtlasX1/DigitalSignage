import React, { useEffect, useMemo } from 'react'
import { translate } from 'react-i18next'
import { useFormik } from 'formik'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { withStyles } from '@material-ui/core'

import Footer from 'components/Filter/Footer'
import { CheckboxSwitcher } from 'components/Checkboxes'
import {
  FormControlInput,
  FormControlAutocomplete,
  FormControlDateRangePickers,
  FormControlReactSelect
} from 'components/Form'
import groupService from 'services/groupsService'
import { stableSort } from 'utils'
import * as axios from 'axios'

const styles = theme => ({
  root: {
    padding: '25px 17px'
  },
  searchAction: {
    width: '90%'
  },
  searchActionText: {
    fontSize: '14px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '300',
    transform: 'none'
  },
  labelTransform: {
    transform: 'translate(0, 1.5px)'
  },
  datepickerDivider: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#4c5057'
  }
})

//TODO: fix disableType when Playlists search will be added

const MediaSearchForm = ({
  classes,
  t,
  configMediaCategory,
  queryParams,
  onSubmit,
  onReset,
  options = {
    disableType: false
  },
  close
}) => {
  const form = useFormik({
    initialValues: queryParams,
    onSubmit: values => {
      onSubmit(values)
      close()
    },
    onReset
  })

  useEffect(() => {
    form.setValues(queryParams)
    // eslint-disable-next-line
  }, [queryParams])

  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const getGroupOptions = async value => {
    const response = await groupService.getGroupByEntity(
      'Media',
      {
        fields: 'title',
        title: value || undefined,
        sort: 'title',
        order: 'asc'
      },
      source.token
    )
    const groups = response ? response.data : []

    return groups.map(({ title }) => ({ value: title, label: title }))
  }

  useEffect(
    () => () => {
      source.cancel()
    },
    // eslint-disable-next-line
    []
  )

  const typeOptions = useMemo(() => {
    const options =
      configMediaCategory && configMediaCategory.response
        ? configMediaCategory.response
            .reduce(
              (features, category) => [
                ...features,
                ...(category ? category.feature : [])
              ],
              []
            )
            .map(({ id, name }) => ({ value: id, label: name || '' }))
        : []
    return stableSort(options, (lhs, rhs) => lhs.label.localeCompare(rhs.label))
  }, [configMediaCategory])

  return (
    <form className={classes.root}>
      <FormControlInput
        name="title"
        fullWidth
        label={t('File Name')}
        value={form.values.title}
        handleChange={form.handleChange}
        formControlLabelClass={classNames(
          classes.label,
          classes.labelTransform
        )}
      />
      {!options.disableType && (
        <FormControlReactSelect
          marginBottom={16}
          name="featureId"
          fullWidth
          label={t('Type')}
          value={form.values.featureId}
          handleChange={form.handleChange}
          options={typeOptions}
          formControlLabelClass={classNames(
            classes.label,
            classes.labelTransform
          )}
          isClearable
        />
      )}
      <FormControlAutocomplete
        marginBottom={16}
        name="group"
        fullWidth
        label={t('Group')}
        value={form.values.group}
        handleChange={form.handleChange}
        getOptions={getGroupOptions}
        formControlLabelClass={classNames(
          classes.label,
          classes.labelTransform
        )}
        isClearable
      />
      <FormControlDateRangePickers
        id="updated-on"
        label={t('Media search updated on')}
        dividerText={t('To')}
        formControlLabelClass={classes.label}
        formControlDividerTextClass={classes.datepickerDivider}
      />
      <FormControlInput
        id="size"
        label={t('Size')}
        formControlLabelClass={classNames(
          classes.label,
          classes.labelTransform
        )}
      />
      <CheckboxSwitcher
        label={t('Status')}
        formControlLabelClass={classes.label}
      />
      <CheckboxSwitcher
        label={t('Approved')}
        formControlLabelClass={classes.label}
      />

      <Footer onSubmit={form.handleSubmit} onReset={form.handleReset} />
    </form>
  )
}

const mapStateToProps = ({ config }) => ({
  configMediaCategory: config.configMediaCategory
})

export default compose(
  translate('translations'),
  withStyles(styles),
  connect(mapStateToProps, null)
)(MediaSearchForm)
