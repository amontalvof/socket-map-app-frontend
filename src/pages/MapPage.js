import { useEffect } from 'react';
import useMapbox from '../hooks/useMapbox';

const startingPoint = {
    lng: -122.4725,
    lat: 37.801,
    zoom: 13.5,
};

const MapPage = () => {
    const { coordinates, setRef, newMarker$, markerMovement$ } =
        useMapbox(startingPoint);

    // New Marker
    useEffect(() => {
        newMarker$.subscribe((marker) => {
            // TODO: nuevo marcador emitir
        });
    }, [newMarker$]);

    // Marker movement
    useEffect(() => {
        markerMovement$.subscribe((marker) => {
            // console.log(marker.id);
        });
    }, [markerMovement$]);

    return (
        <>
            <div className="info">
                Lng: {coordinates.lng} | Lat: {coordinates.lat} | Zoom:
                {coordinates.zoom}
            </div>
            <div className="mapContainer" ref={setRef} />
        </>
    );
};

export default MapPage;
