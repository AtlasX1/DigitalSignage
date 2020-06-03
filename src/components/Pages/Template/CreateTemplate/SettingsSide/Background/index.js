import React, { useState, useMemo } from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Dropzone from 'react-dropzone'
import { has } from 'lodash'

import { Grid, withStyles, Typography } from '@material-ui/core'

import ExpansionPanel from '../ExpansionPanel'
import {
  SliderInputRange,
  FormControlSketchColorPicker,
  FormControlSelect
} from 'components/Form'

import {
  updateCurrentTemplateItem,
  updateTemplateContainer
} from 'actions/createTemplateActions'
import { createTemplateConstants } from 'constants/index'
import { shadeColor } from 'utils'

const styles = ({ palette, type }) => {
  return {
    expandedContainer: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      paddingBottom: '10px'
    },
    itemContainer: {
      width: '100%',
      height: '45px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 10px 0 19px'
    },
    label: {
      fontSize: 12,
      marginRight: '20px',
      color:
        palette[type].pages.createTemplate.settings.expansion.body.formControl
          .color
    },
    sliderRoot: {
      display: 'flex',
      justifyContent: 'space-between',
      height: '28px',
      alignItems: 'center'
    },
    sliderRootSmall: {
      width: 115
    },
    sliderInputContainer: {
      transform: 'translateX(-15px)',
      maxWidth: 55,
      height: 28
    },
    sliderInputContainerNT: {
      maxWidth: 55,
      height: 28
    },
    sliderInputRoot: {
      width: '100%',
      height: '100%',
      margin: '0'
    },
    sliderInputRootMoved: {
      position: 'relative',
      left: '5px'
    },
    sliderInputRangeContainer: {
      maxWidth: '100px',
      width: 'calc(100% - 75px)',
      '& > div': {
        width: '100% !important'
      }
    },
    sliderLabel: {
      width: '20px',
      height: '21px',
      lineHeight: '21px',
      fontStyle: 'normal'
    },
    colorPickerRoot: {
      width: '112px',
      height: '28px',
      marginBottom: '0',
      transform: 'translateX(-11px)',
      zIndex: 2
    },
    colorPickerInputRoot: {
      height: '28px',
      '&:after': {
        content: '""',
        height: '100%',
        width: '1px',
        background: '#ced4da',
        right: '41px',
        position: 'absolute'
      }
    },
    colorPickerInput: {
      paddingLeft: '5px !important',
      height: '28px !important',
      fontSize: '12px !important'
    },
    colorPickerWrap: {
      zIndex: '1',
      right: '0',
      left: 'auto'
    },
    imageTabContainer: {
      paddingLeft: 15,
      paddingRight: 15
    },
    imageTabThumbnailContainer: {
      width: 58,
      height: 58,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#979797'
    },
    imageTabThumbnail: {
      width: '100%'
    },
    imageTabControlsContainer: {
      maxWidth: 100
    },
    imageTabControl: {
      height: 22,
      marginBottom: 0
    },
    imageTabInput: {
      height: 22,
      paddingTop: 0,
      paddingBottom: 0,
      fontSize: 10,
      color: '#74809A'
    },
    imageTabSelectImageButtonContainer: {
      height: 22,
      border: 1,
      marginBottom: 10,
      borderRadius: 2,
      borderStyle: 'solid',
      borderColor: '#d8deea',
      background: '#f3f5f7',
      overflow: 'hidden',
      cursor: 'pointer'
    },
    imageTabSelectImageButtonLabel: {
      color: '#74809a',
      fontSize: 10,
      maxWidth: 'calc(100% - 20px)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    patternTabContainer: {
      paddingLeft: 15,
      paddingRight: 15
    },
    patternTabControlContainer: {
      marginTop: 10
    },
    patternTabControlLabel: {
      color: '#74809a',
      fontSize: 10
    },
    patternTabInput: {
      width: 100,
      height: 22,
      paddingTop: 0,
      paddingBottom: 0,
      fontSize: 10,
      color: '#74809A'
    }
  }
}

const images = {
  thumbnail: require('../../../../../../common/assets/images/image-thumbnail.png')
}

