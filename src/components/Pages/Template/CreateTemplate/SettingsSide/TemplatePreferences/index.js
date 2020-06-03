import React, { useState, useEffect, Fragment } from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { has } from 'lodash'
import classNames from 'classnames'
import { Grid, withStyles, Typography, Dialog } from '@material-ui/core'
import update from 'immutability-helper'

import { FormControlInput } from 'components/Form'
import ExpansionPanel from '../ExpansionPanel'
import { BlueButton, WhiteButton } from 'components/Buttons'
import { CheckboxSwitcher } from 'components/Checkboxes'

import {
  updateTemplateContainer,
  setTemplateContainerOrientation,
  setTemplateContainerSize,
  setTemplateContainerVideoWall,
  deleteTemplateItems
} from 'actions/createTemplateActions'
import FormControlReactSelect from '../../../../../Form/FormControlReactSelect'

const styles = theme => {
  const { palette, type } = theme
  return {
    expandedContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '10px'
    },
    item: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      borderBottom: `1px solid ${palette[type].pages.createTemplate.border}`,
      '&:last-child': {
        borderBottom: '0'
      }
    },
    formControlRootClass: {
      height: '28px',
      marginBottom: '0'
    },
    formControlInputClass: {
      textAlign: 'right',
      width: '100%',
      height: '28px',
      padding: '0',
      fontSize: '12px !important',
      color:
        palette[type].pages.createTemplate.settings.expansion.body.formControl
          .color,
      border: '1px solid #ced4da !important',
      borderRadius: '3px !important',
      paddingRight: '22px !important'
    },
    selectInput: {
      width: '137px',
      height: '28px',
      padding: '0 12px',
      lineHeight: '28px',
      color:
        palette[type].pages.createTemplate.settings.expansion.body.formControl
          .color,
      fontSize: 12
    },
    selectLabel: {
      fontWeight: '500',
      color:
        palette[type].pages.createTemplate.settings.expansion.body.formControl
          .color,
      fontSize: 12
    },
    modalContainer: {
      width: 400,
      padding: 15
    },
    modalText: {
      fontSize: 14,
      marginTop: 10,
      marginBottom: 10,
      color: '#4c5057'
    },
    modalButton: {
      marginRight: 10,

      '&:last-child': {
        marginRight: 0
      }
    },
    switcherContainer: {
      width: '100%'
    },
    switcherRoot: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between'
    },
    switcherLabel: {
      fontSize: '12px',
      color:
        palette[type].pages.createTemplate.settings.expansion.body.formControl
          .color
    },
    switcherItem: {
      padding: '0 16px'
    },
    switchRoot: {
      transform: 'translateX(20px)'
    },
    selectContainerClass: {
      width: 150,
      '& > div': {
        '& > div': {
          '& > div': {
            minHeight: '26px !important',
            height: 26,
            '& div': {
              height: 16,
              fontSize: '12px !important'
            }
          }
        }
      }
    }
  }
}

