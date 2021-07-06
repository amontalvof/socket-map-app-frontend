import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken =
    'pk.eyJ1IjoiYW5keXdkIiwiYSI6ImNrcXBnNzgyejAxa3Eyd2x0eGphYjk4bHAifQ.Y8bCi84-gT5wGQzpcYgAnA';

const useMapbox = (startingPoint) => {
    // Reference to map div
    const mapDiv = useRef();
    const setRef = useCallback((node) => {
        mapDiv.current = node;
    }, []);

    const map = useRef();
    const [coordinates, setCoordinates] = useState(startingPoint);

    useEffect(() => {
        const actualMap = new mapboxgl.Map({
            container: mapDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [startingPoint.lng, startingPoint.lat],
            zoom: startingPoint.zoom,
        });
        map.current = actualMap;
    }, [startingPoint]);

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

    return { coordinates, setRef };
};

export default useMapbox;
