import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { translate } from 'react-i18next'
import { isObject as _isObject, get as _get, isEmpty } from 'lodash'
import { withStyles, Typography } from '@material-ui/core'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import update from 'immutability-helper'
import moment from 'moment'

import { addMedia, editMedia, generateMediaPreview } from 'actions/mediaActions'

import { FormControlReactSelect } from 'components/Form'
import { CheckboxSwitcher } from 'components/Checkboxes'
import Section from 'components/Section'
import { MediaInfo, MediaTabActions } from 'components/Media/index'
import MediaThemeCarousel from 'components/Media/MediaThemeCarousel'
import {
  LibraryComponents,
  themeProperties,
  exceptions,
  temperatureOptions,
  elements
} from 'components/Media/Local/Weather/config'
import FormControlSelectCities from 'components/Form/FormControlSelectCities'
import PreviewButton from 'components/Buttons/PreviewButton'
import FormControlSelectResolution from 'components/Form/FormControlSelectResolution'

import { mediaInfoInitvalue } from 'constants/media'

import useMediaTheme from 'hooks/useMediaTheme'
import useSelectedList from 'hooks/tableLibrary/useSelectedList'
import useMediaNotification from 'hooks/useMediaNotification'

import { createMediaPostData } from 'utils/mediaUtils'
import { selectUtils } from 'utils'
import replaceAllExcept from 'utils/replaceAllExcept'

const styles = ({ palette, type, formControls }) => ({
  root: {
    display: 'flex',
    flexGrow: 1
  },
  rightContent: {
    height: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderLeft: `1px solid ${palette[type].sideModal.content.border}`
  },
  leftContent: {
    padding: '15px 30px',
    display: 'grid',
    gridTemplateRows: 'repeat(6, fit-content(100%))',
    gridTemplateColumns: '1fr',
    gridRowGap: '1px'
  },
  stretch: {
    gridColumnStart: '1',
    gridColumnEnd: '4',
    justifyContent: 'center'
  },
  sectionContentPadding: {
    padding: '15px 15px 0'
  },
  sectionHeaderPadding: {
    padding: '0 14px'
  },
  optionsSelectGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridColumnGap: '16px',
    gridTemplateRows: 'repeat(2, fit-content(100%))'
  },
  optionsSwitchGroup: {
    display: 'grid',
    gridRowGap: '18px',
    gridColumnGap: '21px',
    gridTemplateRows: 'repeat(2, fit-content(100%))',
    gridTemplateColumns: 'repeat(4, 1fr)'
  },
  label: {
    fontSize: '17px',
    transform: 'scale(0.75)',
    color: palette[type].formControls.label.color
  },
  switch: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  },
  formControlInputClass: {
    ...formControls.mediaApps.numericInput.input
  },
  formControlRootClass: {
    marginBottom: '0'
  },
  numberInput: {
    '& span': {
      width: '76px',
      height: '36px'
    }
  },
  elementsLabel: {
    fontWeight: 'bold',
    color: palette[type].pages.media.general.card.header.color
  },
  switchHeight: {
    height: 'unset'
  },
  carousel: {
    maxWidth: '617px'
  },
  stretchSkin: {
    gridColumnStart: 1,
    gridColumnEnd: 3
  },
  error: {
    marginLeft: '10px',
    fontSize: 9,
    color: 'red'
  },
  elementsHeader: {
    display: 'flex',
    alignItems: 'center',
    borderTop: `1px solid ${palette[type].pages.media.general.card.border}`,
    paddingTop: '16px'
  }
})

const mediaName = 'Local'
const tabName = 'Weather'

