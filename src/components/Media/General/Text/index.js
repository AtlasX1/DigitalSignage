import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { translate } from 'react-i18next'
import classNames from 'classnames'
import { withStyles, Typography } from '@material-ui/core'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { isEmpty } from 'lodash'
import moment from 'moment'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { get as _get } from 'lodash'
import {
  addMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemById
} from 'actions/mediaActions'

import { FormControlInput } from 'components/Form'
import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from 'components/Buttons'
import ThemeSection from 'components/Media/General/Text/ThemeSection'
import { MediaInfo, MediaTabActions } from 'components/Media/index'
import FormControlSelectFont from 'components/Form/FormControlSelectFont'

import { mediaInfoInitvalue } from 'constants/media'

import useDetermineMediaFeatureId from 'hooks/useDetermineMediaFeatureId'

import { textPalettes } from 'utils/palettePresets'
import { selectUtils } from 'utils'
import { camelToSnake, snakeToCamel } from 'utils/camelCaseObjectToSnakeCase'
import { createMediaPostData } from 'utils/mediaUtils'
import useMediaNotification from 'hooks/useMediaNotification'

const styles = ({ palette, type, formControls }) => ({
  root: {
    position: 'relative',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr max(474.92px)'
  },
  tabToggleButton: {
    width: '128px'
  },
  previewMediaBtn: {
    margin: '25px 0',
    padding: '10px 25px 8px',
    borderColor: palette[type].sideModal.action.button.border,
    backgroundImage: palette[type].sideModal.action.button.background,
    borderRadius: '4px',
    boxShadow: 'none'
  },
  previewMediaText: {
    fontWeight: 'bold',
    color: palette[type].sideModal.action.button.color
  },
  label: {
    fontSize: '17px'
  },
  formControlRootClass: {
    marginBottom: '0'
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
  rightContent: {
    height: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderLeft: `1px solid ${palette[type].sideModal.content.border}`
  },
  leftContent: {
    padding: '22px 25px 0 24px',
    display: 'grid',
    gridTemplateRows: 'repeat(5, fit-content(100%))',
    gridTemplateColumns: 'max(166px) max(166px) 1fr',
    gridRowGap: '18px'
  },
  stretch: {
    gridColumnStart: '1',
    gridColumnEnd: '4',
    justifyContent: 'center'
  },
  error: {
    background: 'red',
    color: 'white',

    '&:hover': {
      color: '#606066'
    }
  }
})

const mediaName = 'General'
const tabName = 'Text'

const Text = ({
  classes,
  generateMediaPreview,
  onShowSnackbar: showSnackbar,
  addMedia,
  editMedia,
  backendData,
  onModalClose: closeModal,
  t,
  mode
}) => {
  const translate = useMemo(
    () => ({
      title: t('Title'),
      text: t('Text'),
      content: t('Content'),
      fontSize: t('Font Size'),
      fontFamily: t('Font Family'),
      preview: t('Preview Media')
    }),
    [t]
  )

  const featureId = useDetermineMediaFeatureId(mediaName, tabName)

  const [selectedTextType, toggleSelectedTextType] = useState('title')

  const initialFormValues = useRef({
    layout: 1,
    title: {
      content: 'Lorem Ipsum',
      fontSize: 24,
      fontFamily: 'Arial',
      fontColor: 'rgba(255,255,255,1)',
      backgroundColor: 'rgba(0,0,0,1)'
    },
    text: {
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      fontSize: 24,
      fontFamily: 'Arial',
      fontColor: 'rgba(255,255,255,1)',
      backgroundColor: 'rgba(0,0,0,1)',
      duration: 5,
      padding: 1,
      direction: 'left',
      animation: 'scrolling',
      speed: 25
    },
    mediaInfo: mediaInfoInitvalue
  })
  const form = useFormik({
    initialValues: initialFormValues.current,
    validationSchema: Yup.object().shape({
      title: Yup.object({
        content: Yup.string().required('This field is required'),
        fontFamily: Yup.string().required('This field is required').nullable()
      }),
      text: Yup.object({
        content: Yup.string().required('This field is required'),
        fontFamily: Yup.string().required('This field is required').nullable(),
        animation: Yup.string().required('This field is required').nullable()
      }),
      mediaInfo: Yup.object().shape({
        title: Yup.string().required('This field is required')
      })
    }),
    onSubmit(values) {
      initialFormValues.current = values
      toggleMode('save')
      const data = createMediaPostData(values.mediaInfo, mode)
      data.attributes = camelToSnake(
        {
          layout: form.values.layout,
          title: form.values.title,
          text: form.values.text
        },
        2
      )

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

  useEffect(
    () => {
      if (!isEmpty(backendData)) {
        const {
          attributes,
          title,
          group,
          tag,
          activeOn,
          expireOn,
          mediaPriority
        } = backendData

        initialFormValues.current = {
          ...form.values,
          ...snakeToCamel(attributes, 2),
          mediaInfo: {
            title,
            group: selectUtils.convertArr(group, selectUtils.toChipObj),
            tags: selectUtils.convertArr(tag, selectUtils.toChipObj),
            activeDate: activeOn ? moment(activeOn) : null,
            expireDate: expireOn ? moment(expireOn) : null,
            priority: mediaPriority
          }
        }
        form.setValues(initialFormValues.current)
      }
    },
    // eslint-disable-next-line
    [backendData]
  )

  const renderSelectedTabContent = useMemo(() => {
    switch (selectedTextType) {
      case 'title':
        return (
          <FormControlInput
            formControlContainerClass={classes.stretch}
            formControlRootClass={classes.formControlRootClass}
            formControlLabelClass={classes.label}
            name="title.content"
            value={form.values.title.content}
            fullWidth
            label={translate.title}
            handleChange={form.handleChange}
            error={_get(form.errors, 'title.content', '')}
            touched={_get(form.touched, 'title.content', false)}
          />
        )
      case 'text':
        return (
          <FormControlInput
            formControlContainerClass={classes.stretch}
            formControlRootClass={classes.formControlRootClass}
            formControlLabelClass={classes.label}
            value={form.values.text.content}
            name="text.content"
            fullWidth
            label={translate.text}
            handleChange={form.handleChange}
            error={_get(form.errors, 'text.content', '')}
            touched={_get(form.touched, 'text.content', false)}
          />
        )
      default:
        return
    }
  }, [
    classes.formControlRootClass,
    classes.label,
    classes.stretch,
    form.errors,
    form.handleChange,
    form.touched,
    form.values.text.content,
    form.values.title.content,
    selectedTextType,
    translate.text,
    translate.title
  ])

  const handleChangeFontSize = useCallback(
    (value, name) => form.setFieldValue(name, value),
    [form]
  )

  const handleSelectPalette = useCallback(
    value => {
      form.setFieldValue('title.fontColor', value.palette.title.value)
      form.setFieldValue('title.backgroundColor', value.palette.titleBg.value)
      form.setFieldValue('text.fontColor', value.palette.text.value)
      form.setFieldValue('text.backgroundColor', value.palette.textBg.value)
    },
    [form]
  )

  const handleClickShowPreview = useCallback(() => {
    form.setTouched({
      title: {
        content: true,
        fontFamily: true
      },
      text: {
        content: true,
        fontFamily: true,
        animation: true
      }
    })
    form.validateForm().then(errors => {
      if (isEmpty(errors.title) && isEmpty(errors.text)) {
        generateMediaPreview({
          featureId,
          attributes: camelToSnake(
            {
              layout: form.values.layout,
              title: form.values.title,
              text: form.values.text
            },
            2
          )
        })
      }
    })
  }, [featureId, form, generateMediaPreview])

  const toggleMode = useMediaNotification({
    t,
    showSnackbar,
    mediaName,
    tabName,
    form,
    closeModal
  })

  const handleClickSaveAndClose = useCallback(() => {
    form.setTouched({
      title: {
        content: true,
        fontFamily: true
      },
      text: {
        content: true,
        fontFamily: true,
        animation: true
      },
      mediaInfo: {
        title: true
      }
    })
    form.validateForm().then(errors => {
      if (isEmpty(errors)) {
        form.submitForm().then(() => toggleMode('saveAndClose'))
      }
    })
  }, [form, toggleMode])

  return (
    <div className={classes.root}>
      <div className={classes.leftContent}>
        <TabToggleButtonGroup
          value={selectedTextType}
          exclusive
          className={classes.stretch}
          onChange={(event, value) => value && toggleSelectedTextType(value)}
        >
          <TabToggleButton
            className={classNames(classes.tabToggleButton, {
              [classes.error]:
                ((_get(form.errors, 'title.content') &&
                  _get(form.touched, 'title.content')) ||
                  (_get(form.errors, 'title.fontFamily') &&
                    _get(form.touched, 'title.fontFamily'))) &&
                selectedTextType !== 'title'
            })}
            value="title"
          >
            {translate.title}
          </TabToggleButton>
          <TabToggleButton
            className={classNames(classes.tabToggleButton, {
              [classes.error]:
                ((_get(form.errors, 'text.content') &&
                  _get(form.touched, 'text.content')) ||
                  (_get(form.errors, 'text.fontFamily') &&
                    _get(form.touched, 'text.fontFamily'))) &&
                selectedTextType !== 'text'
            })}
            value="text"
          >
            {translate.content}
          </TabToggleButton>
        </TabToggleButtonGroup>
        {renderSelectedTabContent}
        <FormControlInput
          custom
          labelPosition="left"
          min={5}
          max={150}
          name={`${selectedTextType}.fontSize`}
          value={form.values[selectedTextType].fontSize}
          handleChange={handleChangeFontSize}
          label={t('Font Size')}
          formControlLabelClass={classes.label}
          formControlInputClass={classes.formControlInputClass}
          formControlRootClass={classNames(
            classes.formControlRootClass,
            classes.numberInput
          )}
        />
        <FormControlInput
          custom
          labelPosition="left"
          min={1}
          max={150}
          name="text.padding"
          value={form.values.text.padding}
          handleChange={handleChangeFontSize}
          label={t('Padding')}
          formControlInputClass={classes.formControlInputClass}
          formControlLabelClass={classes.label}
          formControlRootClass={classNames(
            classes.formControlRootClass,
            classes.numberInput
          )}
        />
        <FormControlSelectFont
          name={`${selectedTextType}.fontFamily`}
          value={form.values[selectedTextType].fontFamily}
          onChange={form.handleChange}
          label={translate.fontFamily}
          labelPosition="left"
          formControlLabelClass={classes.label}
          error={_get(form.errors, `${selectedTextType}.fontFamily`, '')}
          touched={_get(form.touched, `${selectedTextType}.fontFamily`, false)}
        />
        <ThemeSection
          className={classes.stretch}
          values={form.values}
          onChange={form.handleChange}
          selectedTextType={selectedTextType}
          optionsPalette={textPalettes}
          onSelectPalette={handleSelectPalette}
          errors={form.errors}
          touched={form.touched}
          directionName="text.direction"
          animationName="text.animation"
          speedName="text.speed"
          durationName="text.duration"
        />
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
          onReset={() => form.resetForm(initialFormValues.current)}
          onAdd={form.handleSubmit}
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
      getMediaItemById,
      addMedia,
      editMedia
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  connect(null, mapDispatchToProps)
)(Text)
