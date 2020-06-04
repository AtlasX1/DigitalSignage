import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { translate } from 'react-i18next'
import { Link, Route } from 'react-router-dom'
import { bindActionCreators, compose } from 'redux'
import { withSnackbar } from 'notistack'
import { connect } from 'react-redux'
import { Grid, withStyles } from '@material-ui/core'

import {
  WhiteButton,
  TabToggleButtonGroup,
  TabToggleButton
} from 'components/Buttons'
import PageContainer from 'components/PageContainer'
import ScheduleSearchForm from './ScheduleSearch'
import SchedulePublish from './SchedulePublish'
import entityConstants from 'constants/entityConstants'
import PageTitle from 'components/PageContainer/PageTitle'
import ScheduleTableRow from 'components/Pages/Schedule/ScheduleTableRow'
import BaseTable from 'components/TableLibrary/BaseTable'
import CopyItemModal from 'components/Modal/CopyItemModal'
import GroupModal from 'components/Group'
import ScheduleItem from './ScheduleItem'

import useNotifyAnalyzer from 'hooks/tableLibrary/useNotifyAnalyzer'
import useIds from 'hooks/tableLibrary/useIds'
import useSelectedList from 'hooks/tableLibrary/useSelectedList'
import usePreference from 'hooks/tableLibrary/usePreference'
import {
  clearResponseInfo,
  cloneSchedule as cloneItem,
  deleteSelectedSchedules as deleteSelectedItems,
  getScheduleItemsAction as getItems,
  getScheduleGroupItemsAction,
  clearGetScheduleGroupItemsInfoAction,
  clearScheduleGroupItemsInfo,
  postScheduleGroupItemAction,
  deleteScheduleGroupItemAction
} from 'actions/scheduleActions'
import {
  dndConstants,
  entityGroupsConstants,
  routeByName
} from 'constants/index'

const styles = theme => {
  const { palette, type } = theme
  return {
    actionIcons: {
      marginRight: '17px'
    },
    iconColor: {
      marginRight: '9px',
      fontSize: '14px',
      color: palette[type].pageContainer.header.button.iconColor
    },
    selectTitle: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: palette[type].pageContainer.header.titleColor
    },
    selectSubTitle: {
      fontSize: '15px',
      fontWeight: 'bold',
      color: palette[type].pageContainer.header.titleColor
    },
    schedulesList: {
      paddingLeft: '40px'
    }
  }
}

const initialColumns = [
  { id: 'scheduleType', label: 'Type', display: true },
  { id: 'title', label: 'Name', display: true },
  { id: 'group', label: 'Group', display: true },
  { id: 'duration', label: 'Working Dates', display: true },
  { id: 'workingDays', label: 'Working Days', display: true },
  { id: 'orientation', label: 'Working Time', display: true },
  { id: 'status', label: 'Status', align: 'center', display: true }
]

const cloneModalInitialState = {
  open: false,
  playlistId: 0,
  title: ''
}

