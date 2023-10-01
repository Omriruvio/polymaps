import { useEffect, useRef, useState } from 'react';
import { Wrapper as GoogleMapsWrapper, Status } from '@googlemaps/react-wrapper';
import { Map } from './components/Map';

function App() {
  const center = { lat: 52.5254908, lng: 13.3981185388 };
  const zoom = 12;
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);

  useEffect(() => {
    const search = document.getElementById('pac-input') as HTMLInputElement;
    search.focus();
  }, []);

  const submitPolygons = () => {
    const data = polygons.map((polygon) => {
      const path = polygon.getPath();
      const points = path.getArray().map((point) => ({ lat: point.lat(), lng: point.lng() }));
      return points;
    });

    const geojson = {
      type: 'MultiPolygon',
      coordinates: data,
    };

    console.log(geojson);
  };

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <input id="pac-input" type="text" placeholder="Search locations" tabIndex={0} />
      <div className="map-wrapper" style={{ flex: 1 }}>
        <GoogleMapsWrapper
          apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          libraries={['drawing', 'places']}
          render={(status: Status) => {
            switch (status) {
              case Status.LOADING:
                return <div>Loading...</div>;
              case Status.FAILURE:
                return <div>Failed to load Google Maps</div>;
              case Status.SUCCESS:
                return <Map polygons={polygons} setPolygons={setPolygons} center={center} zoom={zoom} />;
            }
          }}
        />
      </div>

      <button onClick={submitPolygons}>Submit Geofence</button>
    </div>
  );
}

export default App;
