import React, { useCallback, useEffect, useState } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Typography } from '@material-ui/core'

import { FormControlInput } from 'components/Form'

import { BlueButton, WhiteButton } from 'components/Buttons'
import LocationSearchInput from 'components/Form/FormControlSearchLocation'
import Section from 'components/Section'
import { MediaInfo, MediaTabActions } from 'components/Media/index'
import { useFormik } from 'formik'
import { mediaInfoInitvalue } from 'constants/media'
import * as Yup from 'yup'
import { createMediaPostData } from 'utils/mediaUtils'
import useDetermineMediaFeatureId from 'hooks/useDetermineMediaFeatureId'
import update from 'immutability-helper'
import { isEmpty } from 'lodash'
import { bindActionCreators, compose } from 'redux'
import {
  addMedia,
  editMedia,
  generateMediaPreview,
  getMediaItemById
} from 'actions/mediaActions'
import { connect } from 'react-redux'
import arrayMove from 'array-move'
import SelectDirections from 'components/Media/Local/Interest/SelectDirections'
import useMediaNotification from 'hooks/useMediaNotification'
import { selectUtils } from 'utils'
import moment from 'moment'

const styles = ({ palette, type, typography }) => ({
  root: {
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr max(474.92px)'
  },
  previewMediaBtn: {
    padding: '10px 25px 8px',
    border: `1px solid ${palette[type].sideModal.action.button.border}`,
    backgroundImage: palette[type].sideModal.action.button.background,
    borderRadius: '4px',
    boxShadow: 'none',
    marginTop: 45
  },
  previewMediaText: {
    ...typography.lightText[type]
  },
  addMediaBtn: {
    width: '103px',
    alignSelf: 'flex-end'
  },
  addMediaText: {
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  infoBoxInput: {
    marginBottom: 16
  },
  locationLabel: {
    fontSize: '13px',
    lineHeight: '15px',
    color: '#74809A'
  },
  sectionContent: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: 15
  },
  rightContent: {
    height: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderLeft: `1px solid ${palette[type].sideModal.content.border}`
  },
  leftContent: {
    padding: '15px 30px'
  },
  draggable: {
    position: 'absolute',
    pointerEvents: 'none',
    height: '100%',
    width: '100%'
  },
  error: {
    left: '5px',
    color: 'red',
    bottom: '-20px',
    position: 'absolute',
    fontSize: '9px'
  }
})

const mediaName = 'Local'
const tabName = 'PointOfInterest'

const initialLocationState = {
  location: null,
  title: '',
  description: '',
  latitude: null,
  longitude: null
}

