import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import tw from "twrnc";

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const menuItems = [
    {
      title: "Campus Map",
      route: "/features/maps",
      iconLib: Ionicons,
      iconName: "map-outline",
      description: "Navigate through campus",
    },
    {
      title: "User Permission",
      route: "/admin/user-permission",
      iconLib: Feather,
      iconName: "users",
      description: "Manage user roles and access rights",
    },
    {
      title: "POI Management",
      route: "/features/manage-poi",
      iconLib: Feather,
      iconName: "map-pin",
      description: "Add and edit points of interest",
    },
    {
      title: "Map Updates",
      route: "/admin/map-updates",
      iconLib: MaterialCommunityIcons,
      iconName: "map-marker-plus-outline",
      description: "Update campus map and locations",
    },
    {
      title: "Course Schedule",
      route: "/features/course-schedule",
      iconLib: Ionicons,
      iconName: "calendar-outline",
      description: "Manage course timings and rooms",
    },
    {
      title: "Student Timetable",
      route: "/admin/student-timetable",
      iconLib: Feather,
      iconName: "clock",
      description: "View and modify student schedules",
    },
    {
      title: "Notifications",
      route: "/features/notifications",
      iconLib: Ionicons,
      iconName: "notifications-outline",
      description: "Send announcements and alerts",
    },
    {
      title: "Profile",
      route: "/admin/admin-profile",
      iconLib: Feather,
      iconName: "user",
      description: "View and update your profile information",
    },
    {
      title: "Settings",
      route: "/features/settings",
      iconLib: Ionicons,
      iconName: "settings-outline",
      description: "System configuration",
    },
  ];

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      // Replace with your own logout logic if needed
      router.replace("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View
        style={tw`flex-row justify-between items-center px-6 pt-4 pb-4`}
      >
        <View>
          <Text style={tw`text-3xl font-bold text-blue-700`}>
            Admin Dashboard
          </Text>
          <Text style={tw`text-base text-gray-500`}>System Management</Text>
        </View>

        <TouchableOpacity
          style={tw`p-3 rounded-xl bg-transparent`}
          onPress={handleSignOut}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#dc2626" />
          ) : (
            <Feather name="log-out" size={22} color="#dc2626" />
          )}
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <ScrollView
        style={tw`px-6 pt-4`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-10`}
      >
        {menuItems.map((item, index) => {
          const IconComponent = item.iconLib;
          return (
            <TouchableOpacity
              key={index}
              style={tw`flex-row items-center bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm`}
              onPress={() => router.push(item.route)}
            >
              <View
                style={tw`w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-4`}
              >
                <IconComponent name={item.iconName} size={22} color="#2563EB" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-semibold text-gray-800`}>
                  {item.title}
                </Text>
                <Text style={tw`text-sm text-gray-500`}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
