import { Grid, withStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { translate } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  getRolePermissionByIdAction,
  postRoleAction,
  putRoleByIdAction,
  putRolePermissionByIdAction,
  getRolesAction,
  clearPostRoleAction,
  clearPutRoleAction
} from '../../../actions/roleActions'
import { FormControlInput, FormControlSelect } from '../../Form'
import { SideModal } from '../../Modal'
import ActionBar from './ActionBar'
import { withRouter, Redirect } from 'react-router-dom'
import { withSnackbar } from 'notistack'

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      display: 'grid',
      height: '100%',
      grid: '1fr auto / 1fr'
    },
    title: {
      textTransform: 'capitalize'
    },
    form: {
      padding: '0 26px'
    },
    label: {
      color: '#74809A',
      fontSize: '16px'
    },
    select: {
      padding: '9px 15px'
    },
    selectDisabled: {
      background: palette[type].pages.rbac.disabled
    },
    actionBar: {
      borderTop: `1px solid ${palette[type].sideModal.content.border}`,
      background: '#fff'
    }
  }
}

const defaults = {
  form: {
    name: '',
    category: '',
    description: ''
  },
  disabled: {
    name: false,
    category: false,
    description: false
  },
  validation: {
    name: true,
    category: true,
    description: true
  },
  nameDuplicate: false,
  categories: [
    { value: 'system', label: 'System' },
    { value: 'org', label: 'Org' },
    { value: 'enterprise', label: 'Enterprise' }
  ]
}