const Weather = ({
  classes,
  t,
  onModalClose: closeModal,
  onShowSnackbar: showSnackbar,
  backendData,
  mode,
  addMedia,
  editMedia,
  generateMediaPreview
}) => {
  const translate = useMemo(
    () => ({
      elements: t('Elements'),
      auto: t('Auto'),
      location: t('Location'),
      zip: t('Enter City / Zip Code'),
      temperature: t('Temperature'),
      last_updated: t('Last Updated'),
      font_family: t('Font Family'),
      font_color: t('Font Color'),
      size: t('Size'),
      dark_font_family: t('Dark Font Family'),
      light_font_family: t('Light Font Family'),
      state_font_size: t('State Font Size'),
      city_font_size: t('City Font Size'),
      skin: t('Skin'),
      section_1: t('Section 1'),
      section_2: t('Section 2'),
      section_3: t('Section 3'),
      section_4: t('Section 4'),
      section_5: t('Section 5'),
      section_6: t('Section 6'),
      section_7: t('Section 7'),
      type: t('Type'),
      color: t('Color'),
      humidity: t('Humidity'),
      precipitation: t('Precipitation'),
      wind: t('Wind'),
      pressure: t('Pressure'),
      feelsLike: t('Feels Like'),
      visibility: t('Visibility')
    }),
    [t]
  )
  const [themeType, setThemeType] = useState('Legacy')
  const [skinPresets, setSkinPresets] = useState([])

  const selectedList = useSelectedList(elements.map(({ value }) => value))

  const { themes, featureId } = useMediaTheme(mediaName, tabName)

  const form = useFormik({
    initialValues: {
      themeId: null,
      attributes: {
        location: '',
        temperature: 'imperial',
        last_updated: 'off',
        location_type: 'city',
        elements: ''
      },
      mediaInfo: mediaInfoInitvalue
    },
    validationSchema: Yup.object().shape({
      mediaInfo: Yup.object().shape({
        title: Yup.string().required('This field is required')
      })
    }),
    onSubmit(values) {
      toggleMode('save')
      const data = createMediaPostData(values.mediaInfo, mode)
      data.attributes = values.attributes
      data.attributes.elements = selectedList.selectedIds.join(',')
      data.themeId = values.themeId

      data.featureId = featureId

      const actionOptions = {
        mediaName: mediaName.toLowerCase(),
        tabName: tabName.toLowerCase(),
        data
      }

      if (mode === 'add') {
        addMedia(actionOptions)
      } else {
        editMedia({ ...actionOptions, id: backendData.id })
      }
    }
  })

  const handleChangeThemeType = useCallback(
    (event, value) => value && setThemeType(value),
    []
  )

  const validate = useCallback(() => {
    let isValid = true

    if (
      !form.values.attributes.location &&
      form.values.attributes.location_type === 'city'
    ) {
      form.setFieldError('location', 'This field is required')
      isValid = false
    }

    return isValid
  }, [form])

  const changeSkinPresets = useCallback(
    value => {
      const {
        customProperties: { other }
      } = themes[themeType].find(({ id }) => id === value)

      if (other.hasOwnProperty('conditions')) {
        setSkinPresets(other.conditions.skin)
      }
    },
    [themeType, themes]
  )

  const handleChangeSelectedTheme = useCallback(
    ({ target: { name, value } }) => {
      form.setFieldValue(
        'attributes',
        replaceAllExcept(form.values.attributes, themeProperties[value], [
          'location',
          'temperature',
          'last_updated',
          'location_type',
          'elements'
        ])
      )

      form.setFieldValue(name, value)

      changeSkinPresets(value)
    },
    [changeSkinPresets, form]
  )

  const handleChangeSkin = useCallback(
    ({ target: { name, value } }) => {
      form.setValues(
        update(form.values, {
          attributes: {
            theme_properties: {
              $merge: skinPresets[value - 1]
            }
          }
        })
      )
      form.setFieldValue(name, value)
    },
    [form, skinPresets]
  )

  // Recursive loop for insert component depending on the chosen theme
  const getComponents = useCallback(
    (object, components, prevPath) => {
      Object.keys(object).forEach(key => {
        if (exceptions.every(e => e !== key)) {
          let currentPath = `attributes.${key}`
          if (prevPath) {
            currentPath = `${prevPath}.${key}`
          }

          if (_isObject(object[key]) && key !== 'background') {
            getComponents(object[key], components, currentPath)
          } else {
            components.push(
              <LibraryComponents
                formControlLabelClass={classes.label}
                key={`library-component-${currentPath}`}
                type={key}
                label={translate[key]}
                value={_get(form.values, currentPath, null)}
                name={currentPath}
                onChange={form.handleChange}
                classes={classes}
                onChangeSkin={handleChangeSkin}
                skinOptions={skinPresets}
              />
            )
          }
        }
      })
    },
    [
      classes,
      form.handleChange,
      form.values,
      handleChangeSkin,
      skinPresets,
      translate
    ]
  )

  const renderRestOptions = useMemo(() => {
    const components = []
    getComponents(form.values.attributes, components)
    return components
  }, [form.values, getComponents])

  const handleClickShowPreview = useCallback(() => {
    selectedList.validate('Please select at least one element')
    if (!validate()) return

    if (selectedList.isValid) {
      generateMediaPreview({
        featureId,
        attributes: {
          ...form.values.attributes,
          elements: selectedList.selectedIds.join(',')
        },
        themeId: form.values.themeId
      })
    }
  }, [
    featureId,
    form.values.attributes,
    form.values.themeId,
    generateMediaPreview,
    selectedList,
    validate
  ])

  useEffect(
    () => {
      if (!isEmpty(backendData) && !isEmpty(themes)) {
        const {
          attributes,
          themeId,
          title,
          group,
          tag,
          activeOn,
          expireOn,
          mediaPriority
        } = backendData

        selectedList.selectIds(attributes.elements.split(','))

        form.setValues({
          ...form.values,
          attributes: {
            ...attributes,
            location: attributes.location.split(',')[0]
          },
          themeId,
          mediaInfo: {
            title,
            group: selectUtils.convertArr(group, selectUtils.toChipObj),
            tags: selectUtils.convertArr(tag, selectUtils.toChipObj),
            activeDate: activeOn ? moment(activeOn) : null,
            expireDate: expireOn ? moment(expireOn) : null,
            priority: mediaPriority
          }
        })

        if (
          (themeId >= 158 && themeId <= 162) ||
          (themeId >= 224 && themeId <= 228)
        ) {
          setThemeType('Modern')
        } else {
          setThemeType('Legacy')
          if (
            (themeId >= 146 && themeId <= 147) ||
            (themeId >= 150 && themeId <= 151)
          )
            changeSkinPresets(themeId)
        }
      }
    },
    // eslint-disable-next-line
    [backendData, themes]
  )

  const handleToggleElements = useCallback(
    (value, id) => {
      selectedList.toggle(id)
    },
    [selectedList]
  )

  const toggleMode = useMediaNotification({
    t,
    showSnackbar,
    mediaName,
    tabName,
    form,
    closeModal
  })

  const handleClickSaveAndClose = useCallback(() => {
    selectedList.validate('Please select at least one element')
    if (!validate()) return

    if (selectedList.isValid)
      form.submitForm().then(() => toggleMode('saveAndClose'))
  }, [form, selectedList, toggleMode, validate])

  const handleSubmit = useCallback(() => {
    selectedList.validate('Please select at least one element')
    if (!validate()) return

    if (selectedList.isValid) form.submitForm().then(r => r)
  }, [form, selectedList, validate])

  return (
    <div className={classes.root}>
      <div className={classes.leftContent}>
        <Section
          title={translate.location}
          headerClass={classes.sectionHeaderPadding}
          contentClass={classes.sectionContentPadding}
          error={form.errors.location}
          headerAction={
            <CheckboxSwitcher
              label={translate.auto}
              formControlLabelClass={classes.label}
              value={form.values.attributes.location_type}
              name="attributes.location_type"
              returnValues={{
                auto: true,
                city: false
              }}
              handleChange={form.handleChange}
              formControlRootClass={classes.lastUpdatedSwitch}
            />
          }
        >
          <FormControlSelectCities
            formControlLabelClass={classes.label}
            label={translate.zip}
            labelPosition="left"
            name="attributes.location"
            value={form.values.attributes.location}
            onChange={form.handleChange}
          />
        </Section>

        <MediaThemeCarousel
          options={themes}
          name="themeId"
          value={form.values.themeId}
          onChange={handleChangeSelectedTheme}
          rootClass={classes.carousel}
          currentTab={themeType}
          onChangeTab={handleChangeThemeType}
          settings={{
            infinite: false
          }}
        />
        <div className={classes.optionsSelectGroup}>
          <FormControlReactSelect
            formControlLabelClass={classes.label}
            options={temperatureOptions}
            onChange={form.handleChange}
            value={form.values.attributes.temperature}
            name="attributes.temperature"
            label={translate.temperature}
          />
          {form.values.attributes.hasOwnProperty('width') ? (
            <FormControlSelectResolution
              formControlLabelClass={classes.label}
              width={form.values.attributes.width}
              height={form.values.attributes.height}
              onChange={form.handleChange}
              label={translate.size}
              nameWidth="attributes.width"
              nameHeight="attributes.height"
            />
          ) : null}
          {renderRestOptions}
          <CheckboxSwitcher
            formControlLabelClass={classes.label}
            label={translate.last_updated}
            value={form.values.attributes.last_updated}
            name="attributes.last_updated"
            returnValues={{
              on: true,
              off: false
            }}
            handleChange={form.handleChange}
            formControlRootClass={classes.lastUpdatedSwitch}
          />
        </div>
        <div className={classes.elementsHeader}>
          <Typography className={classes.elementsLabel}>
            {translate.elements}
          </Typography>
          <Typography className={classes.error}>
            {selectedList.error}
          </Typography>
        </div>

        <div className={classes.optionsSwitchGroup}>
          {elements.map(({ label, value }) => (
            <CheckboxSwitcher
              id={value}
              key={`elements-${value}`}
              label={translate[label]}
              value={selectedList.isSelect(value)}
              formControlLabelClass={classes.label}
              formControlRootClass={classes.switch}
              switchBaseClass={classes.switchHeight}
              handleChange={handleToggleElements}
            />
          ))}
        </div>
        <PreviewButton onClick={handleClickShowPreview} text="Preview Media" />
      </div>
      <div className={classes.rightContent}>
        <MediaInfo
          values={form.values.mediaInfo}
          errors={form.errors.mediaInfo}
          touched={form.touched.mediaInfo}
          onControlChange={form.setFieldValue}
          onFormHandleChange={form.handleChange}
        />
        <MediaTabActions
          mode={mode}
          onClose={closeModal}
          onAdd={handleSubmit}
          onAddAndClose={handleClickSaveAndClose}
        />
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      generateMediaPreview,
      addMedia,
      editMedia
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  connect(null, mapDispatchToProps)
)(Weather)
