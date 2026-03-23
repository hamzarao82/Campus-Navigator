// app/(screens)/MapUpdatesScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, Modal, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { useMapAdmin } from "../../hooks/useMapAdmin";
import { AdminMapCard } from "../../components/ui/molecules/AdminMapCard";
import { AdminMapFormModal } from "../../components/ui/organisms/AdminMapFormModal";
import { AdminMapData } from "../../types/mapAdmin";

export default function MapUpdatesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { allMaps, loading, addMap, updateMap, deleteMap } = useMapAdmin();

  const filteredMaps = allMaps.filter((map: AdminMapData) =>
    map.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMap = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const success = await addMap({
      name: formData.name,
      description: formData.description,
      status: formData.status,
      type: formData.type,
      image: formData.image || "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg",
    });

    if (success) {
      setShowModal(false);
      resetForm();
      Alert.alert("Success", "Map added successfully!");
    }
  };

  const handleUpdateMap = async () => {
    if (!editingMap || !formData.name.trim() || !formData.description.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const success = await updateMap(editingMap.id, {
      name: formData.name,
      description: formData.description,
      status: formData.status,
      type: formData.type,
      image: formData.image || editingMap.image,
    });

    if (success) {
      setShowModal(false);
      setEditingMap(null);
      resetForm();
      Alert.alert("Success", "Map updated successfully!");
    }
  };

  const handleDeleteMap = (map: AdminMapData) => {
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
            const success = await deleteMap(map.id);
            if (success) {
              Alert.alert("Success", "Map deleted successfully!");
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

  const openEditModal = (map: AdminMapData) => {
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

        {!loading && filteredMaps.map((map: AdminMapData) => (
          <AdminMapCard
            key={map.id}
            map={map}
            onEdit={openEditModal}
            onDelete={handleDeleteMap}
            onUpload={() => Alert.alert("Upload", `Upload feature for ${map.name} coming soon`)}
          />
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
      <AdminMapFormModal
        visible={showModal}
        editingMap={editingMap}
        formData={formData}
        setFormData={setFormData}
        onClose={() => {
          setShowModal(false);
          setEditingMap(null);
          resetForm();
        }}
        onSubmit={editingMap ? handleUpdateMap : handleAddMap}
      />
    </SafeAreaView>
  );
}
