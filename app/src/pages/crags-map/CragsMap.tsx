import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import leaflet from "leaflet";
import "leaflet.markercluster";
import "leaflet-defaulticon-compatibility";

import { crags } from "../../api";
import {Crag} from "core/types";
import LeafletMap from "../../components/LeafletMap";

function CragsMap() {
  const [allCrags, setCrags] = useState<Crag[]>();

  useEffect(() => {
    const getCrags = async () => {
      const newCrags = await crags.getCrags("");
      setCrags(newCrags);
    };

    getCrags();
  }, []);

  const createMapMarkers = () => {
    const markers = [
     ...(allCrags ? allCrags?.map(crag => {
        return leaflet
          .marker([parseFloat(crag.latitude), parseFloat(crag.longitude)])
          .bindPopup(`<a href="/crags/${crag.slug}"><h2>${crag.title}</h2></a>`);
      }) : [])
    ];

    return markers;
  }

  return (
    <LeafletMap markers={ createMapMarkers() } height="calc(100vh - 56px)"></LeafletMap>
  );
}

export default CragsMap;
