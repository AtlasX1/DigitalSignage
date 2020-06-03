import React from 'react'
import { withStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

const styles = () => ({
  radioContainer: {
    display: 'inline-flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    margin: '10px 10px 10px 0',
    paddingLeft: '23px',
    position: 'relative',
    cursor: 'pointer',
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: '50%',
      left: '0',
      transform: 'translate(0, -50%)',
      height: '14px',
      width: '14px',
      border: '6px solid #535d73',
      borderRadius: '50%',
      background: '#d3d6dd'
    },
    '&:hover': {
      '&:before': {
        borderColor: '#41cb71'
      }
    }
  },
  activeRadio: {
    '&:before': {
      borderColor: '#41cb71'
    }
  },
  paletteSection: {
    width: '34px'
  }
})

const FormControlRadio = ({
  id,
  classes,
  onChange,
  selected,
  item,
  ...props
}) => {
  const handleChange = () => {
    onChange(item)
  }

  return (
    <Grid
      className={
        selected === id
          ? `${classes.activeRadio} ${classes.radioContainer}`
          : classes.radioContainer
      }
      onClick={handleChange}
    >
      {!!item.component && item.component}
      {!item.component && item.value}
    </Grid>
  )
}

export default withStyles(styles)(FormControlRadio)
