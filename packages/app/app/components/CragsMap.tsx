"use client"

import { CragBrief } from "@climbingtopos/types";
import leaflet from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Link from "next/link";
import { crags } from "@/app/api";
import ButtonCopyCoordinates from "@/app/components/ButtonCopyCoordinates";
import MarkerClusterGroup from 'react-leaflet-cluster'


function CragsMap() {
  const [allCrags, setCrags] = useState<CragBrief[]>();

  useEffect(() => {
    const getCrags = async () => {
      const newCrags = await crags.getCrags("");
      setCrags(newCrags);
    };

    getCrags();
  }, []);

  const cragIcon = () => {
    return leaflet.divIcon({
      html: '<i class="fas fa-mountain fa-2x"></i>',
      iconSize: [20, 20],
      className: "icon"
    })
  }

  return (
   <MapContainer
     scrollWheelZoom={false}
     style={{ width: "100%", height: "calc(100vh - 64px)" }}
     center={[51.505, -0.09]}
     zoom={ 3 }
   >
     <TileLayer
       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
       maxZoom={ 20 }
       maxNativeZoom={ 19 }
     />
     <MarkerClusterGroup>
       { allCrags?.map(crag => (
         <Marker
           key={ crag.slug }
           icon={ cragIcon() }
           position={[
             parseFloat(`${crag.latitude}`),
             parseFloat(`${crag.longitude}`)
           ]}
         >
           <Popup>
             <h5 className="subtitle is-5">{ crag.title }</h5>
             <img src={ `${crag.image}` } alt={ crag.title }/>
             <ButtonCopyCoordinates
               className="is-small"
               latitude={ crag.latitude }
               longitude={ crag.longitude }
             />
             <Link
               className="button mt-1 is-small is-rounded is-fullwidth"
               href={ `/crags/${crag.slug}` }
             >
               Open
             </Link>
           </Popup>
         </Marker>
       ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

export default CragsMap;
