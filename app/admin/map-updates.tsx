// app/(screens)/MapUpdatesScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, Modal, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { db } from "@/firebaseConfig";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

// Dummy data as fallback
const dummyMapUpdates = [
  {
    id: "dummy-1",
    name: "Main Campus Map",
    image: "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg",
    lastUpdated: "2024-03-10",
    status: "Active",
    type: "Outdoor",
    description: "Complete overview of main campus buildings and facilities",
  },
  {
    id: "dummy-2",
    name: "Science Complex",
    image: "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg",
    lastUpdated: "2024-03-08",
    status: "Pending",
    type: "Indoor",
    description: "Detailed map of science buildings and laboratories",
  },
  {
    id: "dummy-3",
    name: "Student Center",
    image: "https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg",
    lastUpdated: "2024-03-05",
    status: "Active",
    type: "Indoor",
    description: "Map of student facilities and recreational areas",
  },
];

export default function MapUpdatesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [firebaseMaps, setFirebaseMaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMap, setEditingMap] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Pending",
    type: "Outdoor",
    image: "",
  });

  // Fetch maps from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "mapUpdates"),
      (snapshot) => {
        const maps = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          lastUpdated: doc.data().updatedAt?.toDate?.()?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0],
        }));
        setFirebaseMaps(maps);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching maps:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Combine Firebase maps with dummy data
  const allMaps = [...firebaseMaps, ...dummyMapUpdates];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "Indoor" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600";
  };

  const filteredMaps = allMaps.filter((map: any) =>
    map.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMap = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      await addDoc(collection(db, "mapUpdates"), {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        type: formData.type,
        image: formData.image || "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setShowModal(false);
      resetForm();
      Alert.alert("Success", "Map added successfully!");
    } catch (error) {
      console.error("Error adding map:", error);
      Alert.alert("Error", "Failed to add map");
    }
  };

  const handleUpdateMap = async () => {
    if (!editingMap || !formData.name.trim() || !formData.description.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      await updateDoc(doc(db, "mapUpdates", editingMap.id), {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        type: formData.type,
        image: formData.image || editingMap.image,
        updatedAt: serverTimestamp(),
      });

      setShowModal(false);
      setEditingMap(null);
      resetForm();
      Alert.alert("Success", "Map updated successfully!");
    } catch (error) {
      console.error("Error updating map:", error);
      Alert.alert("Error", "Failed to update map");
    }
  };

  const handleDeleteMap = (map: any) => {
    if (map.id.startsWith("dummy-")) {
      Alert.alert("Info", "Cannot delete dummy data");
      return;
    }

    Alert.alert(
      "Delete Map",
      `Are you sure you want to delete "${map.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "mapUpdates", map.id));
              Alert.alert("Success", "Map deleted successfully!");
            } catch (error) {
              console.error("Error deleting map:", error);
              Alert.alert("Error", "Failed to delete map");
            }
          },
        },
      ]
    );
  };

  const openAddModal = () => {
    resetForm();
    setEditingMap(null);
    setShowModal(true);
  };

  const openEditModal = (map: any) => {
    if (map.id.startsWith("dummy-")) {
      Alert.alert("Info", "Cannot edit dummy data");
      return;
    }

    setFormData({
      name: map.name,
      description: map.description,
      status: map.status,
      type: map.type,
      image: map.image,
    });
    setEditingMap(map);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "Pending",
      type: "Outdoor",
      image: "",
    });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-4 py-3`}>
        <TouchableOpacity
          style={tw`w-10 h-10 rounded-full bg-gray-100 items-center justify-center`}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color="#000" />
        </TouchableOpacity>

        <Text style={tw`text-xl font-semibold text-gray-900`}>Map Updates</Text>

        <TouchableOpacity
          style={tw`w-10 h-10 rounded-full bg-blue-100 items-center justify-center`}
          onPress={openAddModal}
        >
          <Feather name="plus" size={22} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={tw`mt-4 mb-3`}>
          <View style={tw`flex-row items-center bg-gray-100 rounded-full px-3 py-2`}>
            <Feather name="search" size={18} color="#9ca3af" />
            <TextInput
              style={tw`flex-1 ml-2 text-base text-gray-800`}
              placeholder="Search maps..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={tw`py-10 items-center`}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={tw`mt-2 text-gray-600`}>Loading maps...</Text>
          </View>
        )}

        {/* Map Cards */}
        {!loading && filteredMaps.map((map: any) => (
          <View key={map.id} style={tw`bg-white rounded-2xl mb-5 shadow-md overflow-hidden`}>
            <Image source={{ uri: map.image }} style={tw`w-full h-48`} resizeMode="cover" />

            <View style={tw`p-4`}>
              {/* Header */}
              <View style={tw`flex-row items-center justify-between mb-2`}>
                <Text style={tw`text-lg font-semibold text-gray-900 flex-1`} numberOfLines={1}>{map.name}</Text>
                <View style={tw`flex-row gap-2`}>
                  <View style={tw`px-3 py-1 rounded-full ${getTypeColor(map.type)}`}>
                    <Text style={tw`text-xs font-medium`}>{map.type}</Text>
                  </View>
                  <View style={tw`px-3 py-1 rounded-full ${getStatusColor(map.status)}`}>
                    <Text style={tw`text-xs font-medium`}>{map.status}</Text>
                  </View>
                </View>
              </View>

              {/* Description */}
              <Text style={tw`text-sm text-gray-600 mb-3`}>{map.description}</Text>

              {/* Info */}
              <View style={tw`flex-row items-center mb-4`}>
                <Entypo name="location-pin" size={16} color="#6b7280" />
                <Text style={tw`ml-1 text-sm text-gray-500`}>
                  Last updated: {map.lastUpdated}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={tw`flex-row justify-between`}>
                <TouchableOpacity
                  style={tw`flex-1 flex-row items-center justify-center bg-blue-50 py-2 rounded-xl mr-2`}
                  onPress={() => Alert.alert("Upload", `Upload feature for ${map.name} coming soon`)}
                >
                  <Feather name="upload" size={18} color="#2563eb" />
                  <Text style={tw`text-blue-600 ml-2 font-medium text-sm`}>Upload</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`flex-1 flex-row items-center justify-center bg-green-50 py-2 rounded-xl mr-2`}
                  onPress={() => openEditModal(map)}
                >
                  <MaterialIcons name="edit" size={18} color="#16a34a" />
                  <Text style={tw`text-green-600 ml-2 font-medium text-sm`}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`flex-1 flex-row items-center justify-center bg-red-50 py-2 rounded-xl`}
                  onPress={() => handleDeleteMap(map)}
                >
                  <Feather name="trash-2" size={18} color="#dc2626" />
                  <Text style={tw`text-red-600 ml-2 font-medium text-sm`}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {!loading && filteredMaps.length === 0 && (
          <View style={tw`py-20 items-center`}>
            <Text style={tw`text-6xl mb-4`}>🗺️</Text>
            <Text style={tw`text-lg font-semibold text-gray-600`}>No maps found</Text>
            <Text style={tw`text-sm text-gray-400 mt-2`}>Try a different search term</Text>
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`bg-white rounded-2xl p-6 w-11/12 max-w-md`}>
            <Text style={tw`text-xl font-bold text-gray-900 mb-4`}>
              {editingMap ? "Edit Map" : "Add New Map"}
            </Text>

            <TextInput
              style={tw`bg-gray-100 rounded-xl px-4 py-3 mb-3 text-gray-900`}
              placeholder="Map Name *"
              placeholderTextColor="#999"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <TextInput
              style={tw`bg-gray-100 rounded-xl px-4 py-3 mb-3 text-gray-900`}
              placeholder="Description *"
              placeholderTextColor="#999"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={3}
            />

            <TextInput
              style={tw`bg-gray-100 rounded-xl px-4 py-3 mb-3 text-gray-900`}
              placeholder="Image URL (optional)"
              placeholderTextColor="#999"
              value={formData.image}
              onChangeText={(text) => setFormData({ ...formData, image: text })}
            />

            {/* Type Selector */}
            <View style={tw`mb-3`}>
              <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Map Type</Text>
              <View style={tw`flex-row gap-2`}>
                <TouchableOpacity
                  style={tw`flex-1 py-3 rounded-xl ${formData.type === "Outdoor" ? "bg-orange-500" : "bg-gray-100"}`}
                  onPress={() => setFormData({ ...formData, type: "Outdoor" })}
                >
                  <Text style={tw`text-center font-semibold ${formData.type === "Outdoor" ? "text-white" : "text-gray-700"}`}>
                    Outdoor
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`flex-1 py-3 rounded-xl ${formData.type === "Indoor" ? "bg-blue-500" : "bg-gray-100"}`}
                  onPress={() => setFormData({ ...formData, type: "Indoor" })}
                >
                  <Text style={tw`text-center font-semibold ${formData.type === "Indoor" ? "text-white" : "text-gray-700"}`}>
                    Indoor
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Status Selector */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Status</Text>
              <View style={tw`flex-row gap-2`}>
                <TouchableOpacity
                  style={tw`flex-1 py-3 rounded-xl ${formData.status === "Active" ? "bg-green-500" : "bg-gray-100"}`}
                  onPress={() => setFormData({ ...formData, status: "Active" })}
                >
                  <Text style={tw`text-center font-semibold ${formData.status === "Active" ? "text-white" : "text-gray-700"}`}>
                    Active
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`flex-1 py-3 rounded-xl ${formData.status === "Pending" ? "bg-yellow-500" : "bg-gray-100"}`}
                  onPress={() => setFormData({ ...formData, status: "Pending" })}
                >
                  <Text style={tw`text-center font-semibold ${formData.status === "Pending" ? "text-white" : "text-gray-700"}`}>
                    Pending
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Buttons */}
            <View style={tw`flex-row gap-3`}>
              <TouchableOpacity
                style={tw`flex-1 bg-gray-200 py-3 rounded-xl`}
                onPress={() => {
                  setShowModal(false);
                  setEditingMap(null);
                  resetForm();
                }}
              >
                <Text style={tw`text-center font-semibold text-gray-700`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 bg-blue-600 py-3 rounded-xl`}
                onPress={editingMap ? handleUpdateMap : handleAddMap}
              >
                <Text style={tw`text-center font-semibold text-white`}>
                  {editingMap ? "Update" : "Add"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
