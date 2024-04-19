import React, { useState, useEffect, useRef } from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const SimpleMap = () => {
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(11);
  const [locationRetrieved, setLocationRetrieved] = useState(false);
  const [publicBathrooms, setPublicBathrooms] = useState([]);

  const map = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setLocationRetrieved(true);
      // Pan the map to the new center
      if (map.current) {
        map.current.panTo({ lat: position.coords.latitude, lng: position.coords.longitude });
      }
    });
  }, []);

  useEffect(() => {
    if (map.current) {
      const service = new google.maps.places.PlacesService(map.current);

      const request = {
        location: center,
        radius: 500,
        type: "restaurant",
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setPublicBathrooms(results.map((restaurant) => {
            return {
              id: restaurant.id,
              name: restaurant.name,
              location: restaurant.geometry.location,
            };
          }));
        }
      });
    }
  }, [map. center]);

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "100vh", width: "100%" }}>
       {locationRetrieved ? (
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY }}
        defaultCenter={center}
        defaultZoom={17}
        ref={map}
      >
        <AnyReactComponent lat={center.lat} lng={center.lng} text="You are Here" />
        {publicBathrooms.map((restaurant) => (
          <AnyReactComponent
            key={restaurant.id}
            lat={restaurant.geometry.location.lat()}
            lng={restaurant.geometry.location.lng()}
            text={restaurant.name}
          />
        ))}
      </GoogleMapReact>
       ) : (
        <div>Loading location...</div>
      )}
    </div>
  );
};

export default SimpleMap;
