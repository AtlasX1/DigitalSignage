import { Typography, withStyles } from '@material-ui/core'
import React, { useCallback, useState, useMemo } from 'react'
import { Remove, Add } from '@material-ui/icons'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import FormControlSelect from '../../../Form/FormControlSelect'
import binderOfType from '../binderOfType'
import splitVariant from '../../../../utils/fontUtils'
import {
  addFontToList,
  removeFontFromList,
  changeVariantOfSelectedFont
} from '../../../../actions/fontsActions'

const styles = ({ palette, type }) => ({
  fontItemDemoText: {
    fontSize: '38px',
    lineHeight: '80px',
    color: palette[type].pages.fonts.item.color
  },
  fontName: {
    fontSize: '18px',
    color: palette[type].pages.fonts.item.fontName.color
  },
  fontItem: {
    display: 'flex',
    justifyContent: 'space-between',
    '&:not(:last-child)': {
      borderBottom: `1px solid ${palette[type].pages.fonts.border}`
    }
  },
  fontType: {
    textAlign: 'right',
    width: '140px',
    color: '#9394a0'
  },
  wrapFontInfo: {
    display: 'flex',
    marginTop: '10px',
    marginRight: '10px',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  rightBlock: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    color: palette[type].pages.createTemplate.settings.expansion.header.color,
    cursor: 'pointer',
    marginRight: '10px',
    marginLeft: '10px',

    '&:hover': {
      color: palette[type].dropdown.listItem.hover.color
    }
  }
})

const FontRow = ({
  classes,
  font,
  placeholder,
  addFontToList,
  removeFontFromList,
  changeVariantOfSelectedFont
}) => {
  const [weight, setWeight] = useState(font.variants[0].weight)
  const [fontStyle, setFontStyle] = useState(font.variants[0].style)
  const [variantOfFont, setVariantOfFont] = useState(font.variants[0].variant)
  const [wasAdded, setWasAdded] = useState(font.selected)

  const handleChangeSelect = useCallback(
    ({ target: { value } }) => {
      let { style, weight, variant } = splitVariant(value)
      setWeight(weight)
      setFontStyle(style)
      setVariantOfFont(variant)

      changeVariantOfSelectedFont(font.family, variant)
    },
    [changeVariantOfSelectedFont, font.family]
  )

  const handleClickAction = useCallback(() => {
    !wasAdded
      ? addFontToList(font, variantOfFont)
      : removeFontFromList(font.family)
    setWasAdded(!wasAdded)
  }, [addFontToList, font, removeFontFromList, variantOfFont, wasAdded])

  const styleOfFont = useMemo(() => {
    return {
      fontFamily: font.family,
      fontWeight: weight,
      fontStyle: fontStyle === 'italic' ? 'italic' : 'normal'
    }
  }, [weight, fontStyle, font])

  return (
    <div className={classes.fontItem}>
      <Typography className={classes.fontItemDemoText} style={styleOfFont}>
        {placeholder}
      </Typography>

      <div className={classes.rightBlock}>
        <div className={classes.wrapFontInfo}>
          <Typography className={classes.fontName}>{font.family}</Typography>
          <FormControlSelect
            className={classes.fontType}
            value={variantOfFont}
            options={font.variants.map(({ variant }) => ({
              label: binderOfType[variant],
              value: variant
            }))}
            handleChange={handleChangeSelect}
          />
        </div>
        <hr style={{ height: '75%' }} />
        <div onClick={handleClickAction}>
          {!wasAdded ? (
            <Add className={classes.icon} />
          ) : (
            <Remove className={classes.icon} />
          )}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = () => ({})
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addFontToList,
      removeFontFromList,
      changeVariantOfSelectedFont
    },
    dispatch
  )

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(FontRow)
)
