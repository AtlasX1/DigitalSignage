import { Grid, Typography, withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import { TableLibraryRowActionButton } from '../TableLibrary'
import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import classNames from 'classnames'

import { deleteCategory, putCategory } from 'actions/categoriesActions'

import { FormControlInput } from 'components/Form'
import { BlueButton } from 'components/Buttons'
import FormControlSelectIcons from 'components/Form/FormControlSelectIcon'

import { iconValidateSchema } from 'constants/validations'

const styles = theme => {
  const { palette, type } = theme
  return {
    categoryItem: {
      padding: '0 15px 0 20px',
      borderBottom: `1px solid ${palette[type].pages.rss.addRss.manage.border}`
    },
    lastItem: { borderBottom: 'unset' },
    categoryName: {
      fontSize: '14px',
      fontWeight: 'bold',
      lineHeight: '55px',
      color: palette[type].pages.rss.addRss.manage.category.color
    },
    categoryIcon: {
      alignSelf: 'center',
      fontSize: '24px',
      lineHeight: '55px',
      color: '#74809a'
    },
    categoryActions: {
      alignSelf: 'center',
      paddingTop: '12px'
    },
    submit: {
      width: '90%'
    },
    editName: {
      alignSelf: 'center'
    }
  }
}

const ListItem = ({ t, item, classes, isLast }) => {
  const [isEdit, toggleEdit] = useState(false)
  const translate = useMemo(
    () => ({
      edit: t('Edit'),
      del: t('Delete'),
      action: t('Edit')
    }),
    [t]
  )

  const form = useFormik({
    initialValues: {
      name: item.name,
      icon: { value: item.icon, valid: true }
    },
    validationSchema: Yup.object().shape({
      icon: iconValidateSchema
    }),
    onSubmit: values => {
      toggleEdit(false)
      dispatch(putCategory(item.id, { ...values, icon: values.icon.value }))
    }
  })

  const dispatch = useDispatch()

  const handleDelete = useCallback(() => {
    dispatch(deleteCategory(item.id))
  }, [dispatch, item.id])

  const handleEdit = useCallback(() => {
    toggleEdit(true)
  }, [])

  return (
    <Grid
      container
      className={classNames(classes.categoryItem, {
        [classes.lastItem]: isLast
      })}
      justify="space-between"
      spacing={16}
    >
      <Grid item xs={1} className={classes.categoryIcon}>
        <i className="icon-navigation-show-more-vertical" />
      </Grid>
      <Grid item xs={5} className={classes.editName}>
        {isEdit ? (
          <FormControlInput
            fullWidth
            id="name"
            marginBottom={false}
            label={translate.name}
            value={form.values.name}
            handleChange={form.handleChange}
            formControlLabelClass={classes.label}
          />
        ) : (
          <Typography className={classes.categoryName}>{item.name}</Typography>
        )}
      </Grid>
      <Grid item xs={4} className={classes.categoryIcon}>
        {isEdit ? (
          <FormControlSelectIcons
            rootClass={classes.controlSelect}
            name="icon"
            value={form.values.icon}
            onChange={form.handleChange}
            marginBottom={false}
            error={form.errors.icon}
            touched={form.touched.icon}
          />
        ) : (
          <i className={item.icon} />
        )}
      </Grid>
      <Grid item xs={2} className={classes.categoryActions}>
        {isEdit ? (
          <BlueButton
            className={classes.submit}
            type="submit"
            onClick={form.handleSubmit}
          >
            {translate.action}
          </BlueButton>
        ) : (
          <TableLibraryRowActionButton
            actionLinks={[
              { label: translate.edit, clickAction: handleEdit },
              { divider: true },
              {
                label: translate.del,
                icon: 'icon-bin',
                clickAction: handleDelete
              }
            ]}
          />
        )}
      </Grid>
    </Grid>
  )
}

ListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired
}
ListItem.defaultProps = {
  items: []
}
export default translate('translations')(withStyles(styles)(ListItem))
