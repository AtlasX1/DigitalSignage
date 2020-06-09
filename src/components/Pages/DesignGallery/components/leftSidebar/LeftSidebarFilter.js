import React, { useEffect } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { translate } from 'react-i18next'

import { useFormik } from 'formik'
import { selectUtils } from 'utils'
import * as axios from 'axios'

import { withStyles } from '@material-ui/core'

import Footer from 'components/Filter/Footer'
import { FormControlDateRangePickers, FormControlChips } from 'components/Form'

import * as tagsActions from 'actions/tagsActions'

const styles = theme => {
  return {
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
  }
}

const LeftSidebarFilter = props => {
  const {
    classes,
    t,
    queryParams,
    onSubmit,
    onReset,
    close,
    tags,
    getTags
  } = props

  const form = useFormik({
    initialValues: queryParams,
    onSubmit: values => {
      onSubmit(values)
      close()
    },
    onReset
  })

  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  useEffect(
    () => {
      if (!tags.length) {
        getTags()
      }
    },
    // eslint-disable-next-line
    []
  )

  useEffect(() => {
    form.setValues(queryParams)
    // eslint-disable-next-line
  }, [queryParams])

  useEffect(
    () => () => {
      source.cancel()
    },
    // eslint-disable-next-line
    []
  )

  const groupControlOnChangeTransformer = (options, handler) => ({
    target: { name, value }
  }) =>
    handler({
      target: {
        name,
        value: options.find(x => x.value === value)
      }
    })

  const { values } = form

  return (
    <form className={classes.root}>
      <FormControlChips
        customClass={classes.reactSelectContainer}
        name="tags"
        label={t('Tags')}
        options={selectUtils.convertArr(tags, selectUtils.tagToChipObj)}
        values={values.tags}
        handleChange={form.handleChange}
      />
      <FormControlChips
        isMulti={false}
        customClass={classes.reactSelectContainer}
        name="group"
        label={t('Group')}
        options={[]}
        values={values.group}
        handleChange={groupControlOnChangeTransformer([], form.handleChange)}
      />
      <FormControlDateRangePickers
        id="updated-on"
        label={t('Media search updated on')}
        dividerText={t('To')}
        formControlLabelClass={classes.label}
        formControlDividerTextClass={classes.datepickerDivider}
      />
      <Footer onSubmit={form.handleSubmit} onReset={form.handleReset} />
    </form>
  )
}

const mapStateToProps = ({ config, tags }) => ({
  configMediaCategory: config.configMediaCategory,
  tags: tags.items.response
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getTags: tagsActions.getItems
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(LeftSidebarFilter)
