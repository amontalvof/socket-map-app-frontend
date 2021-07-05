import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// TODO: Cambiar access token
mapboxgl.accessToken =
    'pk.eyJ1IjoiYW5keXdkIiwiYSI6ImNrcXBnNzgyejAxa3Eyd2x0eGphYjk4bHAifQ.Y8bCi84-gT5wGQzpcYgAnA';

const startingPoint = {
    lng: -122.4725,
    lat: 37.801,
    zoom: 13.5,
};

const MapPage = () => {
    const mapDiv = useRef();
    const [map, setMap] = useState();
    const [coordinates, setCoordinates] = useState(startingPoint);

    useEffect(() => {
        const actualMap = new mapboxgl.Map({
            container: mapDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [startingPoint.lng, startingPoint.lat],
            zoom: startingPoint.zoom,
        });
        setMap(actualMap);
    }, []);

    useEffect(() => {
        map?.on('move', (params) => {
            const { lng, lat } = map.getCenter();
            setCoordinates({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: map.getZoom().toFixed(2),
            });
        });
        return map?.off('move');
    }, [map]);

    return (
        <>
            <div className="info">
                Lng: {coordinates.lng} | Lat: {coordinates.lat} | Zoom:
                {coordinates.zoom}
            </div>
            <div className="mapContainer" ref={mapDiv} />
        </>
    );
};

export default MapPage;
