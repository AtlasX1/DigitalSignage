import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { translate } from 'react-i18next'
import { withStyles, Typography } from '@material-ui/core'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import classNames from 'classnames'
import { get as _get, isEmpty } from 'lodash'

import { addMedia, editMedia, generateMediaPreview } from 'actions/mediaActions'
import { getAirlines } from 'actions/configActions'

import { CheckboxSwitcher } from 'components/Checkboxes'
import { WhiteButton } from 'components/Buttons'
import ExpansionPanel from 'components/Pages/Template/CreateTemplate/SettingsSide/ExpansionPanel'
import { MediaInfo, MediaTabActions } from 'components/Media/index'
import FormControlReactSelect from 'components/Form/FormControlReactSelect'
import {
  FormControlInput,
  FormControlSelectFont,
  FormControlSketchColorPicker
} from 'components/Form'
import MediaThemeCarousel from 'components/Media/MediaThemeCarousel'

import { layout, airlineTypes, noOfHours } from './config'

import { mediaInfoInitvalue } from 'constants/media'

import useMediaTheme from 'hooks/useMediaTheme'

import { createMediaPostData } from 'utils/mediaUtils'
import FormControlSelectAirports from 'components/Form/FormControlSelectAirports'
import useSelectedList from 'hooks/tableLibrary/useSelectedList'
import useMediaNotification from 'hooks/useMediaNotification'
import { selectUtils } from 'utils'
import moment from 'moment'

const styles = ({ palette, type, formControls }) => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr max(474.92px)'
  },
  rightContent: {
    height: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderLeft: `1px solid ${palette[type].sideModal.content.border}`
  },
  leftContent: {
    width: '100%',
    padding: '15px 30px',
    display: 'grid',
    gridTemplateRows: 'repeat(4, fit-content(100%))',
    gridTemplateColumns: '1fr 1fr',
    gridRowGap: '16px',
    gridColumnGap: '16px'
  },
  previewMediaBtn: {
    marginTop: 45,
    maxWidth: '147px',
    padding: '10px 25px 8px',
    border: `1px solid ${palette[type].sideModal.action.button.border}`,
    backgroundImage: palette[type].sideModal.action.button.background,
    borderRadius: '4px',
    boxShadow: 'none'
  },
  previewMediaText: {
    fontWeight: 'bold',
    color: palette[type].sideModal.action.button.color
  },
  checkboxRootClass: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  formControlLabelClass: {
    fontSize: '13px'
  },
  expansionPanelLabelClass: {
    fontSize: '12px',
    color: palette[type].pages.media.licenced.color,
    fontWeight: '700'
  },
  label: {
    fontSize: '1.0833rem'
  },
  stretch: {
    gridColumnStart: 1,
    gridColumnEnd: 3
  },
  layout: {
    display: 'grid',
    gridColumnGap: '79px',
    gridTemplateColumns: 'minmax(100px, 250px) minmax(100px, 250px)'
  },
  layoutWrapper: {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: '20px'
  },
  switchBorder: {
    borderBottom: `1px solid ${palette[type].secondary}`
  },
  layoutSubActions: {
    gridColumnStart: 1,
    gridColumnEnd: 3,
    display: 'grid',
    gridTemplateColumns: 'minmax(100px, 250px) minmax(100px, 250px)',
    gridColumnGap: '79px',
    gridRowGap: '15px',
    padding: '16px 0'
  },
  colorPicker: {
    marginBottom: 'unset'
  },
  formControlInputClass: {
    ...formControls.mediaApps.numericInput.input
  },
  numberInput: {
    '& span': {
      width: '76px',
      height: '36px'
    }
  },
  selectAllAirlines: {
    gridColumnStart: 2
  },
  labelColorPicker: {
    fontSize: '1.0833rem'
  }
})

const mediaName = 'Licensed'
const tabName = 'Flightstats'

