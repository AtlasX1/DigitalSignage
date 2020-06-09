import React, { useMemo } from 'react'
import classNames from 'classnames'

import {
  FormControlReactSelect,
  FormControlSelectFont,
  FormControlSketchColorPicker,
  FormControlSelectSkin,
  FormControlBackgroundSelect
} from 'components/Form'
import FormControlInput from 'components/Form/FormControlInput'

const defaultModernProperties = {
  theme_properties: {
    font_color: 'rgb(0,0,0)',
    font_family: 'Arial'
  }
}
const defaultLegacyProperties = {
  height: 330,
  width: 470
}

const themeProperties = {
  158: defaultModernProperties,
  159: defaultModernProperties,
  160: defaultModernProperties,
  161: defaultModernProperties,
  162: defaultModernProperties,
  224: defaultModernProperties,
  225: defaultModernProperties,
  226: defaultModernProperties,
  227: defaultModernProperties,
  228: defaultModernProperties,
  140: defaultLegacyProperties,
  141: defaultLegacyProperties,
  142: defaultLegacyProperties,
  143: defaultLegacyProperties,
  144: defaultLegacyProperties,
  145: defaultLegacyProperties,
  146: {
    ...defaultLegacyProperties,
    theme_properties: {
      section_1: 'rgba(255, 255, 255, 1)',
      section_2: 'rgba(35, 78, 133, 1)',
      section_3: 'rgba(47, 105, 182, 1)',
      section_4: 'rgba(31, 71, 121, 1)',
      section_5: 'rgba(28, 63, 106, 1)',
      section_6: 'rgba(247, 147, 39, 1)',
      section_7: 'rgba(62, 127, 194, 1)',
      skin: 1,
      dark_font_family: 'Arial',
      light_font_family: 'Arial',
      state_font_size: 14,
      city_font_size: 27
    }
  },
  147: {
    ...defaultLegacyProperties,
    theme_properties: {
      section_1: 'rgba(255, 255, 255, 1)',
      section_2: 'rgba(35, 78, 133, 1)',
      section_3: 'rgba(47, 105, 182, 1)',
      section_4: 'rgba(31, 71, 121, 1)',
      section_5: 'rgba(28, 63, 106, 1)',
      section_6: 'rgba(247, 147, 39, 1)',
      section_7: 'rgba(62, 127, 194, 1)',
      skin: 1,
      dark_font_family: 'Arial',
      light_font_family: 'Arial',
      state_font_size: 14,
      city_font_size: 27
    }
  },
  148: {
    ...defaultLegacyProperties,
    theme_properties: {
      text_color: 'rgba(255, 255, 255, 1)',
      font_family: 'Arial',
      background: {
        type: 'none',
        image_id: 200,
        color: 'rgba(0, 0, 0, 1)',
        pattern: 'vertical_stripes',
        size: 'original'
      },
      city_font_size: 27
    }
  },
  149: {
    ...defaultLegacyProperties,
    theme_properties: {
      text_color: 'rgba(255, 255, 255, 1)',
      font_family: 'Arial',
      background: {
        type: 'none',
        image_id: null,
        color: 'rgba(0, 0, 0, 1)',
        pattern: null,
        size: 'original'
      },
      city_font_size: 27
    }
  },
  150: {
    ...defaultLegacyProperties,
    theme_properties: {
      section_1: 'rgba(255, 255, 255, 1)',
      section_2: 'rgba(236, 68, 68, 1)',
      section_3: 'rgba(221, 221, 221, 1)',
      section_4: 'rgba(245, 245, 245, 1)',
      section_5: 'rgba(105, 105, 105, 1)',
      skin: 1,
      font_family: 'Arial',
      city_font_size: 27
    }
  },
  151: {
    ...defaultLegacyProperties,
    theme_properties: {
      section_1: 'rgba(255, 255, 255, 1)',
      section_2: 'rgba(236, 68, 68, 1)',
      section_3: 'rgba(221, 221, 221, 1)',
      section_4: 'rgba(245, 245, 245, 1)',
      section_5: 'rgba(105, 105, 105, 1)',
      skin: 1,
      font_family: 'Arial',
      city_font_size: 27
    }
  },
  152: {
    ...defaultLegacyProperties,
    theme_properties: {
      text_color: 'rgba(255, 255, 255, 1)',
      font_family: 'Arial',
      city_font_size: 27
    }
  },
  153: {
    ...defaultLegacyProperties,
    theme_properties: {
      text_color: 'rgba(255, 255, 255, 1)',
      font_family: 'Arial',
      city_font_size: 27
    }
  },
  154: {
    ...defaultLegacyProperties,
    theme_properties: {
      text_color: 'rgba(255, 255, 255, 1)',
      font_family: 'Arial',
      city_font_size: 27
    }
  },
  155: {
    ...defaultLegacyProperties,
    theme_properties: {
      text_color: 'rgba(255, 255, 255, 1)',
      font_family: 'Arial',
      city_font_size: 27
    }
  },
  156: {
    ...defaultLegacyProperties,
    theme_properties: {
      text_color: 'rgba(255, 255, 255, 1)',
      font_family: 'Arial',
      city_font_size: 27
    }
  },
  157: {
    ...defaultLegacyProperties,
    theme_properties: {
      text_color: 'rgba(255, 255, 255, 1)',
      font_family: 'Arial',
      city_font_size: 27
    }
  }
}

const temperatureOptions = [
  {
    label: '°C',
    value: 'metric'
  },
  {
    label: '°F',
    value: 'imperial'
  }
]

