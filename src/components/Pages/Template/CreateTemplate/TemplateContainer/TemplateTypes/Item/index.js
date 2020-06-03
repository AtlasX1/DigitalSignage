import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Typography, withStyles, Tooltip } from '@material-ui/core'

import { DropdownHover } from 'components/Dropdowns'

import { addTemplateItem } from 'actions/createTemplateActions'

const styles = ({ palette, type, typography }) => {
  return {
    navigationItemWrap: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      paddingRight: '40px',

      '&:last-child': {
        paddingRight: '0'
      }
    },
    navigationItemText: {
      fontSize: '12px',
      cursor: 'pointer',
      color: palette[type].pages.createTemplate.types.item.color,

      '&:hover': {
        cursor: 'pointer',
        color: palette[type].pages.createTemplate.types.item.hover.color
      }
    },
    navigationSubList: {
      display: 'flex',
      padding: '15px 23px 20px 23px'
    },
    navIconWrapper: {
      width: '24px',
      height: '24px',
      marginRight: '30px',

      '&:last-child': {
        marginRight: '0'
      }
    },
    navIcon: {
      fontSize: '1.5em',
      cursor: 'pointer',
      color: '#9394a0',

      '&:hover': {
        color: palette[type].dropdown.listItem.hover.color
      }
    },
    moveBottom: {
      paddingTop: '1px'
    },
    noIconItemText: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: typography.fontFamily,
      lineHeight: 0
    }
  }
}

const Item = props => {
  const { t, classes, name, feature } = props

  return (
    <div className={classes.navigationItemWrap}>
      <DropdownHover
        dropSide="bottomRight"
        ButtonComponent={
          <Typography className={classes.navigationItemText}>
            {t(`${name} Tab`)}
          </Typography>
        }
        MenuComponent={
          <div className={classes.navigationSubList}>
            {feature.map((item, index) => (
              <Tooltip
                position={'top'}
                title={item.alias}
                key={`att-template-sub-${index}`}
              >
                <div
                  className={classes.navIconWrapper}
                  onClick={() =>
                    props.addTemplateItem({
                      featureId: item.id,
                      featureTab: name,
                      type: item.name,
                      icon: item.icon
                    })
                  }
                >
                  {item.icon ? (
                    <i className={[classes.navIcon, item.icon].join(' ')} />
                  ) : (
                    <div className={classes.noIconItemText}>
                      {item.name.slice(0, 1)}
                    </div>
                  )}
                </div>
              </Tooltip>
            ))}
          </div>
        }
      />
    </div>
  )
}

Item.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  feature: PropTypes.array.isRequired
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ addTemplateItem }, dispatch)

export default translate('translations')(
  withStyles(styles)(connect(null, mapDispatchToProps)(Item))
)
