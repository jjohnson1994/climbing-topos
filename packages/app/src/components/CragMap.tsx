
import 'leaflet/dist/leaflet.css'
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css'
import { Crag } from '@climbingtopos/types';
import leaflet from 'leaflet';
import 'leaflet-gesture-handling'
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ButtonCopyCoordinates from './ButtonCopyCoordinates';

type LocationStatus = 'idle' | 'coarse' | 'precise' | 'denied' | 'error'

interface UserLocation {
  lat: number
  lng: number
  accuracy: number
  heading: number | null
}

function useUserLocation(): { location: UserLocation | null; status: LocationStatus; errorCode: number | null } {
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [status, setStatus] = useState<LocationStatus>('idle')
  const [errorCode, setErrorCode] = useState<number | null>(null)
  const headingRef = useRef<number | null>(null)
  const watchIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('error')
      return
    }

    const applyPosition = (position: GeolocationPosition, precise: boolean) => {
      setErrorCode(null)
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        heading: headingRef.current,
      })
      setStatus(precise ? 'precise' : 'coarse')
    }

    const startLowAccuracyWatch = () => {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => applyPosition(pos, false),
        (err) => {
          setErrorCode(err.code)
          setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'error')
        },
        { enableHighAccuracy: false, maximumAge: 60000, timeout: 15000 }
      )
    }

    const startPreciseWatch = () => {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => applyPosition(pos, true),
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setStatus('denied')
          } else {
            startLowAccuracyWatch()
          }
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      )
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyPosition(pos, false)
        startPreciseWatch()
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus('denied')
        } else {
          startPreciseWatch()
        }
      },
      { enableHighAccuracy: false, maximumAge: 60000, timeout: 5000 }
    )

    const handleOrientation = (e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      let heading: number | null = null
      if (e.webkitCompassHeading != null) {
        heading = e.webkitCompassHeading
      } else if (e.alpha != null) {
        heading = (360 - e.alpha) % 360
      }
      if (heading !== null) {
        headingRef.current = heading
        setLocation(prev => prev ? { ...prev, heading } : prev)
      }
    }

    const eventName = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation'
    window.addEventListener(eventName, handleOrientation as EventListener)

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current)
      window.removeEventListener(eventName, handleOrientation as EventListener)
    }
  }, [])

  return { location, status, errorCode }
}

function userLocationIcon(heading: number | null): leaflet.DivIcon {
  const svg = heading !== null
    ? `<svg width="48" height="48" viewBox="-24 -24 48 48" xmlns="http://www.w3.org/2000/svg" style="transform:rotate(${heading}deg)">
        <polygon points="0,-22 -9,-6 9,-6" fill="rgba(66,133,244,0.45)"/>
        <circle cx="0" cy="0" r="8" fill="#4285f4" stroke="white" stroke-width="2.5"/>
      </svg>`
    : `<svg width="48" height="48" viewBox="-24 -24 48 48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="0" cy="0" r="8" fill="#4285f4" stroke="white" stroke-width="2.5"/>
      </svg>`

  return leaflet.divIcon({ html: svg, iconSize: [48, 48], iconAnchor: [24, 24], className: '' })
}

function FullscreenControl() {
  const map = useMap()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const control = leaflet.control({ position: 'topleft' })
    control.onAdd = () => {
      const el = leaflet.DomUtil.create('div', 'leaflet-bar leaflet-control')
      leaflet.DomEvent.disableClickPropagation(el)
      setContainer(el)
      return el
    }
    control.addTo(map)
    return () => { control.remove() }
  }, [map])

  useEffect(() => {
    const onChange = () => {
      const entering = !!document.fullscreenElement
      setIsFullscreen(entering)
      map.getContainer().style.height = entering ? '100vh' : '90vh'
      const gh = (map as any).gestureHandling
      if (gh) {
        ;(map as any).options.gestureHandling = !entering
        entering ? gh.disable() : gh.enable()
      }
      if (entering) map.dragging.enable()
      map.invalidateSize()
    }
    document.addEventListener('fullscreenchange', onChange)
    document.addEventListener('webkitfullscreenchange', onChange)
    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      document.removeEventListener('webkitfullscreenchange', onChange)
    }
  }, [map])

  const toggle = () => {
    const el = map.getContainer()
    if (!document.fullscreenElement) {
      (el.requestFullscreen ?? (el as any).webkitRequestFullscreen)?.call(el)
    } else {
      (document.exitFullscreen ?? (document as any).webkitExitFullscreen)?.call(document)
    }
  }

  if (!container) return null

  return createPortal(
    <a
      role="button"
      title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      onClick={toggle}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, cursor: 'pointer', textDecoration: 'none', color: '#333' }}
    >
      <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} aria-hidden="true" />
    </a>,
    container
  )
}

