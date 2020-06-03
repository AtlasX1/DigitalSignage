import React, { useState, useCallback } from 'react'
import { withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormControlSelect } from '../../../Form'
import options from './options'
import { setFilters } from '../../../../actions/fontsActions'

const styles = () => ({
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
    transform: 'translate(0, 1.5px)'
  }
})

const FontsFilter = ({ classes, t, fontsPerPage, setFilters, filters }) => {
  const [category, setCategory] = useState(filters.category)
  const [language, setLanguage] = useState(filters.language)
  const [sort, setSort] = useState(filters.sort)

  const handleChangeCategory = useCallback(
    ({ target: { value } }) => {
      setCategory(value)
      setFilters({ category: value, language, sort }, fontsPerPage)
    },
    [fontsPerPage, language, setFilters, sort]
  )

  const handleChangeLanguage = useCallback(
    ({ target: { value } }) => {
      setLanguage(value)
      setFilters({ category, language: value, sort }, fontsPerPage)
    },
    [category, fontsPerPage, setFilters, sort]
  )

  const handleChangeSort = useCallback(
    ({ target: { value } }) => {
      setSort(value)
      setFilters({ category, language, sort: value }, fontsPerPage)
    },
    [category, fontsPerPage, language, setFilters]
  )

  return (
    <form className={classes.root}>
      <FormControlSelect
        id="schedule-name"
        fullWidth={true}
        label={t('Category')}
        formControlLabelClass={classes.label}
        options={options.category}
        value={category}
        handleChange={handleChangeCategory}
      />
      <FormControlSelect
        id="schedule-group"
        fullWidth={true}
        label={t('Language')}
        formControlLabelClass={classes.label}
        options={options.language}
        value={language}
        handleChange={handleChangeLanguage}
      />
      <FormControlSelect
        id="schedule-device"
        fullWidth={true}
        label={t('Sort by')}
        options={options.sortBy}
        formControlLabelClass={classes.label}
        value={sort}
        handleChange={handleChangeSort}
      />
    </form>
  )
}

const mapStateToProps = ({ fonts: { filters } }) => ({
  filters
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setFilters
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FontsFilter))
)
