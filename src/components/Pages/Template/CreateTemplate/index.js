import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { translate } from 'react-i18next'
import { get as _get, isEqual as _isEqual } from 'lodash'

import { bindActionCreators, compose } from 'redux'

import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'

import {
  withStyles,
  Grid,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Button,
  DialogActions
} from '@material-ui/core'

import SideModal from 'components/Modal/SideModal'
import { WhiteButton } from 'components/Buttons'

import TemplateContainer from './TemplateContainer'
import SettingsSide from './SettingsSide'
import BottomActions from './BottomActions'
import SaveTemplateDialog from './SaveTemplateDialog'

import selectUtils from 'utils/select'
import { labelToSec, secToLabel } from 'utils/secToLabel'

import {
  clearTemplateItem,
  editTemplate,
  getTemplate,
  getTemplateItemsAction,
  postTemplate
} from 'actions/templateActions'
import { hex2rgba } from '../../DesignGallery/utils'
import { withRouter } from 'react-router-dom'

import {
  addTemplateItem,
  resetTemplatePage,
  setMultiplier,
  updateTemplateContainer,
  zoomInTemplateContainer,
  zoomOutTemplateContainer
} from 'actions/createTemplateActions'

import { calculateMultiplier } from 'utils/createTemplate'

const styles = theme => {
  const { palette, type } = theme
  return {
    sideModalHeader: {
      paddingTop: '17px',
      paddingBottom: '12px',
      borderBottom: `1px solid ${palette[type].pages.createTemplate.border}`
    },
    createTemplateContainer: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    mainActionsContainer: {
      width: '100%',
      display: 'flex',
      height: 'calc(100% - 82px)'
    },
    templateContainerRoot: {
      width: 'calc(100% - 271px)',
      maxWidth: 'calc(100% - 271px)'
    },
    settingsRoot: {
      width: 271,
      minWidth: 271
    },
    bottomActionsRoot: {
      width: '100%',
      minWidth: '100%',
      height: '82px'
    },
    modalWrapClassName: {
      position: 'relative'
    }
  }
}

