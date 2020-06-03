import React, { useMemo } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { WhiteButton, BlueButton } from '../../Buttons'
import {
  FormControlChips,
  FormControlInput,
  FormControlSelect
} from '../../Form'
import { connect } from 'react-redux'
import { useFormik } from 'formik'
import { contentType, orientation } from './options'
import routeByName from '../../../constants/routes'
import queryParamsHelper from '../../../utils/queryParamsHelper'

import { selectUtils } from 'utils/index'

const styles = theme => ({
  root: {
    padding: '25px 17px'
  },
  searchAction: {
    width: '90%'
  },
  searchActionText: {
    fontSize: 14
  },
  label: {
    fontSize: 18
  }
})

const WorkplacePosterSearch = ({ t, tags, classes, fetcher, meta }) => {
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

      <Grid container>
        <Grid item xs={6}>
          <BlueButton
            className={classes.searchAction}
            onClick={form.handleSubmit}
          >
            {translate.search}
          </BlueButton>
        </Grid>
        <Grid item xs={6}>
          <WhiteButton
            className={classes.searchAction}
            component={Link}
            to={routeByName.workplacePoster.root}
            onClick={form.handleReset}
          >
            {translate.reset}
          </WhiteButton>
        </Grid>
      </Grid>
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
  connect(mapStateToProps, null)(withStyles(styles)(WorkplacePosterSearch))
)
