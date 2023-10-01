import { useState, useRef, useCallback, useEffect } from "react";

import { Wrapper, Status } from "@googlemaps/react-wrapper";

interface MyMapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
}

const MyMapComponent: React.FC<MyMapProps> = ({ center, zoom }) => {
  const ref = useRef(null);
  const mapRef = useRef<google.maps.Map>();
  const [polygon, setPolygon] = useState<google.maps.Polygon>(null);
  const polygonListeners = useRef<google.maps.MapsEventListener[]>([]);

  const [polygonCoords, setPolygonCoords] = useState<google.maps.LatLngLiteral[]>([
    { lat: 52.52549080781086, lng: 13.398118538856465 },
    { lat: 52.48578559055679, lng: 13.36653284549709 },
    { lat: 52.48871246221608, lng: 13.44618372440334 }
  ]);

  const updatePolygonCoords = () => {
    if (polygon) {
      const pathArray = polygon.getPath().getArray();
      setPolygonCoords(
        pathArray.map(point => {
          return { lat: point.lat(), lng: point.lng() };
        })
      );
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(ref.current, {
        center,
        zoom
      });
    }
    
    const newPolygon = new window.google.maps.Polygon({
      paths: polygonCoords,
      editable: true,
      draggable: true,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35
    });
    newPolygon.setMap(mapRef.current);
    setPolygon(newPolygon);

    // Update polygon coordinates when edited
    polygonListeners.current.push(
      newPolygon.getPath().addListener('set_at', updatePolygonCoords),
      newPolygon.getPath().addListener('insert_at', updatePolygonCoords),
      newPolygon.getPath().addListener('remove_at', updatePolygonCoords)
    );

    // Log polygon coordinates when clicked
    newPolygon.addListener('click', () => {
      console.log(polygonCoords);
    });

    // Cleanup
    return () => {
      polygonListeners.current.forEach(listener => listener.remove());
    };
  }, []);

  return (
    <div ref={ref} id="map" style={{ width: "100%", height: "100%" }}>
      <button onClick={() => console.log(polygonCoords)}>Done</button>
    </div>
  );
};

const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return <div>Loading...</div>
    case Status.FAILURE:
      return <div>Failed to load Google Maps</div>
    case Status.SUCCESS:
      return <MyMapComponent center={{lat: 52.52549080, lng: 13.3981185388}} zoom={12} />;
  }
};

function App() {
  return (<div className="map-wrapper" style={{ height: "100vh", width: "100%" }}>
    <Wrapper apiKey={"AIzaSyA2cQAGCEu8wO4wD3tRD0caO-Cqdz7S724"} render={render} />
  </div>)

}

export default App;