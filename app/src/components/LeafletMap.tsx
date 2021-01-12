import { useEffect } from "react";
import { DateTime } from "luxon";

import "leaflet/dist/leaflet.css";
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import leaflet from "leaflet";
import "leaflet.markercluster";
import "leaflet-defaulticon-compatibility";

interface Props {
  markers: leaflet.Marker[],
  height?: string,
  center?: [number, number],
  zoom?: number
}

let map: leaflet.Map;

const getTimeStamp = async () => {
  const res = await fetch("https://tilecache.rainviewer.com/api/maps.json");
  const dates = await res.json();

  return dates.pop();
}

function LeafletMap({ markers, height = "600px", center, zoom }: Props) {

  useEffect(() => {
    const initMap = async () => {
      if (map?.off) {
        map.off();
        map.remove();
      }

      const tiles = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

      const timestamp = await getTimeStamp();
      const precipitationNow = leaflet.tileLayer(
        `https://tilecache.rainviewer.com/v2/radar/${timestamp}/256/{z}/{x}/{y}/2/1_1.png`
      );

      map = leaflet.map('map', {
        layers: [tiles, precipitationNow],
        ...(center && { center }),
        ...(zoom && { zoom })
      });

      if (!center && !zoom) {
        map.fitWorld();
      }

      const markersLayer = leaflet.markerClusterGroup();

      markers.forEach(marker => {
        markersLayer.addLayer(marker);
      });

      map.addLayer(markersLayer);
    }

    initMap();
  });

  return <div id="map" style={{ width: "100%", height }}></div>;
}

export default LeafletMap;
