import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import tw from "twrnc";

export default function FacultyDashboard() {
  const router = useRouter();

  const menuItems = [
    {
      title: "Campus Map",
      route: "/features/maps",
      icon: <Ionicons name="map-outline" size={22} color="#2563EB" />,
      description: "View campus layout",
    },
    {
      title: "Manage POI",
      route: "/features/manage-poi",
      icon: <Feather name="map-pin" size={22} color="#2563EB" />,
      description: "Edit points of interest",
    },
    {
      title: "Course Management",
      route: "/features/course-schedule",
      icon: <MaterialCommunityIcons name="book-open-outline" size={22} color="#2563EB" />,
      description: "Manage your courses",
    },
    {
      title: "Notifications",
      route: "/features/notifications",
      icon: <Ionicons name="notifications-outline" size={22} color="#2563EB" />,
      description: "Send announcements",
    },
    {
      title: "Profile",
      route: "/faculty/faculty-profile",
      icon: <Feather name="user" size={22} color="#2563EB" />,
      description: "Update your profile",
    },
    {
      title: "Setting",
      route: "/features/settings",
      icon: <Feather name="settings" size={22} color="#2563EB" />,
      description: "System configuration",
    },
  ];

  const handleSignOut = () => {
    router.replace("/login");
  };

  return (
    <SafeAreaView
      style={[
        tw`flex-1 bg-white`,
        { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={tw`flex-row justify-between items-center px-6 pb-4`}>
        <View>
          <Text style={tw`text-3xl font-bold text-blue-700`}>Faculty Dashboard</Text>
          <Text style={tw`text-base text-gray-500`}>Welcome back!</Text>
        </View>

        <TouchableOpacity style={tw`p-3 rounded-xl bg-transparent`} onPress={handleSignOut}>
          <Feather name="log-out" size={22} color="#dc2626" />
        </TouchableOpacity>
      </View>

      {/* Menu */}
      <ScrollView style={tw`px-6 pt-4`} showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={tw`flex-row items-center bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm`}
            onPress={() => router.push(item.route)}
          >
            <View style={tw`w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-4`}>
              {item.icon}
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-lg font-semibold text-gray-800`}>{item.title}</Text>
              <Text style={tw`text-sm text-gray-500`}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
