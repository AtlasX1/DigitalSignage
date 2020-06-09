import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useFormik } from 'formik'

import { translate } from 'react-i18next'

import moment from 'moment'
import * as Yup from 'yup'

import { withRouter } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { get as _get } from 'lodash'

import { withStyles, Grid, CircularProgress, Button } from '@material-ui/core'

import { SideModal, ScreenPreviewModal } from 'components/Modal'
import { Card } from 'components/Card'
import { TabToggleButton, TabToggleButtonGroup } from 'components/Buttons'

import Actions from './Actions'
import ScheduleInfo from './ScheduleInfo'
import Contents from './Contents'
import Devices from './Devices'

import { getMediaItemsAction } from 'actions/mediaActions'
import { getPlaylistItemsAction } from 'actions/playlistActions'
import { getTemplateItemsAction } from 'actions/templateActions'
import {
  clearAddedSchedule,
  editSchedule,
  getSchedule,
  getScheduleItemsAction,
  postSchedule,
  clearScheduleStatus
} from 'actions/scheduleActions'
import { getDeviceItemsAction } from 'actions/deviceActions'

import selectUtils from 'utils/select'
import { withSnackbar } from 'notistack'
import { clearScheduleError } from '../../../../actions/scheduleActions'
import ErrorDialog from './ErrorDialog'
import Dialog from '@material-ui/core/Dialog'

const styles = theme => {
  const { palette, type } = theme
  return {
    schedulePublishContent: {
      height: '100%',
      position: 'relative'
    },
    loaderWrapper: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(255,255,255,.7)',
      zIndex: 99
    },
    leftSide: {
      maxHeight: '100%',
      paddingLeft: '35px',
      paddingRight: '20px'
    },
    tabsWrap: {
      marginBottom: '20px'
    },

    mediaInfoWrap: {
      borderLeft: `solid 1px ${palette[type].sideModal.content.border}`
    },
    mediaInfoContainer: {
      height: '100%'
    },

    header: {
      marginBottom: '20px',
      paddingLeft: 0,
      border: `solid 1px ${palette[type].sideModal.content.border}`,
      backgroundColor: palette[type].card.greyHeader.background
    },
    headerText: {
      fontWeight: 'bold',
      lineHeight: '42px',
      color: palette[type].sideModal.header.titleColor
    },
    contentsCardRoot: {
      height: 'calc(100% - 45px)',
      paddingBottom: 0
    },
    scheduleInfoWrap: {
      overflowX: 'auto',
      flexGrow: 1
    }
  }
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Enter field'),
  deviceList: Yup.array().min(1).of(Yup.number()),
  scheduleContent: Yup.array().min(1)
})

