import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import {
  Ionicons,
  MaterialIcons,
  Entypo,
  FontAwesome5,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

interface POI {
  id: string;
  name: string;
  image: string;
  description: string;
  location: string;
  hours: string;
  capacity: number;
  currentOccupancy: number;
  status: string;
  latitude?: number;
  longitude?: number;
}

export default function ManagePOIScreen() {
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPOI, setEditingPOI] = useState<POI | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    location: "",
    hours: "",
    capacity: "",
    currentOccupancy: "",
    status: "Open",
    latitude: "",
    longitude: "",
  });

  // Fetch POIs from Firestore in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "pois"),
      (snapshot) => {
        const poisData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as POI[];
        setPois(poisData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching POIs:", error);
        Alert.alert("Error", "Failed to load POIs");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      image: "",
      description: "",
      location: "",
      hours: "",
      capacity: "",
      currentOccupancy: "",
      status: "Open",
      latitude: "",
      longitude: "",
    });
  };

  const handleAddPOI = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter a POI name");
      return;
    }

    try {
      const poiData = {
        name: formData.name,
        image: formData.image || "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
        description: formData.description,
        location: formData.location,
        hours: formData.hours,
        capacity: parseInt(formData.capacity) || 0,
        currentOccupancy: parseInt(formData.currentOccupancy) || 0,
        status: formData.status,
        latitude: parseFloat(formData.latitude) || 33.6844,
        longitude: parseFloat(formData.longitude) || 73.0479,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "pois"), poiData);
      Alert.alert("Success", "POI added successfully!");
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Error adding POI:", error);
      Alert.alert("Error", "Failed to add POI");
    }
  };

  const handleEditPOI = async () => {
    if (!editingPOI || !formData.name.trim()) {
      Alert.alert("Error", "Please enter a POI name");
      return;
    }

    try {
      const poiRef = doc(db, "pois", editingPOI.id);
      const updatedData = {
        name: formData.name,
        image: formData.image,
        description: formData.description,
        location: formData.location,
        hours: formData.hours,
        capacity: parseInt(formData.capacity) || 0,
        currentOccupancy: parseInt(formData.currentOccupancy) || 0,
        status: formData.status,
        latitude: parseFloat(formData.latitude) || editingPOI.latitude || 33.6844,
        longitude: parseFloat(formData.longitude) || editingPOI.longitude || 73.0479,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(poiRef, updatedData);
      Alert.alert("Success", "POI updated successfully!");
      setShowEditModal(false);
      setEditingPOI(null);
      resetForm();
    } catch (error) {
      console.error("Error updating POI:", error);
      Alert.alert("Error", "Failed to update POI");
    }
  };

  const handleDelete = (poi: POI) => {
    Alert.alert(
      "Delete POI",
      `Are you sure you want to delete "${poi.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "pois", poi.id));
              Alert.alert("Success", "POI deleted successfully!");
            } catch (error) {
              console.error("Error deleting POI:", error);
              Alert.alert("Error", "Failed to delete POI");
            }
          },
        },
      ]
    );
  };

  const openEditModal = (poi: POI) => {
    setEditingPOI(poi);
    setFormData({
      name: poi.name,
      image: poi.image,
      description: poi.description,
      location: poi.location,
      hours: poi.hours,
      capacity: poi.capacity.toString(),
      currentOccupancy: poi.currentOccupancy.toString(),
      status: poi.status,
      latitude: poi.latitude?.toString() || "",
      longitude: poi.longitude?.toString() || "",
    });
    setShowEditModal(true);
  };

  const handleNavigateToMap = (poi: POI) => {
    // Navigate to maps.tsx with POI data
    router.push({
      pathname: "/features/maps",
      params: {
        poiName: poi.name,
        poiLat: poi.latitude?.toString() || "33.6844",
        poiLng: poi.longitude?.toString() || "73.0479",
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "text-green-600 bg-green-100";
      case "busy":
        return "text-yellow-600 bg-yellow-100";
      case "available":
        return "text-blue-600 bg-blue-100";
      case "closed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const renderPOIForm = (isEdit: boolean) => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1`}
    >
      <ScrollView
        style={tw`flex-1 px-6 py-4`}
        showsVerticalScrollIndicator={false}
      >
        <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Name *</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base`}
          placeholder="Enter POI name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Image URL</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base`}
          placeholder="Enter image URL"
          value={formData.image}
          onChangeText={(text) => setFormData({ ...formData, image: text })}
        />

        <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Description</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base`}
          placeholder="Enter description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={3}
        />

        <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Location</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base`}
          placeholder="Enter location"
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
        />

        <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Hours</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base`}
          placeholder="e.g., 8:00 AM - 10:00 PM"
          value={formData.hours}
          onChangeText={(text) => setFormData({ ...formData, hours: text })}
        />

        <View style={tw`flex-row gap-3 mb-4`}>
          <View style={tw`flex-1`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Capacity</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-xl px-4 py-3 text-base`}
              placeholder="0"
              value={formData.capacity}
              onChangeText={(text) => setFormData({ ...formData, capacity: text })}
              keyboardType="numeric"
            />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Occupancy</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-xl px-4 py-3 text-base`}
              placeholder="0"
              value={formData.currentOccupancy}
              onChangeText={(text) => setFormData({ ...formData, currentOccupancy: text })}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Status</Text>
        <View style={tw`flex-row gap-2 mb-4 flex-wrap`}>
          {["Open", "Busy", "Available", "Closed"].map((status) => (
            <TouchableOpacity
              key={status}
              style={tw`px-4 py-2 rounded-full ${formData.status === status
                ? "bg-blue-500"
                : "bg-gray-200"
                }`}
              onPress={() => setFormData({ ...formData, status })}
            >
              <Text
                style={tw`font-medium ${formData.status === status ? "text-white" : "text-gray-700"
                  }`}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Coordinates (Optional)</Text>
        <View style={tw`flex-row gap-3 mb-6`}>
          <View style={tw`flex-1`}>
            <TextInput
              style={tw`border border-gray-300 rounded-xl px-4 py-3 text-base`}
              placeholder="Latitude"
              value={formData.latitude}
              onChangeText={(text) => setFormData({ ...formData, latitude: text })}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={tw`flex-1`}>
            <TextInput
              style={tw`border border-gray-300 rounded-xl px-4 py-3 text-base`}
              placeholder="Longitude"
              value={formData.longitude}
              onChangeText={(text) => setFormData({ ...formData, longitude: text })}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={tw`flex-row gap-3 mb-6`}>
          <TouchableOpacity
            style={tw`flex-1 bg-gray-200 py-4 rounded-xl items-center`}
            onPress={() => {
              isEdit ? setShowEditModal(false) : setShowAddModal(false);
              resetForm();
              setEditingPOI(null);
            }}
          >
            <Text style={tw`text-gray-700 font-semibold text-base`}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-1 bg-blue-500 py-4 rounded-xl items-center`}
            onPress={isEdit ? handleEditPOI : handleAddPOI}
          >
            <Text style={tw`text-white font-semibold text-base`}>
              {isEdit ? "Update" : "Add"} POI
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-white items-center justify-center`}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={tw`mt-4 text-gray-600`}>Loading POIs...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-6 py-4`}>
        <TouchableOpacity
          style={tw`w-10 h-10 rounded-full bg-gray-100 items-center justify-center`}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-semibold text-gray-900`}>Manage POI</Text>
        <TouchableOpacity
          style={tw`w-10 h-10 rounded-full bg-blue-100 items-center justify-center`}
          onPress={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <Ionicons name="add" size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={tw`pb-20 px-6`}
        showsVerticalScrollIndicator={false}
      >
        {pois.length === 0 ? (
          <View style={tw`items-center justify-center py-20`}>
            <Ionicons name="location-outline" size={80} color="#d1d5db" />
            <Text style={tw`text-gray-500 text-lg mt-4`}>No POIs yet</Text>
            <Text style={tw`text-gray-400 text-sm mt-2`}>
              Tap the + button to add one
            </Text>
          </View>
        ) : (
          pois.map((poi) => (
            <View
              key={poi.id}
              style={tw`bg-white rounded-2xl shadow-md mb-5 overflow-hidden border border-gray-100`}
            >
              <Image
                source={{ uri: poi.image }}
                style={tw`w-full h-48`}
                resizeMode="cover"
              />
              <View style={tw`p-4`}>
                {/* Name + Status */}
                <View style={tw`flex-row justify-between items-center mb-2`}>
                  <Text style={tw`text-lg font-semibold text-gray-900 flex-shrink`}>
                    {poi.name}
                  </Text>
                  <View
                    style={tw`px-3 py-1 rounded-full ${getStatusColor(poi.status)}`}
                  >
                    <Text style={tw`text-xs font-medium`}>{poi.status}</Text>
                  </View>
                </View>

                <Text style={tw`text-gray-600 text-sm mb-3`}>
                  {poi.description}
                </Text>

                {/* Info Section */}
                <View style={tw`mb-3`}>
                  <View style={tw`flex-row items-center mb-1`}>
                    <Entypo name="location-pin" size={16} color="#6b7280" />
                    <Text style={tw`text-gray-700 text-sm ml-1`}>
                      {poi.location}
                    </Text>
                  </View>
                  <View style={tw`flex-row items-center mb-1`}>
                    <MaterialIcons name="access-time" size={16} color="#6b7280" />
                    <Text style={tw`text-gray-700 text-sm ml-1`}>
                      {poi.hours}
                    </Text>
                  </View>
                  <View style={tw`flex-row items-center`}>
                    <FontAwesome5 name="users" size={14} color="#6b7280" />
                    <Text style={tw`text-gray-700 text-sm ml-1`}>
                      {poi.currentOccupancy}/{poi.capacity} occupied
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={tw`flex-row justify-between mt-3`}>
                  <TouchableOpacity
                    style={tw`flex-row items-center justify-center bg-blue-100 px-4 py-2 rounded-xl flex-1 mr-2`}
                    onPress={() => openEditModal(poi)}
                  >
                    <Ionicons name="create-outline" size={18} color="#2563eb" />
                    <Text style={tw`text-blue-600 ml-1 font-medium text-sm`}>
                      Edit
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={tw`flex-row items-center justify-center bg-red-100 px-4 py-2 rounded-xl flex-1 mx-1`}
                    onPress={() => handleDelete(poi)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#dc2626" />
                    <Text style={tw`text-red-600 ml-1 font-medium text-sm`}>
                      Delete
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={tw`flex-row items-center justify-center bg-green-100 px-4 py-2 rounded-xl flex-1 ml-2`}
                    onPress={() => handleNavigateToMap(poi)}
                  >
                    <Entypo name="location" size={18} color="#16a34a" />
                    <Text style={tw`text-green-700 ml-1 font-medium text-sm`}>
                      Map
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add POI Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
      >
        <SafeAreaView style={tw`flex-1 bg-white`}>
          <View style={tw`flex-row items-center justify-between px-6 py-4 border-b border-gray-200`}>
            <Text style={tw`text-xl font-semibold text-gray-900`}>Add New POI</Text>
            <TouchableOpacity
              onPress={() => {
                setShowAddModal(false);
                resetForm();
              }}
            >
              <Ionicons name="close" size={28} color="#111" />
            </TouchableOpacity>
          </View>
          {renderPOIForm(false)}
        </SafeAreaView>
      </Modal>

      {/* Edit POI Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowEditModal(false);
          setEditingPOI(null);
          resetForm();
        }}
      >
        <SafeAreaView style={tw`flex-1 bg-white`}>
          <View style={tw`flex-row items-center justify-between px-6 py-4 border-b border-gray-200`}>
            <Text style={tw`text-xl font-semibold text-gray-900`}>Edit POI</Text>
            <TouchableOpacity
              onPress={() => {
                setShowEditModal(false);
                setEditingPOI(null);
                resetForm();
              }}
            >
              <Ionicons name="close" size={28} color="#111" />
            </TouchableOpacity>
          </View>
          {renderPOIForm(true)}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
