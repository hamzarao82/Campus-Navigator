import React, { useState, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import MapView from 'react-native-maps';
import { LocationCoords, POI, RouteData } from '../types/map';

export function useMapNavigation(
  location: LocationCoords | null,
  setLocation: (loc: LocationCoords) => void,
  mapRef: React.RefObject<MapView | null>
) {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [currentDistance, setCurrentDistance] = useState<string | null>(null);
  const [currentDuration, setCurrentDuration] = useState<number | null>(null);
  const [realTimeTracking, setRealTimeTracking] = useState(false);
  const [navigationStarted, setNavigationStarted] = useState(false);
  const [heading, setHeading] = useState(0);
  const [loadingRoute, setLoadingRoute] = useState(false);

  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  const calculateRoute = useCallback(async (
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number },
    showLoading: boolean = true
  ) => {
    if (showLoading) setLoadingRoute(true);

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson&steps=true`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.code !== 'Ok') {
        throw new Error('Route not found');
      }

      const route = data.routes[0];
      const coordinates = route.geometry.coordinates.map((coord: number[]) => ({
        latitude: coord[1],
        longitude: coord[0],
      }));

      const routeInfo = {
        coordinates,
        distance: (route.distance / 1000).toFixed(2),
        duration: Math.round(route.duration / 60),
        steps: route.legs[0].steps,
      };

      setRouteData(routeInfo);
      setCurrentDistance(routeInfo.distance);
      setCurrentDuration(routeInfo.duration);

      if (!realTimeTracking && mapRef.current) {
        mapRef.current.fitToCoordinates([origin, destination], {
          edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
          animated: true,
        });
      }

      return true;
    } catch (error) {
      console.error('Route error:', error);
      if (showLoading) {
        Alert.alert('Error', 'Could not calculate route');
      }
      return false;
    } finally {
      if (showLoading) setLoadingRoute(false);
    }
  }, [realTimeTracking, mapRef]);

  const stopRealTimeTracking = useCallback(() => {
    console.log('Stopping real-time tracking...');
    if (locationSubscription.current) {
      console.log('Removing location subscription');
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    setNavigationStarted(false);
    console.log('Real-time navigation stopped');
  }, []);

  const startRealTimeTracking = useCallback(async (selectedPOI: POI | null) => {
    try {
      stopRealTimeTracking();

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is needed for real-time navigation');
        setRealTimeTracking(false);
        return;
      }

      console.log('Setting up location watcher...');
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (newLocation: Location.LocationObject) => {
          console.log('New location update received');
          const newCoords = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };

          setLocation(newCoords);
          setHeading(newLocation.coords.heading || 0);

          if (selectedPOI) {
            calculateRoute(
              { latitude: newCoords.latitude, longitude: newCoords.longitude },
              { latitude: selectedPOI.latitude, longitude: selectedPOI.longitude },
              false
            );
          }

          if (mapRef.current && navigationStarted) {
            mapRef.current.animateCamera({
              center: newCoords,
              heading: newLocation.coords.heading || 0,
              pitch: 45,
              zoom: 16,
            }, { duration: 1000 });
          }
        }
      );

      locationSubscription.current = subscription;
      setNavigationStarted(true);
      console.log('Real-time navigation started successfully');
    } catch (error) {
      console.error('Real-time tracking error:', error);
      Alert.alert('Tracking Error', 'Could not start real-time tracking');
      setRealTimeTracking(false);
    }
  }, [stopRealTimeTracking, setLocation, calculateRoute, mapRef, navigationStarted]);

  const clearRoute = useCallback(() => {
    console.log('Clearing route completely');
    setRouteData(null);
    setRealTimeTracking(false);
    setNavigationStarted(false);
    setCurrentDistance(null);
    setCurrentDuration(null);
    stopRealTimeTracking();
  }, [stopRealTimeTracking]);

  return {
    routeData,
    setRouteData,
    currentDistance,
    setCurrentDistance,
    currentDuration,
    setCurrentDuration,
    realTimeTracking,
    setRealTimeTracking,
    navigationStarted,
    setNavigationStarted,
    heading,
    setHeading,
    loadingRoute,
    calculateRoute,
    startRealTimeTracking,
    stopRealTimeTracking,
    clearRoute,
  };
}
