import { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';
import useMapbox from '../hooks/useMapbox';

const startingPoint = {
    lng: -122.4725,
    lat: 37.801,
    zoom: 13.5,
};

const MapPage = () => {
    const { coordinates, setRef, newMarker$, markerMovement$, addMarker } =
        useMapbox(startingPoint);
    const { socket } = useContext(SocketContext);

    // listen to existing markers
    useEffect(() => {
        socket.on('active-markers', (markers) => {
            for (const key of Object.keys(markers)) {
                addMarker(markers[key], key);
            }
        });
    }, [socket, addMarker]);

    // New Marker
    useEffect(() => {
        newMarker$.subscribe((marker) => {
            socket.emit('new-marker', marker);
        });
    }, [newMarker$, socket]);

    // Marker movement
    useEffect(() => {
        markerMovement$.subscribe((marker) => {
            // console.log(marker.id);
        });
    }, [markerMovement$]);

    // listen new markers
    useEffect(() => {
        socket.on('new-marker', (marker) => {
            addMarker(marker, marker.id);
        });
    }, [socket, addMarker]);

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
