/* global google */
import { Paper, withStyles } from '@material-ui/core'
import React from 'react'
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs
} from 'react-google-maps'
import { translate } from 'react-i18next'
import markerImage from '../../common/assets/icons/map-marker.svg'
import * as config from '../../config'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      padding: '22px 32px',
      borderRadius: '6px',
      boxShadow: `-2px 0 4px 0 ${palette[type].card.shadow}`,
      position: 'relative',
      minHeight: '390px',
      overflow: 'hidden'
    },

    map: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  }
}

const Map = withScriptjs(
  withGoogleMap(({ markers = [] }) => {
    return (
      <GoogleMap onGoogleApi defaultZoom={2} defaultCenter={{ lat: 0, lng: 0 }}>
        {markers.map((m, index) => (
          <Marker
            key={index}
            icon={markerImage}
            position={{ lat: m.lat, lng: m.long }}
            animation={google && google.maps.Animation.DROP}
          />
        ))}
      </GoogleMap>
    )
  })
)

const MapsCard = ({ t, classes, title = '', rootClassName = '', ...props }) => {
  return (
    <Paper className={[classes.root, rootClassName].join(' ')}>
      <Map
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div className={classes.map} />}
        mapElement={<div style={{ height: `100%` }} />}
        defaultZoom={8}
        {...props}
      />
    </Paper>
  )
}

export default translate('translations')(withStyles(styles)(MapsCard))
