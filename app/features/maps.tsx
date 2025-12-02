import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import tw from 'twrnc';
import { router, useLocalSearchParams } from 'expo-router';
import { db } from '@/firebaseConfig';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.85;

const Icons = {
  Menu: '☰',
  Close: '✕',
  Search: '🔍',
  Pin: '📍',
  Navigation: '➤',
  Clock: '⏱',
  Distance: '📏',
  Save: '💾',
  Trash: '🗑',
  Plus: '➕',
  Current: '📡',
  List: '📋',
  Position: '📍',
  Exit: '🚪',
  Play: '▶️',
  Stop: '⏹️'
};

export default function MapNavigation() {
  const [location, setLocation] = useState(null);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [savedPOIs, setSavedPOIs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showManualPOIModal, setShowManualPOIModal] = useState(false);
  const [newPOI, setNewPOI] = useState({ name: '', description: '', category: 'Custom' });
  const [manualPOI, setManualPOI] = useState({ name: '', latitude: '', longitude: '', description: '', category: 'Custom' });
  const [longPressCoords, setLongPressCoords] = useState(null);
  const [realTimeTracking, setRealTimeTracking] = useState(false);
  const [heading, setHeading] = useState(0);
  const [navigationStarted, setNavigationStarted] = useState(false);
  const [currentDistance, setCurrentDistance] = useState(null);
  const [currentDuration, setCurrentDuration] = useState(null);
  const params = useLocalSearchParams();
  const [managedPOIs, setManagedPOIs] = useState([]);

  const mapRef = useRef(null);
  const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const locationSubscription = useRef(null);

  useEffect(() => {
    getCurrentLocation();
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

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
      startRealTimeTracking();
    } else {
      console.log('Stopping real-time tracking...');
      stopRealTimeTracking();
    }

    return () => {
      stopRealTimeTracking();
    };
  }, [realTimeTracking, selectedPOI, routeData]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'pois'),
      (snapshot) => {
        const pois = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          category: 'Managed',
          savedAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        }));
        setManagedPOIs(pois);
      },
      (error) => {
        console.error('Error fetching managed POIs:', error);
      }
    );

    return () => unsubscribe();
  }, []);

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

  const startRealTimeTracking = async () => {
    try {
      stopRealTimeTracking();

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is needed for real-time navigation');
        setRealTimeTracking(false);
        return;
      }

      console.log('Setting up location watcher...');
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (newLocation) => {
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

      setNavigationStarted(true);
      console.log('Real-time navigation started successfully');
    } catch (error) {
      console.error('Real-time tracking error:', error);
      Alert.alert('Tracking Error', 'Could not start real-time tracking');
      setRealTimeTracking(false);
    }
  };

  const stopRealTimeTracking = () => {
    console.log('Stopping real-time tracking...');
    if (locationSubscription.current) {
      console.log('Removing location subscription');
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    setNavigationStarted(false);
    console.log('Real-time navigation stopped');
  };

  const getCurrentLocation = async () => {
    try {
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services.',
          [{ text: 'Use Default', onPress: () => setDefaultLocation() }]
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
        timeout: 10000,
      });

      const newCoords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setLocation(newCoords);

      if (mapRef.current) {
        mapRef.current.animateCamera({
          center: newCoords,
          zoom: 15,
        });
      }
    } catch (error) {
      console.error('Location error:', error);
      setDefaultLocation();
    }
  };

  const setDefaultLocation = () => {
    setLocation({
      latitude: 33.6844,
      longitude: 73.0479,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const searchLocation = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;

      const response = await fetch(url, {
        headers: { 'User-Agent': 'CampusNavigator/1.0' }
      });
      const data = await response.json();

      const results = data.map(item => ({
        id: item.place_id,
        name: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        type: item.type,
      }));

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Error', 'Could not search location');
    } finally {
      setSearching(false);
    }
  };

  const calculateRoute = async (origin, destination, showLoading = true) => {
    if (showLoading) setLoading(true);

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson&steps=true`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.code !== 'Ok') {
        throw new Error('Route not found');
      }

      const route = data.routes[0];
      const coordinates = route.geometry.coordinates.map(coord => ({
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
      if (showLoading) setLoading(false);
    }
  };

  const handleNavigateTo = async (poi) => {
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

  const exitNavigation = () => {
    console.log('Exit navigation called');
    stopRealTimeTracking();
    setRealTimeTracking(false);
    setNavigationStarted(false);
    console.log('Navigation exited successfully');
  };

  const clearRoute = () => {
    console.log('Clearing route completely');
    setSelectedPOI(null);
    setRouteData(null);
    setRealTimeTracking(false);
    setNavigationStarted(false);
    setCurrentDistance(null);
    setCurrentDuration(null);
    stopRealTimeTracking();
  };

  const handleMapLongPress = (e) => {
    const coords = e.nativeEvent.coordinate;
    setLongPressCoords(coords);
    setNewPOI({ ...newPOI, name: '', description: '', category: 'Custom' });
    setShowSaveModal(true);
  };

  const savePOI = async () => {
    if (!newPOI.name.trim()) {
      Alert.alert('Error', 'Please enter a name for this location');
      return;
    }
    try {
      const poiData = {
        name: newPOI.name,
        description: newPOI.description || '',
        capacity: 0,
        currentOccupancy: 0,
        status: 'Open',
        latitude: longPressCoords.latitude,
        longitude: longPressCoords.longitude,
        image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'pois'), poiData);
      setShowSaveModal(false);
      setNewPOI({ name: '', description: '', category: 'Custom' });
      Alert.alert('Success', 'Location saved to campus POIs');
    } catch (error) {
      console.error("Error saving POI:", error);
      Alert.alert('Error', 'Failed to save location');
    }
  };

  const saveCurrentLocationPOI = async () => {  // ← Add 'async'
    if (!location) {
      Alert.alert('Error', 'Current location not available');
      return;
    }

    try {
      const poiData = {
        name: 'Current Location',
        description: 'Saved from current position',
        location: '',
        hours: '',
        capacity: 0,
        currentOccupancy: 0,
        status: 'Open',
        latitude: location.latitude,
        longitude: location.longitude,
        image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "pois"), poiData);  // ✅ Save to Firebase
      setDrawerOpen(false);
      Alert.alert('Success', 'Current location saved to campus POIs!');
    } catch (error) {
      console.error("Error saving POI:", error);
      Alert.alert('Error', 'Failed to save location. Make sure you have admin/faculty permissions.');
    }
  };

  const saveManualPOI = async () => {  // ← Add 'async'
    if (!manualPOI.name.trim()) {
      Alert.alert('Error', 'Please enter a name for this location');
      return;
    }

    if (!manualPOI.latitude || !manualPOI.longitude) {
      Alert.alert('Error', 'Please enter both latitude and longitude');
      return;
    }

    const lat = parseFloat(manualPOI.latitude);
    const lng = parseFloat(manualPOI.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Error', 'Please enter valid coordinates');
      return;
    }

    try {
      const poiData = {
        name: manualPOI.name,
        description: manualPOI.description || '',
        location: '',
        hours: '',
        capacity: 0,
        currentOccupancy: 0,
        status: 'Open',
        latitude: lat,
        longitude: lng,
        image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "pois"), poiData);  // ✅ Save to Firebase
      setShowManualPOIModal(false);
      setManualPOI({ name: '', latitude: '', longitude: '', description: '', category: 'Custom' });
      Alert.alert('Success', 'Location saved to campus POIs!');
    } catch (error) {
      console.error("Error saving POI:", error);
      Alert.alert('Error', 'Failed to save location. Make sure you have admin/faculty permissions.');
    }
  };

  const deletePOI = (id: string) => {
    Alert.alert(
      'Delete Location',
      'Are you sure you want to delete this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setSavedPOIs(savedPOIs.filter(poi => poi.id !== id))
        }
      ]
    );
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleSearchSelect = (result) => {
    const poi = {
      id: result.id,
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      type: result.type,
    };
    handleNavigateTo(poi);
  };

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

  const groupedPOIs = savedPOIs.reduce((acc, poi) => {
    if (!acc[poi.category]) acc[poi.category] = [];
    acc[poi.category].push(poi);
    return acc;
  }, {});

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
        {savedPOIs.map(poi => (
          <Marker
            key={poi.id}
            coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
            title={poi.name}
            description={poi.description}
            pinColor={selectedPOI?.id === poi.id ? 'green' : 'red'}
            onPress={() => setSelectedPOI(poi)}
          />
        ))

        }

        {/* Managed Campus POIs */}
        {managedPOIs.map(poi => (
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

      {/* Search Bar */}
      <View style={tw`absolute top-12 left-20 right-5 z-10`}>
        <View style={tw`flex-row items-center bg-white rounded-full px-4 py-3 shadow-lg`}>
          <Text style={tw`text-lg mr-2.5`}>{Icons.Search}</Text>
          <TextInput
            style={tw`flex-1 text-base text-gray-800`}
            placeholder="Search location..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              searchLocation(text);
            }}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchQuery(''); setSearchResults([]); }}>
              <Text style={tw`text-lg text-gray-400`}>{Icons.Close}</Text>
            </TouchableOpacity>
          )}
        </View>

        {searchResults.length > 0 && (
          <ScrollView style={tw`mt-2.5 bg-white rounded-xl max-h-62 shadow-lg`}>
            {searching ? (
              <ActivityIndicator style={tw`my-5`} />
            ) : (
              searchResults.map(result => (
                <TouchableOpacity
                  key={result.id}
                  style={tw`flex-row items-center p-4 border-b border-gray-100`}
                  onPress={() => handleSearchSelect(result)}
                >
                  <Text style={tw`text-lg mr-2.5`}>{Icons.Pin}</Text>
                  <Text style={tw`flex-1 text-sm text-gray-800`} numberOfLines={2}>
                    {result.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </View>

      {/* Menu Button */}
      <TouchableOpacity
        onPress={toggleDrawer}
        style={tw`absolute top-12 left-5 w-12 h-12 bg-blue-500 rounded-full justify-center items-center shadow-lg z-10`}
      >
        <Text style={tw`text-2xl text-white`}>{drawerOpen ? Icons.Close : Icons.List}</Text>
      </TouchableOpacity>

      {/* Bottom Right Position Button */}
      <View style={tw`absolute bottom-30 right-5 z-10`}>
        <TouchableOpacity
          onPress={getCurrentLocation}
          style={tw`w-14 h-14 bg-blue-500 rounded-full justify-center items-center shadow-lg`}
        >
          <Text style={tw`text-2xl text-white`}>{Icons.Position}</Text>
        </TouchableOpacity>
      </View>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <>
          <Animated.View style={[tw`absolute inset-0 bg-black z-50`, { opacity: overlayAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] }) }]}>
            <TouchableOpacity style={tw`flex-1`} activeOpacity={1} onPress={toggleDrawer} />
          </Animated.View>

          <Animated.View
            style={[
              tw`absolute top-0 bottom-0 bg-white shadow-2xl z-50`,
              { width: DRAWER_WIDTH, transform: [{ translateX: drawerAnim }] }
            ]}
          >
            {/* Drawer Header */}
            <View style={tw`flex-row justify-between items-center px-5 pt-12 pb-4 bg-blue-500`}>
              <View style={tw`flex-row items-center gap-3`}>
                <Text style={tw`text-3xl text-white`}>{Icons.List}</Text>
                <Text style={tw`text-2xl font-bold text-white`}>Saved Locations</Text>
              </View>
              <TouchableOpacity onPress={toggleDrawer} style={tw`p-2`}>
                <Text style={tw`text-3xl text-white`}>{Icons.Close}</Text>
              </TouchableOpacity>
            </View>

            {/* Add POI Buttons */}
            <View style={tw`flex-row px-5 py-4 bg-blue-50 border-b border-blue-200 gap-2`}>
              <TouchableOpacity
                style={tw`flex-1 flex-row items-center justify-center bg-blue-500 rounded-xl py-3 px-4`}
                onPress={saveCurrentLocationPOI}
              >
                <Text style={tw`text-white text-lg mr-2`}>{Icons.Plus}</Text>
                <Text style={tw`text-white font-semibold`}>Save Current</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 flex-row items-center justify-center bg-green-500 rounded-xl py-3 px-4`}
                onPress={() => setShowManualPOIModal(true)}
              >
                <Text style={tw`text-white text-lg mr-2`}>{Icons.Plus}</Text>
                <Text style={tw`text-white font-semibold`}>Add Manual</Text>
              </TouchableOpacity>
            </View>

            {/* Manage Campus POIs Button */}
            <View style={tw`px-5 py-2`}>
              <TouchableOpacity
                style={tw`flex-row items-center justify-center bg-purple-500 rounded-xl py-3 px-4`}
                onPress={() => {
                  setDrawerOpen(false);
                  router.push('/features/manage-poi');
                }}
              >
                <Text style={tw`text-white text-lg mr-2`}>🏢</Text>
                <Text style={tw`text-white font-semibold`}>Manage Campus POIs</Text>
              </TouchableOpacity>
            </View>

            {/* Sub Header */}
            <View style={tw`px-5 py-4 bg-blue-50 border-b border-blue-200`}>
              <Text style={tw`text-base font-semibold text-blue-700 mb-1`}>
                {savedPOIs.length + managedPOIs.length} Total Locations
              </Text>
              <Text style={tw`text-xs text-blue-700 opacity-80`}>
                {managedPOIs.length} Campus POIs • {savedPOIs.length} Personal
              </Text>
            </View>

            {/* Content */}
            <ScrollView style={tw`flex-1 pb-5`} showsVerticalScrollIndicator={false}>
              {/* Managed POIs Section */}
              {managedPOIs.length > 0 && (
                <View style={tw`mt-5 px-5`}>
                  <Text style={tw`text-xs font-bold text-purple-500 mb-3 uppercase tracking-wider`}>
                    Campus POIs ({managedPOIs.length})
                  </Text>
                  {managedPOIs.map(poi => (
                    <View key={poi.id} style={tw`flex-row items-center mb-2.5`}>
                      <TouchableOpacity
                        style={tw`flex-1 flex-row justify-between items-center py-3.5 px-4 ${selectedPOI?.id === poi.id ? 'bg-purple-50 border-2 border-purple-500' : 'bg-gray-50 border border-gray-200'
                          } rounded-xl`}
                        onPress={() => handleNavigateTo(poi)}
                        activeOpacity={0.7}
                      >
                        <View style={tw`flex-row items-center flex-1`}>
                          <View style={tw`w-10 h-10 bg-white rounded-full justify-center items-center mr-3`}>
                            <Text style={tw`text-xl`}>🏢</Text>
                          </View>
                          <View style={tw`flex-1`}>
                            <Text style={tw`text-base font-semibold text-gray-800 mb-0.5`}>{poi.name}</Text>
                            {poi.description && (
                              <Text style={tw`text-xs text-gray-600 mt-0.5`} numberOfLines={1}>
                                {poi.description}
                              </Text>
                            )}
                            {poi.location && (
                              <Text style={tw`text-xs text-gray-500 mt-0.5`} numberOfLines={1}>
                                📍 {poi.location}
                              </Text>
                            )}
                          </View>
                        </View>
                        <View style={tw`w-9 h-9 bg-purple-500 rounded-full justify-center items-center ml-2`}>
                          <Text style={tw`text-lg text-white`}>{Icons.Navigation}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Personal Saved POIs Section */}
              {savedPOIs.length === 0 ? (
                <View style={tw`items-center justify-center p-10 mt-20`}>
                  <Text style={tw`text-7xl mb-5 opacity-30`}>{Icons.Pin}</Text>
                  <Text style={tw`text-lg font-semibold text-gray-600 mb-2`}>No saved locations yet</Text>
                  <Text style={tw`text-sm text-gray-400 text-center leading-5`}>
                    Use the buttons above to save locations
                  </Text>
                </View>
              ) : (
                Object.entries(groupedPOIs).map(([category, pois]) => (
                  <View key={category} style={tw`mt-5 px-5`}>
                    <Text style={tw`text-xs font-bold text-blue-500 mb-3 uppercase tracking-wider`}>
                      {category}
                    </Text>
                    {pois.map(poi => (
                      <View key={poi.id} style={tw`flex-row items-center mb-2.5`}>
                        <TouchableOpacity
                          style={tw`flex-1 flex-row justify-between items-center py-3.5 px-4 ${selectedPOI?.id === poi.id ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 border border-gray-200'} rounded-xl`}
                          onPress={() => handleNavigateTo(poi)}
                          activeOpacity={0.7}
                        >
                          <View style={tw`flex-row items-center flex-1`}>
                            <View style={tw`w-10 h-10 bg-white rounded-full justify-center items-center mr-3`}>
                              <Text style={tw`text-xl`}>{Icons.Pin}</Text>
                            </View>
                            <View style={tw`flex-1`}>
                              <Text style={tw`text-base font-semibold text-gray-800 mb-0.5`}>{poi.name}</Text>
                              {poi.description && (
                                <Text style={tw`text-xs text-gray-600 mt-0.5`} numberOfLines={1}>
                                  {poi.description}
                                </Text>
                              )}
                            </View>
                          </View>
                          <View style={tw`w-9 h-9 bg-blue-500 rounded-full justify-center items-center ml-2`}>
                            <Text style={tw`text-lg text-white`}>{Icons.Navigation}</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => deletePOI(poi.id)}
                          style={tw`ml-2.5 p-3 bg-red-50 rounded-xl border border-red-200`}
                          activeOpacity={0.7}
                        >
                          <Text style={tw`text-xl`}>{Icons.Trash}</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ))
              )}
            </ScrollView>

            {/* Footer */}
            <View style={tw`px-5 py-4 bg-gray-50 border-t border-gray-200`}>
              <Text style={tw`text-xs text-gray-600 text-center`}>
                {Icons.Pin} Tap any location to navigate
              </Text>
            </View>
          </Animated.View>
        </>
      )}

      {/* Bottom Panel - Route Info with Start Navigation Button (NOT ACTIVE) */}
      {selectedPOI && routeData && !realTimeTracking && (
        <View style={tw`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-10 p-5`}>
          <View style={tw`flex-row justify-between items-start mb-4`}>
            <View style={tw`flex-row items-start flex-1 mr-3`}>
              <Text style={tw`text-2xl mr-2.5 mt-0.5`}>{Icons.Pin}</Text>
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-bold text-gray-800 mb-1`} numberOfLines={1}>
                  {selectedPOI.name}
                </Text>
                <Text style={tw`text-xs text-gray-500`}>Ready to navigate</Text>
              </View>
            </View>
            <TouchableOpacity onPress={clearRoute} style={tw`px-4 py-2.5 bg-gray-100 rounded-xl`}>
              <Text style={tw`text-xl text-gray-600`}>{Icons.Close}</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`flex-row justify-around py-4 bg-gray-50 rounded-2xl mb-4`}>
            <View style={tw`items-center gap-1.5`}>
              <Text style={tw`text-2xl`}>{Icons.Distance}</Text>
              <Text style={tw`text-xs text-gray-600 font-medium`}>Distance</Text>
              <Text style={tw`text-xl font-bold text-gray-800`}>{routeData.distance} km</Text>
            </View>
            <View style={tw`w-px bg-gray-300`} />
            <View style={tw`items-center gap-1.5`}>
              <Text style={tw`text-2xl`}>{Icons.Clock}</Text>
              <Text style={tw`text-xs text-gray-600 font-medium`}>ETA</Text>
              <Text style={tw`text-xl font-bold text-gray-800`}>{routeData.duration} min</Text>
            </View>
          </View>

          {/* Start Navigation Button */}
          <TouchableOpacity
            onPress={startNavigation}
            style={tw`bg-green-500 rounded-xl py-4 flex-row justify-center items-center shadow-lg`}
          >
            <Text style={tw`text-white text-2xl mr-3`}>{Icons.Navigation}</Text>
            <Text style={tw`text-white text-lg font-bold`}>Start Navigation</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator style={tw`mt-3`} size="small" color="#2196F3" />}
        </View>
      )}

      {/* Bottom Panel - Real-Time Navigation (ACTIVE) - Google Maps Style */}
      {selectedPOI && routeData && realTimeTracking && (
        <View style={tw`absolute bottom-0 left-0 right-0 bg-blue-600 shadow-2xl z-10`}>
          {/* Compact Navigation Bar */}
          <View style={tw`px-5 py-4`}>
            {/* Top Row - Destination and Exit */}
            <View style={tw`flex-row justify-between items-center mb-3`}>
              <View style={tw`flex-row items-center flex-1 mr-3`}>
                <View style={tw`w-10 h-10 bg-white/20 rounded-full justify-center items-center mr-3`}>
                  <Text style={tw`text-xl`}>{Icons.Pin}</Text>
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-base font-bold text-white`} numberOfLines={1}>
                    {selectedPOI.name}
                  </Text>
                  <View style={tw`flex-row items-center mt-1`}>
                    <View style={tw`w-2 h-2 bg-green-400 rounded-full mr-1.5`} />
                    <Text style={tw`text-xs text-white/80`}>Live tracking</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={exitNavigation}
                style={tw`w-10 h-10 bg-red-500 rounded-full justify-center items-center`}
              >
                <Text style={tw`text-lg text-white`}>{Icons.Exit}</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Row - Live Stats */}
            <View style={tw`flex-row items-center justify-around bg-white/10 rounded-xl py-3`}>
              <View style={tw`items-center flex-1`}>
                <Text style={tw`text-2xl font-bold text-white`}>
                  {currentDistance || routeData.distance}
                </Text>
                <Text style={tw`text-xs text-white/70 mt-1`}>km remaining</Text>
              </View>

              <View style={tw`w-px h-10 bg-white/20`} />

              <View style={tw`items-center flex-1`}>
                <Text style={tw`text-2xl font-bold text-white`}>
                  {currentDuration || routeData.duration}
                </Text>
                <Text style={tw`text-xs text-white/70 mt-1`}>min ETA</Text>
              </View>

              <View style={tw`w-px h-10 bg-white/20`} />

              <TouchableOpacity
                onPress={getCurrentLocation}
                style={tw`items-center flex-1`}
              >
                <View style={tw`w-10 h-10 bg-white/20 rounded-full justify-center items-center`}>
                  <Text style={tw`text-xl text-white`}>{Icons.Current}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Indicator that navigation is active */}
          <View style={tw`h-1 bg-green-400`} />
        </View>
      )}

      {/* Save POI Modal */}
      <Modal
        visible={showSaveModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSaveModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={tw`flex-1 justify-end`}
        >
          <TouchableOpacity
            style={tw`flex-1 bg-black/60`}
            activeOpacity={1}
            onPress={() => setShowSaveModal(false)}
          />
          <View style={tw`bg-white rounded-t-3xl p-6 pb-10`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <Text style={tw`text-2xl font-bold text-gray-800`}>{Icons.Save} Save Location</Text>
              <TouchableOpacity onPress={() => setShowSaveModal(false)}>
                <Text style={tw`text-3xl text-gray-600`}>{Icons.Close}</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={tw`bg-gray-50 rounded-xl px-4 py-3.5 text-base text-gray-800 mb-4 border border-gray-200`}
              placeholder="Location Name *"
              value={newPOI.name}
              onChangeText={(text) => setNewPOI({ ...newPOI, name: text })}
              placeholderTextColor="#999"
            />

            <TextInput
              style={tw`bg-gray-50 rounded-xl px-4 py-3.5 text-base text-gray-800 mb-4 border border-gray-200 h-22`}
              placeholder="Description (optional)"
              value={newPOI.description}
              onChangeText={(text) => setNewPOI({ ...newPOI, description: text })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />

            <View style={tw`flex-row flex-wrap gap-2.5 mb-6`}>
              {['Custom', 'Food', 'Education', 'Recreation', 'Other'].map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={tw`px-4.5 py-2.5 ${newPOI.category === cat ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-100 border border-gray-200'} rounded-full`}
                  onPress={() => setNewPOI({ ...newPOI, category: cat })}
                >
                  <Text style={tw`text-sm ${newPOI.category === cat ? 'text-blue-500 font-bold' : 'text-gray-600 font-semibold'}`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={tw`bg-blue-500 rounded-xl py-4 items-center shadow-lg`} onPress={savePOI}>
              <Text style={tw`text-white text-lg font-bold`}>{Icons.Save} Save Location</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Manual POI Modal */}
      <Modal
        visible={showManualPOIModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowManualPOIModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={tw`flex-1 justify-end`}
        >
          <TouchableOpacity
            style={tw`flex-1 bg-black/60`}
            activeOpacity={1}
            onPress={() => setShowManualPOIModal(false)}
          />
          <View style={tw`bg-white rounded-t-3xl p-6 pb-10 max-h-3/4`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <Text style={tw`text-2xl font-bold text-gray-800`}>{Icons.Plus} Add Manual Location</Text>
              <TouchableOpacity onPress={() => setShowManualPOIModal(false)}>
                <Text style={tw`text-3xl text-gray-600`}>{Icons.Close}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={tw`bg-gray-50 rounded-xl px-4 py-3.5 text-base text-gray-800 mb-4 border border-gray-200`}
                placeholder="Location Name *"
                value={manualPOI.name}
                onChangeText={(text) => setManualPOI({ ...manualPOI, name: text })}
                placeholderTextColor="#999"
              />

              <View style={tw`flex-row gap-3 mb-4`}>
                <TextInput
                  style={tw`flex-1 bg-gray-50 rounded-xl px-4 py-3.5 text-base text-gray-800 border border-gray-200`}
                  placeholder="Latitude *"
                  value={manualPOI.latitude}
                  onChangeText={(text) => setManualPOI({ ...manualPOI, latitude: text })}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
                <TextInput
                  style={tw`flex-1 bg-gray-50 rounded-xl px-4 py-3.5 text-base text-gray-800 border border-gray-200`}
                  placeholder="Longitude *"
                  value={manualPOI.longitude}
                  onChangeText={(text) => setManualPOI({ ...manualPOI, longitude: text })}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>

              <TextInput
                style={tw`bg-gray-50 rounded-xl px-4 py-3.5 text-base text-gray-800 mb-4 border border-gray-200 h-22`}
                placeholder="Description (optional)"
                value={manualPOI.description}
                onChangeText={(text) => setManualPOI({ ...manualPOI, description: text })}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                placeholderTextColor="#999"
              />

              <View style={tw`flex-row flex-wrap gap-2.5 mb-6`}>
                {['Custom', 'Food', 'Education', 'Recreation', 'Other'].map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={tw`px-4.5 py-2.5 ${manualPOI.category === cat ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-100 border border-gray-200'} rounded-full`}
                    onPress={() => setManualPOI({ ...manualPOI, category: cat })}
                  >
                    <Text style={tw`text-sm ${manualPOI.category === cat ? 'text-blue-500 font-bold' : 'text-gray-600 font-semibold'}`}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={tw`bg-blue-500 rounded-xl py-4 items-center shadow-lg`} onPress={saveManualPOI}>
                <Text style={tw`text-white text-lg font-bold`}>{Icons.Save} Save Location</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}