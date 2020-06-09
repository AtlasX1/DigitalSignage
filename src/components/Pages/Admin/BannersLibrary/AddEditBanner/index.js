import React, { useEffect, useMemo } from 'react'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import moment from 'moment'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { withSnackbar } from 'notistack'
import { bindActionCreators } from 'redux'
import { useFormik } from 'formik'

import { SideModal } from 'components/Modal'
import {
  FormControlInput,
  WysiwygEditor,
  FormControlSingleDatePicker,
  FormControlSketchColorPicker
} from 'components/Form'
import { getItemById, postItem, putItem } from 'actions/bannerActions'
import FooterLayout from 'components/Modal/FooterLayout'
import routeByName from 'constants/routes'
import FormControlReactSelect from 'components/Form/FormControlReactSelect'
import FormControlChips from 'components/Form/FormControlChips'
import TextPreview from 'components/TextPreview'
import useOrgRoleOptions from 'hooks/tableLibrary/useOrgRoleOptions'
import useClientOptions from 'hooks/tableLibrary/useClientOptions'
import useEnterpriseRoleOptions from 'hooks/tableLibrary/useEnterpriseRoleOptions'
import useClientUserOptions from 'hooks/tableLibrary/useClientUserOptions'

const showForOptions = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Org',
    value: 'org'
  },
  {
    label: 'Enterprise',
    value: 'enterprise'
  },
  {
    label: 'Specific clients',
    value: 'specific_clients'
  }
]

const styles = theme => {
  const { palette, type } = theme
  return {
    addHelpPageWrap: {
      height: '100%'
    },
    addEditBannerDetails: {
      padding: '0 30px',
      overflowX: 'auto'
    },
    marginBottom40: {
      marginBottom: '40px'
    },

    bannerEditorWrap: {
      marginBottom: '15px'
    },
    bannerPreviewTitle: {
      marginBottom: '10px',
      fontSize: '13px',
      color: palette[type].formControls.label.color
    },
    bannerPreview: {
      marginBottom: '15px',
      minHeight: '250px',
      border: `1px solid ${palette[type].pages.banners.preview.border}`
    },
    additionalInfoWrap: {
      marginRight: '35px'
    },
    subForm: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridColumnGap: '20px'
    }
  }
}

const AddEditBanner = ({
  t,
  item,
  classes,
  putItem,
  history,
  postItem,
  getItemById,
  match: {
    params: { id }
  }
}) => {
  const translate = useMemo(
    () => ({
      title: id ? t('Edit Banner') : t('Add New Banner'),
      name: t('Name'),
      textPreview: t('Banner Text Preview'),
      userType: t('User Type'),
      expirationDate: t('Expiration Date'),
      activationDate: t('Activation Date'),
      showFor: t('Show For'),
      color: t('Color'),
      client: t('Client')
    }),
    [id, t]
  )

  const orgRoleOptions = useOrgRoleOptions()
  const enterpriseRoleOptions = useEnterpriseRoleOptions()
  const clientOptions = useClientOptions()
  const clientUserOptions = useClientUserOptions()

  useEffect(() => {
    id && getItemById(id)
  }, [id, getItemById])

  useEffect(() => {
    if (Object.keys(item.response).length && id) {
      const {
        response: {
          name,
          userRole,
          color,
          content,
          expirationDate,
          activationDate,
          client,
          showFor
        }
      } = item
      const contentBlock = htmlToDraft(content)
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      )

      form.setValues({
        name,
        color,
        showFor,
        userRole: userRole.map(({ id, displayName }) => ({
          value: id,
          label: displayName
        })),
        client: client.map(({ id, name }) => ({
          value: id,
          label: `${name} [${id}]`
        })),
        expirationDate: moment(expirationDate),
        activationDate: moment(activationDate),
        bannerEditor: EditorState.createWithContent(contentState)
      })
    }
    //eslint-disable-next-line
  }, [item])

  const form = useFormik({
    initialValues: {
      bannerEditor: EditorState.createEmpty(),
      name: '',
      userRole: [],
      client: [],
      expirationDate: moment(),
      activationDate: moment(),
      showFor: 'all',
      color: '#e31c1c'
    },
    onSubmit: ({
      name,
      color,
      userRole,
      client,
      expirationDate,
      activationDate,
      showFor
    }) => {
      const data = {
        name,
        content: getBannerEditorToHtml,
        color,
        expirationDate: moment(expirationDate).format('YYYY-MM-DD'),
        activationDate: moment(activationDate).format('YYYY-MM-DD'),
        userRole: userRole.length ? userRole.map(({ value }) => value) : null,
        client: client.length ? client.map(({ value }) => value) : [],
        showFor,
        status: 'Active'
      }

      if (id) {
        putItem(id, data)
      } else {
        postItem(data)
      }

      history.goBack()
    }
  })

  const getBannerEditorToHtml = useMemo(() => {
    return draftToHtml(
      convertToRaw(form.values.bannerEditor.getCurrentContent())
    )
  }, [form.values.bannerEditor])

  const roleOptions = useMemo(
    () =>
      form.values.showFor === 'org'
        ? orgRoleOptions
        : form.values.showFor === 'enterprise'
        ? enterpriseRoleOptions
        : [...orgRoleOptions, ...enterpriseRoleOptions],
    [enterpriseRoleOptions, form.values.showFor, orgRoleOptions]
  )

  return (
    <SideModal
      width="40%"
      title={translate.title}
      closeLink={routeByName.banner.root}
      childrenWrapperClass={classes.addEditBannerDetails}
      footerLayout={
        <FooterLayout
          onSubmit={form.handleSubmit}
          onReset={form.handleReset}
          isUpdate={!!id}
        />
      }
    >
      <FormControlInput
        id="name"
        value={form.values.name}
        handleChange={form.handleChange}
        fullWidth
        label={translate.name}
      />
      <WysiwygEditor
        name="bannerEditor"
        editorState={form.values.bannerEditor}
        onChange={form.handleChange}
      />
      <TextPreview label={translate.textPreview} text={getBannerEditorToHtml} />
      <FormControlReactSelect
        name="showFor"
        value={form.values.showFor}
        options={showForOptions}
        onChange={form.handleChange}
        label={translate.showFor}
        marginBottom={16}
      />
      {form.values.showFor === 'org' ||
      form.values.showFor === 'system' ||
      form.values.showFor === 'enterprise' ? (
        <FormControlChips
          name="userRole"
          values={form.values.userRole}
          options={roleOptions}
          handleChange={form.handleChange}
          label={translate.userType}
        />
      ) : null}
      {form.values.showFor === 'specific_clients' ? (
        <FormControlChips
          name="client"
          values={form.values.client}
          options={[...clientOptions, ...clientUserOptions]}
          handleChange={form.handleChange}
          label={translate.client}
        />
      ) : null}

      <div className={classes.subForm}>
        <FormControlSingleDatePicker
          name="expirationDate"
          label={translate.expirationDate}
          value={form.values.expirationDate}
          handleChange={form.handleChange}
        />
        <FormControlSingleDatePicker
          name="activationDate"
          label={translate.activationDate}
          value={form.values.activationDate}
          handleChange={form.handleChange}
        />
        <FormControlSketchColorPicker
          name="color"
          label={translate.color}
          color={form.values.color}
          onColorChange={form.handleChange}
        />
      </div>
    </SideModal>
  )
}

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(
      connect(
        ({ banners: { item } }) => ({
          item
        }),
        dispatch =>
          bindActionCreators(
            {
              postItem,
              putItem,
              getItemById
            },
            dispatch
          )
      )(AddEditBanner)
    )
  )
)
