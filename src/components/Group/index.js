import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { translate } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Grid, withStyles } from '@material-ui/core'
import { withSnackbar } from 'notistack'

import { SideModal } from 'components/Modal'
import { Card, GroupCard } from 'components/Card'
import { FormControlInput } from 'components/Form'
import { WhiteButton } from 'components/Buttons'
import { GroupModalItemsLoader, GroupsLoader } from 'components/Loaders'
import ActionDropdown from 'components/Dropdowns/GroupActionDropdown'
import {
  getGroupsByEntity,
  postGroupAction,
  clearUpdateGroupInfoAction,
  putGroupAction,
  deleteGroupAction
} from 'actions/groupActions'
import { notificationAnalyzer, groupsUtils } from 'utils'
import { useCustomSnackbar } from 'hooks'

const styles = ({ palette, type }) => ({
  groupsContainer: {
    height: '100%'
  },
  groupContainer: {
    padding: '0 20px',
    borderRight: `1px solid ${palette[type].sideModal.content.border}`
  },
  itemsContainer: {
    padding: '0 20px'
  },
  header: {
    paddingLeft: '0',
    border: `solid 1px ${palette[type].sideModal.content.border}`,
    backgroundColor: palette[type].sideModal.groups.header.background,
    margin: '0 0 20px'
  },
  headerText: {
    fontWeight: 'bold',
    lineHeight: '42px',
    color: palette[type].sideModal.groups.header.titleColor
  },
  addNewGroupWrap: {
    paddingLeft: '10px'
  },
  addNewGroup: {
    width: '100%',
    height: '38px',
    borderColor: palette[type].sideModal.groups.button.border,
    boxShadow: 'none',
    backgroundColor: palette[type].sideModal.groups.button.background
  },
  addNewGroupLabel: {
    fontWeight: 'normal',
    color: palette[type].sideModal.groups.button.color
  }
})

const GroupModal = ({
  t,
  classes,
  title,
  closeLink,
  entity,
  getGroupsByEntity,
  groupsLoading,
  groups,
  post,
  put,
  del,
  postGroupAction,
  putGroupAction,
  deleteGroupAction,
  clearUpdateGroupInfoAction,
  groupItemsTitle,
  dropItemType,
  onMoveItem,
  groupItemsReducer,
  postGroupItemReducer,
  deleteGroupItemReducer,
  clearGroupItemsInfo,
  itemsPopupProps,
  itemsLoading,
  enqueueSnackbar,
  closeSnackbar,
  groupCardItemsTitle,
  children
}) => {
  const newGroupForm = useFormik({
    initialValues: {
      title: '',
      color: '#3983ff',
      entity: entity
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required()
    }),
    onSubmit: values => {
      postGroupAction(values)
    }
  })
  const [groupsList, setGroupsList] = useState(groups)

  useEffect(() => {
    getGroupsByEntity(entity)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    setGroupsList(groups)
  }, [groups])

  useEffect(() => {
    const wasNotify = notificationAnalyzer(
      enqueueSnackbar,
      [post, put, del],
      `${entity} Group`,
      closeSnackbar
    )

    if (wasNotify) {
      newGroupForm.resetForm()
      clearUpdateGroupInfoAction()
      getGroupsByEntity(entity)
    }
    // eslint-disable-next-line
  }, [post, put, del])

  const showSnackbar = useCustomSnackbar(t, enqueueSnackbar, closeSnackbar)

  const updateGroupItemsInfo = useCallback(
    reducer => {
      if (reducer.response) {
        showSnackbar(t('Successfully updated'))
        clearGroupItemsInfo()
        getGroupsByEntity(entity)
      } else if (reducer.error) {
        showSnackbar(reducer.error.message)
        clearGroupItemsInfo()
      }
    },
    [t, clearGroupItemsInfo, getGroupsByEntity, entity, showSnackbar]
  )

  useEffect(() => {
    updateGroupItemsInfo(postGroupItemReducer)
  }, [updateGroupItemsInfo, postGroupItemReducer])

  useEffect(() => {
    updateGroupItemsInfo(deleteGroupItemReducer)
  }, [updateGroupItemsInfo, deleteGroupItemReducer])

  const handleChangeGroupTitle = useCallback(
    (id, value) => {
      const groupsListCopy = [...groupsList]
      const changedTitleGroupIndex = groupsList.findIndex(
        ({ id: groupId }) => id === groupId
      )
      groupsListCopy[changedTitleGroupIndex].title = value
      setGroupsList(groupsListCopy)
      putGroupAction({ id, data: { title: value } })
    },
    [groupsList, putGroupAction]
  )

  const handleSelectColor = useCallback(
    (id, color) => {
      const { title } = groupsList.find(({ id: groupId }) => groupId === id)
      putGroupAction({ id, data: { color, title } })
    },
    [putGroupAction, groupsList]
  )

  return (
    <SideModal width="78%" title={title} closeLink={closeLink}>
      <Grid container className={classes.groupsContainer}>
        <Grid item xs={4} className={classes.groupContainer}>
          <Card
            dropdown={false}
            grayHeader={true}
            shadow={false}
            radius={false}
            icon={false}
            removeSidePaddings={true}
            title={t('Groups').toUpperCase()}
            headerClasses={[classes.header]}
            headerTextClasses={[classes.headerText]}
          >
            <Grid container>
              <Grid item xs={8}>
                <FormControlInput
                  id="new-group-name"
                  fullWidth={true}
                  label={false}
                  name="title"
                  value={newGroupForm.values.title}
                  handleChange={newGroupForm.handleChange}
                  handleBlur={newGroupForm.handleBlur}
                  error={newGroupForm.errors.title}
                  touched={newGroupForm.touched.title}
                  showErrorText={false}
                />
              </Grid>
              <Grid item xs={4} className={classes.addNewGroupWrap}>
                <WhiteButton
                  classes={{
                    root: classes.addNewGroup,
                    label: classes.addNewGroupLabel
                  }}
                  onClick={newGroupForm.handleSubmit}
                >
                  {t('Add new')}
                </WhiteButton>
              </Grid>
            </Grid>
            {groupsLoading ? (
              <GroupsLoader />
            ) : (
              <Grid container direction="column">
                {groupsUtils.sortByTitle(groupsList).map(group => (
                  <GroupCard
                    id={group.id}
                    key={group.id}
                    title={group.title}
                    color={group.color}
                    itemsCount={group.count}
                    groupItemsLabel={groupCardItemsTitle || groupItemsTitle}
                    dropItemType={dropItemType}
                    onChangeGroupTitle={handleChangeGroupTitle}
                    onMoveItem={onMoveItem}
                    itemsPopupProps={{
                      ...itemsPopupProps,
                      groupItemsReducer,
                      deleteGroupItemReducer
                    }}
                    ActionDropdownComponent={
                      <ActionDropdown
                        id={group.id}
                        selectedColor={group.color}
                        onSelectColor={handleSelectColor}
                        onDeleteGroup={deleteGroupAction}
                      />
                    }
                  />
                ))}
              </Grid>
            )}
          </Card>
        </Grid>
        <Grid item xs={8} className={classes.itemsContainer}>
          <Card
            dropdown={false}
            grayHeader={true}
            shadow={false}
            radius={false}
            icon={false}
            removeSidePaddings={true}
            title={groupItemsTitle.toUpperCase()}
            headerClasses={[classes.header]}
            headerTextClasses={[classes.headerText]}
          >
            {itemsLoading ? <GroupModalItemsLoader /> : children}
          </Card>
        </Grid>
      </Grid>
    </SideModal>
  )
}