const FlightInformation = ({
  classes,
  mode,
  backendData,
  t,
  generateMediaPreview,
  getAirlines,
  airlines = [],
  onShowSnackbar: showSnackbar,
  onModalClose: closeModal,
  addMedia,
  editMedia
}) => {
  const translate = useMemo(
    () => ({
      airport: t('Airport Code or Name'),
      type: t('Departure / Arrival'),
      noOfHours: t('No of Hours'),
      theme: t('Theme'),
      titleColor: t('Title font color'),
      preview: t('Preview Media'),
      selectAll: t('Select All'),
      airline: t('Airlines'),
      dataColor: t('Data color'),
      headerColor: t('Header color'),
      duration: t('Duration'),
      fontFamily: t('Font Family')
    }),
    [t]
  )
  const { themes, featureId } = useMediaTheme(mediaName, tabName)
  const selectedColumns = useSelectedList(layout.map(({ value }) => value))
  const selectedAirlines = useSelectedList(airlines.map(({ code }) => code))

  const [themeType, setThemeType] = useState('Modern')

  const form = useFormik({
    initialValues: {
      themeId: null,
      attributes: {
        airport: null,
        type: null,
        no_of_hours: null,
        theme_settings: {}
      },
      mediaInfo: mediaInfoInitvalue
    },
    validationSchema: Yup.object().shape({
      themeId: Yup.number().required('This field is required').nullable(),
      attributes: Yup.object().shape({
        airport: Yup.string().required('This field is required').nullable(),
        type: Yup.string().required('This field is required').nullable(),
        no_of_hours: Yup.number().required('This field is required').nullable()
      }),
      mediaInfo: Yup.object().shape({
        title: Yup.string().required('This field is required')
      })
    }),
    onSubmit(values) {
      toggleMode('save')

      const data = createMediaPostData(values.mediaInfo, mode)

      data.attributes = values.attributes
      data.themeId = values.themeId
      data.attributes.theme_settings.columns = selectedColumns.selectedIds
      data.attributes.theme_settings.airlines = selectedAirlines.selectedIds
      data.featureId = featureId

      const actionOptions = {
        mediaName: mediaName.toLowerCase(),
        tabName: tabName.toLowerCase(),
        data
      }
      if (selectedAirlines.isValid && selectedColumns.isValid) {
        if (mode === 'add') {
          addMedia(actionOptions)
        } else {
          editMedia({ ...actionOptions, id: backendData.id })
        }
      }
    }
  })

  const airlinesErrorMessage = useMemo(
    () =>
      !form.values.attributes.airport ||
      !form.values.attributes.type ||
      !form.values.attributes.no_of_hours ||
      !airlines.length
        ? t('There are no airlines for these settings')
        : t('Please select at least one airline'),
    [
      airlines.length,
      form.values.attributes.airport,
      form.values.attributes.no_of_hours,
      form.values.attributes.type,
      t
    ]
  )

  useEffect(() => {
    if (
      form.values.attributes.airport &&
      form.values.attributes.no_of_hours &&
      form.values.attributes.type
    )
      getAirlines({
        airport: form.values.attributes.airport,
        type: form.values.attributes.type,
        noOfHours: form.values.attributes.no_of_hours
      })
  }, [
    getAirlines,
    form.values.attributes.airport,
    form.values.attributes.no_of_hours,
    form.values.attributes.type
  ])

  const handleSelectAllAirlines = useCallback(() => {
    selectedAirlines.pageSelect()
  }, [selectedAirlines])

  const handleSelectAllColumns = useCallback(() => {
    selectedColumns.pageSelect()
  }, [selectedColumns])

  const handleClickShowPreview = useCallback(() => {
    form.setTouched({
      themeId: true,
      attributes: {
        airport: true,
        type: true,
        no_of_hours: true
      }
    })
    selectedColumns.validate('Please select at least one column')
    selectedAirlines.validate(airlinesErrorMessage)
    form.validateForm().then(errors => {
      if (
        isEmpty(errors.attributes) &&
        selectedColumns.isValid &&
        selectedAirlines.isValid
      ) {
        generateMediaPreview({
          featureId,
          themeId: form.values.themeId,
          attributes: {
            ...form.values.attributes,
            theme_settings: {
              ...form.values.attributes.theme_settings,
              airlines: selectedAirlines.selectedIds,
              columns: selectedColumns.selectedIds
            }
          },
          mediaInfo: undefined
        })
      }
    })
  }, [
    airlinesErrorMessage,
    featureId,
    form,
    generateMediaPreview,
    selectedAirlines,
    selectedColumns
  ])

  const handleChangeTheme = useCallback(
    event => {
      const {
        customProperties: {
          other: { default_values }
        }
      } = themes[themeType].find(({ id }) => id === event.target.value)

      selectedColumns.selectIds(default_values.columns)

      form.handleChange(event)
      form.setFieldTouched('themeId', false)
      form.setFieldValue('attributes.theme_settings', default_values)
    },
    [form, selectedColumns, themeType, themes]
  )

  const toggleMode = useMediaNotification({
    t,
    showSnackbar,
    mediaName,
    tabName,
    form,
    closeModal
  })

  useEffect(
    () => {
      if (!isEmpty(backendData)) {
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
        if (themeId >= 188 && themeId <= 197) {
          setThemeType('Modern')
        } else {
          setThemeType('Legacy')
        }
        selectedColumns.selectIds(attributes.theme_settings.columns)
        selectedAirlines.selectIds(attributes.theme_settings.airlines)
        form.setValues({
          ...form.values,
          attributes,
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
      }
    },
    // eslint-disable-next-line
    [backendData]
  )

  const handleClickSaveAndClose = useCallback(() => {
    form.setTouched({
      themeId: true,
      attributes: {
        airport: true,
        type: true,
        no_of_hours: true
      },
      mediaInfo: {
        title: true
      }
    })
    selectedColumns.validate('Please select at least one column')
    selectedAirlines.validate(airlinesErrorMessage)
    form.validateForm().then(errors => {
      if (isEmpty(errors)) {
        form.submitForm().then(() => toggleMode('saveAndClose'))
      }
    })
  }, [
    airlinesErrorMessage,
    form,
    selectedAirlines,
    selectedColumns,
    toggleMode
  ])

  const handleSubmit = useCallback(() => {
    form.submitForm().then(r => r)
    selectedColumns.validate('Please select at least one column')
    selectedAirlines.validate(airlinesErrorMessage)
  }, [airlinesErrorMessage, form, selectedAirlines, selectedColumns])

  const handleChangeType = useCallback(
    (event, value) => value && setThemeType(value),
    []
  )

  return (
    <div className={classes.root}>
      <div className={classes.leftContent}>
        <FormControlSelectAirports
          label={translate.airport}
          formControlLabelClass={classes.label}
          formControlContainerClass={classes.stretch}
          onChange={form.handleChange}
          value={form.values.attributes.airport}
          name="attributes.airport"
          error={_get(form.errors, 'attributes.airport')}
          touched={_get(form.touched, 'attributes.airport')}
          marginBottom={0}
        />
        <FormControlReactSelect
          label={translate.type}
          options={airlineTypes}
          name="attributes.type"
          value={form.values.attributes.type}
          onChange={form.handleChange}
          formControlLabelClass={classes.label}
          error={_get(form.errors, 'attributes.type')}
          touched={_get(form.touched, 'attributes.type')}
        />
        <FormControlReactSelect
          label={translate.noOfHours}
          formControlLabelClass={classes.label}
          options={noOfHours}
          name="attributes.no_of_hours"
          value={form.values.attributes.no_of_hours}
          onChange={form.handleChange}
          error={_get(form.errors, 'attributes.no_of_hours')}
          touched={_get(form.touched, 'attributes.no_of_hours')}
        />
        <div className={classes.stretch}>
          <ExpansionPanel
            expanded
            title={translate.theme}
            formControlLabelClass={classes.expansionPanelLabelClass}
            children={
              <MediaThemeCarousel
                options={themes}
                name="themeId"
                value={form.values.themeId}
                onChange={handleChangeTheme}
                currentTab={themeType}
                onChangeTab={handleChangeType}
                settings={{
                  infinite: false
                }}
                error={form.errors.themeId}
                touched={form.touched.themeId}
              />
            }
          />
          <ExpansionPanel
            expanded={false}
            title={'Layout'}
            formControlLabelClass={classes.expansionPanelLabelClass}
            contentClass={classes.layoutWrapper}
            error={selectedColumns.error}
            touched
            children={
              <div className={classes.layout}>
                <CheckboxSwitcher
                  label={translate.selectAll}
                  value={selectedColumns.isPageSelect}
                  handleChange={handleSelectAllColumns}
                  switchContainerClass={classes.selectAllAirlines}
                  formControlRootClass={classes.checkboxRootClass}
                  formControlLabelClass={classes.formControlLabelClass}
                />
                {layout.map(({ label, value }) => (
                  <CheckboxSwitcher
                    key={`layout-switch-${label}`}
                    label={label}
                    name={value}
                    value={selectedColumns.isSelect(value)}
                    handleChange={selectedColumns.toggle}
                    selectedListMode
                    switchContainerClass={classes.switchBorder}
                    formControlRootClass={classes.checkboxRootClass}
                    formControlLabelClass={classes.formControlLabelClass}
                  />
                ))}
                <div className={classes.layoutSubActions}>
                  {form.values.themeId ? (
                    <>
                      <FormControlInput
                        custom
                        labelPosition="left"
                        min={5}
                        max={150}
                        name="attributes.theme_settings.duration"
                        formikMode
                        marginBottom={false}
                        value={form.values.attributes.theme_settings.duration}
                        handleChange={form.handleChange}
                        label={translate.duration}
                        formControlLabelClass={classes.label}
                        formControlRootClass={classNames(
                          classes.formControlRootClass,
                          classes.numberInput
                        )}
                      />
                      <FormControlSketchColorPicker
                        name="attributes.theme_settings.title_font_color"
                        label={translate.titleColor}
                        formControlLabelClass={classes.labelColorPicker}
                        color={
                          form.values.attributes.theme_settings.title_font_color
                        }
                        onColorChange={form.handleChange}
                        rootClass={classes.colorPicker}
                      />
                    </>
                  ) : null}
                  {form.values.themeId >= 188 && form.values.themeId <= 197 ? (
                    <>
                      <FormControlSelectFont
                        label={translate.fontFamily}
                        value={
                          form.values.attributes.theme_settings.font_family
                        }
                        name="attributes.theme_settings.font_family"
                        onChange={form.handleChange}
                        formControlLabelClass={classes.label}
                      />
                      <FormControlSketchColorPicker
                        name="attributes.theme_settings.data_font_color"
                        label={translate.dataColor}
                        formControlLabelClass={classes.labelColorPicker}
                        color={
                          form.values.attributes.theme_settings.data_font_color
                        }
                        onColorChange={form.handleChange}
                        rootClass={classes.colorPicker}
                      />
                      <FormControlSketchColorPicker
                        name="attributes.theme_settings.header_font_color"
                        label={translate.headerColor}
                        formControlLabelClass={classes.labelColorPicker}
                        color={
                          form.values.attributes.theme_settings
                            .header_font_color
                        }
                        onColorChange={form.handleChange}
                        rootClass={classes.colorPicker}
                      />
                    </>
                  ) : null}
                </div>
              </div>
            }
          />
          <ExpansionPanel
            expanded={false}
            title={translate.airline}
            formControlLabelClass={classes.expansionPanelLabelClass}
            contentClass={classes.layoutWrapper}
            error={selectedAirlines.error}
            disabled={
              !form.values.attributes.airport ||
              !form.values.attributes.type ||
              !form.values.attributes.no_of_hours ||
              !airlines.length
            }
            touched
            children={
              <div className={classes.layout}>
                {airlines.length ? (
                  <CheckboxSwitcher
                    label={translate.selectAll}
                    value={selectedAirlines.isPageSelect}
                    handleChange={handleSelectAllAirlines}
                    switchContainerClass={classes.selectAllAirlines}
                    formControlRootClass={classes.checkboxRootClass}
                    formControlLabelClass={classes.formControlLabelClass}
                  />
                ) : null}
                {airlines.map(({ airline, code }) => (
                  <CheckboxSwitcher
                    key={`airlines-switch-${airline}`}
                    label={airline}
                    name={code}
                    value={selectedAirlines.isSelect(code)}
                    handleChange={selectedAirlines.toggle}
                    selectedListMode
                    switchContainerClass={classes.switchBorder}
                    formControlRootClass={classes.checkboxRootClass}
                    formControlLabelClass={classes.formControlLabelClass}
                  />
                ))}
              </div>
            }
          />
        </div>
        <WhiteButton
          className={classes.previewMediaBtn}
          onClick={handleClickShowPreview}
        >
          <Typography className={classes.previewMediaText}>
            {translate.preview}
          </Typography>
        </WhiteButton>
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

const mapStateToProps = ({
  config: {
    airlines: { response: airlines }
  }
}) => ({
  airlines
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      generateMediaPreview,
      addMedia,
      editMedia,
      getAirlines
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(FlightInformation)
