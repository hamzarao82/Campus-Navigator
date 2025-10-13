import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Platform, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useRouter } from 'expo-router';

const GOOGLE_API_KEY = 'AIzaSyAy9f1MytruKVZpvjRsVgvrQGJ8muxrHq4'; // Replace with your API key

export default function InteractiveCampusMap() {
  const router = useRouter();
  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // HTML with interactive map
  const mapHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; }
          #info { position: absolute; top: 10px; left: 10px; background: white; padding: 5px 10px; border-radius: 6px; font-family: Arial; z-index: 5; }
        </style>
        <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}"></script>
        <script>
          let map;
          let userMarker;
          let destinationMarker;

          function initMap() {
            // Default location
            const campus = { lat: 24.8607, lng: 67.0011 };

            map = new google.maps.Map(document.getElementById('map'), {
              zoom: 16,
              center: campus,
            });

            // Campus marker
            new google.maps.Marker({
              position: campus,
              map: map,
              title: 'Campus',
            });

            // Try HTML5 geolocation
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
                  map.setCenter(pos);

                  userMarker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: 'You',
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                  });
                },
                () => { console.log('Geolocation denied'); }
              );
            }

            // Add destination marker on click
            map.addListener('click', (e) => {
              const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
              if (destinationMarker) destinationMarker.setMap(null);
              destinationMarker = new google.maps.Marker({
                position: coords,
                map: map,
                title: 'Destination',
                icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
              });

              // Optional: send coordinates to React Native
              window.ReactNativeWebView.postMessage(JSON.stringify({ destination: coords }));
            });
          }
        </script>
      </head>
      <body onload="initMap()">
        <div id="map"></div>
      </body>
    </html>
  `;

  if (Platform.OS === 'web') {
    return (
      <View style={tw`flex-1 justify-center items-center px-4`}>
        <Text style={tw`text-center text-lg font-bold mb-2`}>Campus Map (Mobile Only)</Text>
        <Text style={tw`text-center text-gray-700`}>
          This interactive map feature is only available on mobile devices.
        </Text>
      </View>
    );
  }

  const handleWebMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.destination) {
        Alert.alert('Destination Selected', `Lat: ${data.destination.lat}, Lng: ${data.destination.lng}`);
      }
    } catch (e) {
      console.log('WebView message error:', e);
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-100 justify-center items-center`}>
      {/* Header */}
      <View style={tw`w-full flex-row justify-between items-center px-6 py-4 bg-white shadow`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`p-2 bg-gray-200 rounded-full`}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold`}>Campus Map</Text>
        <TouchableOpacity
          onPress={() => Alert.alert('Indoor Navigation', 'Feature coming soon')}
          style={tw`px-3 py-1 bg-blue-600 rounded-lg`}
        >
          <Text style={tw`text-white font-semibold`}>Indoor</Text>
        </TouchableOpacity>
      </View>

      {/* WebView Container */}
      <View
        style={[
          tw`bg-white shadow-lg rounded-lg overflow-hidden`,
          { width: '90%', height: '75%' },
        ]}
      >
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={{ html: mapHTML }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onMessage={handleWebMessage}
          startInLoadingState
          renderLoading={() => (
            <View style={tw`flex-1 justify-center items-center bg-white`}>
              <ActivityIndicator size="large" color="#1D4ED8" />
              <Text style={tw`mt-2 text-gray-700`}>Loading map...</Text>
            </View>
          )}
        />
        {loading && (
          <View style={tw`absolute inset-0 bg-white bg-opacity-50 justify-center items-center`}>
            <ActivityIndicator size="large" color="#1D4ED8" />
            <Text style={tw`mt-2 text-gray-700`}>Loading map...</Text>
          </View>
        )}
      </View>
    </View>
  );
}
