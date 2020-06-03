import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import ClampLines from 'react-clamp-lines'

import {
  withStyles,
  Grid,
  Link,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core'

import { Card } from '../../Card'
import { Scrollbars } from 'components/Scrollbars'

const styles = theme => {
  const { palette, type } = theme
  return {
    cardWrapper: {
      width: 330,
      marginBottom: '20px',
      maxHeight: 414,
      overflowY: 'auto',
      zIndex: 1,
      borderRadius: 6
    },
    cardTransparentBorder: {
      borderColor: 'transparent'
    },
    responsiveCardWrapper: {
      '@media (max-width: 1600px)': {
        flex: 1,
        '&:first-child': {
          marginRight: '20px'
        }
      }
    },
    cardList: {
      width: '100%',
      margin: 0,
      padding: 0,
      listStyle: 'none'
    },
    cardListItem: {
      position: 'relative',
      display: 'block',
      width: '100%',

      '&:not(:last-child)': {
        borderBottom: `1px solid ${palette[type].pages.dashboard.card.border}`
      },

      '&::before': {
        content: '"\\002022"',
        position: 'absolute',
        top: '50%',
        left: 0,
        color: '#5f5f5f',
        transform: 'translateY(-50%)'
      }
    },
    supportListItem: {
      minHeight: '53px'
    },
    link: {
      position: 'absolute',
      top: '50%',
      left: '20px',
      right: 0,
      transform: 'translateY(-50%)',

      '&:hover': {
        color: '#0076b9'
      }
    },
    linkText: {
      fontSize: '13px',
      color: '#888996',

      '&:hover': {
        color: 'inherit !important'
      }
    },
    cardRoot: {
      '@media (max-width: 1600px)': {
        minHeight: '100%'
      }
    },
    cardMenuList: {
      padding: '10px 0 10px 10px'
    },
    cardMenuText: {
      color: palette[type].list.item.color,
      transition: 'all .4s',

      '&:hover': {
        fontWeight: 'bold',
        color: palette[type].list.item.colorActive
      }
    }
  }
}

const SupportCard = ({
  t,
  info,
  classes,
  dragging,
  hoverClassName,
  draggingClassName
}) => {
  const [data, setData] = useState([])

  useEffect(() => {
    if (info.response && info.response.support) {
      setData(info.response.support.data)
    }
  }, [info])

  return (
    <Grid
      item
      className={[classes.cardWrapper, classes.responsiveCardWrapper].join(' ')}
    >
      <Scrollbars style={{ width: 330, height: 414 }}>
        <Card
          showMenuOnHover
          title={t('Dashboard Card Title Support')}
          menuDropdownComponent={
            <List className={classes.cardMenuList}>
              {[
                {
                  label: t('Contact Us dashboard action'),
                  url: 'https://support.mvixusa.com/s/contactsupport'
                },
                {
                  label: t('Knowledgebase dashboard action'),
                  url: 'https://support.mvixusa.com/s'
                }
              ].map((item, index) => (
                <ListItem
                  key={`menu-link-${index}`}
                  component="a"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      className: classes.cardMenuText
                    }}
                  />
                </ListItem>
              ))}
            </List>
          }
          rootClassName={[
            classes.cardRoot,
            hoverClassName,
            dragging ? draggingClassName : ''
          ].join(' ')}
        >
          <Grid container justify="space-between">
            {Array.isArray(data) ? (
              <ul className={classes.cardList}>
                {data.map((item, index) => (
                  <li
                    key={item + index}
                    className={`${classes.cardListItem} ${classes.supportListItem}`}
                  >
                    <Link
                      href={item.uri}
                      target="_blank"
                      rel="noopener"
                      className={classes.link}
                      underline="none"
                    >
                      <Typography component="span" className={classes.linkText}>
                        <ClampLines
                          text={item.title}
                          lines={2}
                          buttons={false}
                        />
                      </Typography>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div
                className={`${classes.cardListItem} ${classes.supportListItem}`}
              >
                <Link
                  href={data.uri}
                  target="_blank"
                  rel="noopener"
                  className={classes.link}
                  underline="none"
                >
                  <Typography component="span" className={classes.linkText}>
                    <ClampLines text={data.email} lines={2} buttons={false} />
                  </Typography>
                </Link>
              </div>
            )}
          </Grid>
        </Card>
      </Scrollbars>
    </Grid>
  )
}

SupportCard.propTypes = {
  draggingClassName: PropTypes.string,
  hoverClassName: PropTypes.string,
  classes: PropTypes.object,
  dragging: PropTypes.bool,
  info: PropTypes.object
}

const mapStateToProps = ({ dashboard }) => ({
  info: dashboard.info
})

export default translate('translations')(
  withStyles(styles)(connect(mapStateToProps, null)(SupportCard))
)