const Interest = ({
  t,
  classes,
  mode,
  addMedia,
  editMedia,
  backendData,
  onModalClose: closeModal,
  generateMediaPreview,
  onShowSnackbar: showSnackbar
}) => {
  const [currentLocation, setLocation] = useState(initialLocationState)
  const [isEditLocation, toggleEditLocation] = useState(false)
  const [editedIndex, setEditedIndex] = useState(null)
  const featureId = useDetermineMediaFeatureId(mediaName, tabName)

  const form = useFormik({
    initialValues: {
      attributes: {
        locations: [],
        zoom_level: 5,
        direction: '',
        map_type: 'auto'
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
      const isValid = validateForm()

      if (!isValid) return

      const data = createMediaPostData(values.mediaInfo, mode)

      data.attributes = values.attributes
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
        form.setValues({
          ...form.values,
          attributes,
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

  const handleChangeLocations = useCallback(
    ({ target: { value, data } }) => {
      form.setFieldError('location', '')
      setLocation(values => ({
        ...values,
        location: value,
        latitude: data.latitude,
        longitude: data.longitude
      }))
    },
    [form]
  )

  const handleChangeLocationInfo = useCallback(
    ({ target: { name, value } }) => {
      setLocation(values => ({
        ...values,
        [name]: value
      }))
    },
    []
  )

  const handelClickSaveLocation = useCallback(() => {
    if (!currentLocation.location)
      return form.setFieldError('location', 'Please select location')

    if (
      !isEditLocation &&
      form.values.attributes.locations.some(
        ({ location }) => location === currentLocation.location
      )
    )
      return form.setFieldError('location', 'This location already select')

    if (isEditLocation) {
      const modifiedLocations = form.values.attributes.locations.map(
        (value, index) => (index === editedIndex ? currentLocation : value)
      )

      form.setFieldValue('attributes.locations', modifiedLocations)

      setEditedIndex(null)
      toggleEditLocation(false)
    } else {
      form.setValues(
        update(form.values, {
          attributes: {
            locations: { $push: [currentLocation] }
          }
        })
      )
    }

    form.setFieldError('location', '')
    setLocation(initialLocationState)
  }, [currentLocation, editedIndex, form, isEditLocation])

  const handleClickDeleteLocations = useCallback(
    deleteIndex => {
      form.setFieldValue(
        'attributes.locations',
        form.values.attributes.locations.filter(
          (v, index) => index !== deleteIndex
        )
      )
    },
    [form]
  )

  const handleClickDeleteDirections = useCallback(
    deletedLocation => {
      form.setFieldValue(
        'attributes.direction',
        form.values.attributes.direction
          .split(':')
          .filter(location => location !== deletedLocation)
          .join(':')
      )
    },
    [form]
  )

  const handleClickAddToDirections = useCallback(
    location => {
      const prevDirections =
        form.values.attributes.direction === ''
          ? []
          : form.values.attributes.direction.split(':')
      form.setValues(
        update(form.values, {
          attributes: {
            direction: { $set: [...prevDirections, location].join(':') }
          }
        })
      )
    },
    [form]
  )

  const handleEditLocations = useCallback(
    desiredIndex => {
      const desiredLocation = form.values.attributes.locations.find(
        (value, index) => index === desiredIndex
      )
      setLocation(desiredLocation)
      toggleEditLocation(true)
      setEditedIndex(desiredIndex)
    },
    [form]
  )

  const validateForm = useCallback(() => {
    if (form.values.attributes.locations.length < 1) {
      form.setFieldError('locations', 'Please select locations')
      return false
    }

    if (form.values.attributes.direction.split(':').length < 2) {
      form.setFieldError('direction', 'Please select at least two directions')
      return false
    }

    return true
  }, [form])

  const handleClickShowPreview = useCallback(() => {
    const isValid = validateForm()

    if (!isValid) return

    generateMediaPreview({
      featureId,
      attributes: form.values.attributes
    })
  }, [featureId, form.values.attributes, generateMediaPreview, validateForm])

  const handleReorder = useCallback(
    ({ source, destination }) => {
      if (source && destination) {
        const { index: sInd } = source
        const { index: dInd } = destination

        const reorderedDirection = arrayMove(
          form.values.attributes.direction.split(':'),
          sInd,
          dInd
        ).join(':')
        form.setFieldValue('attributes.direction', reorderedDirection)
      }
    },
    [form]
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
    form.submitForm().then(() => toggleMode('saveAndClose'))
  }, [form, toggleMode])

  return (
    <div className={classes.root}>
      <div className={classes.leftContent}>
        <LocationSearchInput
          label={t('Local')}
          value={currentLocation.location}
          onChange={handleChangeLocations}
          error={form.errors.location}
          marginBottom={16}
          touched
        />
        <Section
          title={t('Info Box Details')}
          contentClass={classes.sectionContent}
        >
          <FormControlInput
            label={t('Title')}
            name="title"
            value={currentLocation.title}
            handleChange={handleChangeLocationInfo}
            formControlRootClass={classes.infoBoxInput}
          />
          <FormControlInput
            label={t('Description')}
            name="description"
            value={currentLocation.description}
            handleChange={handleChangeLocationInfo}
            formControlRootClass={classes.infoBoxInput}
            fullWidth
            multiline
            rows={15}
          />
          <BlueButton
            fullWidth
            className={classes.addMediaBtn}
            onClick={handelClickSaveLocation}
          >
            <Typography className={classes.addMediaText}>
              {isEditLocation ? t('Edit') : t('Add')}
            </Typography>
          </BlueButton>
          <Typography className={classes.error}>
            {form.errors.locations || form.errors.direction}
          </Typography>
        </Section>

        <SelectDirections
          locations={form.values.attributes.locations}
          directions={form.values.attributes.direction}
          onReorder={handleReorder}
          onDeleteLocations={handleClickDeleteLocations}
          onDeleteDirections={handleClickDeleteDirections}
          onAddToDirections={handleClickAddToDirections}
          onEdit={handleEditLocations}
        />

        <WhiteButton
          className={classes.previewMediaBtn}
          onClick={handleClickShowPreview}
        >
          <Typography className={classes.previewMediaText}>
            {t('Preview Media')}
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
          onAdd={form.submitForm}
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
)(Interest)
