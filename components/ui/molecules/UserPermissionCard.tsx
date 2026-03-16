import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import tw from "twrnc";
import { AdminUserData } from "../../../types/userAdmin";

interface UserPermissionCardProps {
  user: AdminUserData;
  onEdit: (user: AdminUserData) => void;
  onDelete: (user: AdminUserData) => void;
}

export const UserPermissionCard: React.FC<UserPermissionCardProps> = ({
  user,
  onEdit,
  onDelete,
}) => {
  const getRoleIcon = (role: string) => {
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "faculty":
        return "bg-blue-100 text-blue-700";
      case "student":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <View style={tw`bg-white rounded-2xl mb-4 p-4 shadow-md border border-gray-100`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-start mb-3`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-lg font-semibold text-gray-900`}>
            {user.fullName}
          </Text>
          <Text style={tw`text-sm text-gray-500`}>{user.email}</Text>
        </View>

        <View style={tw`px-3 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
          <Text style={tw`text-xs font-medium capitalize`}>{user.role}</Text>
        </View>
      </View>

      {/* Role Icon */}
      <View style={tw`flex-row items-center mb-3`}>
        {getRoleIcon(user.role)}
        <Text style={tw`ml-2 text-sm text-gray-600`}>
          {user.role === "admin"
            ? "Full Access"
            : user.role === "faculty"
            ? "Can Manage Courses & POIs"
            : "Student Access"}
        </Text>
      </View>

      {/* Created Date */}
      <Text style={tw`text-xs text-gray-400 mb-3`}>
        Created: {new Date(user.createdAt).toLocaleDateString()}
      </Text>

      {/* Action Buttons */}
      <View style={tw`flex-row gap-2`}>
        <TouchableOpacity
          style={tw`flex-1 bg-blue-50 py-2 rounded-xl items-center`}
          onPress={() => onEdit(user)}
        >
          <Text style={tw`text-blue-600 text-sm font-medium`}>Edit Role</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-1 bg-red-50 py-2 rounded-xl items-center`}
          onPress={() => onDelete(user)}
        >
          <Text style={tw`text-red-600 text-sm font-medium`}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
