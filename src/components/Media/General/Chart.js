import React, { Component, Fragment } from 'react'
import { translate } from 'react-i18next'
import { useDropzone } from 'react-dropzone'

import {
  withStyles,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import { Folder } from '@material-ui/icons'

import {
  TabToggleButton,
  TabToggleButtonGroup,
  WhiteButton
} from '../../Buttons'
import { FormControlInput, SliderInputRange } from '../../Form'
import ChartTypes from './components/Chart/ChartTypes'

import UploadMediaSVG from '../../../common/icons/img_drag_and_drop_upload.svg'

const dropzoneStatusColor = ({ isDragActive, isDragAccept, isDragReject }) => {
  if (isDragAccept) return '#00e676'
  if (isDragReject) return '#ff1744'
  if (isDragActive) return '#0378ba'
  return '#0378ba'
}

const DropzoneWithoutClickStyles = () => ({
  dropFilesWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '182px',
    marginTop: '14px',
    padding: '20px',
    borderWidth: '1px',
    borderStyle: 'dashed',
    color: '#0378ba',
    outline: 'none',
    transition: 'border .2s ease-in-out'
  },
  dropzoneText: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#0378ba'
  }
})

const DropzoneWithoutClick = translate('translations')(
  withStyles(DropzoneWithoutClickStyles)(({ t, classes }) => {
    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
      acceptedFiles
    } = useDropzone({ noClick: true })

    return (
      <Fragment>
        <div
          {...getRootProps({ className: classes.dropFilesWrap })}
          style={{
            borderColor: dropzoneStatusColor({
              isDragActive,
              isDragAccept,
              isDragReject
            })
          }}
        >
          <input {...getInputProps()} />
          <img src={UploadMediaSVG} alt={t('Drop and Drop your image here')} />
          <Typography className={classes.dropzoneText}>
            {t('Drop files to Upload')}
          </Typography>
        </div>
        <List>
          {acceptedFiles.map(file => (
            <ListItem key={file.path}>
              <ListItemIcon>
                <Folder />
              </ListItemIcon>
              <ListItemText primary={file.path} />
            </ListItem>
          ))}
        </List>
      </Fragment>
    )
  })
)

const TabIconStyles = () => ({
  tabIconWrap: {
    fontSize: '16px',
    lineHeight: '16px',
    color: '#9394A0'
  }
})

const TabIcon = withStyles(TabIconStyles)(({ iconClassName = '', classes }) => (
  <div className={classes.tabIconWrap}>
    <i className={iconClassName} />
  </div>
))

const DownloadFileButtonClasses = ({ typography }) => ({
  DownloadFileButtonContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  DownloadFileButton: {
    marginLeft: '6px',
    fontSize: '11px',
    lineHeight: '13px',
    fontFamily: typography.fontFamily,
    color: '#4C5057'
  }
})

const DownloadFileButton = withStyles(DownloadFileButtonClasses)(
  ({ iconClassName = '', text = '', classes }) => (
    <div className={classes.DownloadFileButtonContainer}>
      <TabIcon iconClassName={iconClassName} />
      <div className={classes.DownloadFileButton}>{text}</div>
    </div>
  )
)

const styles = ({ palette, type, typography }) => {
  return {
    root: {
      margin: '20px 25px',
      fontFamily: typography.fontFamily
    },
    chartTypeContainer: {
      padding: '0 0 28px'
    },
    previewMediaBtn: {
      padding: '10px 25px 8px',
      borderColor: palette[type].sideModal.action.button.border,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none',
      marginTop: '45px'
    },
    previewMediaText: {
      fontWeight: 'bold',
      color: palette[type].sideModal.action.button.color
    },
    themeCardWrap: {
      border: `solid 1px ${palette[type].pages.media.general.card.border}`,
      backgroundColor: palette[type].pages.media.general.card.background,
      borderRadius: '4px'
    },
    themeHeader: {
      padding: '0 15px',
      borderBottom: `1px solid ${palette[type].pages.media.general.card.border}`,
      backgroundColor: palette[type].pages.media.general.card.header.background
    },
    themeHeaderText: {
      fontWeight: 'bold',
      lineHeight: '42px',
      color: palette[type].pages.media.general.card.header.color,
      fontSize: '12px'
    },
    tabToggleButton: {
      width: '128px'
    },
    fileTypeLabel: {
      fontSize: '11px',
      lineHeight: '13px',
      fontWeight: '500',
      marginRight: '27px',
      '&:last-of-type': {
        marginRight: '0'
      }
    },
    axisInputContainer: {
      padding: '0 7.5px',
      margin: '0 -7.5px'
    },
    axisContainer: {
      marginTop: '26px'
    },
    formControlRootClass: {
      marginBottom: '18px'
    },
    sliderInputLabel: {
      color: '#74809A',
      fontSize: '13px',
      lineHeight: '15px',
      marginRight: '15px'
    },
    marginTop1: {
      marginTop: '15px'
    }
  }
}

