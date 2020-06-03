import React from 'react'
import PropTypes from 'prop-types'

import { Grid, withStyles, Typography } from '@material-ui/core'

import Popup from '../../../Popup'

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      width: '100%',
      minHeight: 63,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: palette[type].pages.reports.generate.filters.item.border,
      borderRadius: 4,
      background: palette[type].pages.reports.generate.filters.item.background,
      paddingTop: 13,
      paddingBottom: 13,
      paddingLeft: 16,
      paddingRight: 50,
      marginBottom: 7,
      overflow: 'hidden',
      position: 'relative',

      '&:last-child': {
        marginBottom: 0
      },

      '&:hover': {
        borderColor: '#007cc4',

        '& > .GenerateCustomReport-FilterItem__IndexContainer': {
          background: '#007cc4 !important'
        },

        '& > .GenerateCustomReport-FilterItem__IndexContainer > .GenerateCustomReport-FilterItem__Index': {
          color: '#fff'
        },

        '& > i': {
          color: '#007cc4'
        }
      }
    },
    containerPaddingLeft: {
      paddingLeft: 27
    },
    title: {
      color: palette[type].pages.reports.generate.filters.item.titleColor,
      fontSize: 12,
      marginBottom: 4
    },
    text: {
      color: palette[type].pages.reports.generate.filters.item.textColor,
      fontSize: 12
    },
    indexContainer: {
      position: 'absolute',
      left: 0,
      width: 17,
      height: '100%',
      background: palette[type].pages.reports.generate.filters.item.border,
      paddingTop: 13
    },
    index: {
      color: palette[type].pages.reports.generate.filters.item.indexColor,
      fontSize: 12,
      fontWeight: 'bold'
    },
    icon: {
      fontSize: 8,
      color: '#e9a3a1',
      cursor: 'pointer',
      position: 'absolute',
      right: 15,
      top: 17
    },
    iconCentered: {
      position: 'absolute',
      right: 15,
      fontSize: 10,
      color: palette[type].pages.reports.generate.iconColor
    },
    iconChanged: {
      fontSize: 16,
      overflow: 'hidden',
      width: 9,
      transform: 'scaleX(-1)'
    }
  }
}

const contentStyle = {
  width: 310,
  transform: 'translateY(-25px)',
  borderRadius: 8,
  padding: 0
}

const arrowStyle = {
  top: 58
}

const Item = ({
  classes,
  title = '',
  text = '',
  index,
  popup,
  popupHeight,
  removeIconClickHandler = f => f
}) => (
  <Popup
    position="right top"
    arrowStyle={arrowStyle}
    contentStyle={{
      ...contentStyle,
      height: popupHeight
    }}
    trigger={
      <Grid
        container
        direction="column"
        justify="center"
        className={[
          classes.container,
          !!index ? classes.containerPaddingLeft : ''
        ].join(' ')}
      >
        {index && (
          <Grid
            container
            justify="center"
            className={[
              classes.indexContainer,
              'GenerateCustomReport-FilterItem__IndexContainer'
            ].join(' ')}
          >
            <Typography
              className={[
                classes.index,
                'GenerateCustomReport-FilterItem__Index'
              ].join(' ')}
            >
              {index}
            </Typography>
          </Grid>
        )}

        <Typography className={classes.title}>{title}</Typography>
        <Typography className={classes.text}>{text}</Typography>

        {!index && (
          <i
            className={[
              'icon-expand-vertical-7',
              classes.iconCentered,
              classes.iconChanged
            ].join(' ')}
          />
        )}

        {index && (
          <i
            onClick={removeIconClickHandler}
            className={`icon-close ${classes.icon}`}
          />
        )}
      </Grid>
    }
  >
    {popup}
  </Popup>
)

Item.propTypes = {
  classes: PropTypes.object,
  title: PropTypes.string,
  text: PropTypes.string,
  index: PropTypes.number,
  popup: PropTypes.node,
  popupHeight: PropTypes.number,
  removeIconClickHandler: PropTypes.func
}

export default withStyles(styles)(Item)
