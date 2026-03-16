import React from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { useManagedPOIs } from "../../hooks/useManagedPOIs";
import { ManagePOICard } from "../../components/ui/molecules/ManagePOICard";
import { ManagePOI } from "../../types/poi";

export default function POIScreen() {
  const router = useRouter();
  const { managedPOIs: pointsOfInterest } = useManagedPOIs();

  // Sort POIs alphabetically
  const sortedPOIs = [...pointsOfInterest].sort((a, b) => a.name.localeCompare(b.name));

  // Navigate to map with POI coordinates for directions
  const handleNavigateToMap = (poi: ManagePOI) => {
    router.push({
      pathname: "/features/maps",
      params: {
        poiName: poi.name,
        poiLat: poi.latitude?.toString() || "33.6844",
        poiLng: poi.longitude?.toString() || "73.0479",
      },
    });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-6 py-4`}>
        <TouchableOpacity
          style={tw`w-10 h-10 justify-center items-center rounded-full bg-transparent mr-3`}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold text-gray-900`}>
          Points of Interest
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={tw`px-6 pt-2`} showsVerticalScrollIndicator={false}>
          <>
            {sortedPOIs.map((poi: any) => (
              <ManagePOICard
                key={poi.id}
                poi={poi as ManagePOI}
                onEdit={() => alert(`Selected: ${poi.name}`)}
                onDelete={() => {}} // Disabled for students
                onNavigateToMap={handleNavigateToMap}
              />
            ))}

            {sortedPOIs.length === 0 && (
              <View style={tw`items-center justify-center py-20`}>
                <Text style={tw`text-lg font-semibold text-gray-800`}>
                  No points of interest found.
                </Text>
                <Text style={tw`text-sm text-gray-500 text-center mt-1`}>
                  Check back later or add new POIs from the admin panel.
                </Text>
              </View>
            )}
          </>
      </ScrollView>
    </SafeAreaView>
  );
}