GroupModal.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  closeLink: PropTypes.string.isRequired,
  entity: PropTypes.string.isRequired,
  getGroupsByEntity: PropTypes.func.isRequired,
  groupsLoading: PropTypes.bool,
  groups: PropTypes.arrayOf(PropTypes.object),
  post: PropTypes.object.isRequired,
  put: PropTypes.object.isRequired,
  del: PropTypes.object.isRequired,
  postGroupAction: PropTypes.func.isRequired,
  putGroupAction: PropTypes.func.isRequired,
  deleteGroupAction: PropTypes.func.isRequired,
  clearUpdateGroupInfoAction: PropTypes.func.isRequired,
  groupItemsTitle: PropTypes.string,
  dropItemType: PropTypes.string.isRequired,
  onMoveItem: PropTypes.func.isRequired,
  groupItemsReducer: PropTypes.object.isRequired,
  postGroupItemReducer: PropTypes.object.isRequired,
  deleteGroupItemReducer: PropTypes.object.isRequired,
  clearGroupItemsInfo: PropTypes.func.isRequired,
  itemsPopupProps: PropTypes.shape({
    getGroupItems: PropTypes.func,
    onDeleteItem: PropTypes.func,
    clearGroupItemsInfo: PropTypes.func,
    renderFieldName: PropTypes.string
  }),
  itemsLoading: PropTypes.bool,
  enqueueSnackbar: PropTypes.func.isRequired,
  closeSnackbar: PropTypes.func.isRequired,
  groupCardItemsTitle: PropTypes.string
}

GroupModal.defaultProps = {
  title: '',
  groupsLoading: true,
  groupItemsTitle: 'Items',
  itemsLoading: true,
  itemsPopupProps: {}
}

const mapStateToProps = ({ group, group: { post, put, del } }, { entity }) => ({
  groups: group[entity].response,
  groupsLoading: group[entity].meta.isLoading,
  post,
  put,
  del
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getGroupsByEntity,
      postGroupAction,
      putGroupAction,
      deleteGroupAction,
      clearUpdateGroupInfoAction
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(GroupModal))
  )
)