const ScheduleLibrary = ({
  t,
  classes,
  items,
  meta,
  getItems,
  cloneItem,
  enqueueSnackbar,
  closeSnackbar,
  clearResponseInfo,
  deleteSelectedItems,
  del,
  clone,
  getScheduleGroupItemsAction,
  clearGetScheduleGroupItemsInfoAction,
  clearScheduleGroupItemsInfo,
  postScheduleGroupItemAction,
  deleteScheduleGroupItemAction,
  postGroupItemReducer,
  groupItemsReducer,
  deleteGroupItemReducer,
  modalHeight
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(t('All Schedule Tab'))

  const translate = useMemo(
    () => ({
      title: t('Schedule page title'),
      groups: t('Groups'),
      add: t('Add Schedule table action'),
      showInactive: t('Show Inactive Users')
    }),
    [t]
  )

  const rowsIds = useIds(items)

  const selectedList = useSelectedList(rowsIds)

  const preference = usePreference({
    initialColumns,
    fetcher: getItems,
    entity: entityConstants.ScheduleLibrary,
    perPage: meta.perPage
  })

  const fetchItems = useCallback(
    () =>
      getItems({
        page: 1,
        limit: meta.perPage
      }),
    [getItems, meta.perPage]
  )

  useNotifyAnalyzer(
    fetchItems,
    clearResponseInfo,
    enqueueSnackbar,
    closeSnackbar,
    'Schedule',
    [del, clone]
  )

  const [dataOfCopyModal, setDataOfCopyModal] = useState(cloneModalInitialState)

  const handleCloneRow = useCallback(data => {
    setDataOfCopyModal(data)
  }, [])

  const handleCloseModal = useCallback(() => {
    setDataOfCopyModal(cloneModalInitialState)
  }, [])

  const handleCopySchedule = useCallback(
    data => {
      cloneItem({ ...data, scheduleId: data.id })
    },
    [cloneItem]
  )

  const handleMoveItem = useCallback(
    (scheduleId, groupId) => {
      postScheduleGroupItemAction({ scheduleId, groupId })
    },
    [postScheduleGroupItemAction]
  )

  const handleDeleteGroupItem = useCallback(
    ({ groupId, itemId }) => {
      deleteScheduleGroupItemAction({ scheduleId: itemId, groupId })
    },
    [deleteScheduleGroupItemAction]
  )

  return (
    <div style={{ height: modalHeight }}>
      <PageContainer
        pageTitle={translate.title}
        PageTitleComponent={
          <PageTitle
            selectedCount={selectedList.count}
            title={translate.title}
          />
        }
        MiddleActionComponent={
          <TabToggleButtonGroup
            value={selectedPeriod}
            exclusive
            onChange={(event, selectedValue) =>
              setSelectedPeriod(selectedValue)
            }
          >
            <TabToggleButton value={t('All Schedule Tab')}>
              {t('All Schedule Tab')}
            </TabToggleButton>
            <TabToggleButton value={t('Today Schedule Tab')}>
              {t('Today Schedule Tab')}
            </TabToggleButton>
            <TabToggleButton value={t('Week Schedule Tab')}>
              {t('Week Schedule Tab')}
            </TabToggleButton>
            <TabToggleButton value={t('Month Schedule Tab')}>
              {t('Month Schedule Tab')}
            </TabToggleButton>
          </TabToggleButtonGroup>
        }
        ActionButtonsComponent={
          <Fragment>
            <WhiteButton
              className={`hvr-radial-out ${classes.actionIcons}`}
              component={Link}
              to={routeByName.schedule.groups}
            >
              <i
                className={`${classes.iconColor} icon-navigation-show-more-vertical`}
              />
              {translate.groups}
            </WhiteButton>
            <WhiteButton
              className={`hvr-radial-out ${classes.actionIcons}`}
              component={Link}
              to={routeByName.schedule.publish}
            >
              <i className={`${classes.iconColor} icon-folder-video`} />
              {translate.add}
            </WhiteButton>
          </Fragment>
        }
        SubHeaderMenuComponent={<ScheduleSearchForm />}
      >
        <BaseTable
          meta={meta}
          fetcher={getItems}
          columns={preference.columns}
          preferenceActions={preference.actions}
          deleteSelectedItems={deleteSelectedItems}
          selectedList={selectedList}
          placeholderMessage="No saved schedule"
        >
          {items.map(row => (
            <ScheduleTableRow
              row={row}
              columns={preference.columns}
              selected={selectedList.isSelect(row.id)}
              onToggleSelect={selectedList.toggle}
              onUnselect={selectedList.unselect}
              key={`schedule-row-${row.id}`}
              onClone={handleCloneRow}
            />
          ))}
        </BaseTable>
        <CopyItemModal
          data={dataOfCopyModal}
          onCloseModal={handleCloseModal}
          modalTitle="Copy schedule"
          inputPlaceholder="Schedule name"
          onClickSave={handleCopySchedule}
        />
        <Route
          path={routeByName.schedule.publish}
          component={SchedulePublish}
        />
        <Route
          path={routeByName.schedule.groups}
          render={props => (
            <GroupModal
              {...props}
              title={t('Schedule Groups')}
              closeLink={routeByName.schedule.root}
              entity={entityGroupsConstants.Schedule}
              groupItemsTitle={t('Schedules')}
              dropItemType={dndConstants.scheduleGroupsItemTypes.SCHEDULE_ITEM}
              onMoveItem={handleMoveItem}
              itemsLoading={meta.isLoading}
              groupItemsReducer={groupItemsReducer}
              postGroupItemReducer={postGroupItemReducer}
              deleteGroupItemReducer={deleteGroupItemReducer}
              clearGroupItemsInfo={clearScheduleGroupItemsInfo}
              displayOverflow={true}
              itemsPopupProps={{
                getGroupItems: getScheduleGroupItemsAction,
                onDeleteItem: handleDeleteGroupItem,
                clearGroupItemsInfo: clearGetScheduleGroupItemsInfoAction
              }}
            >
              <Grid container className={classes.schedulesList}>
                {items.map((schedule, index) => (
                  <ScheduleItem
                    key={`schedule-${index}`}
                    schedule={schedule}
                    index={index}
                  />
                ))}
              </Grid>
            </GroupModal>
          )}
        />
      </PageContainer>
    </div>
  )
}

const mapStateToProps = ({ schedule, appReducer }) => ({
  items: schedule.library.response,
  meta: schedule.library.meta,
  del: schedule.del,
  clone: schedule.clone,
  postGroupItemReducer: schedule.postGroupItem,
  groupItemsReducer: schedule.groupItems,
  deleteGroupItemReducer: schedule.deleteGroupItem,
  modalHeight: appReducer.height
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getItems,
      clearResponseInfo,
      deleteSelectedItems,
      cloneItem,
      getScheduleGroupItemsAction,
      clearGetScheduleGroupItemsInfoAction,
      clearScheduleGroupItemsInfo,
      postScheduleGroupItemAction,
      deleteScheduleGroupItemAction
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  withSnackbar,
  connect(mapStateToProps, mapDispatchToProps)
)(ScheduleLibrary)
