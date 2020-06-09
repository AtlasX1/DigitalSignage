import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import update from 'immutability-helper'

import {
  withStyles,
  Grid,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core'

import { Card } from '../../Card'
import { BandwidthChart } from '../../Charts'

const styles = {
  cardWrapper: {
    width: 330,
    marginBottom: '20px'
  },
  cardMenuList: {
    padding: '10px 0 10px 10px'
  }
}

const BandwidthCard = ({
  t,
  info,
  classes,
  dragging,
  hoverClassName,
  draggingClassName
}) => {
  const [data, setData] = useState({ remaining: 0, data: [] })

  useEffect(() => {
    if (info.response && info.response.bandwidth) {
      const { total = 0, remaining = 0 } = info.response.bandwidth
      setData(
        update(data, {
          remaining: { $set: `${parseFloat(remaining).toFixed(1)} GB` },
          data: {
            $set: [
              {
                id: 'Used',
                label: 'Used',
                value: parseFloat(total) - parseFloat(remaining)
              },
              {
                id: 'Remaining',
                label: 'Remaining',
                value: parseFloat(remaining)
              }
            ]
          }
        })
      )
    }
    //eslint-disable-next-line
  }, [info])

  return (
    <Grid item className={classes.cardWrapper}>
      <Card
        showMenuOnHover
        title={t('Dashboard Card Title Bandwidth')}
        menuDropdownComponent={
          <List className={classes.cardMenuList}>
            {
              <ListItem
                component="a"
                href={
                  'https://support.mvixusa.com/s/article/how-does-my-bandwidth-work'
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <ListItemText
                  primary={t('More Info')}
                  primaryTypographyProps={{
                    className: classes.cardMenuText
                  }}
                />
              </ListItem>
            }
          </List>
        }
        rootClassName={[hoverClassName, dragging ? draggingClassName : ''].join(
          ' '
        )}
      >
        <Grid container justify="center">
          <BandwidthChart chartData={data} />
        </Grid>
      </Card>
    </Grid>
  )
}

BandwidthCard.propTypes = {
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
  withStyles(styles)(connect(mapStateToProps, null)(BandwidthCard))
)
