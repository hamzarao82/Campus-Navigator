import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import tw from 'twrnc';
import { router, useLocalSearchParams } from 'expo-router';
import { db } from '../../firebaseConfig';
import { NavigationOverlay } from "../../components/ui/molecules/NavigationOverlay";

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.85;

import { useMapLocation } from '../../hooks/useMapLocation';
import { useMapNavigation } from '../../hooks/useMapNavigation';
import { useManagedPOIs } from '../../hooks/useManagedPOIs';
import { useMapSearch } from '../../hooks/useMapSearch';
import { usePOIActions } from '../../hooks/usePOIActions';
import { MapDrawer } from '../../components/ui/organisms/MapDrawer';
import { MapSearchResults } from '../../components/ui/organisms/MapSearchResults';
import { MapFloatingControls } from '../../components/ui/organisms/MapFloatingControls';
import { MapModals } from '../../components/ui/organisms/MapModals';
import { LocationCoords, POI, RouteData, SearchResult, LongPressCoords } from '../../types/map';
import { Icons } from '../../constants/icons';

export default function MapNavigation() {
  const mapRef = useRef<MapView | null>(null);
  
  const { location, setLocation, getCurrentLocation } = useMapLocation();
  const {
    routeData, setRouteData,
    currentDistance, currentDuration,
    realTimeTracking, setRealTimeTracking,
    navigationStarted, setNavigationStarted,
    heading, setHeading,
    loadingRoute, calculateRoute,
    startRealTimeTracking, stopRealTimeTracking, clearRoute
  } = useMapNavigation(location, setLocation, mapRef);

  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const { managedPOIs } = useManagedPOIs();
  const {
    searchQuery, setSearchQuery,
    searchResults, setSearchResults,
    searching,
    isSearchFocused, setIsSearchFocused,
    searchLocation, clearSearch
  } = useMapSearch();
  const {
    savedPOIs, setSavedPOIs,
    showSaveModal, setShowSaveModal,
    showManualPOIModal, setShowManualPOIModal,
    showEditModal, setShowEditModal,
    isSaving, setIsSaving,
    tempLocation, setTempLocation,
    editForm, setEditForm,
    newPOIForm, setNewPOIForm,
    handleMapLongPress,
    savePOI,
    saveCurrentLocationPOI,
    saveManualPOI,
    deletePOI
  } = usePOIActions();

  const params = useLocalSearchParams();
  const isAdmin = true; // Hardcoded for now based on context

  const POI_CATEGORIES = ["Building", "Food", "Library", "Parking", "Other"];

  const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getCurrentLocation(mapRef);
  }, [getCurrentLocation]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(drawerAnim, {
        toValue: drawerOpen ? 0 : -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: drawerOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, [drawerOpen]);

  useEffect(() => {
    if (realTimeTracking && selectedPOI && routeData) {
      console.log('Starting real-time tracking...');
      startRealTimeTracking(selectedPOI);
    } else {
      console.log('Stopping real-time tracking...');
      stopRealTimeTracking();
    }

    return () => {
      stopRealTimeTracking();
    };
  }, [realTimeTracking, selectedPOI, routeData, startRealTimeTracking, stopRealTimeTracking]);

  // Handle incoming POI from manage-poi screen
  useEffect(() => {
    if (params.poiName && params.poiLat && params.poiLng && location) {
      const incomingPOI = {
        id: Date.now(),
        name: params.poiName as string,
        latitude: parseFloat(params.poiLat as string),
        longitude: parseFloat(params.poiLng as string),
        category: 'Managed',
      };

      handleNavigateTo(incomingPOI);
    }
  }, [params.poiName, params.poiLat, params.poiLng, location]);





  const handleNavigateToMap = (poi: POI) => {
    // Navigation logic from Manage POI goes here. For now, it's just setting selected.
  };

  const handleSearchSelect = (searchPoi: SearchResult) => {
    const poi: POI = {
      id: searchPoi.id,
      name: searchPoi.name,
      description: searchPoi.type || 'Search Result',
      category: 'Search Result',
      latitude: searchPoi.latitude,
      longitude: searchPoi.longitude,
    };
    handleNavigateTo(poi);
  };

  const handleNavigateTo = async (poi: POI) => {
    if (!location) {
      Alert.alert('Location Required', 'Enable location services');
      return;
    }

    setSelectedPOI(poi);
    setDrawerOpen(false);
    setSearchResults([]);
    setSearchQuery('');

    await calculateRoute(
      { latitude: location.latitude, longitude: location.longitude },
      { latitude: poi.latitude, longitude: poi.longitude }
    );
  };

  const startNavigation = async () => {
    if (!selectedPOI || !location) {
      Alert.alert('Error', 'No destination selected or location unavailable');
      return;
    }

    const routeSuccess = await calculateRoute(
      { latitude: location.latitude, longitude: location.longitude },
      { latitude: selectedPOI.latitude, longitude: selectedPOI.longitude }
    );

    if (routeSuccess) {
      setRealTimeTracking(true);
    }
  };





  const toggleDrawer = () => setDrawerOpen(!drawerOpen);



  const filteredPOIs = searchQuery.length > 0
    ? managedPOIs.filter(poi =>
      poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (poi.description && poi.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : [];

  const handleSearchResultSelect = (poi: POI) => {
    setSearchQuery(poi.name);
    setIsSearchFocused(false);
    handleNavigateTo(poi);
  };

  const isNavigating = realTimeTracking && navigationStarted;
  const selectedDestPOI = selectedPOI && routeData;

  if (!location) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={tw`mt-3 text-base text-gray-600`}>Loading map...</Text>
        <TouchableOpacity onPress={getCurrentLocation} style={tw`mt-5 px-8 py-3 bg-blue-500 rounded-lg`}>
          <Text style={tw`text-white text-base font-semibold`}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const groupedPOIs = savedPOIs.reduce<Record<string, POI[]>>(
    (acc, poi) => {
      const category = poi.category || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(poi);
      return acc;
    },
    {}
  );

  return (
    <View style={tw`flex-1`}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={tw`flex-1`}
        initialRegion={location}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={false}
        showsCompass={true}
        rotateEnabled={true}
        onLongPress={handleMapLongPress}
      >
        {savedPOIs.map((poi: POI) => (
          <Marker
            key={poi.id}
            coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
            title={poi.name}
            description={poi.description}
            pinColor={selectedPOI?.id === poi.id ? 'green' : 'red'}
            onPress={() => setSelectedPOI(poi)}
          />
        ))}

        {/* Managed Campus POIs */}
        {managedPOIs.map((poi: POI) => (
          <Marker
            key={`managed-${poi.id}`}
            coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
            title={poi.name}
            description={poi.description}
            pinColor={selectedPOI?.id === poi.id ? 'green' : 'purple'}
            onPress={() => setSelectedPOI(poi)}
          />
        ))}

        {routeData && (
          <Polyline
            coordinates={routeData.coordinates}
            strokeColor="#2196F3"
            strokeWidth={4}
          />
        )}
      </MapView>

        <MapSearchResults
          searchResults={searchResults}
          searching={searching}
          onSelect={(searchPoi) => {
            handleSearchSelect(searchPoi);
          }}
        />

      <MapFloatingControls
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        getCurrentLocation={getCurrentLocation}
        navigationStarted={navigationStarted}
        showSaveModal={showSaveModal}
        showEditModal={showEditModal}
        isAdmin={isAdmin}
        selectedPOI={selectedPOI}
        deletePOI={deletePOI}
      />

      <MapDrawer
        drawerOpen={drawerOpen}
        toggleDrawer={() => setDrawerOpen(!drawerOpen)}
        overlayAnim={overlayAnim}
        drawerAnim={drawerAnim}
        drawerWidth={DRAWER_WIDTH}
        managedPOIs={managedPOIs}
        onSelectPOI={(poi) => {
          handleNavigateTo(poi);
        }}
      />

      {/* Bottom Panel - Route Info with Start Navigation Button (NOT ACTIVE) */}
      {selectedPOI && !navigationStarted && (
        <NavigationOverlay
          mode="preview"
          distance={routeData?.distance ? String(routeData.distance) : null}
          duration={routeData?.duration ? String(routeData.duration) : null}
          destinationName={selectedPOI.name}
          onStartNavigation={() => setRealTimeTracking(true)}
          onCancelNavigation={() => {
            setSelectedPOI(null);
            setRouteData(null);
          }}
        />
      )}

      {/* Active Navigation Overlay */}
      {navigationStarted && (
        <NavigationOverlay
          mode="active"
          distance={currentDistance ? String(currentDistance) : (routeData?.distance ? String(routeData.distance) : null)}
          duration={currentDuration ? String(currentDuration) : (routeData?.duration ? String(routeData.duration) : null)}
          onCancelNavigation={() => {
            setRealTimeTracking(false);
            setNavigationStarted(false);
            setSelectedPOI(null);
            setRouteData(null);
          }}
        />
      )}
      <MapModals
        showSaveModal={showSaveModal}
        setShowSaveModal={setShowSaveModal}
        setTempLocation={setTempLocation}
        newPOIForm={newPOIForm}
        setNewPOIForm={setNewPOIForm}
        savePOI={savePOI}
        isSaving={isSaving}
        POI_CATEGORIES={POI_CATEGORIES}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        selectedPOI={selectedPOI}
        editForm={editForm}
        setEditForm={setEditForm}
        saveManualPOI={saveManualPOI}
      />
    </View>
  );
}