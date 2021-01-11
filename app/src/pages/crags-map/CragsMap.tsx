import { useEffect } from "react";

import "leaflet/dist/leaflet.css";
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import leaflet from "leaflet";
import "leaflet.markercluster";
import "leaflet-defaulticon-compatibility";

import { crags } from "../../api";

function CragsMap() {

  useEffect(() => {
    (async () => {
      const allCrags = await crags.getCrags("");

      const tiles = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });
      const map = leaflet.map('map', { layers: [tiles] }).fitWorld();
      const markers = leaflet.markerClusterGroup();

      allCrags.forEach(crag => {
        const marker = leaflet
          .marker([parseFloat(crag.latitude), parseFloat(crag.longitude)])
          .bindPopup(`<a href="/crags/${crag.slug}"><h2>${crag.title}</h2></a>`);

        markers.addLayer(marker);
      });

      map.addLayer(markers);
    })();
  });

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "calc(100vh - 52px)"
      }}
    ></div>
  );
}

export default CragsMap;
