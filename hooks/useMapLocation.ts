import React, { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import type MapView from 'react-native-maps';
import { LocationCoords } from '../types/map';

export function useMapLocation() {
  const [location, setLocation] = useState<LocationCoords | null>(null);

  const setDefaultLocation = useCallback(() => {
    setLocation({
      latitude: 33.6844,
      longitude: 73.0479,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  }, []);

  const getCurrentLocation = useCallback(async (mapRef?: React.RefObject<MapView | null>) => {
    try {
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services.',
          [{ text: 'Use Default', onPress: setDefaultLocation }]
        );
        setDefaultLocation();
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setDefaultLocation();
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newCoords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setLocation(newCoords);

      if (mapRef && mapRef.current) {
        mapRef.current.animateCamera({
          center: newCoords,
          zoom: 15,
        });
      }
    } catch (error) {
      console.error('Location error:', error);
      setDefaultLocation();
    }
  }, [setDefaultLocation]);

  return {
    location,
    setLocation,
    getCurrentLocation,
    setDefaultLocation,
  };
}
