import React, {
  Fragment,
  useState,
  useEffect,
  useMemo,
  useCallback
} from 'react'
import { Route, Link, Redirect } from 'react-router-dom'
import { translate } from 'react-i18next'
import { bindActionCreators, compose } from 'redux'
import { withSnackbar } from 'notistack'
import { connect } from 'react-redux'
import { Grid, withStyles } from '@material-ui/core'
import { GridOn, List } from '@material-ui/icons'

import {
  clearResponseInfo,
  cloneTemplate as cloneItem,
  deleteSelectedTemplate as deleteSelectedItems,
  getTemplateItemsAction as getItems
} from 'actions/templateActions'

import PageContainer from 'components/PageContainer'
import { CircleIconButton, WhiteButton } from 'components/Buttons'
import PageTitle from 'components/PageContainer/PageTitle'
import TemplateGridView from './TemplateGrid'
import TemplateSearchForm from './TemplateSearch'
import CreateTemplate from './CreateTemplate'
import CopyItemModal from 'components/Modal/CopyItemModal'
import BaseTable from 'components/TableLibrary/BaseTable'
import entityConstants from 'constants/entityConstants'
import TemplateTableRow from 'components/Pages/Template/TemplateTableRow'
import TemplateItem from './TemplateItem'

import routeByName from 'constants/routes'
import useSelectedList from 'hooks/tableLibrary/useSelectedList'
import usePreference from 'hooks/tableLibrary/usePreference'
import useNotifyAnalyzer from 'hooks/tableLibrary/useNotifyAnalyzer'
import useIds from 'hooks/tableLibrary/useIds'
import { libraryUtils } from 'utils/index'
import {
  getTemplateGroupItemsAction,
  clearGetTemplateGroupItemsInfoAction,
  clearTemplateGroupItemsInfo,
  postTemplateGroupItemAction,
  deleteTemplateGroupItemAction
} from 'actions/templateActions'
import GroupModal from 'components/Group'
import { dndConstants, entityGroupsConstants } from 'constants/index'

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
    circleButton: {
      color: '#afb7c7',

      '&:hover': {
        color: '#1c5dca'
      }
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
    templatesItemsContainer: {
      maxHeight: 'calc(100% - 42px)',
      overflowY: 'auto'
    }
  }
}

const initialColumns = [
  { id: 'templateType', label: 'Type', display: true },
  { id: 'title', label: 'Name', display: true },
  { id: 'group', label: 'Group', display: true },
  { id: 'duration', label: 'Duration', display: true },
  { id: 'resolution', label: 'Resolution', display: true },
  { id: 'orientation', label: 'Orientation', display: true },
  { id: 'displayQty', label: 'Displays', align: 'center', display: true },
  { id: 'status', label: 'Status', align: 'center', display: true }
]

const cloneModalInitialState = {
  open: false,
  playlistId: 0,
  title: ''
}

