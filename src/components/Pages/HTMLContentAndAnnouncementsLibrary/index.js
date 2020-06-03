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
import TableRow from 'components/Pages/HTMLContentAndAnnouncementsLibrary/TableRow'
import { ANNOUNCEMENT } from 'constants/library'
import PageTitle from 'components/PageContainer/PageTitle'
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

const AnnouncementsLibrary = ({
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
  deleteSelectedItems,
  variant = ANNOUNCEMENT
}) => {
  const translate = useMemo(
    () => ({
      title: t(translateConfig[variant].title),
      add: t(translateConfig[variant].add),
      category: t(translateConfig[variant].category),
      tabTitle: t(translateConfig[variant].tabTitle)
    }),
    [t, variant]
  )

  const rowsIds = useMemo(() => items.map(({ id }) => id), [items])
  const categoryColor = useColorIcon(classes)
  const selectedList = useSelectedList(rowsIds)

  useEffect(() => {
    document.title = translateConfig[variant].tabTitle
    getItems({
      page: 1
    })
    // eslint-disable-next-line
  }, [t])

  useEffect(() => {
    const wasNotify = notificationAnalyzer(
      enqueueSnackbar,
      [post, put, del],
      translateConfig[variant].notifyKey
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

  const columns = useMemo(() => columnsConfig[variant], [variant])

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
            to={routeByName[variant].add}
          >
            <i className={`${classes.iconColor} icon-user-add`} />
            {translate.add}
          </WhiteButton>
        </Fragment>
      }
      SubHeaderMenuComponent={
        <Filter getItems={getItems} meta={meta} variant={variant} />
      }
      SubHeaderRightActionComponent={
        <CircleIconButton
          className={`hvr-grow ${classes.circleButton}`}
          component={Link}
          to={routeByName[variant].categories}
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
        placeholderMessage={placeholder[variant]}
      >
        {items.map(row => (
          <TableRow
            key={`announcement-row-${row.id}`}
            selected={selectedList.isSelect(row.id)}
            onToggleSelect={selectedList.toggle}
            onUnselect={selectedList.unselect}
            deleteItem={deleteItem}
            variant={variant}
            row={row}
          />
        ))}
      </BaseTable>
      <Route
        path={routeByName[variant].add}
        render={props => <AddEditSideModal variant={variant} {...props} />}
      />
      <Route
        path={routeByName[variant].edit}
        render={props => <AddEditSideModal variant={variant} {...props} />}
      />
      <Route
        path={routeByName[variant].categories}
        render={props => (
          <ManageCategories
            feature={featureConstants[variant]}
            closeLink={routeByName[variant].root}
            title={translate.category}
            {...props}
          />
        )}
      />
    </PageContainer>
  )
}

AnnouncementsLibrary.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = (
  { categories: { categoriesByFeature }, ...state },
  { variant }
) => {
  const categories = featureConstants[variant]

  return {
    meta: state[variant].items.meta,
    items: state[variant].items.response,
    put: state[variant].put,
    post: state[variant].post,
    del: state[variant].del,
    categories: categoriesByFeature[categories].response
  }
}

const mapDispatchToProps = (dispatch, { variant }) =>
  bindActionCreators(
    {
      ...groupActions[variant]
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(
      connect(mapStateToProps, mapDispatchToProps)(AnnouncementsLibrary)
    )
  )
)
