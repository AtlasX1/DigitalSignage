import React, { Fragment, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Link, Route } from 'react-router-dom'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withSnackbar } from 'notistack'
import { Category } from '@material-ui/icons'

import { CircleIconButton, WhiteButton } from 'components/Buttons'
import PageContainer from 'components/PageContainer'
import { notificationAnalyzer } from 'utils'
import Filter from './Filter'
import AddEditSideModal from './AddEditSideModal'
import featureConstants from 'constants/featureConstants'
import ManageCategories from 'components/ManageCategories'
import routeByName from 'constants/routes'
import {
  columns as columnsConfig,
  placeholder,
  groupActions,
  translateConfig
} from './config'
import BaseTable from 'components/TableLibrary/BaseTable'
import TableRow from 'components/Pages/HTMLContentLibrary/TableRow'
import PageTitle from 'components/PageContainer/PageTitle'
import useSelectedList from 'hooks/tableLibrary/useSelectedList'
import useColorIcon from 'hooks/tableLibrary/useColorIcon'
import { HTML_CONTENT } from 'constants/library'

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

const HTMLContentLibrary = ({
  t,
  put,
  del,
  post,
  meta,
  items,
  classes,
  getItems,
  deleteItem,
  categories,
  enqueueSnackbar,
  clearResponseInfo,
  deleteSelectedItems
}) => {
  const translate = useMemo(
    () => ({
      title: t(translateConfig.title),
      add: t(translateConfig.add),
      category: t(translateConfig.category),
      tabTitle: t(translateConfig.tabTitle)
    }),
    [t]
  )

  const rowsIds = useMemo(() => items.map(({ id }) => id), [items])
  const categoryColor = useColorIcon(classes)
  const selectedList = useSelectedList(rowsIds)

  useEffect(() => {
    document.title = translateConfig.tabTitle
    getItems({
      page: 1
    })
    // eslint-disable-next-line
  }, [t])

  useEffect(() => {
    const wasNotify = notificationAnalyzer(
      enqueueSnackbar,
      [post, put, del],
      translateConfig.notifyKey
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

  const columns = useMemo(() => columnsConfig, [])

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
            to={routeByName[HTML_CONTENT].add}
          >
            <i className={`${classes.iconColor} icon-user-add`} />
            {translate.add}
          </WhiteButton>
        </Fragment>
      }
      SubHeaderMenuComponent={<Filter getItems={getItems} meta={meta} />}
      SubHeaderRightActionComponent={
        <CircleIconButton
          className={`hvr-grow ${classes.circleButton}`}
          component={Link}
          to={routeByName[HTML_CONTENT].categories}
        >
          <Category nativeColor={categoryColor} />
        </CircleIconButton>
      }
    >
      <BaseTable
        meta={meta}
        rows={items}
        fetcher={getItems}
        columns={columns}
        deleteSelectedItems={deleteSelectedItems}
        selectedList={selectedList}
        placeholderMessage={placeholder}
      >
        {items.map(row => (
          <TableRow
            key={row.id}
            selected={selectedList.isSelect(row.id)}
            onToggleSelect={selectedList.toggle}
            onUnselect={selectedList.unselect}
            deleteItem={deleteItem}
            row={row}
          />
        ))}
      </BaseTable>
      <Route
        path={routeByName[HTML_CONTENT].add}
        render={props => <AddEditSideModal {...props} />}
      />
      <Route
        path={routeByName[HTML_CONTENT].edit}
        render={props => <AddEditSideModal {...props} />}
      />
      <Route
        path={routeByName[HTML_CONTENT].categories}
        render={props => (
          <ManageCategories
            feature={featureConstants[HTML_CONTENT]}
            closeLink={routeByName[HTML_CONTENT].root}
            title={translate.category}
            {...props}
          />
        )}
      />
    </PageContainer>
  )
}

HTMLContentLibrary.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = ({ categories: { categoriesByFeature }, ...state }) => {
  const categories = featureConstants[HTML_CONTENT]

  return {
    meta: state[HTML_CONTENT].items.meta,
    items: state[HTML_CONTENT].items.response,
    put: state[HTML_CONTENT].put,
    post: state[HTML_CONTENT].post,
    del: state[HTML_CONTENT].del,
    categories: categoriesByFeature[categories].response
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...groupActions
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(
      connect(mapStateToProps, mapDispatchToProps)(HTMLContentLibrary)
    )
  )
)
