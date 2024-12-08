import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  MarkerF,
  StandaloneSearchBox,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";

const RiyadhLocation = { lat: 24.7136, lng: 46.6753 };
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function LocationPicker({ onLocationChange, defaultLocation = null }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries: ["places"],
  });

  const [mapStates, setMapStates] = useState({
    selectedLocation: defaultLocation || {
      latitude: RiyadhLocation.lat,
      longitude: RiyadhLocation.lng,
      address: "",
    },
    searchBox: null,
  });

  useEffect(() => {
    if (defaultLocation) {
      setMapStates((prev) => ({
        ...prev,
        selectedLocation: defaultLocation,
      }));
    }
  }, [defaultLocation]);


  const handlePlacesChanged = () => {
    if (mapStates.searchBox) {
      const places = mapStates.searchBox.getPlaces();
      if (places?.[0]) {
        const place = places[0];
        const newLocation = {
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          address: place.formatted_address,
        };
        setMapStates((prev) => ({ ...prev, selectedLocation: newLocation }));
        onLocationChange(newLocation);
      }
    }
  };

  const handleMarkerDragEnd = (event) => {
    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === "OK" && results?.[0]) {
          const newLocation = {
            latitude,
            longitude,
            address: results[0].formatted_address,
          };
          setMapStates((prev) => ({
            ...prev,
            selectedLocation: newLocation,
          }));
          onLocationChange(newLocation);
        }
      }
    );
  };

  const handleMapClick = (event) => {
    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === "OK" && results?.[0]) {
          const newLocation = {
            latitude,
            longitude,
            address: results[0].formatted_address,
          };
          setMapStates((prev) => ({
            ...prev,
            selectedLocation: newLocation,
          }));
          onLocationChange(newLocation);
        }
      }
    );
  };

  if (!isLoaded) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 h-[300px] rounded-lg overflow-hidden border border-gray-200">
        <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={{
            lat: mapStates.selectedLocation.latitude,
            lng: mapStates.selectedLocation.longitude,
          }}
          zoom={13}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          <StandaloneSearchBox
            onLoad={(ref) =>
              setMapStates((prev) => ({ ...prev, searchBox: ref }))
            }
            onPlacesChanged={handlePlacesChanged}
          >
            <input
              type="text"
              placeholder="Search for a location"
              className="absolute left-1/2 -translate-x-1/2 top-4 w-[80%] max-w-md px-4 py-2 rounded-lg shadow-lg border border-gray-200 outline-none focus:ring-2 focus:ring-navy-600 focus:border-transparent bg-white/95"
            />
          </StandaloneSearchBox>

          <MarkerF
            position={{
              lat: mapStates.selectedLocation.latitude,
              lng: mapStates.selectedLocation.longitude,
            }}
            
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        </GoogleMap>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            value={mapStates.selectedLocation?.address || ""}
            className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-navy-600 focus:border-transparent outline-none bg-gray-50 h-24 resize-none"
            readOnly
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude
            </label>
            <input
              type="text"
              value={mapStates.selectedLocation?.latitude || ""}
              className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-gray-50"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude
            </label>
            <input
              type="text"
              value={mapStates.selectedLocation?.longitude || ""}
              className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-gray-50"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationPicker;
