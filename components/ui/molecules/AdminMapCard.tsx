import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";
import { Feather, Entypo, MaterialIcons } from "@expo/vector-icons";
import { AdminMapData } from "../../../types/mapAdmin";

interface AdminMapCardProps {
  map: AdminMapData;
  onEdit: (map: AdminMapData) => void;
  onDelete: (map: AdminMapData) => void;
  onUpload?: (map: AdminMapData) => void;
}

export const AdminMapCard: React.FC<AdminMapCardProps> = ({
  map,
  onEdit,
  onDelete,
  onUpload,
}) => {
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

  const getTypeColor = (type: string) => {
    return type === "Indoor" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600";
  };

  return (
    <View style={tw`bg-white rounded-2xl mb-5 shadow-md overflow-hidden`}>
      <Image source={{ uri: map.image }} style={tw`w-full h-48`} resizeMode="cover" />

      <View style={tw`p-4`}>
        {/* Header */}
        <View style={tw`flex-row items-center justify-between mb-2`}>
          <Text style={tw`text-lg font-semibold text-gray-900 flex-1`} numberOfLines={1}>
            {map.name}
          </Text>
          <View style={tw`flex-row gap-2`}>
            <View style={tw`px-3 py-1 rounded-full ${getTypeColor(map.type)}`}>
              <Text style={tw`text-xs font-medium`}>{map.type}</Text>
            </View>
            <View style={tw`px-3 py-1 rounded-full ${getStatusColor(map.status)}`}>
              <Text style={tw`text-xs font-medium`}>{map.status}</Text>
            </View>
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
            onPress={() => onUpload?.(map)}
          >
            <Feather name="upload" size={18} color="#2563eb" />
            <Text style={tw`text-blue-600 ml-2 font-medium text-sm`}>Upload</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-1 flex-row items-center justify-center bg-green-50 py-2 rounded-xl mr-2`}
            onPress={() => onEdit(map)}
          >
            <MaterialIcons name="edit" size={18} color="#16a34a" />
            <Text style={tw`text-green-600 ml-2 font-medium text-sm`}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-1 flex-row items-center justify-center bg-red-50 py-2 rounded-xl`}
            onPress={() => onDelete(map)}
          >
            <Feather name="trash-2" size={18} color="#dc2626" />
            <Text style={tw`text-red-600 ml-2 font-medium text-sm`}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