const sizeOptions = [
  {
    label: 'Original',
    value: 'original'
  },
  {
    label: 'Stretch',
    value: 'stretch'
  }
]

const typeOptions = [
  {
    label: 'None',
    value: 'none'
  },
  {
    label: 'Image',
    value: 'image'
  },
  {
    label: 'Pattern',
    value: 'pattern'
  }
]

const elements = [
  { value: 'Humidity', label: 'humidity' },
  { value: 'Precipitation', label: 'precipitation' },
  { value: 'Wind', label: 'wind' },
  { value: 'Pressure', label: 'pressure' }
]

const defaultFonts = [
  {
    label: 'Arial',
    value: 'Arial'
  },
  {
    label: 'Roboto',
    value: 'Roboto'
  },
  {
    label: 'Times New Roman',
    value: 'Times New Roman'
  },
  {
    label: 'Times',
    value: 'Times'
  },
  {
    label: 'Courier New',
    value: 'Courier New'
  },
  {
    label: 'Courier',
    value: 'Courier'
  },
  {
    label: 'Verdana',
    value: 'Verdana'
  },
  {
    label: 'Georgia',
    value: 'Georgia'
  },
  {
    label: 'Palatino',
    value: 'Palatino'
  },
  {
    label: 'Garamond',
    value: 'Garamond'
  },
  {
    label: 'Bookman',
    value: 'Bookman'
  },
  {
    label: 'Comic Sans MS',
    value: 'Comic Sans MS'
  },
  {
    label: 'Candara',
    value: 'Candara'
  },
  {
    label: 'Arial Black',
    value: 'Arial Black'
  },
  {
    label: 'Impact',
    value: 'Impact'
  }
]

const components = {
  font_family: ({ classes, ...props }) => (
    <FormControlSelectFont options={defaultFonts} {...props} />
  ),
  font_color: ({ onChange, value, classes, ...props }) => (
    <FormControlSketchColorPicker
      color={value}
      onColorChange={onChange}
      {...props}
    />
  ),
  dark_font_family: ({ classes, ...props }) => (
    <FormControlSelectFont options={defaultFonts} {...props} />
  ),
  light_font_family: ({ classes, ...props }) => (
    <FormControlSelectFont options={defaultFonts} {...props} />
  ),
  state_font_size: ({ onChange, classes, ...props }) => (
    <FormControlInput
      custom
      min={14}
      max={32}
      handleChange={onChange}
      formikMode
      labelPosition="left"
      formControlInputClass={classes.formControlInputClass}
      formControlLabelClass={classes.label}
      formControlRootClass={classNames(
        classes.formControlRootClass,
        classes.numberInput
      )}
      {...props}
    />
  ),
  city_font_size: ({ onChange, classes, ...props }) => (
    <FormControlInput
      custom
      min={27}
      max={32}
      handleChange={onChange}
      formikMode
      labelPosition="left"
      formControlInputClass={classes.formControlInputClass}
      formControlLabelClass={classes.label}
      formControlRootClass={classNames(
        classes.formControlRootClass,
        classes.numberInput
      )}
      {...props}
    />
  ),
  section_1: ({ onChange, value, classes, ...props }) => (
    <FormControlSketchColorPicker
      color={value}
      onColorChange={onChange}
      {...props}
    />
  ),
  section_2: ({ onChange, value, classes, ...props }) => (
    <FormControlSketchColorPicker
      color={value}
      onColorChange={onChange}
      {...props}
    />
  ),
  section_3: ({ onChange, value, classes, ...props }) => (
    <FormControlSketchColorPicker
      color={value}
      onColorChange={onChange}
      {...props}
    />
  ),
  section_4: ({ onChange, value, classes, ...props }) => (
    <FormControlSketchColorPicker
      color={value}
      onColorChange={onChange}
      {...props}
    />
  ),
  section_5: ({ onChange, value, classes, ...props }) => (
    <FormControlSketchColorPicker
      color={value}
      onColorChange={onChange}
      {...props}
    />
  ),
  section_6: ({ onChange, value, classes, ...props }) => (
    <FormControlSketchColorPicker
      color={value}
      onColorChange={onChange}
      {...props}
    />
  ),
  section_7: ({ onChange, value, classes, ...props }) => (
    <FormControlSketchColorPicker
      color={value}
      onColorChange={onChange}
      {...props}
    />
  ),
  skin: ({ classes, onChangeSkin, skinOptions, onChange, ...props }) => (
    <FormControlSelectSkin
      options={skinOptions}
      onChange={onChangeSkin}
      {...props}
    />
  ),
  type: ({ classes, ...props }) => (
    <FormControlReactSelect options={typeOptions} {...props} />
  ),
  color: ({ onChange, value, classes, ...props }) => (
    <FormControlSketchColorPicker
      color={value}
      onColorChange={onChange}
      {...props}
    />
  ),
  size: ({ onChange, classes, ...props }) => (
    <FormControlReactSelect options={sizeOptions} {...props} />
  ),
  background: ({ classes, ...props }) => (
    <FormControlBackgroundSelect style={{ alignSelf: 'end' }} {...props} />
  )
}

const LibraryComponents = ({ type, ...props }) => {
  const SpecificComponent = useMemo(
    () => (components.hasOwnProperty(type) ? components[type] : null),
    [type]
  )

  return SpecificComponent ? <SpecificComponent {...props} /> : null
}

const exceptions = [
  'location',
  'temperature',
  'last_updated',
  'elements',
  'width',
  'height'
]

export {
  themeProperties,
  LibraryComponents,
  exceptions,
  temperatureOptions,
  elements
}
