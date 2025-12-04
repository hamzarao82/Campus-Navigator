// app/(screens)/MapUpdatesScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import tw from "twrnc";

const mapUpdates = [
  {
    id: 1,
    name: "Main Campus Map",
    image: "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg",
    lastUpdated: "2024-03-10",
    status: "Active",
    description: "Complete overview of main campus buildings and facilities",
  },
  {
    id: 2,
    name: "Science Complex",
    image: "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg",
    lastUpdated: "2024-03-08",
    status: "Pending",
    description: "Detailed map of science buildings and laboratories",
  },
  {
    id: 3,
    name: "Student Center",
    image: "https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg",
    lastUpdated: "2024-03-05",
    status: "Active",
    description: "Map of student facilities and recreational areas",
  },
];

export default function MapUpdatesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredMaps = mapUpdates.filter((map) =>
    map.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-4 py-3 border-b border-gray-200`}>
        <TouchableOpacity
          style={tw`w-10 h-10 rounded-full bg-gray-100 items-center justify-center`}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color="#000" />
        </TouchableOpacity>

        <Text style={tw`text-xl font-semibold text-gray-900`}>Map Updates</Text>

        <TouchableOpacity
          style={tw`w-10 h-10 rounded-full bg-blue-100 items-center justify-center`}
          onPress={() => alert("Add new map")}
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

        {/* Map Cards */}
        {filteredMaps.map((map) => (
          <View key={map.id} style={tw`bg-white rounded-2xl mb-5 shadow-md overflow-hidden`}>
            <Image source={{ uri: map.image }} style={tw`w-full h-48`} resizeMode="cover" />

            <View style={tw`p-4`}>
              {/* Header */}
              <View style={tw`flex-row items-center justify-between mb-2`}>
                <Text style={tw`text-lg font-semibold text-gray-900`}>{map.name}</Text>
                <View
                  style={tw`px-3 py-1 rounded-full ${getStatusColor(map.status)}`}
                >
                  <Text style={tw`text-xs font-medium`}>{map.status}</Text>
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
                  onPress={() => alert(`Upload new version for ${map.name}`)}
                >
                  <Feather name="upload" size={18} color="#2563eb" />
                  <Text style={tw`text-blue-600 ml-2 font-medium text-sm`}>Upload</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`flex-1 flex-row items-center justify-center bg-green-50 py-2 rounded-xl mr-2`}
                  onPress={() => alert(`Edit ${map.name}`)}
                >
                  <MaterialIcons name="edit" size={18} color="#16a34a" />
                  <Text style={tw`text-green-600 ml-2 font-medium text-sm`}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`flex-1 flex-row items-center justify-center bg-red-50 py-2 rounded-xl`}
                  onPress={() => alert(`Delete ${map.name}`)}
                >
                  <Feather name="trash-2" size={18} color="#dc2626" />
                  <Text style={tw`text-red-600 ml-2 font-medium text-sm`}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
