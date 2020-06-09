import React, { useEffect, useMemo, useState, forwardRef, useRef } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import useUserRole from 'hooks/tableLibrary/useUserRole'
import { deviceService, tagsService, groupsService } from 'services'
import { components } from 'react-select'

import {
  FormControlInput,
  FormControlChips,
  FormControlReactSelect,
  FormControlAutocomplete
} from 'components/Form'
import Footer from 'components/Filter/Footer'
import { distinctFilter, stableSort } from 'utils'
import { ALL_RECORD } from 'constants/library'

const NameOptionStyles = ({ palette, type }) => ({
  alias: {
    display: 'block',
    color: palette[type].tableLibrary.body.cell.color
  },
  children: {
    display: 'block',
    fontSize: '0.75em'
  }
})
const NameOption = withStyles(NameOptionStyles)(
  forwardRef(({ classes, children, data, ...props }) => {
    const role = useUserRole()
    return (
      <components.Option {...props}>
        {!!data.alias && role.org && (
          <span className={classes.alias}>{data.alias}</span>
        )}
        <span className={classes.children}>{children}</span>
        {!!data.alias && !role.org && (
          <span className={classes.alias}>{data.alias}</span>
        )}
      </components.Option>
    )
  })
)

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
  },
  spacing: {
    marginBottom: 16
  }
})
const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' }
]

const DeviceSearchForm = ({
  t,
  classes,
  initialValues,
  onSubmit,
  onReset,
  close
}) => {
  const nameOptions = useRef([])
  const role = useUserRole()
  const [locations, setLocations] = useState([])
  const [locationInput, setLocationInput] = useState('')

  const translations = useMemo(
    () => ({
      deviceName: t('Device search name'),
      deviceType: t('Device Type'),
      locationCity: t('Device search location city'),
      clientName: t('Client Name'),
      status: t('Device search status'),
      group: t('Group'),
      tags: t('Tags')
    }),
    [t]
  )

  const form = useFormik({
    initialValues,
    onSubmit: values => {
      onSubmit(values)
      close()
    },
    onReset
  })

  useEffect(() => {
    form.setValues(initialValues)
    // eslint-disable-next-line
  }, [initialValues])

  const getGroupOptions = async value => {
    const response = await groupsService.getGroupByEntity('Device', {
      fields: 'title',
      title: value || undefined,
      sort: 'title',
      order: 'asc'
    })
    const groups = response ? response.data : []

    return groups.map(({ title }) => ({ value: title, label: title }))
  }

  const getTagOptions = async value => {
    const response = await tagsService.getTags({
      fields: 'tag',
      tag: value || undefined,
      sort: 'tag',
      order: 'asc'
    })
    const tags = response ? response.data : []

    return tags.map(({ tag }) => ({ value: tag, label: tag }), 'value')
  }

  const getNameAliasOptions = async value => {
    const [names, aliases] = await Promise.all([
      deviceService.getItems({
        fields: 'id,name,alias',
        name: value || undefined,
        sort: 'alias',
        order: 'asc'
      }),
      deviceService.getItems({
        fields: 'id,name,alias',
        alias: value || undefined,
        sort: 'alias',
        order: 'asc'
      })
    ]).then(([responseName, responseAlias]) => [
      responseName ? responseName.data : [],
      responseAlias ? responseAlias.data : []
    ])

    nameOptions.current = stableSort(
      distinctFilter
        .filterByField([...names, ...aliases], 'id')
        .map(({ alias, name }) => ({
          value: name,
          label: name,
          alias: alias
        })),
      (lhs, rhs) => lhs.alias.localeCompare(rhs.alias)
    )
    return nameOptions.current
  }
  useEffect(() => {
    deviceService
      .getItems({
        fields: 'city,state',
        limit: ALL_RECORD,
        sort: 'city',
        order: 'asc'
      })
      .then(response => (response ? response.data : []))
      .then(data => {
        setLocations(
          distinctFilter.filterByField(
            data.map(({ city, state }) => ({
              value: city,
              label: `${city}, ${state}`,
              state
            })),
            'value'
          )
        )
      })
  }, [])

  const onLocationInputChange = value => {
    setLocationInput(value)
  }

  const locationOptions = useMemo(
    () =>
      locations.filter(({ label }) =>
        label.toLowerCase().startsWith(locationInput.toLowerCase())
      ),
    [locations, locationInput]
  )

  const onNameChange = e => {
    const val = e.target ? e.target.value : ''
    const value = val
      ? nameOptions.current.find(o => o.value === val) || {
          value: val,
          label: val
        }
      : ''
    form.setFieldValue('name', value)
  }

  return (
    <form className={classes.root}>
      <FormControlAutocomplete
        fullWidth
        label={translations.deviceName}
        formControlLabelClass={classes.label}
        name="name"
        getOptions={getNameAliasOptions}
        value={form.values.name}
        handleChange={onNameChange}
        components={{ Option: NameOption }}
        isClearable
        formControlContainerClass={classes.spacing}
      />
      <FormControlReactSelect
        isSearchable
        fullWidth
        label={translations.locationCity}
        formControlLabelClass={classes.label}
        name="city"
        isLoading={!locations.length}
        handleInputChange={onLocationInputChange}
        options={locationOptions}
        value={form.values.city}
        handleChange={form.handleChange}
        isClearable
        formControlContainerClass={classes.spacing}
      />
      {!role.org && (
        <FormControlInput
          fullWidth
          label={translations.clientName}
          formControlLabelClass={classes.label}
          name="clientName"
          value={form.values.clientName}
          handleChange={form.handleChange}
        />
      )}
      <FormControlReactSelect
        fullWidth
        label={translations.status}
        formControlLabelClass={classes.label}
        options={statusOptions}
        name="status"
        value={form.values.status}
        handleChange={form.handleChange}
        isClearable
        formControlContainerClass={classes.spacing}
      />
      {role.org && (
        <FormControlAutocomplete
          fullWidth
          name="group"
          label={translations.group}
          value={form.values.group}
          getOptions={getGroupOptions}
          handleChange={form.handleChange}
          formControlLabelClass={classes.label}
          isClearable
          formControlContainerClass={classes.spacing}
        />
      )}
      {role.org && (
        <FormControlAutocomplete
          selectComponent={FormControlChips}
          fullWidth
          name="tag"
          label={translations.tags}
          values={form.values.tag}
          handleChange={form.handleChange}
          getOptions={getTagOptions}
          formControlLabelClass={classes.label}
          isClearable
          formControlContainerClass={classes.spacing}
        />
      )}

      <Footer onSubmit={form.handleSubmit} onReset={form.handleReset} />
    </form>
  )
}

DeviceSearchForm.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  initialValues: PropTypes.object
}

DeviceSearchForm.defaultProps = {
  initialValues: {}
}

export default translate('translations')(withStyles(styles)(DeviceSearchForm))
