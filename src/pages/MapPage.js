import { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';
import useMapbox from '../hooks/useMapbox';

const startingPoint = {
    lng: -103.3251,
    lat: 20.6707,
    zoom: 11.35,
};

const MapPage = () => {
    const {
        coordinates,
        setRef,
        newMarker$,
        markerMovement$,
        addMarker,
        updateLocation,
    } = useMapbox(startingPoint);
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
            socket.emit('updated-marker', marker);
        });
    }, [markerMovement$, socket]);

    // Move marker using sockets
    useEffect(() => {
        socket.on('updated-marker', (marker) => {
            updateLocation(marker);
        });
    }, [socket, updateLocation]);

    // listen new markers
    useEffect(() => {
        socket.on('new-marker', (marker) => {
            addMarker(marker, marker.id);
        });
    }, [socket, addMarker]);
    console.log(process.env.NODE_ENV);
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
