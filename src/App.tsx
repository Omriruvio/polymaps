import { useRef, useEffect, useState } from 'react';

import { Wrapper, Status } from '@googlemaps/react-wrapper';

interface MyMapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
}

const MyMapComponent: React.FC<MyMapProps> = ({ center, zoom }) => {
  const ref = useRef(null);
  const mapRef = useRef<google.maps.Map>();
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager>();
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(ref.current, {
        center,
        zoom,
      });
    }

    if (!drawingManagerRef.current) {
      drawingManagerRef.current = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        polygonOptions: {
          clickable: true,
          draggable: true,
          editable: true,
        },
        map: mapRef.current,
      });

      drawingManagerRef.current.addListener('polygoncomplete', (polygon: google.maps.Polygon) => {
        setPolygons((prevPolygons) => [...prevPolygons, polygon]);
        drawingManagerRef.current?.setDrawingMode(null);

        polygon.addListener('click', (event: google.maps.PolyMouseEvent) => {
          const {
            domEvent,
            latLng: { lat, lng },
            edge,
            path,
            vertex,
          } = event;
          console.table({ lat: lat(), lng: lng(), edge, path, vertex });
          console.log(domEvent.type);
          if (domEvent.type === 'contextmenu') {
            polygon.setMap(null);
          }
        });
      });
    }
  }, [polygons]);

  return <div ref={ref} id="map" style={{ width: '100%', height: '100%' }}></div>;
};

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <div>Loading...</div>;
    case Status.FAILURE:
      return <div>Failed to load Google Maps</div>;
    case Status.SUCCESS:
      return <MyMapComponent center={{ lat: 52.5254908, lng: 13.3981185388 }} zoom={12} />;
  }
};

function App() {
  return (
    <div className="map-wrapper" style={{ height: '100vh', width: '100%' }}>
      <Wrapper apiKey={'AIzaSyA2cQAGCEu8wO4wD3tRD0caO-Cqdz7S724'} render={render} libraries={['drawing']} />
    </div>
  );
}

export default App;
