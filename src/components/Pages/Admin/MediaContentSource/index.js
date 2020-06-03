import React, { useCallback, useEffect, useMemo } from 'react'
import { translate } from 'react-i18next'
import { Link, Route } from 'react-router-dom'
import { withStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withSnackbar } from 'notistack'
import { Category } from '@material-ui/icons'

import {
  clearContentResponseInfo,
  deleteSelectedContent,
  getContentsByFeature
} from 'actions/contentActions'

import { CircleIconButton, WhiteButton } from 'components/Buttons'
import PageContainer from 'components/PageContainer'
import ManageCategories from 'components/ManageCategories'
import BaseTable from 'components/TableLibrary/BaseTable'
import PageTitle from 'components/PageContainer/PageTitle'

import Components from './Components/index'
import config from './config'

import routeByName from 'constants/routes'

import useSelectedList from 'hooks/tableLibrary/useSelectedList'
import useIds from 'hooks/tableLibrary/useIds'
import useColorIcon from 'hooks/tableLibrary/useColorIcon'
import useNotifyAnalyzer from 'hooks/tableLibrary/useNotifyAnalyzer'

const styles = ({ palette, type }) => ({
  actionIcons: {
    marginRight: 17
  },
  iconColor: {
    marginRight: 9,
    fontSize: 14,
    color: palette[type].pageContainer.header.button.iconColor
  }
})

const MediaContentSource = ({
  t,
  put,
  del,
  post,
  meta,
  items,
  classes,
  feature,
  enqueueSnackbar,
  closeSnackbar,
  clearContentResponseInfo,
  deleteSelectedContent,
  getContentsByFeature
}) => {
  const translate = useMemo(
    () => ({
      tabTitle: t(config[feature].tabTitle),
      title: t(config[feature].title),
      category: t('Manage Categories'),
      add: t(config[feature].add)
    }),
    [feature, t]
  )

  const rowsIds = useIds(items)
  const selectedList = useSelectedList(rowsIds)
  const categoryColor = useColorIcon(classes)

  useEffect(() => {
    document.title = translate.tabTitle
    getContentsByFeature(feature, {
      page: 1
    })
    // eslint-disable-next-line
  }, [])

  const handleGetItems = useCallback(
    (params = { page: 1, limit: meta.perPage }) => {
      getContentsByFeature(feature, params)
    },
    [feature, getContentsByFeature, meta.perPage]
  )

  useNotifyAnalyzer(
    handleGetItems,
    clearContentResponseInfo,
    enqueueSnackbar,
    closeSnackbar,
    config[feature].keyWord,
    [post, put, del]
  )

  return (
    <PageContainer
      pageTitle={translate.title}
      PageTitleComponent={
        <PageTitle selectedCount={selectedList.count} title={translate.title} />
      }
      ActionButtonsComponent={
        <>
          <WhiteButton
            className={`hvr-radial-out ${classes.actionIcons}`}
            component={Link}
            to={routeByName[feature].add}
          >
            <i className={`${classes.iconColor} icon-folder-video`} />
            {translate.add}
          </WhiteButton>
        </>
      }
      SubHeaderRightActionComponent={
        <CircleIconButton
          className={`hvr-grow`}
          component={Link}
          to={routeByName[feature].categories}
        >
          <Category nativeColor={categoryColor} />
        </CircleIconButton>
      }
      SubHeaderMenuComponent={
        <Components
          feature={feature}
          component="Filter"
          fetcher={handleGetItems}
          perPage={meta.perPage}
        />
      }
    >
      <BaseTable
        meta={meta}
        fetcher={handleGetItems}
        columns={config[feature].columns}
        deleteSelectedItems={deleteSelectedContent}
        selectedList={selectedList}
        placeholderMessage={config[feature].placeholderMessage}
      >
        {items.map(row => (
          <Components
            feature={feature}
            component="Row"
            row={row}
            selected={selectedList.isSelect(row.id)}
            onToggleSelect={selectedList.toggle}
            onUnselect={selectedList.unselect}
            key={`media-content-row-${row.id}`}
          />
        ))}
      </BaseTable>

      <Route
        path={routeByName[feature].categories}
        render={props => (
          <ManageCategories
            feature={feature}
            closeLink={routeByName[feature].root}
            title={translate.category}
            {...props}
          />
        )}
      />
      <Components feature={feature} component="AddEdit" />
    </PageContainer>
  )
}

const mapStateToProps = ({ contents }, { feature }) => {
  return {
    items: contents.contentsByFeature[feature].response,
    meta: contents.contentsByFeature[feature].meta,
    put: contents.put,
    post: contents.post,
    del: contents.del
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearContentResponseInfo,
      deleteSelectedContent,
      getContentsByFeature
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(
      connect(mapStateToProps, mapDispatchToProps)(MediaContentSource)
    )
  )
)
