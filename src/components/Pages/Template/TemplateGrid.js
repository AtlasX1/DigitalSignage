import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid, Paper } from '@material-ui/core'

import { withSnackbar } from 'notistack'

import { CircleIconButton } from '../../Buttons'
import { CheckboxSelectAll } from '../../Checkboxes'
import { TemplateCard } from '../../Card'

import { createTemplateDummyData } from '../../../utils'

const styles = theme => ({
  root: {
    width: '100%',
    boxShadow: 'none'
  },
  tableWrapper: {
    padding: '15px'
  },
  templateCardWrap: {
    padding: '15px'
  },
  tableFooterWrap: {
    paddingLeft: '21px',
    backgroundColor: '#f9fafc',
    borderRadius: '0 0 8px 8px'
  },
  tableFooterCheckboxSelectAll: {
    marginRight: '10px'
  },
  tableFooterCircleIcon: {
    fontSize: '18px',
    color: '#adb7c9'
  }
})

class TemplateGrid extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    enqueueSnackbar: PropTypes.func.isRequired
  }

  state = {
    selected: [],
    data: [
      createTemplateDummyData(
        'CUSTOM-ORANGE',
        'Copy Of digitalBuildingDirectory',
        'Default',
        'N/A',
        '1080 x 1920',
        'Portrait',
        true,
        'https://picsum.photos/480/270'
      ),
      createTemplateDummyData(
        'PLAYLIST',
        'digitalBuildingDirectory1',
        'Default',
        'N/A',
        '1080 x 1920',
        'Portrait',
        true,
        'https://picsum.photos/480/270'
      ),
      createTemplateDummyData(
        'PLAYLIST',
        'Custom Widgets',
        'Default',
        'N/A',
        '1080 x 1920',
        'Portrait',
        false,
        'https://picsum.photos/480/270'
      ),
      createTemplateDummyData(
        'CUSTOM-ORANGE',
        'directoryXS',
        'Default',
        'N/A',
        '1080 x 1920',
        'Portrait',
        false,
        'https://picsum.photos/480/270'
      ),
      createTemplateDummyData(
        'PLAYLIST',
        'uberlyftXS',
        'Default',
        'N/A',
        '1080 x 1920',
        'Portrait',
        true,
        'https://picsum.photos/480/270'
      ),
      createTemplateDummyData(
        'CUSTOM',
        'Copy Of Template3',
        'Default',
        'N/A',
        '1080 x 1920',
        'Portrait',
        true,
        'https://picsum.photos/480/270'
      ),
      createTemplateDummyData(
        'CUSTOM',
        'SharedPermission',
        'Default',
        'N/A',
        '1080 x 1920',
        'Portrait',
        true,
        'https://picsum.photos/480/270'
      ),
      createTemplateDummyData(
        'CUSTOM-ORANGE',
        'DemoTemplate-Playlist',
        'Default',
        'N/A',
        '1080 x 1920',
        'Portrait',
        false,
        'https://picsum.photos/480/270'
      )
    ]
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }))
      return
    }
    this.setState({ selected: [] })
  }

  setSelected = newSelected => {
    this.setState({ selected: newSelected })
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1

  render() {
    const { classes } = this.props
    const { data, selected } = this.state

    return (
      <Paper className={classes.root}>
        <Grid container className={classes.tableWrapper}>
          {data.map((template, index) => {
            const isSelected = this.isSelected(template.id)

            return (
              <Grid
                item
                xs={3}
                key={`template-card-${index}`}
                className={classes.templateCardWrap}
              >
                <TemplateCard
                  template={template}
                  selectable={true}
                  additionalAction={true}
                  selected={selected}
                  isSelected={isSelected}
                  setSelected={this.setSelected}
                />
              </Grid>
            )
          })}
        </Grid>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.tableFooterWrap}
        >
          <Grid item>
            <CheckboxSelectAll
              className={classes.tableFooterCheckboxSelectAll}
              indeterminate={
                selected.length > 0 && selected.length < data.length
              }
              checked={selected.length === data.length}
              onChange={this.handleSelectAllClick}
            />
            <CircleIconButton
              className={`hvr-grow ${classes.tableFooterCircleIcon}`}
            >
              <i className="icon-bin" />
            </CircleIconButton>
            <CircleIconButton
              className={`hvr-grow ${classes.tableFooterCircleIcon}`}
            >
              <i className="icon-tag-1" />
            </CircleIconButton>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

export default translate('translations')(
  withStyles(styles)(withSnackbar(TemplateGrid))
)
