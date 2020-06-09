import * as Yup from 'yup'
import { useFormik } from 'formik'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
import React, { useEffect, useState, useRef } from 'react'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import { withStyles, Grid, FormControl, InputLabel } from '@material-ui/core'

import { FormControlInput, FormControlSketchColorPicker } from 'components/Form'
import { SideModal } from 'components/Modal'
import { postItem, putItem, getItemById } from 'actions/tagsActions'
import { roles } from 'utils'
import FooterLayout from 'components/Modal/FooterLayout'

const styles = theme => {
  const { palette, type } = theme
  return {
    addHelpPageWrap: {
      height: '100%'
    },
    addHelpPageDetails: {
      padding: '0 30px'
    },
    colorPickerRoot: {
      marginTop: '24px'
    },
    bootstrapFormLabel: {
      fontSize: '1.0833rem',
      lineHeight: '24px',
      color: palette[type].pages.tags.add.label.color
    }
  }
}

const AddEditTags = ({
  t,
  item,
  putItem,
  postItem,
  classes,
  getItemById,
  detailsReducer,
  history,
  match: {
    params: { id }
  }
}) => {
  const [role, setRole] = useState({})

  useEffect(() => {
    if (detailsReducer.response) {
      setRole(roles.parse(detailsReducer.response.role))
    }
  }, [detailsReducer])

  const form = useFormik({
    initialValues: {
      name: '',
      color: '#e31c1c',
      background: '#e31c1c'
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required()
    }),
    onSubmit: ({ name, background, color }) => {
      const data = {
        tag: name,
        attributes: {
          tagBgColor: background,
          tagTextColor: color
        }
      }

      if (id) {
        putItem(id, data)
      } else {
        postItem(data)
      }

      history.goBack()
    }
  })

  useEffect(() => {
    if (id) {
      getItemById(id)
    }
    //eslint-disable-next-line
  }, [id])

  const intialFormValues = useRef(form.values)

  useEffect(() => {
    if (Object.keys(item.response).length && id) {
      intialFormValues.current = {
        ...form.values,
        name: item.response.tag,
        color: item.response.attributes.tagTextColor,
        background: item.response.attributes.tagBgColor
      }
      form.setValues(intialFormValues.current)
    }
    //eslint-disable-next-line
  }, [item])

  const handleChangeColor = color => {
    form.setFieldValue('color', color)
  }

  const handleChangeBackground = color => {
    form.setFieldValue('background', color)
  }

  return (
    <SideModal
      width="32%"
      title={id ? t('Edit Tag') : t('Add Tag')}
      closeLink={`/${role.role}/tags-library`}
      footerLayout={
        <FooterLayout
          onSubmit={form.handleSubmit}
          onReset={() => form.setValues(intialFormValues.current)}
          isUpdate={!!id}
        />
      }
    >
      <Grid
        container
        direction="column"
        justify="space-between"
        className={classes.addHelpPageWrap}
      >
        <Grid item className={classes.addHelpPageDetails}>
          <FormControlInput
            id="tag-name"
            name="name"
            fullWidth={true}
            label={t('Tag Name')}
            value={form.values.name}
            error={form.errors.name}
            touched={form.touched.name}
            onChange={form.handleChange}
            showErrorText={false}
          />

          <Grid container justify="space-between">
            <Grid item>
              <FormControl>
                <InputLabel
                  shrink
                  htmlFor="txt-color"
                  className={classes.bootstrapFormLabel}
                >
                  {t('Text Color')}
                </InputLabel>
                <FormControlSketchColorPicker
                  rootClass={classes.colorPickerRoot}
                  color={form.values.color}
                  handleChange={handleChangeColor}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel
                  shrink
                  htmlFor="bg-color"
                  className={classes.bootstrapFormLabel}
                >
                  {t('Background Color')}
                </InputLabel>
                <FormControlSketchColorPicker
                  id="background"
                  rootClass={classes.colorPickerRoot}
                  color={form.values.background}
                  handleChange={handleChangeBackground}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </SideModal>
  )
}

AddEditTags.propTypes = {
  t: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  putItem: PropTypes.func.isRequired,
  postItem: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  getItemById: PropTypes.func.isRequired
}

const mapStateToProps = ({ tags: { item }, user }) => ({
  item,
  detailsReducer: user.details
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getItemById,
      putItem,
      postItem
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(AddEditTags))
  )
)
