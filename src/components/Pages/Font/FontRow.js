import { Grid, Typography, withStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import React from 'react'
import { CircleIconButton } from '../../Buttons'
import { Checkbox } from '../../Checkboxes'

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      width: '100%',
      height: 80,
      padding: '0 25px',
      borderBottom: `1px solid ${palette[type].tableLibrary.body.cell.border}`
    },
    checkbox: {
      width: 30,
      height: 30,
      marginRight: 30,

      '& span svg': {
        width: 30,
        height: 30
      }
    },
    title: {
      fontSize: 38,
      color: palette[type].pages.fonts.item.color,
      letterSpacing: '-0.04px'
    },
    placeholderContainer: {
      width: '80%'
    },
    infoContainer: {
      width: '20%'
    },
    fontName: {
      fontSize: 20,
      color: palette[type].pages.fonts.item.fontName.color
    },
    fontWeight: {
      fontSize: 14,
      color: '#A0A1AB',
      textAlign: 'end'
    },
    circleIcon: {
      fontSize: '18px',
      color: '#adb7c9'
    },
    infoTextContainer: {
      width: 'auto',
      marginRight: 20
    }
  }
}

const FontRow = ({
  classes,
  placeholder,
  font,
  selected,
  handleSelect = f => f,
  handleDelete = f => f
}) => {
  return (
    <Grid
      container
      justify="space-between"
      alignItems="center"
      className={classes.container}
    >
      <Grid
        container
        alignItems="center"
        className={classes.placeholderContainer}
      >
        <Checkbox
          checked={selected}
          onClick={handleSelect}
          className={classes.checkbox}
        />

        <Typography className={classes.title}>{placeholder}</Typography>
      </Grid>

      <Grid
        container
        alignItems="center"
        justify="flex-end"
        className={classes.infoContainer}
      >
        <Grid
          container
          direction="column"
          alignItems="flex-end"
          className={classes.infoTextContainer}
        >
          <Typography className={classes.fontName}>{font.name}</Typography>
          <Typography className={classes.fontWeight}>Normal 400</Typography>
        </Grid>
        <CircleIconButton
          className={`hvr-grow ${classes.circleIcon}`}
          onClick={() => handleDelete(font.id)}
        >
          <i className="icon-bin" />
        </CircleIconButton>
      </Grid>
    </Grid>
  )
}

FontRow.propTypes = {
  classes: PropTypes.object,
  placeholder: PropTypes.string,
  font: PropTypes.object,
  handleSelect: PropTypes.func,
  handleDelete: PropTypes.func
}

export default withStyles(styles)(FontRow)
