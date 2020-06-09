import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import classNames from 'classnames'
import { DateTimeView } from 'components/TableLibrary'

import {
  withStyles,
  Grid,
  Typography,
  TableRow,
  TableCell
} from '@material-ui/core'

import { CheckboxSwitcher } from 'components/Checkboxes'

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      height: 73,
      padding: '15px 0 15px 12px',
      borderBottomWidth: 1,
      borderBottomColor: palette[type].sideModal.content.border,
      borderBottomStyle: 'solid'
    },
    containerBlue: {
      width: 68,
      height: 40,
      background:
        'linear-gradient(134.72deg, rgba(103,181,255,0.21) 0%, rgba(61,135,255,0.22) 100%)',
      borderWidth: 1,
      borderColor: '#AECFFF',
      borderStyle: 'solid',
      borderRadius: 2,
      marginRight: 26
    },
    textBold: {
      fontSize: 14,
      letterSpacing: '-0.02px',
      color: palette[type].sideModal.tabs.item.titleColor,
      fontWeight: 'bold'
    },
    text: {
      fontSize: 12,
      letterSpacing: '-0.01px',
      color: '#9394A0'
    },
    textSmall: {
      fontSize: 10,
      letterSpacing: '-0.01px',
      color: '#fff',
      transform: 'translateY(1px)'
    },
    status: {
      height: 16,
      background: '#D35E37',
      borderRadius: 12.5
    },
    statusActive: {
      background: '#3CD480'
    },
    switchBase: {
      justifyContent: 'flex-end'
    },
    nameContiner: {
      display: 'flex'
    },
    nameCell: {
      width: 300
    }
  }
}

const Item = ({
  t,
  classes,
  alias,
  name,
  location,
  lastUpdate,
  status,
  isSelected,
  handleChange,
  id,
  className,
  style
}) => (
  <TableRow className={classNames(classes.container, className)} style={style}>
    <TableCell padding="none" className={classes.nameCell}>
      <div className={classes.nameContiner}>
        <Grid className={classes.containerBlue} />
        <div>
          <Typography className={classes.textBold}>{alias}</Typography>
          <Typography className={classes.text}>{name}</Typography>
        </div>
      </div>
    </TableCell>

    <TableCell padding="none" align="center">
      <Typography className={classes.text}>{location}</Typography>
    </TableCell>

    <TableCell padding="none" align="center">
      <Typography className={classes.text}>
        <DateTimeView date={lastUpdate} />
      </Typography>
    </TableCell>

    <TableCell padding="none" align="center">
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classNames(classes.status, {
          [classes.statusActive]: status === 'Active'
        })}
      >
        <Typography className={classes.textSmall}>{t(status)}</Typography>
      </Grid>
    </TableCell>
    <TableCell padding="none">
      <CheckboxSwitcher
        value={isSelected}
        switchContainerClass={classes.switchBase}
        handleChange={e => handleChange(e)}
      />
    </TableCell>
  </TableRow>
)

Item.propTypes = {
  classes: PropTypes.object,
  name: PropTypes.string,
  alias: PropTypes.string,
  status: PropTypes.string,
  handleChange: PropTypes.func,
  id: PropTypes.number,
  isSelected: PropTypes.bool,
  location: PropTypes.string,
  lastUpdate: PropTypes.string
}
Item.defaultProps = {
  name: '',
  alias: '',
  status: 'Inactive',
  handleChange: () => {},
  isSelected: false,
  location: '',
  lastUpdate: ''
}

export default translate('translations')(withStyles(styles)(Item))
