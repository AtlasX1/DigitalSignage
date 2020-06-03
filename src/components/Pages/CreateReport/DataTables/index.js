import React, { useState } from 'react'
import { translate } from 'react-i18next'
import { Rnd } from 'react-rnd'
import update from 'immutability-helper'

import { Grid, withStyles } from '@material-ui/core'

import { FormControlSelect, FormControlInput } from '../../../Form'

import Item from './Item'

const styles = ({ palette, type, typography }) => {
  return {
    container: {
      width: 316,
      height: 'calc(100% + 49px)',
      position: 'relative',
      top: -49,
      borderRightWidth: 1,
      borderRightStyle: 'solid',
      borderRightColor: palette[type].pages.reports.generate.border
    },
    header: {
      boxSizing: 'border-box',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: palette[type].pages.reports.generate.border,
      background: palette[type].pages.reports.generate.background,
      padding: '10px 20px'
    },
    headerInputContainer: {
      width: '100%'
    },
    headerInputRoot: {
      marginBottom: 0
    },
    headerInput: {
      paddingLeft: 15,
      fontSize: 13,
      letterSpacing: '-0.01px',
      color: '#494f5c',
      fontFamily: typography.fontFamily
    },
    headerInputSelectIcon: {
      right: '10px'
    },
    content: {
      padding: '10px 20px',
      position: 'relative',
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    inputIcon: {
      width: 16,
      position: 'absolute',
      right: '15px',
      color: '#9394A0',
      opacity: 0.5,
      bottom: 10,
      transform: 'scaleX(-1)'
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
    inputLabel: {
      fontSize: 18
    },
    contentWrapper: {
      height: 'calc(100% - 84px)'
    },
    contentDivider: {
      width: 'calc(100% + 1px)',
      height: 10,
      background:
        palette[type].pages.reports.generate.dataTables.divider.background,
      position: 'fixed',
      bottom: 0,
      left: 0,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: palette[type].pages.reports.generate.border,

      '&::before': {
        content: '""',
        position: 'absolute',
        width: 10,
        height: 2,
        background: '#748092',
        top: 1
      },

      '&::after': {
        content: '""',
        position: 'absolute',
        width: 10,
        height: 2,
        background: '#748092',
        bottom: 1
      }
    }
  }
}

const selectData = [
  { label: 'Media', value: 'media' },
  { label: 'Playlist', value: 'playlist' }
]

const DataTables = ({ t, classes }) => {
  const [select, setSelect] = useState('media')
  const [height, setHeight] = useState('50%')
  const [dataTablesSearch, setDataTablesSearch] = useState('')
  const [groupRowsSearch, setGroupRowsSearch] = useState('')

  const [dataTables, setDataTables] = useState([
    { title: 'Opportunity: Opportunity Owner 1', value: 0 },
    { title: 'Opportunity: Opportunity Owner 2', value: 1 },
    { title: 'Opportunity: Opportunity Owner 3', value: 2 },
    { title: 'Opportunity: Opportunity Owner 4', value: 3 },
    { title: 'Opportunity: Opportunity Owner 5', value: 4 },
    { title: 'Opportunity: Opportunity Owner 6', value: 5 },
    { title: 'Opportunity: Opportunity Owner 7', value: 6 }
  ])

  const [groupRows, setGroupRows] = useState([
    { title: 'Opportunity: Opportunity Owner 8', value: 7 },
    { title: 'Opportunity: Opportunity Owner 9', value: 8 },
    { title: 'Opportunity: Opportunity Owner 10', value: 9 },
    { title: 'Opportunity: Opportunity Owner 11', value: 10 },
    { title: 'Opportunity: Opportunity Owner 12', value: 11 },
    { title: 'Opportunity: Opportunity Owner 13', value: 12 },
    { title: 'Opportunity: Opportunity Owner 14', value: 13 }
  ])

  const removeDataTableHandler = index => {
    setDataTables(
      update(dataTables, {
        $splice: [[index, 1]]
      })
    )
  }

  const removeGroupRowsHandler = index => {
    setGroupRows(
      update(groupRows, {
        $splice: [[index, 1]]
      })
    )
  }

  const resizeHandler = (e, direction, ref) => setHeight(ref.offsetHeight)

  return (
    <Grid container direction="column" className={classes.container}>
      <Grid item container className={classes.header}>
        <FormControlSelect
          custom
          value={select}
          options={selectData}
          handleChange={e => setSelect(e.target.value)}
          label={t('Data Tables')}
          marginBottom={false}
          formControlRootClass={classes.headerInputRoot}
          formControlContainerClass={classes.headerInputContainer}
          nativeSelectIconClassName={classes.headerInputSelectIcon}
          inputClasses={{ input: classes.headerInput }}
        />
      </Grid>
      <Grid
        item
        container
        direction="column"
        className={classes.contentWrapper}
      >
        <Rnd
          disableDragging
          size={{
            width: '100%',
            height: height
          }}
          minHeight={150}
          maxHeight={720}
          style={{
            position: 'relative'
          }}
          onResize={resizeHandler}
          enableResizing={{
            top: false,
            topLeft: false,
            topRight: false,
            left: false,
            right: false,
            bottomLeft: false,
            bottomRight: false,
            bottom: true
          }}
        >
          <Grid
            container
            wrap="nowrap"
            direction="column"
            className={classes.content}
            style={{ height: '100%' }}
          >
            <FormControlInput
              value={dataTablesSearch}
              formControlRootClass={classes.inputContainer}
              formControlInputRootClass={classes.inputRoot}
              formControlLabelClass={classes.inputLabel}
              handleChange={e => setDataTablesSearch(e.target.value)}
              icon={
                <i className={`icon-beauty-hand-mirror ${classes.inputIcon}`} />
              }
            />

            <Grid container direction="column">
              {dataTables.map((item, index) => (
                <Item
                  key={`data-tables-${index}`}
                  title={item.title}
                  marginBottom={index !== dataTables.length - 1}
                  handleClick={() => removeDataTableHandler(index)}
                />
              ))}
            </Grid>

            <Grid
              container
              justify="center"
              alignItems="center"
              className={classes.contentDivider}
            />
          </Grid>
        </Rnd>

        <Grid
          container
          wrap="nowrap"
          direction="column"
          className={classes.content}
          style={{ height: `calc(100% - ${height}px)` }}
        >
          <FormControlInput
            value={groupRowsSearch}
            label={t('Group Rows')}
            handleChange={e => setGroupRowsSearch(e.target.value)}
            formControlRootClass={classes.inputContainer}
            formControlInputRootClass={classes.inputRoot}
            formControlLabelClass={classes.inputLabel}
            icon={
              <i className={`icon-beauty-hand-mirror ${classes.inputIcon}`} />
            }
          />

          <Grid container direction="column">
            {groupRows.map((item, index) => (
              <Item
                key={`group-rows-${index}`}
                title={item.title}
                marginBottom={index !== groupRows.length - 1}
                handleClick={() => removeGroupRowsHandler(index)}
              />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default translate('translations')(withStyles(styles)(DataTables))
