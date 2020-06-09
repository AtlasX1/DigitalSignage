import React, { useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography, withStyles } from '@material-ui/core'
import classNames from 'classnames'

import { CheckboxSwitcher } from 'components/Checkboxes'
import EmptyPlaceholder from 'components/EmptyPlaceholder'
import ItemsCard from './ItemsCard'

import { isEmpty, isFalsy } from 'utils/generalUtils'

const styles = ({ type, palette }) => ({
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
  teamViewerStatus: {
    fontSize: 18
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

function DeviceItem({
  id,
  name,
  classes,
  isRenderToggle,
  isSelected,
  onChange
}) {
  const renderToggle = useMemo(() => {
    if (isFalsy(isRenderToggle)) return null
    return (
      <Grid item>
        <CheckboxSwitcher
          value={isSelected}
          id={id}
          switchBaseClass={classes.featureCheckboxSwitcher}
          handleChange={onChange}
        />
      </Grid>
    )
  }, [isRenderToggle, classes, id, isSelected, onChange])
  return (
    <Grid key={id} container className={classes.deviceItemContainer}>
      <Grid container>
        <Grid item className={classes.deviceIconWrap}>
          <i
            className={classNames(
              'icon-computer-screen-1',
              classes.teamViewerStatus
            )}
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
              <Typography className={classes.detailLabel}>{name}</Typography>
            </Grid>
            {renderToggle}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

const DeviceItemMemoized = memo(DeviceItem)

function DeviceItemsCard({
  title,
  classes,
  data,
  noToggles,
  selectedDevices,
  onChange,
  emptyTitle,
  error
}) {
  const renderRows = useMemo(() => {
    if (isEmpty(data)) {
      return (
        <EmptyPlaceholder
          text={emptyTitle}
          rootClassName={classes.emptyPlaceholderRootClassName}
        />
      )
    }
    return data.map(({ name, id }) => {
      return (
        <DeviceItemMemoized
          key={id}
          id={id}
          name={name}
          onChange={onChange}
          classes={classes}
          isSelected={selectedDevices.includes(id)}
          isRenderToggle={isFalsy(noToggles)}
        />
      )
    })
  }, [classes, emptyTitle, selectedDevices, data, onChange, noToggles])
  return (
    <ItemsCard title={title} error={error}>
      <Grid container>
        <Grid container>{renderRows}</Grid>
      </Grid>
    </ItemsCard>
  )
}

DeviceItemsCard.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.array,
  title: PropTypes.string,
  noToggles: PropTypes.bool,
  selectedDevices: PropTypes.array,
  onChange: PropTypes.func,
  emptyTitle: PropTypes.string,
  name: PropTypes.string
}

DeviceItemsCard.defaultProps = {
  title: '',
  emptyTitle: '',
  data: [],
  noToggles: false,
  selectedDevices: [],
  onChange: f => f
}

export default withStyles(styles)(DeviceItemsCard)