const Background = ({
  t,
  classes,
  styles = {},
  container = {},
  locked,
  theme,
  isExpanded,
  onExpanded,
  ...props
}) => {
  const [image, setImage] = useState('')

  const inputRangeSliderStyles = useMemo(
    () => ({
      width: '100%',
      height: '28px',
      textAlign: 'right',
      fontSize: '12px',
      paddingRight: '3px',
      color:
        theme &&
        theme.palette[theme.type].pages.createTemplate.settings.expansion.body
          .formControl.color,
      background:
        theme && theme.palette[theme.type].formControls.input.background
    }),
    [theme]
  )

  const handleOpacityChange = value => {
    props.updateCurrentTemplateItem(createTemplateConstants.STYLES, {
      opacity: value / 100
    })
  }

  const handleBackgroundChange = color => {
    props.updateTemplateContainer({ background: color })
  }

  const handlePatternChange = pattern => {
    props.updateTemplateContainer({ pattern })
  }

  const handlePatternOpacityChange = value => {
    props.updateTemplateContainer({ patternOpacity: value / 100 })
  }

  const SelectImageButton = (
    <Dropzone onDrop={images => setImage(images[0].name)}>
      {({ getRootProps, getInputProps }) => (
        <Grid
          container
          justify="center"
          alignItems="center"
          {...getRootProps()}
          className={classes.imageTabSelectImageButtonContainer}
        >
          <input {...getInputProps()} />
          <Typography className={classes.imageTabSelectImageButtonLabel}>
            {image || t('Choose Image')}
          </Typography>
        </Grid>
      )}
    </Dropzone>
  )

  const ImageTab = (
    <Grid
      container
      className={classes.imageTabContainer}
      justify="space-between"
    >
      <Grid item className={classes.imageTabThumbnailContainer}>
        <img
          src={images.thumbnail}
          alt="thumbnail"
          className={classes.imageTabThumbnail}
        />
      </Grid>
      <Grid
        item
        container
        direction="column"
        className={classes.imageTabControlsContainer}
      >
        {SelectImageButton}
        <FormControlSelect
          value={''}
          options={[
            { value: '', label: t('Fill') },
            { value: 'original', label: t('Original') },
            { value: 'fit', label: t('Fit to screen') }
          ]}
          formControlContainerClass={classes.imageTabControl}
          inputClasses={{
            root: classes.imageTabInput,
            input: classes.imageTabInput
          }}
        />
      </Grid>
    </Grid>
  )

  const PatternTab = (
    <Grid container className={classes.patternTabContainer} direction="column">
      <Grid
        item
        container
        justify="space-between"
        alignItems="center"
        className={classes.patternTabControlContainer}
      >
        <Typography className={classes.patternTabControlLabel}>
          {t('Type')}
        </Typography>
        <FormControlSelect
          value={container.pattern}
          options={[
            { value: 'original', label: t('Original') },
            { value: 'zig-zag-pattern', label: 'Zig Zag' },
            { value: 'microbial-mat-pattern', label: 'Microbial Mat' },
            { value: 'steps-pattern', label: 'Steps' },
            { value: 'waves-pattern', label: 'Waves' },
            { value: 'bricks-pattern', label: 'Bricks' },
            { value: 'tablecloth-pattern', label: 'Tablecloth' }
          ]}
          formControlContainerClass={classes.imageTabControl}
          inputClasses={{
            root: classes.patternTabInput,
            input: classes.patternTabInput
          }}
          handleChange={e => handlePatternChange(e.target.value)}
        />
      </Grid>
      <Grid
        item
        container
        justify="space-between"
        alignItems="center"
        className={classes.patternTabControlContainer}
      >
        <Typography className={classes.patternTabControlLabel}>
          {t('Intensity')}
        </Typography>
        <SliderInputRange
          maxValue={100}
          minValue={0}
          step={1}
          value={container.patternOpacity * 100 || 0}
          label={false}
          rootClass={[classes.sliderRoot, classes.sliderRootSmall].join(' ')}
          inputRangeContainerSASS="CreateTemplateSettings__slider--Wrap CreateTemplateSettings__slider-small"
          inputContainerClass={classes.sliderInputContainerNT}
          inputRootClass={classes.sliderInputRoot}
          numberWraperStyles={inputRangeSliderStyles}
          labelClass={classes.sliderLabel}
          handleChange={handlePatternOpacityChange}
        />
      </Grid>
    </Grid>
  )

  return (
    <ExpansionPanel
      isExpanded={isExpanded}
      onChange={onExpanded}
      expanded={false}
      title={t('Background')}
      children={
        <Grid item className={classes.expandedContainer}>
          <Grid item className={classes.itemContainer}>
            <Typography className={classes.label}>{t('Opacity')}</Typography>
            <SliderInputRange
              id="create-template-settings-background-opacity"
              maxValue={100}
              minValue={0}
              step={1}
              value={styles.opacity ? styles.opacity * 100 : 0}
              label={false}
              rootClass={classes.sliderRoot}
              inputRangeContainerClass={classes.sliderInputRangeContainer}
              inputRangeContainerSASS="CreateTemplateSettings__slider--Wrap"
              inputContainerClass={classes.sliderInputContainer}
              inputRootClass={[
                classes.sliderInputRoot,
                classes.sliderInputRootMoved
              ].join(' ')}
              numberWraperStyles={inputRangeSliderStyles}
              labelClass={classes.sliderLabel}
              onChange={handleOpacityChange}
              disabled={locked || !has(styles, 'opacity')}
            />
          </Grid>
          <Grid item className={classes.itemContainer}>
            <Typography className={classes.label}>{t('Background')}</Typography>
            <FormControlSketchColorPicker
              tabs={[
                { value: 'image', label: t('Image'), tabChildren: ImageTab },
                {
                  value: 'pattern',
                  label: t('Pattern'),
                  tabChildren: PatternTab
                }
              ]}
              rootClass={classes.colorPickerRoot}
              formControlInputRootClass={classes.colorPickerInputRoot}
              formControlInputClass={classes.colorPickerInput}
              pickerWrapClass={classes.colorPickerWrap}
              color={container.background || 'rgba(0,0,0,1)'}
              inputValue={shadeColor(container.background, 0, true)}
              handleChange={handleBackgroundChange}
            />
          </Grid>
        </Grid>
      }
    />
  )
}

Background.propTypes = {
  classes: PropTypes.object.isRequired,
  styles: PropTypes.object,
  container: PropTypes.object,
  locked: PropTypes.bool
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { updateCurrentTemplateItem, updateTemplateContainer },
    dispatch
  )

export default translate('translations')(
  withStyles(styles, { withTheme: true })(
    connect(null, mapDispatchToProps)(Background)
  )
)
