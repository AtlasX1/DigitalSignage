import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { Link, Route } from 'react-router-dom'
import { translate } from 'react-i18next'
import { withSnackbar } from 'notistack'
import { withStyles } from '@material-ui/core'
import { LabelImportant } from '@material-ui/icons'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { CircleIconButton, WhiteButton } from 'components/Buttons'
import PageContainer from 'components/PageContainer'
import {
  getItems,
  getTags,
  clearResponseInfo,
  deleteSelectedItems
} from 'actions/workplacePosterActions'
import { notificationAnalyzer } from 'utils'
import Filter from './Filter'
import AddEditWorkplacePoster from './AddEditWorkplacePoster'
import ManageTags from './ManageTags'
import routeByName from 'constants/routes'
import BaseTable from 'components/TableLibrary/BaseTable'
import TableRow from './TableRow'
import PageTitle from 'components/PageContainer/PageTitle'
import ImagePreview from 'components/Modal/ImagePreview'
import useSelectedList from 'hooks/tableLibrary/useSelectedList'
import useColorIcon from 'hooks/tableLibrary/useColorIcon'

const styles = ({ palette, type }) => ({
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
  }
})

const WorkplacePostersLibrary = ({
  t,
  put,
  del,
  post,
  meta,
  items,
  classes,
  getItems,
  getTags,
  enqueueSnackbar,
  clearResponseInfo,
  deleteSelectedItems
}) => {
  const itemsIds = useMemo(() => items.map(({ id }) => id), [items])
  const selectedList = useSelectedList(itemsIds)
  const categoryColor = useColorIcon(classes)
  const [isOpenPreview, togglePreview] = useState(false)
  const [contentToPreview, setContentToPreview] = useState('')

  const translate = useMemo(
    () => ({
      title: t('Workplace Posters page title'),
      tabTitle: t('Workplace Posters Library - Digital Signage'),
      add: t('Add Workplace Poster')
    }),
    [t]
  )

  useEffect(() => {
    getItems({
      page: 1
    })
    getTags()
    // eslint-disable-next-line
  }, [t])

  useEffect(() => {
    const wasNotify = notificationAnalyzer(
      enqueueSnackbar,
      [post, put, del],
      'Workplace Poster'
    )

    if (wasNotify) {
      clearResponseInfo()
      getItems({
        page: 1,
        limit: meta.perPage
      })
    }
    // eslint-disable-next-line
  }, [post, put, del])

  const columns = useMemo(
    () => [
      { id: 'title', label: 'Name' },
      { id: 'tag', label: 'Tags' },
      {
        id: 'size',
        label: 'Size',
        align: 'center'
      },
      {
        id: 'uploadType',
        label: 'Type',
        align: 'center'
      },
      {
        id: 'orientation',
        label: 'Orientation',
        align: 'center'
      },
      {
        id: 'updatedAt',
        label: 'Updated on',
        align: 'center'
      }
    ],
    []
  )

  const handleCLickPreviewImage = useCallback(content => {
    togglePreview(true)
    setContentToPreview(content)
  }, [])

  const handleClosePreviewModal = useCallback(() => {
    togglePreview(false)
  }, [])

  return (
    <PageContainer
      pageTitle={translate.title}
      PageTitleComponent={
        <PageTitle selectedCount={selectedList.count} title={translate.title} />
      }
      ActionButtonsComponent={
        <Fragment>
          <WhiteButton
            className={`hvr-radial-out ${classes.actionIcons}`}
            component={Link}
            to={routeByName.workplacePoster.add}
          >
            <i className={`${classes.iconColor} icon-user-add`} />
            {translate.add}
          </WhiteButton>
        </Fragment>
      }
      SubHeaderRightActionComponent={
        <CircleIconButton
          className={`hvr-grow ${classes.circleButton}`}
          component={Link}
          to={routeByName.workplacePoster.tags}
        >
          <LabelImportant nativeColor={categoryColor} />
        </CircleIconButton>
      }
      SubHeaderMenuComponent={<Filter fetcher={getItems} meta={meta} />}
    >
      <BaseTable
        meta={meta}
        rows={items}
        fetcher={getItems}
        columns={columns}
        deleteSelectedItems={deleteSelectedItems}
        selectedList={selectedList}
        noType={false}
        placeholderMessage="No saved workplace poster"
      >
        {items.map(row => (
          <TableRow
            onClickPreview={handleCLickPreviewImage}
            key={`workplace-posters-row-${row.id}`}
            selected={selectedList.isSelect(row.id)}
            onToggleSelect={selectedList.toggle}
            onUnselect={selectedList.unselect}
            row={row}
          />
        ))}
      </BaseTable>
      <Route
        path={routeByName.workplacePoster.add}
        component={AddEditWorkplacePoster}
      />
      <Route
        path={routeByName.workplacePoster.edit}
        component={AddEditWorkplacePoster}
      />
      <Route path={routeByName.workplacePoster.tags} component={ManageTags} />
      <ImagePreview
        screenPreview={contentToPreview}
        isOpen={isOpenPreview}
        onModalClose={handleClosePreviewModal}
      />
    </PageContainer>
  )
}

const mapStateToProps = ({
  workplacePosters: {
    items: { meta, response: items },
    post,
    put,
    del
  }
}) => ({
  items,
  meta,
  put,
  post,
  del
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getItems,
      getTags,
      clearResponseInfo,
      deleteSelectedItems
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(
      connect(mapStateToProps, mapDispatchToProps)(WorkplacePostersLibrary)
    )
  )
)
