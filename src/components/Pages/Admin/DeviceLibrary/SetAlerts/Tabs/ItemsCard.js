import React from 'react'
import PropTypes from 'prop-types'

import { Grid, Typography, withStyles } from '@material-ui/core'

import { CheckboxSwitcher } from 'components/Checkboxes'
import { Card } from 'components/Card'
import EmptyPlaceholder from 'components/EmptyPlaceholder'

const styles = ({ type, palette }) => ({
  header: {
    paddingLeft: 0,
    border: `solid 1px ${palette[type].card.greyHeader.border}`,
    backgroundColor:
      palette[type].pages.devices.alerts.tabs.card.header.background,
    marginBottom: '35px'
  },
  headerText: {
    width: '100%',
    fontWeight: 'bold',
    lineHeight: '42px',
    color: palette[type].sideModal.header.titleColor
  },

  devicesList: {},
  deviceIconWrap: {
    marginRight: '15px',
    lineHeight: '40px',
    color: '#0a83c8'
  },
  detailRow: {
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`
  },
  detailLabel: {
    color: '#74809a'
  },
  featureCheckboxSwitcher: {
    height: '40px'
  },

  teamviewerStatus: {
    fontSize: 18
  },
  teamviewerStatusActive: {
    color: '#4fd688'
  },
  devicesWithNoMediaHeaderHelpText: {
    fontSize: '12px',
    lineHeight: '42px',
    color: '#9394a0',
    textAlign: 'right'
  },
  itemsCardContainer: {
    maxHeight: 'calc((100% - 76px) / 2)',
    height: 'calc((100% - 76px) / 2)',
    paddingBottom: 20
  },
  itemsCardContentContainer: {
    maxHeight: 'calc(100% - 44px)',
    overflowY: 'auto'
  },
  deviceItemContainer: {
    padding: '0 20px',
    width: '50%'
  },
  emptyPlaceholderRootClassName: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center'
  }
})

const ItemsCard = ({
  title = '',
  helpText = '',
  classes = {},
  data = [],
  noToggles = false,
  selectedDevices = [],
  handleChange = f => f,
  emptyTitle = ''
}) => {
  return (
    <Card
      icon={false}
      grayHeader={true}
      shadow={false}
      radius={false}
      removeSidePaddings={true}
      headerSidePaddings={true}
      removeNegativeHeaderSideMargins={true}
      title={title}
      helpText={helpText}
      headerHelpTextClasses={[classes.devicesWithNoMediaHeaderHelpText]}
      headerClasses={[classes.header]}
      headerTextClasses={[classes.headerText]}
      rootClassName={classes.itemsCardContainer}
    >
      <Grid container className={classes.itemsCardContentContainer}>
        <Grid container>
          <Grid container className={classes.devicesList}>
            {!data.length ? (
              <EmptyPlaceholder
                text={emptyTitle}
                rootClassName={classes.emptyPlaceholderRootClassName}
              />
            ) : (
              data.map((device, index) => (
                <Grid
                  container
                  key={`feature-${index}`}
                  className={classes.deviceItemContainer}
                >
                  <Grid container>
                    <Grid item className={classes.deviceIconWrap}>
                      <i
                        className={`icon-computer-screen-1 ${
                          classes.teamviewerStatus
                        } ${
                          device.teamviewerStatus
                            ? classes.teamviewerStatusActive
                            : ''
                        }`}
                      />
                    </Grid>
                    <Grid item xs container alignItems="center">
                      <Grid
                        className={classes.detailRow}
                        container
                        justify="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <Typography className={classes.detailLabel}>
                            {device.name}
                          </Typography>
                        </Grid>
                        {!noToggles && (
                          <Grid item>
                            <CheckboxSwitcher
                              value={
                                !!selectedDevices.find(d => d === device.id)
                              }
                              id={device.id}
                              switchBaseClass={classes.featureCheckboxSwitcher}
                              handleChange={handleChange}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  )
}

ItemsCard.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.array,
  title: PropTypes.string,
  helpText: PropTypes.string,
  noToggles: PropTypes.bool,
  selectedDevices: PropTypes.array,
  handleChange: PropTypes.func,
  emptyTitle: PropTypes.string
}

export default withStyles(styles)(ItemsCard)
