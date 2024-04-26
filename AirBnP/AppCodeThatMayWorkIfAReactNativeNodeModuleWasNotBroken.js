import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps'; // import MapView and Marker
import { StyleSheet, View } from 'react-native';

const App = () => {
  const [query, setQuery] = useState('');
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [service, setService] = useState(null);

  useEffect(() => {
    const loadedMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: 40.7128, lng: -74.0060 }, // Example location (New York)
      zoom: 12,
    });
    setMap(loadedMap);
    setService(new window.google.maps.places.PlacesService(loadedMap));
  }, []);

  const handleSearch = () => {
    if (!service) return;

    const request = {
      location: map.getCenter(),
      radius: '5000',
      type: ['restaurant'],
      query: query
    };

    service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        map.setCenter(results[0].geometry.location);
        results.forEach(place => {
          new window.google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name
          });
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        provider="google"  // Specify Google Maps as provider
        style={styles.map}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default App;