const SchedulePublish = props => {
  const { t, classes, history, edit, match } = props

  const id = match.params.id

  const dispatchAction = useDispatch()

  const [
    mediaReducer,
    scheduleReducer,
    playlistReducer,
    playlistMetaReducer,
    templateReducer,
    templateMetaReducer,
    deviceReducer
  ] = useSelector(state => [
    state.media.library.response,
    state.schedule.scheduleItem,
    state.playlist.library.response,
    state.playlist.library.meta,
    state.template.library.response,
    state.template.library.meta,
    state.device.library.response
  ])

  const [isLoading, setLoading] = useState(false)
  const [componentLoading, setComponentLoading] = useState(edit && id)

  const [page, setPage] = useState(1)
  const [selectedType, setSelectedType] = useState('media')
  const [selectedDevices, setSelectedDevices] = useState([])
  const [publishTypeSelected, setPublishTypeSelected] = useState('contents')
  const [pageMediaContent, setPageMediaContent] = useState({})
  const [backendData, setBackendData] = useState({})

  const [isClear, setClear] = useState(false)
  const [openErrorDialog, setErrorDialog] = useState(false)

  const form = useFormik({
    initialValues: {
      title: '',
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      scheduleType: 'Timed',
      allDay: true,
      allDate: false,
      allTime: false,
      startTime: '00:00:00',
      endTime: '00:00:00',
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      randomizePlaybackOrder: false,
      specificDates: [],
      deviceList: [],
      scheduleContent: [],
      force: true,
      revertBackToOrigin: true,
      status: 'Active',
      group: [],
      tag: []
    },
    enableReinitialize: false,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema,
    onSubmit: async values => {
      const {
        title,
        workingDays,
        scheduleType,
        allDay,
        allDate,
        allTime,
        startTime,
        endTime,
        startDate,
        endDate,
        randomizePlaybackOrder,
        specificDates,
        deviceList,
        scheduleContent,
        force,
        revertBackToOrigin,
        status,
        group,
        tag
      } = values

      if (values.workingDays.length < 1) return

      try {
        const requestData = {
          title,
          workingDays: workingDays.join(','),
          scheduleType,
          allDay,
          allDate,
          allTime,
          startTime,
          endTime,
          startDate,
          endDate,
          randomizePlaybackOrder,
          specificDates,
          force,
          revertBackToOrigin,
          status,
          deviceList,
          scheduleContent: scheduleContent.map((i, index) => ({
            title: i.title,
            playbackContent: i.playbackContent,
            playbackContentId: i.playbackContentId ? i.playbackContentId : i.id,
            duration: i.duration ? i.duration : '00:00:00',
            daypartStartTime: i.daypartStartTime
              ? i.daypartStartTime
              : '00:00:00',
            daypartEndTime: i.daypartEndTime ? i.daypartEndTime : '00:00:00',
            repeatTime: i.playtime ? i.playtime : 1,
            sortOrder: index
          })),
          ...(group.length && {
            group: selectUtils.convertArr(group, selectUtils.fromChipObj)
          }),
          ...(tag.length && {
            tag: selectUtils.convertArr(tag, selectUtils.fromChipObj)
          })
        }

        if (!edit) {
          dispatchAction(postSchedule(requestData))
        } else {
          dispatchAction(editSchedule({ data: requestData, id }))
        }
      } catch (e) {
        form.setFieldValue('title', title)
      }
    }
  })

  // ---- methods

  const handlePublishTypeSelectedChanges = (event, publishTypeSelected) => {
    if (publishTypeSelected) {
      setPublishTypeSelected(publishTypeSelected)
    }
  }

  const getMediaItem = id => pageMediaContent.data.find(item => item.id === id)

  const handleClose = () => {
    history.push('/schedule-library')
  }

  const handleSelectedDevicesChange = devices => {
    setSelectedDevices(devices)
    form.setFieldValue(
      'deviceList',
      devices.map(({ id }) => id)
    )
  }

  const showSnackbar = title => {
    const { enqueueSnackbar, closeSnackbar, t } = props
    enqueueSnackbar(title, {
      variant: 'default',
      action: key => (
        <Button
          color="secondary"
          size="small"
          onClick={() => closeSnackbar(key)}
        >
          {t('OK')}
        </Button>
      )
    })
  }

  // ---- effects

  useEffect(
    () => {
      if (edit && id) {
        dispatchAction(getSchedule(id))
      } else {
        dispatchAction(
          getDeviceItemsAction({
            page: 1,
            limit: 10
          })
        )
      }
    },
    // eslint-disable-next-line
    []
  )

  useEffect(
    // as BE data
    () => {
      if (scheduleReducer.response) {
        dispatchAction(getDeviceItemsAction({ limit: 9999 }))

        const {
          title,
          workingDays,
          scheduleType,
          allDay,
          allDate,
          allTime,
          startTime,
          endTime,
          startDate,
          endDate,
          randomizePlaybackOrder,
          specificDates,
          deviceList,
          force,
          revertBackToOrigin,
          status,
          group,
          tag
        } = scheduleReducer.response

        setBackendData(scheduleReducer)

        form.setValues({
          ...form.values,
          title,
          workingDays: workingDays.split(','),
          scheduleType,
          allDay,
          allDate,
          allTime,
          startTime,
          endTime,
          startDate,
          endDate,
          randomizePlaybackOrder,
          specificDates,
          deviceList,
          force,
          revertBackToOrigin,
          status,
          group: group.length
            ? selectUtils.convertArr(group[0], selectUtils.toChipObj)
            : selectUtils.convertArr(group, selectUtils.toChipObj),
          tag: selectUtils.convertArr(tag, selectUtils.toChipObj)
        })
      }
    },
    // eslint-disable-next-line
    [scheduleReducer.response]
  )

  useEffect(
    () => {
      if (!!scheduleReducer.status) {
        if (scheduleReducer.status === 'successfully') {
          showSnackbar(
            id
              ? `Schedule ${id} successfully edited`
              : 'Schedule successfully added'
          )

          dispatchAction(clearScheduleStatus())

          dispatchAction(
            getScheduleItemsAction({
              page: 1,
              limit: 10
            })
          )

          if (isClear) {
            if (edit) return

            dispatchAction(clearAddedSchedule())
            history.push('/schedule-library/schedule-publish')
            form.resetForm()

            return
          }

          handleClose()
        } else if (scheduleReducer.status === 'error') {
          scheduleReducer.error.data && setErrorDialog(true)
          showSnackbar(scheduleReducer.error.message)
        }
      }
    },
    // eslint-disable-next-line
    [scheduleReducer.status]
  )

  useEffect(() => {
    setPage(1)
  }, [selectedType])

  useEffect(
    () => {
      setLoading(true)
      switch (selectedType) {
        case 'media':
          dispatchAction(
            getMediaItemsAction({
              page,
              limit: 20
            })
          )
          break
        case 'playlist':
          dispatchAction(
            getPlaylistItemsAction({
              limit: 20,
              page
            })
          )
          break
        case 'template':
          dispatchAction(
            getTemplateItemsAction({
              page,
              limit: 20
            })
          )
          break
        default:
          break
      }
    },
    // eslint-disable-next-line
    [selectedType, page]
  )

  useEffect(
    () => {
      if (selectedType === 'media' && _get(mediaReducer, 'data')) {
        setPageMediaContent(mediaReducer)
      } else if (selectedType === 'playlist') {
        setPageMediaContent({
          data: playlistReducer,
          meta: playlistMetaReducer
        })
      } else if (selectedType === 'template') {
        setPageMediaContent({
          data: templateReducer,
          meta: templateMetaReducer
        })
      } else {
        setPageMediaContent({})
      }
      setLoading(false)
    },
    // eslint-disable-next-line
    [playlistReducer, mediaReducer, templateReducer]
  )

  useEffect(
    () => {
      if (backendData.response && deviceReducer) {
        const { deviceList } = backendData.response

        const devices = []

        deviceList.forEach(deviceId => {
          const device = deviceReducer.find(i => i.id === deviceId)
          devices.push(device)
        })

        setSelectedDevices(devices)

        setComponentLoading(false)

        setBackendData({})
      }
    },
    // eslint-disable-next-line
    [deviceReducer]
  )

  useEffect(
    () => () => {
      // clear everything on unmount
      form.resetForm()
      dispatchAction(clearAddedSchedule())
    },
    // eslint-disable-next-line
    []
  )

  // ---- UI

  const contents = publishTypeSelected === 'contents'
  const devices = publishTypeSelected === 'devices'

  const title = publishTypeSelected === 'contents' ? t('Content') : t('Devices')
  const { values, errors, touched } = form

  return (
    <>
      <SideModal
        width="100%"
        animated={false}
        title={edit ? t('Edit Schedule') : t('Schedule & Publish')}
        leftBorderRadius
      >
        <Grid
          container
          wrap="nowrap"
          className={classes.schedulePublishContent}
        >
          {componentLoading && (
            <div className={classes.loaderWrapper}>
              <CircularProgress
                size={30}
                thickness={5}
                className={classes.progress}
              />
            </div>
          )}
          <Grid item xs={8} className={classes.leftSide}>
            <Grid
              className={classes.tabsWrap}
              container
              alignContent="center"
              justify="center"
            >
              <Grid item>
                <TabToggleButtonGroup
                  exclusive
                  value={publishTypeSelected}
                  onChange={handlePublishTypeSelectedChanges}
                >
                  <TabToggleButton value="contents">
                    {t('Add Content')}
                  </TabToggleButton>
                  <TabToggleButton value="devices">
                    {t('Select Devices')}
                  </TabToggleButton>
                </TabToggleButtonGroup>
              </Grid>
            </Grid>

            <Card
              icon={false}
              grayHeader={true}
              shadow={false}
              radius={false}
              removeSidePaddings={true}
              headerSidePaddings={true}
              removeNegativeHeaderSideMargins={true}
              title={t(title).toUpperCase()}
              headerClasses={[classes.header]}
              headerTextClasses={[classes.headerText]}
              rootClassName={classes.contentsCardRoot}
            >
              {contents && (
                <Contents
                  media={pageMediaContent}
                  getMediaItem={getMediaItem}
                  type={selectedType}
                  handleTypeChange={setSelectedType}
                  handlePageChange={setPage}
                  handleValueChange={form.setFieldValue}
                  page={page}
                  values={values}
                  loading={isLoading}
                  errors={errors}
                  touched={touched}
                />
              )}

              {devices && (
                <Devices
                  values={values}
                  selectedDevices={selectedDevices}
                  onSelectedChange={handleSelectedDevicesChange}
                />
              )}
            </Card>
          </Grid>
          <Grid item xs={4} className={classes.mediaInfoWrap}>
            <Grid
              container
              direction="column"
              wrap="nowrap"
              className={classes.mediaInfoContainer}
            >
              <Grid item className={classes.scheduleInfoWrap}>
                <ScheduleInfo
                  selectedDevices={selectedDevices}
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleValueChange={form.setFieldValue}
                />
              </Grid>
              <Grid item>
                <Actions
                  onSave={form.handleSubmit}
                  onSaveAndCreate={() => {
                    setClear(true)
                    form.handleSubmit()
                  }}
                  edit={edit}
                  onCancel={handleClose}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Dialog
          open={openErrorDialog}
          onClose={() => {
            setErrorDialog(false)
            dispatchAction(clearScheduleError())
          }}
        >
          <ErrorDialog />
        </Dialog>
      </SideModal>
      <ScreenPreviewModal />
    </>
  )
}

SchedulePublish.propTypes = {
  classes: PropTypes.object.isRequired,
  edit: PropTypes.bool
}

export default compose(
  translate('translations'),
  withSnackbar,
  withStyles(styles),
  withRouter
)(SchedulePublish)