class Chart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedUploadType: 'File Upload',
      selectedChart: {
        chart: '',
        subChart: ''
      }
    }
  }

  handleUploadTypeChanges = (event, selectedUploadType) =>
    this.setState({ selectedUploadType })
  handleChartChanges = selectedChart => this.setState({ selectedChart })
  getSelectedTabContent = () => {
    const { classes } = this.props

    switch (this.state.selectedUploadType) {
      case 'File Upload':
        return (
          <Grid container>
            <Grid item xs={12}>
              <DropzoneWithoutClick />
            </Grid>
          </Grid>
        )
      case 'File from Web URL':
        return (
          <Grid
            container
            justify="space-between"
            alignItems="center"
            className={classes.marginTop1}
          >
            <Grid item xs={6} className={classes.axisInputContainer}>
              <FormControlInput
                formControlRootClass={classes.formControlRootClass}
                label={'Input URL:'}
                className={classes.formControlInput}
                fullWidth={true}
              />
            </Grid>
            <Grid item xs={6} className={classes.axisInputContainer}>
              <Grid container justify="flex-start" alignItems="center">
                <Grid item>
                  <Typography className={classes.sliderInputLabel}>
                    Refresh Every
                  </Typography>
                </Grid>
                <Grid item>
                  <SliderInputRange
                    step={1}
                    value={5}
                    label={''}
                    maxValue={150}
                    minValue={0}
                    handleChange={() => {}}
                    numberWraperStyles={{ width: 55 }}
                    inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )
      default:
        return
    }
  }

  render() {
    const { t, classes } = this.props

    const { selectedUploadType } = this.state

    return (
      <div className={classes.root}>
        <Grid container justify="center" className={classes.chartTypeContainer}>
          <Grid item xs={12} className={classes.themeCardWrap}>
            <header className={classes.themeHeader}>
              <Typography className={classes.themeHeaderText}>
                Chart Type
              </Typography>
            </header>
            <ChartTypes handleChartChanges={this.handleChartChanges} />
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Grid item>
            <TabToggleButtonGroup
              value={selectedUploadType}
              exclusive
              onChange={this.handleUploadTypeChanges}
            >
              <TabToggleButton
                className={classes.tabToggleButton}
                value={'File Upload'}
              >
                {t('File Upload')}
              </TabToggleButton>
              <TabToggleButton
                className={classes.tabToggleButton}
                value={'File from Web URL'}
              >
                File from Web URL
              </TabToggleButton>
            </TabToggleButtonGroup>
          </Grid>
        </Grid>
        {this.getSelectedTabContent()}
        <Grid container>
          <Grid item xs={12} className={classes.themeCardWrap}>
            <header className={classes.themeHeader}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Typography className={classes.themeHeaderText}>
                    Download Sample Files
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container>
                    <Grid item className={classes.fileTypeLabel}>
                      <DownloadFileButton
                        iconClassName="icon-download-harddisk"
                        text="CSV"
                      />
                    </Grid>
                    <Grid item className={classes.fileTypeLabel}>
                      <DownloadFileButton
                        iconClassName="icon-download-harddisk"
                        text="XML"
                      />
                    </Grid>
                    <Grid item className={classes.fileTypeLabel}>
                      <DownloadFileButton
                        iconClassName="icon-download-harddisk"
                        text="JSON"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </header>
          </Grid>
        </Grid>
        <Grid
          container
          justify="space-between"
          className={classes.axisContainer}
        >
          <Grid item xs={6} className={classes.axisInputContainer}>
            <FormControlInput
              formControlRootClass={classes.formControlRootClass}
              label={'X-Axis Title'}
              className={classes.formControlInput}
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6} className={classes.axisInputContainer}>
            <FormControlInput
              formControlRootClass={classes.formControlRootClass}
              label={'Y-Axis Title'}
              className={classes.formControlInput}
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6} className={classes.axisInputContainer}>
            <FormControlInput
              formControlRootClass={classes.formControlRootClass}
              label={'X-Axis Sub Title'}
              className={classes.formControlInput}
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6} className={classes.axisInputContainer}>
            <FormControlInput
              formControlRootClass={classes.formControlRootClass}
              label={'Y-Axis Sub Title'}
              className={classes.formControlInput}
              fullWidth={true}
            />
          </Grid>
        </Grid>
        <Grid container justify="flex-start">
          <Grid item>
            <WhiteButton className={classes.previewMediaBtn}>
              <Typography className={classes.previewMediaText}>
                {t('Preview Media')}
              </Typography>
            </WhiteButton>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default translate('translations')(withStyles(styles)(Chart))
