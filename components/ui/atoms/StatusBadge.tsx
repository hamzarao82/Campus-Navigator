import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import tw from 'twrnc';

interface StatusBadgeProps {
  status: string;
  style?: StyleProp<ViewStyle>;
}

export function StatusBadge({ status, style }: StatusBadgeProps) {
  const getStatusColor = (statusText: string) => {
    switch (statusText.toLowerCase()) {
      case "open":
      case "active":
        return tw`text-green-600 bg-green-100`;
      case "busy":
        return tw`text-yellow-600 bg-yellow-100`;
      case "available":
        return tw`text-blue-600 bg-blue-100`;
      case "closed":
        return tw`text-red-600 bg-red-100`;
      case "student":
        return tw`bg-green-100 text-green-700`;
      case "faculty":
        return tw`bg-blue-100 text-blue-700`;
      case "all":
      case "all users":
         return tw`bg-purple-100 text-purple-700`;
      default:
        return tw`text-gray-500 bg-gray-100`;
    }
  };

  return (
    <View style={[tw`px-3 py-1 rounded-full self-start`, getStatusColor(status), style]}>
      <Text style={tw`text-xs font-medium capitalize`}>
        {status}
      </Text>
    </View>
  );
}
