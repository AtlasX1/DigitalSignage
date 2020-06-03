import React from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'

import { withStyles, List, ListItem, Typography } from '@material-ui/core'

import Popup from '../../Popup'
import { WhiteButton } from '../../Buttons'

const styles = theme => {
  const { palette, type } = theme
  return {
    actionButton: {
      marginRight: 12,

      '&:hover': {
        color: '#fff'
      }
    },
    buttonIcon: {
      marginRight: 5,

      '&:hover': {
        color: '#fff'
      }
    },
    list: {
      padding: 0
    },
    listItem: {
      height: 35,
      display: 'flex',
      alignItems: 'center',
      padding: '0 10px',
      borderBottomWidth: 1,
      borderBottomColor: palette[type].pages.reports.generate.border,
      borderBottomStyle: 'solid',
      cursor: 'pointer',

      '&:last-child': {
        borderBottom: 0
      }
    },
    text: {
      fontSize: 12,
      color: '#74809A',
      letterSpacing: '-0.01px',
      position: 'relative',
      top: 1
    },
    icon: {
      marginRight: 12
    }
  }
}

const contentStyle = {
  width: 98,
  borderRadius: 4,
  padding: 0,
  zIndex: 1111
}

const arrowStyle = {
  left: 71
}

const options = [
  {
    title: 'CSV',
    value: 'csv',
    icon: 'icon-files-coding-csv',
    color: '#1e6d1c'
  },
  {
    title: 'PDF',
    value: 'pdf',
    icon: 'icon-file-office-pdf',
    color: '#c32a24'
  },
  {
    title: 'XML',
    value: 'xml',
    icon: 'icon-files-coding-xml',
    color: '#773edb'
  },
  {
    title: 'XLS',
    value: 'xls',
    icon: 'icon-file-office-xls',
    color: '#168bc0'
  }
]

const ExportAsButton = ({ t, classes }) => (
  <Popup
    position="bottom right"
    contentStyle={contentStyle}
    arrowStyle={arrowStyle}
    trigger={
      <WhiteButton className={`hvr-radial-out ${classes.actionButton}`}>
        <i
          className={`${classes.buttonIcon} icon-navigation-show-more-vertical`}
        />
        {t('Export As')}
      </WhiteButton>
    }
  >
    <List className={classes.list}>
      {options.map((option, index) => (
        <ListItem key={index} className={classes.listItem}>
          <i
            className={[option.icon, classes.icon].join(' ')}
            style={{ color: option.color }}
          />
          <Typography className={classes.text}>{option.title}</Typography>
        </ListItem>
      ))}
    </List>
  </Popup>
)

ExportAsButton.propTypes = {
  classes: PropTypes.object
}

export default translate('translations')(withStyles(styles)(ExportAsButton))
