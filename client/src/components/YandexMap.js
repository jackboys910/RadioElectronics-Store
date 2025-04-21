import React, { useEffect, useRef } from 'react'

const YandexMap = ({ defaultCoordinates, onAddressSelect }) => {
  const mapContainerRef = useRef(null)
  const mapInstance = useRef(null)
  const placemarkInstance = useRef(null)

  useEffect(() => {
    if (!window.ymaps) return
    let destroyed = false

    window.ymaps.ready(() => {
      if (destroyed) return

      if (!mapInstance.current) {
        mapInstance.current = new window.ymaps.Map(mapContainerRef.current, {
          center: defaultCoordinates,
          zoom: 12,
          controls: ['zoomControl', 'fullscreenControl'],
        })

        placemarkInstance.current = new window.ymaps.Placemark(
          defaultCoordinates,
          {},
          { draggable: true }
        )

        mapInstance.current.geoObjects.add(placemarkInstance.current)

        placemarkInstance.current.events.add('dragend', () => {
          const coords = placemarkInstance.current.geometry.getCoordinates()
          fetchAddress(coords)
        })

        mapInstance.current.events.add('click', (e) => {
          const coords = e.get('coords')
          placemarkInstance.current.geometry.setCoordinates(coords)
          fetchAddress(coords)
        })
      } else {
        mapInstance.current.setCenter(defaultCoordinates)
        placemarkInstance.current.geometry.setCoordinates(defaultCoordinates)
      }
    })

    const fetchAddress = (coords) => {
      window.ymaps.geocode(coords).then((res) => {
        const address =
          res.geoObjects.get(0)?.getAddressLine() || 'Адрес не найден'
        console.log(address)
        if (onAddressSelect) {
          onAddressSelect(address, coords)
        }
      })
    }

    return () => {
      destroyed = true
      if (mapInstance.current) {
        mapInstance.current.destroy()
        mapInstance.current = null
      }
    }
  }, [defaultCoordinates, onAddressSelect])

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '400px' }} />
  )
}

export default YandexMap