const TemplateLibrary = ({
  t,
  items,
  classes,
  meta,
  del,
  clone,
  location,
  getItems,
  cloneItem,
  clearResponseInfo,
  deleteSelectedItems,
  enqueueSnackbar,
  closeSnackbar,
  getTemplateGroupItemsAction,
  clearGetTemplateGroupItemsInfoAction,
  clearTemplateGroupItemsInfo,
  postTemplateGroupItemAction,
  deleteTemplateGroupItemAction,
  postGroupItemReducer,
  groupItemsReducer,
  deleteGroupItemReducer,
  modalHeight
}) => {
  const translate = useMemo(
    () => ({
      tabTitle: t('Template Library - Digital Signage'),
      title: t('Template page title'),
      groups: t('Groups'),
      add: t('Add Template table action')
    }),
    [t]
  )

  const rowsIds = useIds(items)

  const selectedList = useSelectedList(rowsIds)

  useEffect(() => {
    document.title = translate.tabTitle
    //eslint-disable-next-line
  }, [])

  const preference = usePreference({
    initialColumns,
    fetcher: getItems,
    entity: entityConstants.TemplateLibrary,
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

  const [dataOfCopyModal, setDataOfCopyModal] = useState(cloneModalInitialState)

  const handleCloneRow = useCallback(data => {
    setDataOfCopyModal(data)
  }, [])

  const handleCloseModal = useCallback(() => {
    setDataOfCopyModal(cloneModalInitialState)
  }, [])

  const handleCopyPlaylist = useCallback(
    data => {
      cloneItem({ ...data, templateId: data.id })
    },
    [cloneItem]
  )

  useNotifyAnalyzer(
    fetchItems,
    clearResponseInfo,
    enqueueSnackbar,
    closeSnackbar,
    'Template',
    [del, clone]
  )

  const createTemplateRoute = useMemo(
    () => location.pathname.includes(routeByName.template.create),
    [location]
  )

  const handleMoveItem = useCallback(
    (templateId, groupId) => {
      postTemplateGroupItemAction({ templateId, groupId })
    },
    [postTemplateGroupItemAction]
  )

  const handleDeleteGroupItem = useCallback(
    ({ groupId, itemId }) => {
      deleteTemplateGroupItemAction({ templateId: itemId, groupId })
    },
    [deleteTemplateGroupItemAction]
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
        ActionButtonsComponent={
          <Fragment>
            <WhiteButton
              className={`hvr-radial-out ${classes.actionIcons}`}
              component={Link}
              to={routeByName.template.groups}
            >
              <i
                className={`${classes.iconColor} icon-navigation-show-more-vertical`}
              />
              {translate.groups}
            </WhiteButton>
            <WhiteButton
              className={`hvr-radial-out ${classes.actionIcons}`}
              component={Link}
              to={routeByName.template.create}
            >
              <i className={`${classes.iconColor} icon-folder-video`} />
              {translate.add}
            </WhiteButton>
          </Fragment>
        }
        SubHeaderMenuComponent={<TemplateSearchForm />}
        SubHeaderRightActionComponent={
          <Fragment>
            <CircleIconButton
              className={`hvr-grow ${classes.circleButton}`}
              component={Link}
              to={routeByName.template.grid}
            >
              <GridOn />
            </CircleIconButton>
            <CircleIconButton
              className={`hvr-grow ${classes.circleButton}`}
              component={Link}
              to={routeByName.template.list}
            >
              <List />
            </CircleIconButton>
          </Fragment>
        }
        subHeader={!createTemplateRoute}
        header={!createTemplateRoute}
      >
        <Route
          exact
          path={routeByName.template.root}
          render={() => <Redirect to={routeByName.template.list} />}
        />
        <Route
          exact={createTemplateRoute}
          path={routeByName.template.list}
          render={() => (
            <BaseTable
              meta={meta}
              fetcher={getItems}
              columns={preference.columns}
              preferenceActions={preference.actions}
              deleteSelectedItems={deleteSelectedItems}
              selectedList={selectedList}
              placeholderMessage="No saved template"
            >
              {items.map(row => (
                <TemplateTableRow
                  row={row}
                  columns={preference.columns}
                  selected={selectedList.isSelect(row.id)}
                  onToggleSelect={selectedList.toggle}
                  onUnselect={selectedList.unselect}
                  key={`template-row-${row.id}`}
                  onClone={handleCloneRow}
                />
              ))}
            </BaseTable>
          )}
        />
        <CopyItemModal
          data={dataOfCopyModal}
          onCloseModal={handleCloseModal}
          modalTitle="Copy template"
          inputPlaceholder="Template name"
          onClickSave={handleCopyPlaylist}
        />
        <Route path={routeByName.template.grid} component={TemplateGridView} />
        <Route
          exact
          path={routeByName.template.groups}
          render={props => (
            <GroupModal
              {...props}
              title={t('Template Groups')}
              closeLink={routeByName.template.list}
              entity={entityGroupsConstants.Template}
              groupItemsTitle={t('Templates')}
              dropItemType={dndConstants.templateGroupsItemTypes.TEMPLATE_ITEM}
              onMoveItem={handleMoveItem}
              itemsLoading={meta.isLoading}
              groupItemsReducer={groupItemsReducer}
              postGroupItemReducer={postGroupItemReducer}
              deleteGroupItemReducer={deleteGroupItemReducer}
              clearGroupItemsInfo={clearTemplateGroupItemsInfo}
              displayOverflow={true}
              itemsPopupProps={{
                getGroupItems: getTemplateGroupItemsAction,
                onDeleteItem: handleDeleteGroupItem,
                clearGroupItemsInfo: clearGetTemplateGroupItemsInfoAction
              }}
            >
              <Grid container className={classes.templatesItemsContainer}>
                {libraryUtils.sortByName(items).map((template, index) => (
                  <TemplateItem key={`template-${index}`} template={template} />
                ))}
              </Grid>
            </GroupModal>
          )}
        />
        <Route
          exact
          path={routeByName.template.edit}
          component={CreateTemplate}
        />
      </PageContainer>
    </div>
  )
}

const mapStateToProps = ({
  template: {
    library: { meta, response: items },
    clone,
    del,
    postGroupItem,
    groupItems,
    deleteGroupItem
  },
  appReducer
}) => ({
  items,
  meta,
  del,
  clone,
  postGroupItemReducer: postGroupItem,
  groupItemsReducer: groupItems,
  deleteGroupItemReducer: deleteGroupItem,
  modalHeight: appReducer.height
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getItems,
      clearResponseInfo,
      deleteSelectedItems,
      cloneItem,
      getTemplateGroupItemsAction,
      clearGetTemplateGroupItemsInfoAction,
      clearTemplateGroupItemsInfo,
      postTemplateGroupItemAction,
      deleteTemplateGroupItemAction
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  withSnackbar,
  connect(mapStateToProps, mapDispatchToProps)
)(TemplateLibrary)
