import { Crag } from "core/types";
import leaflet from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Link } from "react-router-dom";
import ButtonCopyCoordinates from "./ButtonCopyCoordinates";
import MapMarkerClusterGroup from "./LeafletMapMarkerClusterGroup";

function CragMap({ crag }: { crag: Crag }) {

  const areaIcon = () => {
    return leaflet.divIcon({
      html: '<i class="fas fa-mountain fa-2x"></i>',
      iconSize: [20, 20],
      className: "icon"
    })
  }

  const carParkIcon = () => {
    return leaflet.divIcon({
      html: '<i class="fas fa-parking fa-2x"></i>',
      iconSize: [20, 20],
      className: "icon"
    })
  }

  return (
    <MapContainer
      center={[
        parseFloat(`${crag?.latitude}`),
        parseFloat(`${crag?.longitude}`)
      ]}
      zoom={ 16 }
      scrollWheelZoom={false}
      style={{ height: "90vh" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={ 20 }
        maxNativeZoom={ 19 }
      />
      <MapMarkerClusterGroup>
        <Marker
          position={[
            parseFloat(`${crag?.latitude}`),
            parseFloat(`${crag?.longitude}`)
          ]}
        />
        { crag?.carParks.map((carPark, index) => (
          <Marker
            key={ index }
            icon={ carParkIcon() }
            position={[
              parseFloat(`${carPark.latitude}`),
              parseFloat(`${carPark.longitude}`)
            ]}
          >
            <Popup>
              <h6 className="subtitle is-6">{ carPark.title }</h6>
              <p>{ carPark.description }</p>
              <ButtonCopyCoordinates
                className="is-small"
                latitude={ carPark.latitude }
                longitude={ carPark.longitude }
              />
            </Popup>
          </Marker>
        ))}
        { crag?.areas.map(area => (
          <Marker
            key={ area.slug }
            icon={ areaIcon() }
            position={[
              parseFloat(`${area?.latitude}`),
              parseFloat(`${area?.longitude}`)
            ]}>
            <Popup>
              <h5 className="subtitle is-5">{ area.title }</h5>
              <ButtonCopyCoordinates
                className="is-small is-fullwidth"
                latitude={ area.latitude }
                longitude={ area.longitude }
              />
              <Link
                className="button mt-1 is-small is-rounded is-fullwidth"
                to={ `/crags/${area.cragSlug}/areas/${area.slug}` }
              >
                Open
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapMarkerClusterGroup>
    </MapContainer>
  );
}

export default CragMap;
