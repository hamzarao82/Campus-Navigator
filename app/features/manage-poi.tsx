import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
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

export default function ManagePOIScreen() {
  const [pois, setPois] = useState([
    {
      id: "1",
      name: "Main Library",
      image:
        "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
      description: "Central library with quiet study areas.",
      location: "Central Campus",
      hours: "8:00 AM - 10:00 PM",
      capacity: 500,
      currentOccupancy: 120,
      status: "Open",
    },
    {
      id: "2",
      name: "Cafeteria",
      image:
        "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg",
      description: "Serves meals, snacks, and drinks all day.",
      location: "South Wing",
      hours: "7:00 AM - 8:00 PM",
      capacity: 300,
      currentOccupancy: 210,
      status: "Busy",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "text-green-600 bg-green-100";
      case "busy":
        return "text-yellow-600 bg-yellow-100";
      case "available":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const handleDelete = (name: string) => {
    Alert.alert(
      "Delete POI",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            setPois((prev) => prev.filter((poi) => poi.name !== name)),
        },
      ]
    );
  };

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
          onPress={() => Alert.alert("Add", "Add new POI")}
        >
          <Ionicons name="add" size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={tw`pb-20 px-6`}
        showsVerticalScrollIndicator={false}
      >
        {pois.map((poi) => (
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
                  onPress={() => Alert.alert("Edit", `Edit ${poi.name}`)}
                >
                  <Ionicons name="create-outline" size={18} color="#2563eb" />
                  <Text style={tw`text-blue-600 ml-1 font-medium text-sm`}>
                    Edit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`flex-row items-center justify-center bg-red-100 px-4 py-2 rounded-xl flex-1 mx-1`}
                  onPress={() => handleDelete(poi.name)}
                >
                  <Ionicons name="trash-outline" size={18} color="#dc2626" />
                  <Text style={tw`text-red-600 ml-1 font-medium text-sm`}>
                    Delete
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`flex-row items-center justify-center bg-green-100 px-4 py-2 rounded-xl flex-1 ml-2`}
                  onPress={() =>
                    Alert.alert(
                      "Navigate",
                      `Opening map for ${poi.name} (${poi.location})`
                    )
                  }
                >
                  <Entypo name="location" size={18} color="#16a34a" />
                  <Text style={tw`text-green-700 ml-1 font-medium text-sm`}>
                    Map
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
