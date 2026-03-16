import React from "react";
import { View, Text, Image } from "react-native";
import tw from "twrnc";
import { Ionicons, Entypo, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Card } from "../atoms/Card";
import { StatusBadge } from "../atoms/StatusBadge";
import { PrimaryButton } from "../atoms/PrimaryButton";
import { ManagePOI } from "../../../types/poi";

interface ManagePOICardProps {
  poi: ManagePOI;
  onEdit: (poi: ManagePOI) => void;
  onDelete: (poi: ManagePOI) => void;
  onNavigateToMap: (poi: ManagePOI) => void;
}

export const ManagePOICard: React.FC<ManagePOICardProps> = ({
  poi,
  onEdit,
  onDelete,
  onNavigateToMap,
}) => {
  return (
    <Card style={tw`mb-5 !p-0 overflow-hidden`}>
      <Image
        source={{ uri: poi.image }}
        style={tw`w-full h-48`}
        resizeMode="cover"
      />
      <View style={tw`p-4`}>
        {/* Name + Status */}
        <View style={tw`flex-row justify-between items-center mb-2`}>
          <Text style={tw`text-lg font-semibold text-gray-900 flex-1 mr-2`} numberOfLines={1}>
            {poi.name}
          </Text>
          <StatusBadge status={poi.status} />
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
        <View style={tw`flex-row justify-between mt-3 gap-2`}>
          <PrimaryButton
            title="Edit"
            icon={<Ionicons name="create-outline" size={18} color="#2563eb" />}
            onPress={() => onEdit(poi)}
            style={tw`flex-1 bg-blue-100`}
            textStyle={tw`text-blue-600 text-sm`}
          />
          <PrimaryButton
            title="Delete"
            icon={<Ionicons name="trash-outline" size={18} color="#dc2626" />}
            onPress={() => onDelete(poi)}
            style={tw`flex-1 bg-red-100`}
            textStyle={tw`text-red-600 text-sm`}
          />
          <PrimaryButton
            title="Map"
            icon={<Entypo name="location" size={18} color="#16a34a" />}
            onPress={() => onNavigateToMap(poi)}
            style={tw`flex-1 bg-green-100`}
            textStyle={tw`text-green-700 text-sm`}
          />
        </View>
      </View>
    </Card>
  );
};