const TemplatePreferences = ({
  t,
  classes,
  container = {},
  itemsCount,
  isExpanded,
  onExpanded,
  ...props
}) => {
  const [modal, setModal] = useState(false)
  const [actionField, setActionField] = useState(null)
  const [actionValue, setActionValue] = useState(null)

  const [fields, setFields] = useState([
    {
      name: 'orientation',
      label: t('Orientation'),
      value: container.orientation,
      options: [
        { value: 'portrait', label: t('Portrait') },
        { value: 'landscape', label: t('Landscape') }
      ]
    },
    {
      name: 'resolution',
      label: t('Display Size'),
      value: `${container.size.width}x${container.size.height}`,
      options: [
        { value: '1920x1080', label: '1920 X 1080' },
        { value: '1360x768', label: '1360 X 768' },
        { value: '1280x768', label: '1280 X 768' },
        { value: '1280x728', label: '1280 X 728' },
        { value: '1280x720', label: '1280 X 720' },
        { value: '1088x612', label: '1088 X 612' },
        { value: '1024x768', label: '1024 X 768' },
        { value: '960x600', label: '960 X 600' },
        { value: '800x600', label: '800 X 600' },
        { value: '700x450', label: '700 X 450' },
        { value: 'custom', label: 'Custom' }
      ]
    },
    {
      name: 'showGrid',
      label: t('Show Grid'),
      value: `${container.showGrid}`
    },
    {
      name: 'video',
      label: t('Video Wall'),
      value: container.videoWall.active
        ? `${container.videoWall.props.y}x${container.videoWall.props.x}`
        : 'none',
      options: [
        { value: 'none', label: 'None' },
        { value: '1x1', label: '1 X 1' },
        { value: '1x2', label: '1 X 2' },
        { value: '2x1', label: '2 X 1' },
        { value: '2x2', label: '2 X 2' },
        { value: '1x3', label: '1 X 3' },
        { value: '3x1', label: '3 X 1' },
        { value: '1x4', label: '1 X 4' },
        { value: '4x1', label: '4 X 1' },
        { value: '1x6', label: '1 X 6' },
        { value: '6x1', label: '6 X 1' },
        { value: '2x3', label: '2 X 3' },
        { value: '3x2', label: '3 X 2' },
        { value: '1x8', label: '1 X 8' },
        { value: '8x1', label: '8 X 1' },
        { value: '2x4', label: '2 X 4' },
        { value: '4x2', label: '4 X 2' }
      ]
    }
  ])

  const onChangeHandler = (field, e, skipChecking) => {
    const value = has(e, 'target') ? e.target.value : e

    if (!skipChecking) {
      if (['orientation', 'resolution', 'video'].includes(field)) {
        if (itemsCount) {
          setActionField(field)
          setActionValue(value)
          return setModal(true)
        }
      }
    }

    switch (field) {
      case 'orientation':
        props.setTemplateContainerOrientation(value)
        break
      case 'resolution':
        const rect = {
          width: 0,
          height: 0
        }

        if (value === 'custom') {
          const item = fields.find(i => i.name === field)
          const index = fields.indexOf(item)
          setFields(
            update(fields, {
              [index]: {
                value: { $set: 'custom' }
              }
            })
          )
          return
        }

        const size = value.split('x').map(v => +v)

        rect.width = size[0]
        rect.height = size[1]

        props.setTemplateContainerSize(rect)
        break
      case 'showGrid':
        if (!value) {
          props.updateTemplateContainer({ showGrid: value, snapToGrid: value })
        } else props.updateTemplateContainer({ showGrid: value })
        break
      case 'snapToGrid':
        props.updateTemplateContainer({ snapToGrid: value })
        break
      case 'width':
        props.setTemplateContainerSize({
          width: value,
          height: container.size.height
        })
        break
      case 'height':
        props.setTemplateContainerSize({
          width: container.size.width,
          height: value
        })
        break
      case 'video':
        let videoWall = {
          active: false,
          props: { x: 0, y: 0 }
        }

        if (value === 'none') {
          videoWall.active = false
        } else {
          const [y, x] = value.split('x').map(v => +v)

          videoWall.active = true
          videoWall.props.x = x
          videoWall.props.y = y
        }

        props.setTemplateContainerVideoWall(videoWall)
        break
      default:
        return
    }
  }

  const onModalContinueClickHandler = () => {
    props.deleteTemplateItems()
    onChangeHandler(actionField, actionValue, true)
    setModal(false)
  }

  useEffect(
    () => {
      const resolutionValue = fields[1].options.find(
        i => i.value === `${container.size.width}x${container.size.height}`
      )

      setFields(
        update(fields, {
          0: { value: { $set: container.orientation } }, // to watch orientation
          1: {
            value: {
              $set: !!resolutionValue
                ? `${container.size.width}x${container.size.height}`
                : 'custom'
            }
          }, // to watch resolutions
          3: {
            value: {
              $set: container.videoWall.active
                ? `${container.videoWall.props.y}x${container.videoWall.props.x}`
                : 'none'
            }
          } // to watch video wall
        })
      )
    },
    // eslint-disable-next-line
    [container]
  )

  return (
    <Fragment>
      <ExpansionPanel
        isExpanded={isExpanded}
        onChange={onExpanded}
        expanded={false}
        title={t('Preferences')}
        children={
          <Grid item className={classes.expandedContainer}>
            {fields.map((field, index) => (
              <React.Fragment key={`template-preferences-field-${index}`}>
                {field.name === 'resolution' && (
                  <>
                    <Grid item className={classes.item}>
                      <Typography className={classes.selectLabel}>
                        {field.label}
                      </Typography>
                      <FormControlReactSelect
                        value={field.value}
                        formControlContainerClass={classes.selectContainerClass}
                        marginBottom={0}
                        options={field.options}
                        onChange={e => onChangeHandler(field.name, e)}
                      />
                    </Grid>
                    {fields[1].value === 'custom' && (
                      <>
                        <Grid item className={classes.item}>
                          <Typography className={classes.selectLabel}>
                            Width
                          </Typography>
                          <FormControlInput
                            type="number"
                            value={container.size.width}
                            formControlRootClass={classes.formControlRootClass}
                            formControlInputClass={
                              classes.formControlInputClass
                            }
                            handleChange={val => onChangeHandler('width', val)}
                            custom
                          />
                        </Grid>
                        <Grid item className={classes.item}>
                          <Typography className={classes.selectLabel}>
                            Height
                          </Typography>
                          <FormControlInput
                            type="number"
                            value={container.size.height}
                            formControlRootClass={classes.formControlRootClass}
                            formControlInputClass={
                              classes.formControlInputClass
                            }
                            handleChange={val => onChangeHandler('height', val)}
                            custom
                          />
                        </Grid>
                      </>
                    )}
                  </>
                )}
                {field.name !== 'showGrid' &&
                  field.name !== 'snapToGrid' &&
                  field.name !== 'resolution' && (
                    <Grid item className={classes.item}>
                      <Typography className={classes.selectLabel}>
                        {field.label}
                      </Typography>
                      <FormControlReactSelect
                        value={field.value}
                        formControlContainerClass={classes.selectContainerClass}
                        marginBottom={0}
                        options={field.options}
                        onChange={e => onChangeHandler(field.name, e)}
                      />
                    </Grid>
                  )}
                {field.name === 'showGrid' && (
                  <Grid
                    item
                    className={classNames(classes.item, classes.switcherItem)}
                  >
                    <Grid container>
                      <Grid item xs={12}>
                        <CheckboxSwitcher
                          label={field.label}
                          switchContainerClass={classes.switcherContainer}
                          formControlRootClass={classes.switcherRoot}
                          formControlLabelClass={classes.switcherLabel}
                          switchRootClass={classes.switchRoot}
                          value={container.showGrid}
                          handleChange={e => onChangeHandler(field.name, e)}
                        />
                      </Grid>

                      {container.showGrid && (
                        <Grid item xs={12}>
                          <CheckboxSwitcher
                            label={t('Snap to Grid')}
                            switchContainerClass={classes.switcherContainer}
                            formControlRootClass={classes.switcherRoot}
                            formControlLabelClass={classes.switcherLabel}
                            switchRootClass={classes.switchRoot}
                            value={container.snapToGrid}
                            handleChange={e => onChangeHandler('snapToGrid', e)}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                )}
              </React.Fragment>
            ))}
          </Grid>
        }
      />
      <Dialog open={modal} onClose={() => setModal(false)} disableBackdropClick>
        <Grid container className={classes.modalContainer}>
          <Typography variant="h6">
            {t('Changing template preferences')}
          </Typography>
          <Typography className={classes.modalText}>
            {t('All items will be removed when you click "Continue"')}
          </Typography>
          <Grid item container justify="flex-end">
            <WhiteButton
              className={classes.modalButton}
              onClick={() => setModal(false)}
            >
              {t('Cancel')}
            </WhiteButton>
            <BlueButton
              className={classes.modalButton}
              onClick={onModalContinueClickHandler}
            >
              {t('Continue')}
            </BlueButton>
          </Grid>
        </Grid>
      </Dialog>
    </Fragment>
  )
}

TemplatePreferences.propTypes = {
  classes: PropTypes.object.isRequired,
  container: PropTypes.object,
  itemsCount: PropTypes.number
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateTemplateContainer,
      setTemplateContainerOrientation,
      setTemplateContainerSize,
      setTemplateContainerVideoWall,
      deleteTemplateItems
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(connect(null, mapDispatchToProps)(TemplatePreferences))
)
