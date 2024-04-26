import React, { useState, useEffect, useRef } from 'react';

function PlacesSearch() {
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
    <div>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search for restaurants"
      />
      <button onClick={handleSearch}>Search</button>
      <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
}

export default PlacesSearch;
