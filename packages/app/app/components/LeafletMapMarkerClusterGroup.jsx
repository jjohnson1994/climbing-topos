import MarkerClusterGroup from 'react-leaflet-markercluster';

/*
 * TODO: Workaroud for MarkerClusterGroup types
 * not working correctly. Waiting on a fix
 *
 * https://github.com/yuzhva/react-leaflet-markercluster/issues/133
 */

const MMarkerClustorGroup = ({ children }) => {
    return (
      <MarkerClusterGroup chunkedLoading={true} >
        { children }
      </MarkerClusterGroup>
    );
}

export default MMarkerClustorGroup;
