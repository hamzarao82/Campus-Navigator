// app/(screens)/PermissionsScreen.js
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import tw from "twrnc";

export default function PermissionsScreen() {
  const router = useRouter();

  const [users] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      status: "active",
      permissions: ["view_schedule", "view_map", "manage_users"],
    },
    {
      id: 2,
      name: "Sara Ali",
      email: "sara@example.com",
      role: "faculty",
      status: "active",
      permissions: ["view_schedule", "manage_courses", "send_notifications"],
    },
    {
      id: 3,
      name: "David Smith",
      email: "david@example.com",
      role: "student",
      status: "suspended",
      permissions: ["view_schedule", "view_map"],
    },
  ]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-600";
      case "suspended":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Ionicons name="shield-checkmark" size={20} color="#2563eb" />;
      case "faculty":
        return <Feather name="shield" size={20} color="#3b82f6" />;
      case "student":
        return <MaterialIcons name="person" size={20} color="#f59e0b" />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-3 border-b border-gray-200`}
      >
        <TouchableOpacity
          style={tw`w-10 h-10 rounded-full bg-gray-100 items-center justify-center`}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color="#000" />
        </TouchableOpacity>

        <Text style={tw`text-xl font-semibold text-gray-900`}>
          User Permissions
        </Text>

        <TouchableOpacity
          style={tw`w-10 h-10 rounded-full bg-blue-100 items-center justify-center`}
          onPress={() => alert("Add new user")}
        >
          <Feather name="plus" size={22} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* User List */}
      <ScrollView
        style={tw`flex-1 px-4 py-2`}
        showsVerticalScrollIndicator={false}
      >
        {users.map((user) => (
          <View
            key={user.id}
            style={tw`bg-white rounded-2xl mb-5 p-4 shadow-md border border-gray-100`}
          >
            {/* Header */}
            <View style={tw`flex-row justify-between items-start mb-2`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-semibold text-gray-900`}>
                  {user.name}
                </Text>
                <Text style={tw`text-sm text-gray-500`}>{user.email}</Text>
              </View>

              <View
                style={tw`px-3 py-1 rounded-full ${getStatusColor(
                  user.status
                )}`}
              >
                <Text style={tw`text-xs font-medium`}>{user.status}</Text>
              </View>
            </View>

            {/* Role */}
            <View style={tw`flex-row items-center mb-3`}>
              {getRoleIcon(user.role)}
              <Text style={tw`ml-2 text-sm text-gray-800 capitalize`}>
                {user.role}
              </Text>
            </View>

            {/* Permissions */}
            <View style={tw`mb-3`}>
              <Text style={tw`text-sm font-medium text-gray-800 mb-2`}>
                Permissions:
              </Text>
              <View style={tw`flex-row flex-wrap gap-2`}>
                {user.permissions.map((perm, idx) => (
                  <View
                    key={idx}
                    style={tw`bg-blue-50 px-3 py-1 rounded-full border border-blue-100`}
                  >
                    <Text style={tw`text-xs text-blue-700`}>
                      {perm
                        .split("_")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Edit Button */}
            <TouchableOpacity
              style={tw`bg-blue-50 py-2 rounded-xl items-center`}
              onPress={() => alert(`Edit permissions for ${user.name}`)}
            >
              <Text style={tw`text-blue-600 text-sm font-medium`}>
                Edit Permissions
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
