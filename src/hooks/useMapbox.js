import { useEffect, useRef, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import mapboxgl from 'mapbox-gl';
import { Subject } from 'rxjs';

mapboxgl.accessToken =
    'pk.eyJ1IjoiYW5keXdkIiwiYSI6ImNrcXBnNzgyejAxa3Eyd2x0eGphYjk4bHAifQ.Y8bCi84-gT5wGQzpcYgAnA';

const useMapbox = (startingPoint) => {
    // Reference to map div
    const mapDiv = useRef();
    const setRef = useCallback((node) => {
        mapDiv.current = node;
    }, []);

    // Reference to markers
    const markers = useRef({});

    // RxJS Observables
    const markerMovement = useRef(new Subject());
    const newMarker = useRef(new Subject());

    // Map and coordinates
    const map = useRef();
    const [coordinates, setCoordinates] = useState(startingPoint);

    // Add markers function
    const addMarker = useCallback((event) => {
        const { lng, lat } = event.lngLat;
        const marker = new mapboxgl.Marker();
        marker.id = uuidv4(); // TODO: si el marcador ya tienen id
        marker.setLngLat([lng, lat]).addTo(map.current).setDraggable(true);
        markers.current[marker.id] = marker;
        // TODO: Si el marcador tiene id no emitir
        newMarker.current.next({
            id: marker.id,
            lng,
            lat,
        });

        // listen marker movement
        marker.on('drag', (event) => {
            const id = event.target;
            const { lng, lat } = event.target.getLngLat();

            // TODO: emitir los cambios del marcador
        });
    }, []);

    useEffect(() => {
        const actualMap = new mapboxgl.Map({
            container: mapDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [startingPoint.lng, startingPoint.lat],
            zoom: startingPoint.zoom,
        });
        map.current = actualMap;
    }, [startingPoint]);

    // when the map is moved
    useEffect(() => {
        map.current?.on('move', (params) => {
            const { lng, lat } = map.current.getCenter();
            setCoordinates({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: map.current.getZoom().toFixed(2),
            });
        });
        return map.current?.off('move');
    }, []);

    // add markers when I click
    useEffect(() => {
        map.current?.on('click', addMarker);
    }, [addMarker]);

    return {
        coordinates,
        setRef,
        markers,
        addMarker,
        newMarker$: newMarker.current,
    };
};

export default useMapbox;