class CreateTemplate extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    items: PropTypes.object.isRequired,
    currentItemId: PropTypes.number,
    container: PropTypes.object,
    renderMultiplier: PropTypes.number,
    selectedItems: PropTypes.array
  }

  constructor(props) {
    super(props)

    this.state = {
      isSaveDialog: false,
      error: {
        isError: false,
        message: 'Please, add any new Zone on canvas.'
      },
      defaultValues: {
        title: '',
        group: [],
        tag: []
      }
    }
  }

  componentDidMount() {
    if (_get(this.props.match, 'params.id')) {
      this.props.getTemplate(this.props.match.params.id)
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      !_isEqual(this.props.templateItem.status, prevProps.templateItem.status)
    ) {
      if (this.props.templateItem.status === 'successfully') {
        if (this.props.match.params.id) {
          this.showSnackbar('Template edited')
        } else this.showSnackbar('Template added')
      }
      if (this.props.templateItem.status === 'error') {
        this.showSnackbar(this.props.templateItem.error.message)
      }
    }

    if (
      this.props.templateItem.response &&
      !_isEqual(
        this.props.templateItem.response,
        prevProps.templateItem.response
      ) &&
      this.props.templateItem.response.id
    ) {
      const convertedTemplate = this.convertTemplate(
        this.props.templateItem.response
      )
      this.props.updateTemplateContainer({ ...convertedTemplate })
      this.props.templateItem.response.zone.forEach(item => {
        const {
          top,
          left,
          width,
          height,
          title,
          name,
          opacity,
          playbackContent = {},
          touchSettingJson: touch = {},
          zoneSettingJson: zoneSetting = {}
        } = item

        this.props.addTemplateItem({
          featureTitle: title ? title : name,
          size: { width, height },
          position: { x: left, y: top },
          playbackContent,
          zoneSetting,
          touch,
          ...(_get(playbackContent, 'feature') && {
            featureId: playbackContent.feature.id,
            type: playbackContent.feature.name,
            icon: playbackContent.feature.icon
          }),
          ...(!!zoneSetting && {
            styles: {
              isTouchZone: zoneSetting.is_touch_zone,
              opacity: opacity,
              borderColor: zoneSetting.zone_border_color,
              borderWidth: zoneSetting.zone_border_width,
              borderBottomLeftRadius:
                zoneSetting.zone_bottom_left_border_radius,
              borderBottomRightRadius:
                zoneSetting.zone_bottom_right_border_radius,
              borderTopLeftRadius: zoneSetting.zone_top_left_border_radius,
              borderTopRightRadius: zoneSetting.zone_top_right_border_radius
            }
          })
        })
      })
      this.setTemplateDefaultValues()
      this.countMultiplier(this.props.templateItem.response)

      //to resume zoom and fit content
      this.props.zoomInTemplateContainer()
      this.props.zoomOutTemplateContainer()
    }
  }

  componentWillUnmount() {
    this.props.getTemplateItemsAction({
      page: 1,
      limit: 10
    })
    this.props.clearTemplateItem()
    this.props.resetTemplatePage()
  }

  countMultiplier = template => {
    const size = { width: template.width, height: template.height }
    const videoWallMatrix = template.videoWallMatrix || '1x1'
    const videoWall = {
      active: template.isVideoWall,
      props: {
        x: +videoWallMatrix.split('x')[0],
        y: +videoWallMatrix.split('x')[1]
      }
    }
    const orientation = template.orientation

    const multiplier = calculateMultiplier(size, videoWall, orientation)

    this.props.setMultiplier(multiplier)
  }

  convertTemplate = template => ({
    size: { width: template.width, height: template.height },
    orientation: template.orientation,

    background: template.backgroundColor,
    pattern: template.backgroundPattern,
    patternOpacity: 1,
    ...(template.videoWallMatrix && {
      videoWall: {
        active: template.isVideoWall,
        props: {
          x: +template.videoWallMatrix.split('x')[0],
          y: +template.videoWallMatrix.split('x')[1]
        }
      }
    })
  })

  showSnackbar = title => {
    const { enqueueSnackbar, closeSnackbar, t } = this.props
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

  setTemplateDefaultValues = () => {
    if (this.props.templateItem.response) {
      this.setState({
        defaultValues: {
          title: this.props.templateItem.response.title,
          tag: selectUtils.convertArr(
            this.props.templateItem.response.tag,
            selectUtils.toChipObj
          ),
          group: selectUtils.convertArr(
            this.props.templateItem.response.group,
            selectUtils.toChipObj
          )
        }
      })
    }
  }

  prepareTemplateData = templateData => {
    const {
      container: {
        orientation,
        background: backgroundColor,
        pattern: backgroundPattern,
        size: { width, height },
        videoWall: { active: isVideoWall, props: videoWallMatrix }
      },
      items
    } = this.props

    if (!items[Object.keys(items)[0]].media.id) {
      this.setState({
        error: {
          isError: true,
          message: 'Please, select any media for Zone.'
        }
      })
      return undefined
    }

    const { group, tag, title } = templateData

    const totalDuration = Object.keys(items)
      .map(key =>
        labelToSec(
          items[key].media.duration ? items[key].media.duration : '00:00:00'
        )
      )
      .reduce((a, b) => a + b, 0)

    const data = {
      title,
      isInteractive: Object.keys(items).some(
        key => items[key].styles.isTouchZone === true
      ),
      zone: Object.keys(items).map(key => ({
        name: items[key].title,
        playbackContent: 'Media',
        playbackContentId: items[key].media.id,
        duration: items[key].media.duration
          ? items[key].media.duration
          : '00:00:00',
        height: items[key].size.height,
        width: items[key].size.width,
        top: items[key].position.y,
        left: items[key].position.x,
        positionOrder: items[key].order,
        zoneNo: items[key].order,
        opacity: items[key].styles.opacity,
        //TODO: fix when BE will be ready
        zoneSettingJson: {
          is_touch_zone: items[key].styles.isTouchZone,
          // is_zone_background_color: 0
          // is_zoom_to_fit: 0
          // zone_background_color: null
          zone_border_color: items[key].styles.borderColor,
          zone_border_style: 'solid',
          zone_border_width: items[key].styles.borderWidth,
          zone_bottom_left_border_radius:
            items[key].styles.borderBottomLeftRadius,
          zone_bottom_right_border_radius:
            items[key].styles.borderBottomRightRadius,
          zone_top_left_border_radius: items[key].styles.borderTopLeftRadius,
          zone_top_right_border_radius: items[key].styles.borderTopRightRadius,
          ...items[key].zoneSettings
        },
        touchSettingJson: {
          playback_content_location: items[key].touch.windowLocation,
          playback_content_id: items[key].touch.id,
          playback_reset_duration: labelToSec(
            items[key].touch.duration ? items[key].touch.duration : '00:00:00'
          ),
          ...items[key].touch
        }
      })),
      orientation,
      duration: secToLabel(totalDuration),
      height,
      width,
      backgroundColor: backgroundColor.includes('#')
        ? hex2rgba(backgroundColor)
        : backgroundColor,
      backgroundPattern,
      backgroundImageSetting: {},
      videoWallMatrix: videoWallMatrix
        ? `${videoWallMatrix.x}x${videoWallMatrix.y}`
        : '',
      isVideoWall,
      ...(!!group.length && {
        group: selectUtils.convertArr(group, selectUtils.fromChipObj)
      }),
      ...(!!tag.length && {
        tag: selectUtils.convertArr(tag, selectUtils.fromChipObj)
      })
    }

    return data
  }

  toggleSaveDialog = value => {
    if (value && !Object.keys(this.props.items).length) {
      this.setState({
        error: {
          isError: true,
          message: 'Please, add any new Zone on canvas.'
        }
      })
      return
    }
    this.setState({
      isSaveDialog: value
    })
  }

  handleSave = (info, isCreate = false) => {
    const templateData = this.prepareTemplateData(info)

    this.toggleSaveDialog(false)
    if (!templateData) return

    if (_get(this.props.match, 'params.id')) {
      this.props.editTemplate({
        id: _get(this.props.match, 'params.id'),
        data: templateData
      })
    } else {
      this.props.postTemplate(templateData)
    }

    if (isCreate) {
      this.props.resetTemplatePage()

      this.setState({
        defaultValues: {
          title: '',
          tag: [],
          group: []
        }
      })

      _get(this.props.match, 'params.id') &&
        this.props.history.push('/template-library/list/create-template')
    }
  }

  handleClose = () => {
    this.props.history.push('/template-library/list')
  }

  render() {
    const {
      t,
      classes,
      container,
      items,
      currentItemId,
      renderMultiplier,
      selectedItems
    } = this.props

    const itemsCount = Object.keys(items).length
    const currentItem = items[currentItemId]
    const multipleSelected = !!selectedItems.length

    return (
      <SideModal
        width="100%"
        animated={false}
        title={t('Create Template')}
        closeLink="/template-library/list"
        headerClassName={classes.sideModalHeader}
        leftBorderRadius
        wrapClassName={classes.modalWrapClassName}
      >
        <Grid container className={classes.createTemplateContainer}>
          <Grid className={classes.mainActionsContainer}>
            <TemplateContainer
              container={container}
              items={items}
              currentItem={currentItem}
              rootClass={classes.templateContainerRoot}
              multiplier={renderMultiplier}
              currentItemId={currentItemId}
              selectedItems={selectedItems}
              multipleSelected={multipleSelected}
            />
            <SettingsSide
              currentItem={currentItem}
              rootClass={classes.settingsRoot}
              container={container}
              itemsCount={itemsCount}
              multipleSelected={multipleSelected}
            />
          </Grid>

          {/*Template page actions*/}
          <BottomActions
            rootClass={classes.bottomActionsRoot}
            onSave={() => this.toggleSaveDialog(true)}
            onCancel={this.handleClose}
          />

          {/*Save dialog*/}
          <SaveTemplateDialog
            values={this.state.defaultValues}
            open={this.state.isSaveDialog}
            onSave={this.handleSave}
            onSaveAndCreate={val => this.handleSave(val, true)}
            onClose={() => this.toggleSaveDialog(false)}
          />

          {/*Error dialog*/}
          <Dialog
            open={this.state.error.isError}
            onClose={() =>
              this.setState({ error: { ...this.state.error, isError: false } })
            }
          >
            <DialogTitle>Add new Zone</DialogTitle>
            <DialogContent>
              <Typography>{this.state.error.message}</Typography>
            </DialogContent>
            <DialogActions className={classes.actionBar}>
              <WhiteButton
                classes={{ root: classes.button }}
                onClick={() =>
                  this.setState({
                    error: { ...this.state.error, isError: false }
                  })
                }
              >
                Ok
              </WhiteButton>
            </DialogActions>
          </Dialog>
        </Grid>
      </SideModal>
    )
  }
}

const mapStateToPops = ({ createTemplate, template }) => ({
  ...createTemplate,
  templateItem: template.templateItem
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      postTemplate,
      getTemplate,
      editTemplate,
      clearTemplateItem,
      updateTemplateContainer,
      addTemplateItem,
      resetTemplatePage,
      getTemplateItemsAction,
      setMultiplier,
      zoomInTemplateContainer,
      zoomOutTemplateContainer
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  connect(mapStateToPops, mapDispatchToProps),
  withRouter,
  withSnackbar
)(CreateTemplate)
