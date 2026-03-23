import { useState } from 'react';
import { Alert } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { POI, LongPressCoords, LocationCoords } from '../types/map';

export function usePOIActions() {
  const [savedPOIs, setSavedPOIs] = useState<POI[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showManualPOIModal, setShowManualPOIModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tempLocation, setTempLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [longPressCoords, setLongPressCoords] = useState<LongPressCoords | null>(null);

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    category: "Building",
    locationDetails: "",
  });

  const [newPOIForm, setNewPOIForm] = useState({
    name: "",
    description: "",
    category: "Building",
    locationDetails: "",
    latitude: "",
    longitude: "",
  });

  const handleMapLongPress = (e: any) => {
    const coords = e.nativeEvent.coordinate;
    setLongPressCoords(coords);
    setNewPOIForm({ ...newPOIForm, name: '', description: '', category: 'Custom' });
    setShowSaveModal(true);
  };

  const savePOI = async () => {
    if (!newPOIForm.name.trim()) {
      Alert.alert('Error', 'Please enter a name for this location');
      return;
    }
    if (!longPressCoords) {
      Alert.alert('Error', 'Please long press on the map to save this location');
      return;
    }
    setIsSaving(true);
    try {
      const poiData = {
        name: newPOIForm.name,
        description: newPOIForm.description || '',
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
      setNewPOIForm({ name: '', description: '', category: 'Custom', locationDetails: '', latitude: '', longitude: '' });
      Alert.alert('Success', 'Location saved to campus POIs');
    } catch (error) {
      console.error("Error saving POI:", error);
      Alert.alert('Error', 'Failed to save location');
    } finally {
      setIsSaving(false);
    }
  };

  const saveCurrentLocationPOI = async (location: LocationCoords | null, setDrawerOpen: (open: boolean) => void) => {
    if (!location) {
      Alert.alert('Error', 'Current location not available');
      return;
    }
    
    setIsSaving(true);
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

      await addDoc(collection(db, "pois"), poiData);
      setDrawerOpen(false);
      Alert.alert('Success', 'Current location saved to campus POIs!');
    } catch (error) {
      console.error("Error saving POI:", error);
      Alert.alert('Error', 'Failed to save location. Make sure you have admin/faculty permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveManualPOI = async () => {
    if (!newPOIForm.name.trim()) {
      Alert.alert('Error', 'Please enter a name for this location');
      return;
    }

    if (!newPOIForm.latitude || !newPOIForm.longitude) {
      Alert.alert('Error', 'Please enter both latitude and longitude');
      return;
    }

    const lat = parseFloat(newPOIForm.latitude);
    const lng = parseFloat(newPOIForm.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Error', 'Please enter valid coordinates');
      return;
    }
    
    setIsSaving(true);
    try {
      const poiData = {
        name: newPOIForm.name,
        description: newPOIForm.description || '',
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

      await addDoc(collection(db, "pois"), poiData);
      setShowManualPOIModal(false);
      setNewPOIForm({ name: '', latitude: '', longitude: '', description: '', category: 'Custom', locationDetails: '' });
      Alert.alert('Success', 'Location saved to campus POIs!');
    } catch (error) {
      console.error("Error saving POI:", error);
      Alert.alert('Error', 'Failed to save location. Make sure you have admin/faculty permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  const deletePOI = (id: string | number) => {
    Alert.alert(
      'Delete Location',
      'Are you sure you want to delete this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setSavedPOIs(savedPOIs.filter((poi: POI) => poi.id !== id))
        }
      ]
    );
  };

  return {
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
  };
}
