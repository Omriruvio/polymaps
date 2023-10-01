import { useState, useRef, useCallback, useEffect } from "react";

import { Wrapper, Status } from "@googlemaps/react-wrapper";

function MyMapComponent({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
}) {
  const ref = useRef();
  const [map, setMap] = useState<google.maps.Map>(null);

  
  useEffect(() => {
    const map = new window.google.maps.Map(ref.current, {
      center,
      zoom,
    });
    setMap(map);
  }, []);

  useEffect(() => {
    const polygon = new window.google.maps.Polygon({
      paths: [
        { lat: 52.52549080781086, lng: 13.398118538856465 },
        { lat: 52.48578559055679, lng: 13.36653284549709 },
        { lat: 52.48871246221608, lng: 13.44618372440334 }
      ],
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35
    });
  
    polygon.setMap(map);
  }, [map]);

  return <div ref={ref} id="map" style={{width: "100%", height: "100%"}} />;
}

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