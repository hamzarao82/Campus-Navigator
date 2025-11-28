import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import tw from "twrnc";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface POI {
  id: string;
  name: string;
  image: string;
  status: string;
  occupancy: string;
  hours: string;
}

export default function POIScreen() {
  const router = useRouter();
  const [pointsOfInterest, setPointsOfInterest] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch POIs from Firebase
  useEffect(() => {
    fetchPOIs();
  }, []);

  const fetchPOIs = async () => {
    try {
      setLoading(true);
      const poisRef = collection(db, "pois");
      const q = query(poisRef, orderBy("name", "asc"));
      const querySnapshot = await getDocs(q);

      const poisData: POI[] = [];
      querySnapshot.forEach((doc) => {
        poisData.push({
          id: doc.id,
          ...doc.data(),
        } as POI);
      });

      setPointsOfInterest(poisData);
    } catch (error) {
      console.error("Error fetching POIs:", error);
      // Fallback to mock data if Firebase fetch fails
      setPointsOfInterest([
        {
          id: "1",
          name: "Central Library",
          image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
          status: "Open",
          occupancy: "Medium",
          hours: "8:00 AM - 8:00 PM",
        },
        {
          id: "2",
          name: "Student Cafeteria",
          image: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg",
          status: "Busy",
          occupancy: "High",
          hours: "9:00 AM - 10:00 PM",
        },
        {
          id: "3",
          name: "Sports Complex",
          image: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg",
          status: "Closed",
          occupancy: "N/A",
          hours: "6:00 AM - 9:00 PM",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-700";
      case "busy":
        return "bg-yellow-100 text-yellow-700";
      case "closed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
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
      <ScrollView style={tw`px-6`} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={tw`items-center justify-center py-20`}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={tw`text-gray-500 mt-4`}>Loading points of interest...</Text>
          </View>
        ) : (
          <>
            {pointsOfInterest.map((poi) => (
              <TouchableOpacity
                key={poi.id}
                style={tw`bg-white rounded-2xl mb-5 overflow-hidden shadow`}
                onPress={() => alert(`Selected: ${poi.name}`)}
              >
                <Image
                  source={{ uri: poi.image }}
                  style={tw`w-full h-40`}
                  resizeMode="cover"
                />

                <View style={tw`p-4`}>
                  {/* Title and Status */}
                  <View style={tw`flex-row justify-between items-center mb-2`}>
                    <Text
                      style={tw`text-lg font-semibold text-gray-900 flex-shrink`}
                    >
                      {poi.name}
                    </Text>
                    <View
                      style={tw`px-3 py-1 rounded-full ${getStatusColor(
                        poi.status
                      )}`}
                    >
                      <Text style={tw`text-xs font-medium capitalize`}>
                        {poi.status}
                      </Text>
                    </View>
                  </View>

                  {/* Info Section */}
                  <View style={tw`mt-2`}>
                    <View style={tw`flex-row items-center mb-1`}>
                      <Feather name="clock" size={16} color="#6B7280" />
                      <Text style={tw`ml-2 text-sm text-gray-500`}>
                        {poi.hours}
                      </Text>
                    </View>
                    <View style={tw`flex-row items-center mb-1`}>
                      <Feather name="users" size={16} color="#6B7280" />
                      <Text style={tw`ml-2 text-sm text-gray-500`}>
                        Occupancy: {poi.occupancy}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={tw`flex-row items-center mt-1`}
                      onPress={() => alert(`Get Directions to ${poi.name}`)}
                    >
                      <Ionicons name="location-outline" size={16} color="#2563EB" />
                      <Text style={tw`ml-2 text-sm font-medium text-blue-600`}>
                        Get Directions
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {pointsOfInterest.length === 0 && (
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
