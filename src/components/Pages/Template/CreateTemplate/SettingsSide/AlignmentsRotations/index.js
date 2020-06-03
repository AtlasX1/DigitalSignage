import React, { useMemo } from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isEmpty } from 'lodash'

import { Grid, withStyles } from '@material-ui/core'

import ExpansionPanel from '../ExpansionPanel'
import Item from './Item'
import { FormControlInput } from 'components/Form'

import {
  updateCurrentTemplateItem,
  setCurrentTemplateItemAlignment,
  setCurrentTemplateItemRotation,
  flipCurrentTemplateItem
} from 'actions/createTemplateActions'

import { createTemplateConstants } from 'constants/index'

const styles = ({ palette, type, formControls }) => {
  return {
    expandedContainer: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      paddingBottom: '10px'
    },
    row: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    },
    icon: {
      width: '20px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      color:
        palette[type].pages.createTemplate.settings.expansion.body.icon.color
    },
    reversed: {
      transform: 'rotate(180deg)'
    },
    rotated: {
      transform: 'rotate(90deg)'
    },
    formControlRootClass: {
      width: '50px',
      height: '28px',
      marginBottom: '0'
    },
    formControlInputRootClass: {
      height: '100%',
      '& > span': {
        width: '50px !important'
      }
    },
    formControlInputClass: {
      ...formControls.mediaApps.numericInput.input,
      textAlign: 'right',
      padding: '0 0 0 5px'
    },
    inputItemWrapper: {
      paddingRight: '5px',
      minWidth: '16.65%'
    },
    inputItemWrapperIcon: {
      minWidth: '16.65%'
    }
  }
}

const AlignmentRotation = ({
  t,
  classes,
  styles = {},
  locked,
  setCurrentTemplateItemAlignment,
  setCurrentTemplateItemRotation,
  flipCurrentTemplateItem,
  updateCurrentTemplateItem,
  isExpanded,
  onExpanded
}) => {
  const iconButtons = useMemo(
    () => [
      {
        label: t('Left'),
        value: createTemplateConstants.LEFT,
        icon: 'icon-move-left-1'
      },
      {
        label: t('Bottom'),
        value: createTemplateConstants.BOTTOM,
        icon: 'icon-move-down-1'
      },
      {
        label: t('Top'),
        value: createTemplateConstants.TOP,
        icon: 'icon-move-up-1'
      },
      {
        label: t('Right'),
        value: createTemplateConstants.RIGHT,
        icon: 'icon-move-right-1'
      },
      {
        label: t('V STR'),
        value: createTemplateConstants.V_STRETCH,
        icon: 'icon-expand-vertical-4'
      },
      {
        label: t('H STR'),
        value: createTemplateConstants.H_STRETCH,
        icon: 'icon-expand-horizontal-4'
      },
      {
        label: t('Rotate Left'),
        value: createTemplateConstants.L_ROTATE,
        icon: 'icon-text-undo'
      },
      {
        label: t('Rotate Right'),
        value: createTemplateConstants.R_ROTATE,
        icon: 'icon-text-redo'
      },
      {
        label: t('Flip Vertical'),
        value: createTemplateConstants.V_FLIP,
        icon: 'icon-shrink-vertical-3'
      },
      {
        label: t('Flip Horizontal'),
        value: createTemplateConstants.H_FLIP,
        icon: 'icon-shrink-horizontal-3'
      }
    ],
    [t]
  )

  const handleClick = action => {
    if (locked) return

    if (
      [
        createTemplateConstants.LEFT,
        createTemplateConstants.RIGHT,
        createTemplateConstants.TOP,
        createTemplateConstants.BOTTOM,
        createTemplateConstants.V_STRETCH,
        createTemplateConstants.H_STRETCH
      ].includes(action)
    ) {
      setCurrentTemplateItemAlignment(action)
    } else if (
      [
        createTemplateConstants.R_ROTATE,
        createTemplateConstants.L_ROTATE
      ].includes(action)
    ) {
      setCurrentTemplateItemRotation(action)
    } else if (
      [createTemplateConstants.V_FLIP, createTemplateConstants.H_FLIP].slice(
        action
      )
    ) {
      flipCurrentTemplateItem(action)
    }
  }

  const handleRotateInputChange = value => {
    updateCurrentTemplateItem(createTemplateConstants.STYLES, {
      rotate: value
    })
  }

  return (
    <ExpansionPanel
      isExpanded={isExpanded}
      onChange={onExpanded}
      expanded={false}
      title={t('Alignments & Rotations')}
      children={
        <Grid item className={classes.expandedContainer}>
          <Grid item className={classes.row}>
            {iconButtons.map((button, index) => (
              <Item
                key={`alignment-rotations-button-${index}`}
                wrapperClass={classes.inputItemWrapperIcon}
                label={button.label}
                children={
                  <div className={classes.icon}>
                    <i className={button.icon} />
                  </div>
                }
                handleClick={() => handleClick(button.value)}
                disabled={locked || isEmpty(styles)}
              />
            ))}
            <Item
              label={t('Rotate Angle')}
              disabled={locked || isEmpty(styles)}
              highlight={false}
              children={
                <FormControlInput
                  disabled={locked || isEmpty(styles)}
                  custom
                  type="number"
                  min={0}
                  max={359}
                  value={styles.rotate}
                  formControlRootClass={classes.formControlRootClass}
                  formControlInputRootClass={classes.formControlInputRootClass}
                  formControlNumericInputRootClass={
                    classes.formControlInputRootClass
                  }
                  formControlInputClass={classes.formControlInputClass}
                  handleChange={handleRotateInputChange}
                />
              }
              wrapperClass={classes.inputItemWrapper}
            />
          </Grid>
        </Grid>
      }
    />
  )
}

AlignmentRotation.propTypes = {
  classes: PropTypes.object.isRequired,
  styles: PropTypes.object,
  locked: PropTypes.bool
}

const mapDispatchToValues = dispatch =>
  bindActionCreators(
    {
      updateCurrentTemplateItem,
      setCurrentTemplateItemAlignment,
      setCurrentTemplateItemRotation,
      flipCurrentTemplateItem
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(connect(null, mapDispatchToValues)(AlignmentRotation))
)
