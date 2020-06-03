import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import classNames from 'classnames'

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
      maxHeight: 486,
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
    shortDesc: {
      fontSize: '13px',
      color: '#888996'
    },

    newsListItem: {
      position: 'relative',
      display: 'block',
      width: '100%',
      padding: '15px 0',

      '&:not(:last-child)': {
        borderBottom: `1px solid ${palette[type].pages.dashboard.card.border}`
      },

      '&::before': {
        content: '"\\002022"',
        position: 'absolute',
        top: '15px',
        left: 0,
        color: '#5f5f5f'
      }
    },
    newsListLink: {
      paddingLeft: '20px',
      color: '#888996',

      '&:hover': {
        color: '#0076b9'
      }
    },
    newsLinkText: {
      fontSize: '13px',
      fontWeight: 'bold',
      color: 'inherit !important'
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

const NewsCard = ({
  t,
  info,
  classes,
  dragging,
  hoverClassName,
  draggingClassName
}) => {
  const [data, setData] = useState([])

  useEffect(() => {
    if (info.response && info.response.news) {
      setData(info.response.news.data)
    }
  }, [info])

  return (
    <Grid
      item
      className={classNames(classes.cardWrapper, classes.responsiveCardWrapper)}
    >
      <Card
        showMenuOnHover
        title={t('Dashboard Card Title News')}
        menuDropdownComponent={
          <List className={classes.cardMenuList}>
            <ListItem
              component="a"
              href="https://mvixdigitalsignage.com/digital-signage-blogs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ListItemText
                primary={t('Read More dashboard action')}
                primaryTypographyProps={{
                  className: classes.cardMenuText
                }}
              />
            </ListItem>
          </List>
        }
        rootClassName={classNames(classes.cardRoot, hoverClassName, {
          [draggingClassName]: dragging
        })}
      >
        <Scrollbars style={{ height: 330 }}>
          <Grid container justify="space-between">
            <ul className={classes.cardList}>
              {Array.isArray(data) &&
                data.map((item, index) => (
                  <li key={item + index} className={classes.newsListItem}>
                    <Link
                      href={item.uri}
                      target="_blank"
                      underline="none"
                      className={classes.newsListLink}
                    >
                      <Typography
                        component="span"
                        className={classes.newsLinkText}
                      >
                        {item.title}
                      </Typography>

                      {item.shortDesc && (
                        <Typography
                          component="span"
                          className={classes.shortDesc}
                        >
                          {item.shortDesc}
                        </Typography>
                      )}
                    </Link>
                  </li>
                ))}
            </ul>
          </Grid>
        </Scrollbars>
      </Card>
    </Grid>
  )
}

NewsCard.propTypes = {
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
  withStyles(styles)(connect(mapStateToProps, null)(NewsCard))
)
