import React, { useState } from 'react'
import { translate } from 'react-i18next'
import update from 'immutability-helper'

import { Grid, withStyles } from '@material-ui/core'

import RowMatchesPopup from './RowMatchesPopup'
import FilterPopup from './FilterPopup'

import { FormControlInput } from '../../../Form'

import Card from '../Card'
import Item from './Item'

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      width: 288,
      height: 'calc(100% + 49px)',
      position: 'relative',
      top: -49,
      borderRightWidth: 1,
      borderRightStyle: 'solid',
      borderRightColor: palette[type].pages.reports.generate.border,
      borderTop: 0
    },
    inputContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%'
    },
    inputRoot: {
      width: '100%'
    },
    inputIcon: {
      width: 16,
      position: 'absolute',
      right: '15px',
      color: '#9394A0',
      opacity: 0.5,
      transform: 'scaleX(-1)'
    }
  }
}

const Filters = ({ t, classes }) => {
  const [filterSearch, setFilterSearch] = useState('')

  const [filters, setFilters] = useState([
    { title: 'Show Me', text: 'All Schedules' },
    { title: 'Schedule Date', text: 'This Month (Aug 1, 2019 - Aug 21, 2019)' }
  ])

  const [matches, setMatches] = useState([
    { title: 'Terms Accepted', text: 'equals true' },
    { title: 'Media: Terms Accepted', text: 'Equals True' },
    { title: 'Media: Status', text: 'Equals True' },
    {
      title: 'Media Status',
      text:
        'Equals Partially Paid, Approved for Fulfillment, Partially Complete, Shipped (Not Paid), Closed, Returned for Refund, Terms Accepted, Payment Complete'
    },
    { title: 'is Vioded', text: 'Equals false' }
  ])

  const removeFiltersHandler = index => {
    setFilters(
      update(filters, {
        $splice: [[index, 1]]
      })
    )
  }

  const removeMatchesHandler = index => {
    setMatches(
      update(matches, {
        $splice: [[index, 1]]
      })
    )
  }

  return (
    <Grid container direction="column" className={classes.container}>
      <Card title={t('Filters')} height={358}>
        <FormControlInput
          value={filterSearch}
          handleChange={e => setFilterSearch(e.target.value)}
          formControlRootClass={classes.inputContainer}
          formControlInputRootClass={classes.inputRoot}
          icon={
            <i className={`icon-beauty-hand-mirror ${classes.inputIcon}`} />
          }
        />

        {filters.map((item, index) => (
          <Item
            key={index}
            title={item.title}
            text={item.text}
            popup={
              <FilterPopup
                removeIconClickHandler={() => removeFiltersHandler(index)}
              />
            }
            popupHeight={358}
          />
        ))}
      </Card>

      <Card title={t('INCLUDE ROW MATCHES')} height={'calc(100% - 358px)'}>
        {matches.map((item, index) => (
          <Item
            key={index}
            index={index + 1}
            title={item.title}
            text={item.text}
            popup={<RowMatchesPopup />}
            popupHeight={468}
            removeIconClickHandler={() => removeMatchesHandler(index)}
          />
        ))}
      </Card>
    </Grid>
  )
}

export default translate('translations')(withStyles(styles)(Filters))