function CragMap({ crag }: { crag: Crag }) {
  const { location: userLocation, status, errorCode } = useUserLocation()

  const areaIcon = () => leaflet.divIcon({
    html: '<i class="fas fa-mountain fa-2x"></i>',
    iconSize: [20, 20],
    className: 'icon',
  })

  const carParkIcon = () => leaflet.divIcon({
    html: '<i class="fas fa-parking fa-2x"></i>',
    iconSize: [20, 20],
    className: 'icon',
  })

  return (
    <>
      {status === 'coarse' && (
        <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: 'rgba(0,0,0,0.65)', color: 'white', padding: '4px 10px', borderRadius: 4, fontSize: 13, whiteSpace: 'nowrap' }}>
          Improving accuracy…
        </div>
      )}
      {status === 'denied' && (
        <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: 'rgba(0,0,0,0.65)', color: 'white', padding: '4px 10px', borderRadius: 4, fontSize: 13, whiteSpace: 'nowrap' }}>
          Location permission denied
        </div>
      )}
      {status === 'error' && (
        <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: 'rgba(0,0,0,0.65)', color: 'white', padding: '4px 10px', borderRadius: 4, fontSize: 13, whiteSpace: 'nowrap' }}>
          Location unavailable (error {errorCode})
        </div>
      )}
      <MapContainer
        center={[
          parseFloat(`${crag?.latitude}`),
          parseFloat(`${crag?.longitude}`),
        ]}
        zoom={16}
        scrollWheelZoom={false}
        {...{ gestureHandling: true }}
        style={{ height: '90vh' }}
      >
        <FullscreenControl />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={20}
          maxNativeZoom={19}
        />
        {crag?.carParks.map((carPark, index) => (
          <Marker
            key={index}
            icon={carParkIcon()}
            position={[
              parseFloat(`${carPark.latitude}`),
              parseFloat(`${carPark.longitude}`),
            ]}
          >
            <Popup>
              <h6 className="subtitle is-6">{carPark.title}</h6>
              <p>{carPark.description}</p>
              <ButtonCopyCoordinates
                className="is-small"
                latitude={carPark.latitude}
                longitude={carPark.longitude}
              />
            </Popup>
          </Marker>
        ))}
        {crag?.areas.map((area) => (
          <Marker
            key={area.slug}
            icon={areaIcon()}
            position={[
              parseFloat(`${area?.latitude}`),
              parseFloat(`${area?.longitude}`),
            ]}
          >
            <Popup>
              <h5 className="subtitle is-5">{area.title}</h5>
              <ButtonCopyCoordinates
                className="is-small is-fullwidth"
                latitude={area.latitude}
                longitude={area.longitude}
              />
              <Link
                className="button mt-1 is-small is-rounded is-fullwidth"
                to="/crags/$cragSlug/areas/$areaSlug"
                params={{ cragSlug: area.cragSlug, areaSlug: area.slug }}
              >
                Open
              </Link>
            </Popup>
          </Marker>
        ))}
        {userLocation && (
          <>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={userLocation.accuracy}
              pathOptions={{
                color: '#4285f4',
                fillColor: '#4285f4',
                fillOpacity: status === 'coarse' ? 0.08 : 0.05,
                weight: status === 'coarse' ? 1.5 : 1,
                opacity: status === 'coarse' ? 0.5 : 0.3,
              }}
            />
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userLocationIcon(userLocation.heading)}
              zIndexOffset={1000}
            />
          </>
        )}
      </MapContainer>
    </>
  )
}

export default CragMap;
