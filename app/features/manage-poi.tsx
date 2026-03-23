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
import { PageHeader } from "../../components/ui/molecules/PageHeader";
import { EmptyState } from "../../components/ui/molecules/EmptyState";
import { ManagePOI } from "../../types/poi";
import { useManagePOIs } from "../../hooks/useManagePOIs";
import { ManagePOICard } from "../../components/ui/molecules/ManagePOICard";
import { ManagePOIForm } from "../../components/ui/organisms/ManagePOIForm";

export default function ManagePOIScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPOI, setEditingPOI] = useState<ManagePOI | null>(null);

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

  const { pois, loading, addPOI, updatePOI, deletePOI } = useManagePOIs();

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
    };

    const success = await addPOI(poiData);
    if (success) {
      Alert.alert("Success", "POI added successfully!");
      setShowAddModal(false);
      resetForm();
    }
  };

  const handleEditPOI = async () => {
    if (!editingPOI || !formData.name.trim()) {
      Alert.alert("Error", "Please enter a POI name");
      return;
    }

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
    };

    const success = await updatePOI(editingPOI.id, updatedData);
    if (success) {
      Alert.alert("Success", "POI updated successfully!");
      setShowEditModal(false);
      setEditingPOI(null);
      resetForm();
    }
  };

  const handleDelete = (poi: ManagePOI) => {
    Alert.alert(
      "Delete POI",
      `Are you sure you want to delete "${poi.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deletePOI(poi.id);
            if (success) {
              Alert.alert("Success", "POI deleted successfully!");
            }
          },
        },
      ]
    );
  };

  const openEditModal = (poi: ManagePOI) => {
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

  const handleNavigateToMap = (poi: ManagePOI) => {
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
      <PageHeader 
        title="Manage POI" 
        rightActionIcon="add"
        onRightAction={() => {
          resetForm();
          setShowAddModal(true);
        }}
      />

      <ScrollView
        contentContainerStyle={tw`pb-20 px-6`}
        showsVerticalScrollIndicator={false}
      >
        {pois.length === 0 ? (
          <EmptyState 
            iconName="location-outline"
            title="No POIs yet"
            subtitle="Tap the + button to add one"
          />
        ) : (
          pois.map((poi) => (
            <ManagePOICard
              key={poi.id}
              poi={poi}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onNavigateToMap={handleNavigateToMap}
            />
          ))
        )}
      </ScrollView>

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
          <PageHeader 
            title="Add New POI" 
            onLeftAction={() => {
              setShowAddModal(false);
              resetForm();
            }}
            leftActionIcon="close"
          />
          <ManagePOIForm
            isEdit={false}
            formData={formData}
            setFormData={setFormData}
            onSave={handleAddPOI}
            onCancel={() => {
              setShowAddModal(false);
              resetForm();
            }}
          />
        </SafeAreaView>
      </Modal>

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
          <PageHeader 
            title="Edit POI" 
            onLeftAction={() => {
              setShowEditModal(false);
              setEditingPOI(null);
              resetForm();
            }}
            leftActionIcon="close"
          />
          <ManagePOIForm
            isEdit={true}
            formData={formData}
            setFormData={setFormData}
            onSave={handleEditPOI}
            onCancel={() => {
              setShowEditModal(false);
              setEditingPOI(null);
              resetForm();
            }}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
