import { useRef, useEffect, useState, CSSProperties } from 'react';

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  polygons: google.maps.Polygon[];
  setPolygons: React.Dispatch<React.SetStateAction<google.maps.Polygon[]>>;
  mapOptions?: google.maps.MapOptions;
  drawingManagerOptions?: google.maps.drawing.DrawingManagerOptions;
  polygonColor?: CSSProperties['stroke'];
  polygonHighlightColor?: CSSProperties['stroke'];
}

export const Map: React.FC<MapProps> = ({
  center,
  zoom,
  polygons,
  setPolygons,
  mapOptions,
  drawingManagerOptions,
  polygonColor = '#2b2b2b',
  polygonHighlightColor = '#51c8f3',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map>();
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager>();
  const [selectedPolygon, setSelectedPolygon] = useState<google.maps.Polygon>(null);

  const defaultMapOptions: google.maps.MapOptions = {
    // disableDefaultUI: false,
    fullscreenControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    zoomControl: false,
    keyboardShortcuts: false,
    styles: [
      // hide poi labels
      { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      // disable transit stations
      { featureType: 'transit.station', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    ],
  };

  const defaultDrawingManagerOptions: google.maps.drawing.DrawingManagerOptions = {
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [google.maps.drawing.OverlayType.POLYGON],
    },
    polygonOptions: {
      clickable: true,
      draggable: true,
      editable: true,
    },
  };

  useEffect(() => {
    // highlight selected polygon
    if (selectedPolygon) {
      polygons.forEach((polygon) => {
        polygon.setOptions({
          ...(polygon === selectedPolygon ? { strokeColor: polygonHighlightColor } : { strokeColor: polygonColor }),
        });
      });
    }
  }, [selectedPolygon]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        ...(mapOptions ?? defaultMapOptions),
      });
    }

    if (!drawingManagerRef.current) {
      drawingManagerRef.current = new google.maps.drawing.DrawingManager({
        map: mapRef.current,
        ...(drawingManagerOptions ?? defaultDrawingManagerOptions),
      });

      drawingManagerRef.current.addListener('polygoncomplete', (polygon: google.maps.Polygon) => {
        setPolygons((prevPolygons) => [...prevPolygons, polygon]);
        drawingManagerRef.current?.setDrawingMode(null);

        polygon.addListener('click', (event: google.maps.PolyMouseEvent) => {
          setSelectedPolygon(polygon);
        });

        polygon.addListener('rightclick', (event: google.maps.PolyMouseEvent) => {
          // remove polygon from map, state and reset selected polygon
          polygon.setMap(null);
          setPolygons((prevPolygons) => prevPolygons.filter((p) => p !== polygon));
          setSelectedPolygon(null);
        });
      });
    }
  }, [polygons]);

  return <div ref={ref} id="map" style={{ width: '100%', height: '100%' }}></div>;
};
