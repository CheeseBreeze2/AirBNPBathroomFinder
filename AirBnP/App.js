import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const SimpleMap = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [restaurants, setRestaurants] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    if (!isLoaded) return;

    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !currentLocation || !mapRef.current) return;
  
    const service = new window.google.maps.places.PlacesService(mapRef.current);
  
    service.nearbySearch(
      {
        location: currentLocation,
        radius: 500,
        type: "restaurant",
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setRestaurants(results);
        } else {
          console.error("Failed to fetch restaurants", status);
        }
      }
    );
  }, [isLoaded, currentLocation, mapRef.current]);  

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={currentLocation || { lat: 0, lng: 0 }}
        zoom={currentLocation ? 17 : 11} // Zoom to 17 if current location is available, otherwise zoom out to show restaurants
        ref={mapRef}
      >
        {currentLocation && (
          <Marker
            position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={{
              lat: restaurant.geometry.location.lat(),
              lng: restaurant.geometry.location.lng(),
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default SimpleMap;