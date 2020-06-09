import React, { useMemo } from 'react'
import { Route } from 'react-router-dom'

import featureConstants from 'constants/featureConstants'
import routeByName from 'constants/routes'

import TableRowRSSFeed from './Rows/RSSFeed'
import AddEditRSSFeed from './AddEdit/RSSFeed'
import FilterRSSFeed from './Filter/RSSFeed'

import TableRowFeed from './Rows/Feed'
import AddEditFeed from './AddEdit/Feed'
import FilterFeed from './Filter/Feed'

import TableRowDemoFeeds from './Rows/DemoFeeds'
import AddEditDemoFeeds from './AddEdit/DemoFeeds'
import FilterDemoFeeds from './Filter/DemoFeeds'

import TableRowMediaRSS from './Rows/MediaRSS'
import AddEditMediaRSS from './AddEdit/MediaRSS'
import FilterMediaRSS from './Filter/MediaRSS'

import TableRowYouTube from './Rows/YouTube'
import AddEditYouTube from './AddEdit/YouTube'
import FilterYouTube from './Filter/YouTube'

import TableRowRadio from './Rows/Radio'
import AddEditRadio from './AddEdit/Radio'
import FilterRadio from './Filter/Radio'

import TableRowCustomWidget from './Rows/CustomWidget'
import AddEditCustomWidget from './AddEdit/CustomWidget'
import FilterCustomWidget from './Filter/CustomWidget'

// import AddEditRSSFeed from "components/Pages/Admin/RSSFeedsLibrary/AddRSSFeed"

const {
  Feeds,
  RSSFeed,
  DemoFeeds,
  MediaRSS,
  YouTube,
  Radio,
  CustomWidget
} = featureConstants

const components = {
  [RSSFeed]: {
    Row: props => <TableRowRSSFeed {...props} />,
    AddEdit: () => (
      <>
        <Route
          exact
          path={routeByName[RSSFeed].edit}
          component={AddEditRSSFeed}
        />
        <Route
          exact
          path={routeByName[RSSFeed].add}
          component={AddEditRSSFeed}
        />
      </>
    ),
    Filter: props => <FilterRSSFeed {...props} />
  },

  [Feeds]: {
    Row: props => <TableRowFeed {...props} />,
    AddEdit: () => (
      <>
        <Route exact path={routeByName[Feeds].edit} component={AddEditFeed} />
        <Route exact path={routeByName[Feeds].add} component={AddEditFeed} />
      </>
    ),
    Filter: props => <FilterFeed {...props} />
  },

  [DemoFeeds]: {
    Row: props => <TableRowDemoFeeds {...props} />,
    AddEdit: () => (
      <>
        <Route
          exact
          path={routeByName[DemoFeeds].edit}
          component={AddEditDemoFeeds}
        />
        <Route
          exact
          path={routeByName[DemoFeeds].add}
          component={AddEditDemoFeeds}
        />
      </>
    ),
    Filter: props => <FilterDemoFeeds {...props} />
  },

  [MediaRSS]: {
    Row: props => <TableRowMediaRSS {...props} />,
    AddEdit: () => (
      <>
        <Route
          exact
          path={routeByName[MediaRSS].edit}
          component={AddEditMediaRSS}
        />
        <Route
          exact
          path={routeByName[MediaRSS].add}
          component={AddEditMediaRSS}
        />
      </>
    ),
    Filter: props => <FilterMediaRSS {...props} />
  },

  [YouTube]: {
    Row: props => <TableRowYouTube {...props} />,
    AddEdit: () => (
      <>
        <Route
          exact
          path={routeByName[YouTube].edit}
          component={AddEditYouTube}
        />
        <Route
          exact
          path={routeByName[YouTube].add}
          component={AddEditYouTube}
        />
      </>
    ),
    Filter: props => <FilterYouTube {...props} />
  },

  [Radio]: {
    Row: props => <TableRowRadio {...props} />,
    AddEdit: () => (
      <>
        <Route exact path={routeByName[Radio].edit} component={AddEditRadio} />
        <Route exact path={routeByName[Radio].add} component={AddEditRadio} />
      </>
    ),
    Filter: props => <FilterRadio {...props} />
  },

  [CustomWidget]: {
    Row: props => <TableRowCustomWidget {...props} />,
    AddEdit: () => (
      <>
        <Route
          exact
          path={routeByName[CustomWidget].edit}
          component={AddEditCustomWidget}
        />
        <Route
          exact
          path={routeByName[CustomWidget].add}
          component={AddEditCustomWidget}
        />
      </>
    ),
    Filter: props => <FilterCustomWidget {...props} />
  },
  default: {
    default: null
  }
}

const Components = ({
  feature = 'default',
  component = 'default',
  ...props
}) => {
  const SpecificComponent = useMemo(() => components[feature][component], [
    component,
    feature
  ])
  return <SpecificComponent {...props} />
}

export default Components
