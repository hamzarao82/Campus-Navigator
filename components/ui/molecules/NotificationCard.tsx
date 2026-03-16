import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Card } from "../atoms/Card";
import { StatusBadge } from "../atoms/StatusBadge";
import { AppNotification } from "../../../types/notification";

interface NotificationCardProps {
  notification: AppNotification;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  return (
    <Card style={tw`mb-4`}>
      {/* Header */}
      <View style={tw`flex-row items-center mb-3`}>
        <View style={tw`w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-3`}>
          <Ionicons name="notifications-outline" size={24} color="#2563EB" />
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`text-base font-semibold text-gray-900`}>
            {notification.title}
          </Text>
          <StatusBadge status={notification.recipients} style={tw`mt-1 self-start`} />
        </View>
      </View>

      {/* Message */}
      <Text style={tw`text-gray-600 text-sm mb-3`}>
        {notification.message}
      </Text>

      {/* Info */}
      <View style={tw`flex-row items-center`}>
        <Feather name="clock" size={14} color="#6B7280" />
        <Text style={tw`text-gray-500 text-sm ml-2`}>
          {notification.time}
        </Text>
      </View>
    </Card>
  );
};
