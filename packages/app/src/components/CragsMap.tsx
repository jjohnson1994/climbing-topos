import 'leaflet/dist/leaflet.css'
import { CragBrief } from '@climbingtopos/types'
import leaflet from 'leaflet'
import { useCallback, useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { Link } from '@tanstack/react-router'
import { getFn as getCragsFn } from '@/data/actions/crags/get'
import ButtonCopyCoordinates from '@/components/ButtonCopyCoordinates'
import useSupercluster from 'use-supercluster'
import { BBox, Feature, Point } from 'geojson'

type CragFeature = Feature<Point, { cluster: false; crag: CragBrief }>

function cragIcon() {
  return leaflet.divIcon({
    html: '<i class="fas fa-mountain fa-2x"></i>',
    iconSize: [20, 20],
    className: 'icon',
  })
}

function clusterIcon(count: number) {
  return leaflet.divIcon({
    html: `<div class="crag-cluster-marker">${count}</div>`,
    iconSize: [40, 40],
    className: '',
  })
}

function ClusteredMarkers({ crags }: { crags: CragBrief[] }) {
  const map = useMap()
  const [bounds, setBounds] = useState<BBox>()
  const [zoom, setZoom] = useState(map.getZoom())

  const updateMap = useCallback(() => {
    const b = map.getBounds()
    setBounds([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()])
    setZoom(map.getZoom())
  }, [map])

  useEffect(() => {
    updateMap()
    map.on('moveend', updateMap)
    return () => {
      map.off('moveend', updateMap)
    }
  }, [map, updateMap])

  const points: CragFeature[] = crags.map((crag) => ({
    type: 'Feature',
    properties: { cluster: false, crag },
    geometry: {
      type: 'Point',
      coordinates: [parseFloat(`${crag.longitude}`), parseFloat(`${crag.latitude}`)],
    },
  }))

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  })

  return (
    <>
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates
        const props = cluster.properties as { cluster: boolean; point_count?: number; crag?: CragBrief }

        if (props.cluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              position={[latitude, longitude]}
              icon={clusterIcon(props.point_count!)}
              eventHandlers={{
                click: () => {
                  const expansionZoom = Math.min(
                    supercluster!.getClusterExpansionZoom(cluster.id as number),
                    20,
                  )
                  map.setView([latitude, longitude], expansionZoom, { animate: true })
                },
              }}
            />
          )
        }

        const { crag } = props
        return (
          <Marker key={crag!.slug} icon={cragIcon()} position={[latitude, longitude]}>
            <Popup>
              <h5 className="subtitle is-5">{crag!.title}</h5>
              <img src={`${crag!.image}`} alt={crag!.title} />
              <ButtonCopyCoordinates
                className="is-small"
                latitude={crag!.latitude}
                longitude={crag!.longitude}
              />
              <Link
                className="button mt-1 is-small is-rounded is-fullwidth"
                to="/crags/$cragSlug"
                params={{ cragSlug: crag!.slug }}
              >
                Open
              </Link>
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}

function CragsMap() {
  const [allCrags, setCrags] = useState<CragBrief[]>()

  useEffect(() => {
    const _getCrags = async () => {
      try {
        const newCrags = await getCragsFn({ data: { limit: 500 } })
        setCrags(newCrags as CragBrief[])
      } catch (error) {}
    }

    _getCrags()
  }, [])

  return (
    <MapContainer
      scrollWheelZoom={false}
      style={{ width: '100%', height: 'calc(100vh - 64px)' }}
      center={[51.505, -0.09]}
      zoom={3}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={20}
        maxNativeZoom={19}
      />
      {allCrags && <ClusteredMarkers crags={allCrags} />}
    </MapContainer>
  )
}

export default CragsMap
