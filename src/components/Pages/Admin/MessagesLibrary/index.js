import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import { Link, Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { withSnackbar } from 'notistack'

import PageContainer from 'components/PageContainer'
import AddEditSideModal from './AddEditSideModal'
import { notificationAnalyzer } from 'utils'
import TableRow from './TableRow'
import BaseTable from 'components/TableLibrary/BaseTable'
import MoreActionBtn from 'components/Buttons/MoreActionBtn'
import { groupActions, moreActionOptions } from './config'
import { WhiteButton } from 'components/Buttons'
import routeByName from 'constants/routes'
import { CUSTOM_EMAIL_TEMPLATE, EMAIL_TEMPLATE } from 'constants/library'
import PageTitle from 'components/PageContainer/PageTitle'

const styles = ({ palette, type }) => ({
  actionIcons: {
    marginRight: '17px'
  },
  iconColor: {
    marginRight: '9px',
    fontSize: '14px',
    color: palette[type].pageContainer.header.button.iconColor
  }
})

const MessagesLibrary = ({
  t,
  put,
  meta,
  classes,
  items,
  history,
  getItems,
  variant = EMAIL_TEMPLATE,
  enqueueSnackbar,
  clearResponseInfo
}) => {
  const translate = useMemo(
    () => ({
      [EMAIL_TEMPLATE]: {
        title: t('Predefined E-mail Templates')
      },
      [CUSTOM_EMAIL_TEMPLATE]: {
        title: t('Special E-mail Templates')
      },
      add: t('Add E-mail Templates')
    }),
    [t]
  )

  const [selectedList, changeSelectedList] = useState({})

  const selectedCount = useMemo(() => Object.keys(selectedList).length, [
    selectedList
  ])

  useEffect(() => {
    getItems({
      page: 1
    })
    // eslint-disable-next-line
  }, [t])

  useEffect(() => {
    const wasNotify = notificationAnalyzer(enqueueSnackbar, [put], 'Message')

    if (wasNotify) {
      clearResponseInfo()
      getItems({
        page: 1,
        limit: meta.perPage
      })
    }
    // eslint-disable-next-line
  }, [put])

  const columns = useMemo(
    () => [
      { id: 'title', label: 'Name', display: true },
      { id: 'subject', label: 'Subject', display: true }
    ],
    []
  )

  const handleClickMoreActionBtn = useCallback(
    value => {
      const location = {
        pathname: routeByName[value].root
      }

      switch (value) {
        case EMAIL_TEMPLATE: {
          history.replace(location)
          break
        }
        case CUSTOM_EMAIL_TEMPLATE: {
          history.replace(location)
          break
        }
        default:
          break
      }
    },
    [history]
  )

  return (
    <PageContainer
      pageTitle={translate[variant].title}
      PageTitleComponent={
        <PageTitle
          selectedCount={selectedCount}
          title={translate[variant].title}
        />
      }
      ActionButtonsComponent={
        <>
          <MoreActionBtn
            onClick={handleClickMoreActionBtn}
            options={moreActionOptions}
          />
          {variant === CUSTOM_EMAIL_TEMPLATE && (
            <WhiteButton
              className={`hvr-radial-out ${classes.actionIcons}`}
              component={Link}
              to={routeByName[variant].add}
            >
              <i className={`${classes.iconColor} icon-user-add`} />
              {translate.add}
            </WhiteButton>
          )}
        </>
      }
      isShowSubHeaderComponent={false}
    >
      <BaseTable
        meta={meta}
        rows={items}
        fetcher={getItems}
        columns={columns}
        onChangeSelectedList={changeSelectedList}
        selectedList={selectedList}
        placeholderMessage="No saved messages"
      >
        {items.map(row => (
          <TableRow
            row={row}
            variant={variant}
            selected={!!selectedList[row.id]}
            onSelectRow={changeSelectedList}
            key={`email-template-row-${row.id}`}
          />
        ))}
      </BaseTable>
      <Route
        exact
        path={routeByName[variant].edit}
        render={props => <AddEditSideModal variant={variant} {...props} />}
      />
      {variant === CUSTOM_EMAIL_TEMPLATE && (
        <Route
          exact
          path={routeByName[variant].add}
          render={props => <AddEditSideModal variant={variant} {...props} />}
        />
      )}
    </PageContainer>
  )
}

MessagesLibrary.propTypes = {
  classes: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
}

const mapStateToProps = (state, { variant }) => ({
  meta: state[variant].items.meta,
  items: state[variant].items.response,
  put: state[variant].put,
  post: variant === EMAIL_TEMPLATE ? {} : state[variant].post
})

const mapDispatchToProps = (dispatch, { variant }) =>
  bindActionCreators(
    {
      ...groupActions[variant]
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(MessagesLibrary))
  )
)
