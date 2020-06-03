import React, { useMemo } from 'react'
import { translate } from 'react-i18next'

import { withStyles } from '@material-ui/core'
import {
  FormControlChips,
  FormControlInput,
  FormControlSelect
} from 'components/Form'
import { connect } from 'react-redux'
import { useFormik } from 'formik'
import { contentType, orientation } from './options'
import queryParamsHelper from 'utils/queryParamsHelper'
import Footer from 'components/Filter/Footer'

import { selectUtils } from 'utils/index'

const styles = theme => ({
  root: {
    padding: '25px 17px'
  },
  label: {
    fontSize: 18
  }
})

const Filter = ({ t, tags, classes, fetcher, meta, close }) => {
  const transformedTags = useMemo(
    () => selectUtils.convertArr(tags, selectUtils.toChipObj),
    [tags]
  )

  const form = useFormik({
    initialValues: {
      tags: [],
      title: '',
      orientation: '',
      contentType: ''
    },
    onSubmit: ({ title, orientation, contentType, tags }) => {
      // TODO Finish filtering work
      fetcher(
        queryParamsHelper({
          title,
          contentType,
          orientation,
          tag: tags.map(({ label }) => label).join(','),
          limit: meta.perPage
        })
      )
      close()
    },
    onReset: () => {
      fetcher({
        limit: meta.perPage
      })
    }
  })

  const translate = useMemo(
    () => ({
      name: t('Name'),
      tags: t('Tags'),
      search: t('Search Action'),
      reset: t('Search Reset Action'),
      orientation: t('Orientation'),
      contentType: t('Type'),
      size: t('Size')
    }),
    [t]
  )

  return (
    <form className={classes.root}>
      <FormControlInput
        id="title"
        handleChange={form.handleChange}
        value={form.values.title}
        fullWidth
        label={translate.name}
        formControlLabelClass={classes.label}
      />
      <FormControlSelect
        id="orientation"
        value={form.values.orientation}
        label={translate.orientation}
        options={orientation}
        handleChange={form.handleChange}
      />
      <FormControlSelect
        id="contentType"
        value={form.values.contentType}
        label={translate.contentType}
        options={contentType}
        handleChange={form.handleChange}
      />
      <FormControlChips
        label={t('Tags')}
        name="tags"
        options={transformedTags}
        formControlLabelClass={classes.label}
        values={form.values.tags}
        handleChange={form.handleChange}
      />

      <Footer onSubmit={form.handleSubmit} onReset={form.handleReset} />
    </form>
  )
}

const mapStateToProps = ({
  workplacePosters: {
    tags: { response }
  }
}) => ({
  tags: response
})

export default translate('translations')(
  connect(mapStateToProps, null)(withStyles(styles)(Filter))
)