const AddEditRole = ({
  t,
  action,
  classes,
  role = null,
  metadata = null,
  enqueueSnackbar
}) => {
  const [form, updateForm] = useState(defaults.form)
  const [disabled, setDisabled] = useState(defaults.disabled)
  const [isValid, setValidation] = useState(defaults.validation)
  const [isNameDuplicate, setNameDuplicate] = useState(defaults.nameDuplicate)

  const [pendingSubmit, setPendingSubmit] = useState(null)
  const [shouldCloseSidebar, closeSidebar] = useState(false)

  const [roleUpdated, roleAdded, fetchedPermissions] = useSelector(
    ({
      role: {
        put: rolePutResponse,
        post: rolePostResponse,
        permissionById: { response: permissionsResponse }
      }
    }) => {
      const roleUpdated =
        rolePutResponse && Object.keys(rolePutResponse).length > 0
          ? rolePutResponse
          : null
      const roleAdded =
        rolePostResponse && Object.keys(rolePostResponse).length > 0
          ? rolePostResponse
          : null
      const fetchedPermissions =
        permissionsResponse && Object.keys(permissionsResponse).length > 0
          ? permissionsResponse
          : null
      return [roleUpdated, roleAdded, fetchedPermissions]
    }
  )

  const dispatch = useDispatch()

  const updateRole = useCallback(
    (id, data) => {
      dispatch(putRoleByIdAction(id, data))
    },
    [dispatch]
  )
  const updateRolePermissions = useCallback(
    (id, data) => {
      dispatch(putRolePermissionByIdAction(id, data))
    },
    [dispatch]
  )

  const getRoles = useCallback(
    data => {
      dispatch(getRolesAction(data))
    },
    [dispatch]
  )

  const getRolePermissions = useCallback(
    id => {
      dispatch(getRolePermissionByIdAction(id))
    },
    [dispatch]
  )

  const addRole = useCallback(role => dispatch(postRoleAction(role)), [
    dispatch
  ])

  const clearPostRole = useCallback(
    role => dispatch(clearPostRoleAction(role)),
    [dispatch]
  )

  const clearPutRole = useCallback(role => dispatch(clearPutRoleAction(role)), [
    dispatch
  ])

  useEffect(() => {
    switch (action) {
      case 'add':
        updateForm({
          ...form,
          category: metadata && metadata.level
        })
        setDisabled({
          category: true
        })
        break
      case 'clone':
        updateForm({
          name: role && role.displayName,
          category: metadata && metadata.level,
          description: role && role.description
        })
        setDisabled({
          category: true,
          description: true
        })
        break
      case 'edit':
        updateForm({
          name: role && role.displayName,
          category: metadata && metadata.level,
          description: role && role.description
        })
        setDisabled({
          category: true
        })
        break
      default:
        break
    }
    return () => {
      clearPostRole()
      clearPutRole()
    } // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (fetchedPermissions && pendingSubmit && action === 'clone') {
      addRole(pendingSubmit)
    } // eslint-disable-next-line
  }, [fetchedPermissions])

  useEffect(() => {
    if (roleAdded && pendingSubmit) {
      const { response, error } = roleAdded
      if (Object.values(response).length > 0) {
        switch (action) {
          case 'add':
            clearPostRole()
            clear()
            getRoles(metadata.level)
            setPendingSubmit(null)
            enqueueSnackbar(t('Role Added'), {
              variant: 'success'
            })
            closeSidebar(true)
            break
          case 'clone':
            if (fetchedPermissions && fetchedPermissions.length > 0) {
              attachPermissions(pendingSubmit.id, fetchedPermissions)
            } else if (metadata && metadata.permissions.length > 0) {
              attachPermissions(pendingSubmit.id, metadata.permissions)
            }
            break
          default:
            return
        }
      } else if (error && Object.values(error).length > 0) {
        if (error.errors && error.errors.length > 0) {
          for (let errorMessage of error.errors) {
            enqueueSnackbar(errorMessage[0], {
              variant: 'error'
            })
          }
        }
      }
    } // eslint-disable-next-line
  }, [roleAdded])

  const attachPermissions = (id, permissions = []) => {
    const formattedPermissions = permissions
      .filter(permission => permission.attached === true)
      .reduce(
        (accumulator, value) => {
          accumulator.permissionIds.push(value.id)
          return accumulator
        },
        { permissionIds: [] }
      )
    updateRolePermissions(id, formattedPermissions)
    enqueueSnackbar(t('Role Cloned'), {
      variant: 'success'
    })
  }

  useEffect(() => {
    if (roleUpdated && pendingSubmit) {
      const { response, error } = roleUpdated
      if (response && Object.values(response).length > 0) {
        setPendingSubmit(null)
        enqueueSnackbar(t('Role Updated'), {
          variant: 'success'
        })
        getRoles(metadata.level)
        closeSidebar(true)
      } else if (error && Object.values(error).length > 0) {
        if (error.errors && error.errors.message) {
          enqueueSnackbar(error.errors.message, {
            variant: 'error'
          })
        }
      }
    } //eslint-disable-next-line
  }, [roleUpdated])

  const submit = () => {
    setValidation(defaults.validation)
    setNameDuplicate(defaults.nameDuplicate)

    const validEntries = Object.entries(form).reduce(
      (accumulator, [key, value]) => {
        key === 'name'
          ? (accumulator[key] =
              !!value &&
              value.length > 0 &&
              new RegExp('[\\d-]+').test(value) === false)
          : (accumulator[key] = !!value && value.length > 0)
        return accumulator
      },
      {}
    )
    const allEntriesValid = Object.values(validEntries).every(Boolean)
    setValidation({ ...validEntries })
    const nameIsDuplicate =
      metadata &&
      action !== 'edit' &&
      metadata.roles
        .filter(({ name, displayName }) =>
          new RegExp(`^(${displayName}|${name})+$`, 'i').test(form.name.trim())
        )
        .some(Boolean)
    setNameDuplicate(nameIsDuplicate)

    if (allEntriesValid === true && nameIsDuplicate === false) {
      let generatedRole = {
        displayName: form.name.trim(),
        description: form.description.trim(),
        status: 'Active',
        lockedPermissions: false,
        restricted: false
      }
      const generatedName = form.name.trim().split(' ').join('-').toLowerCase()
      const generatedIndex =
        metadata && metadata.roles
          ? Math.max(...metadata.roles.map(role => parseInt(role.id))) + 1
          : 0

      switch (action) {
        case 'add':
          generatedRole = {
            ...generatedRole,
            id: generatedIndex,
            name: generatedName,
            displayName: form.name.trim(),
            guardName: form.category === 'system' ? 'system' : 'org',
            level: form.category,
            createdBy: metadata.user
          }
          clearPostRole()
          setPendingSubmit(generatedRole)
          addRole(generatedRole)
          break
        case 'clone':
          generatedRole = {
            ...role,
            id: generatedIndex,
            name: generatedName,
            displayName: form.name,
            createdBy: metadata.user
          }
          clearPostRole()
          setPendingSubmit(generatedRole)
          metadata.permissions.length > 0
            ? addRole(generatedRole)
            : getRolePermissions(role.id)
          break
        case 'edit':
          generatedRole = {
            ...generatedRole,
            updatedBy: metadata.user
          }
          clearPutRole()
          if (role.lockedPermissions) {
            enqueueSnackbar(t("Can't Edit Locked Role"), {
              variant: 'warning'
            })
            closeSidebar(true)
          } else {
            setPendingSubmit(generatedRole)
            updateRole(role.id, generatedRole)
          }
          break
        default:
          return
      }
    } else {
    }
  }

  const clear = () => {
    updateForm({ ...defaults.form, category: form.category })
    setValidation(defaults.validation)
  }

  return (
    <SideModal
      width="560px"
      title={t(`${action} Role`)}
      closeLink="/system/roles-permissions/"
      classes={{ sideModalHeaderTitle: classes.title }}
    >
      <Grid container className={classes.container}>
        <Grid item container alignContent="flex-start" className={classes.form}>
          <Grid item xs={12}>
            <FormControlInput
              showErrorText={isValid.name === false || isNameDuplicate === true}
              handleChange={e => updateForm({ ...form, name: e.target.value })}
              touched={isValid.name === false || isNameDuplicate === true}
              formControlLabelClass={classes.label}
              error={
                isNameDuplicate === true
                  ? t('Validation error name duplicate')
                  : t('Validation error name')
              }
              label={t('Role Name')}
              value={form.name}
              fullWidth={true}
              id="role-name"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlSelect
              handleChange={e =>
                updateForm({ ...form, category: e.target.value })
              }
              showErrorText={isValid.category === false}
              disabled={disabled && disabled.category}
              inputClasses={{ input: classes.select }}
              error={t('Validation error category')}
              formControlLabelClass={classes.label}
              classes={{ nativeSelectDisabled: classes.selectDisabled }}
              touched={isValid.category === false}
              options={defaults.categories}
              label={t('Role Category')}
              value={form.category}
              id="role-category"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlInput
              handleChange={e =>
                updateForm({ ...form, description: e.target.value })
              }
              showErrorText={isValid.description === false}
              disabled={disabled && disabled.description}
              error={t('Validation error description')}
              touched={isValid.description === false}
              formControlLabelClass={classes.label}
              label={t('Role Description')}
              value={form.description}
              id="role-description"
              multiline={true}
              fullWidth={true}
              rows={10}
            />
          </Grid>
        </Grid>
        <Grid item container className={classes.actionBar}>
          <ActionBar
            onCancel={() => closeSidebar(true)}
            actionName={t(
              `${
                action === 'add'
                  ? 'Add New'
                  : action === 'edit'
                  ? 'Update'
                  : action
              } Role`
            )}
            onAction={submit}
          />
        </Grid>
      </Grid>
      {shouldCloseSidebar && <Redirect to="/system/roles-permissions" />}
    </SideModal>
  )
}

AddEditRole.propTypes = {
  classes: PropTypes.object
}

export default translate('translations')(
  withStyles(styles)(withRouter(withSnackbar(AddEditRole)))
)
