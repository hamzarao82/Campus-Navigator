import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  iconName?: any; // Ionicons name
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  iconName = 'document-text-outline',
  title,
  subtitle,
  style,
}: EmptyStateProps) {
  return (
    <View style={[tw`items-center justify-center py-20 px-6`, style]}>
      <Ionicons name={iconName} size={80} color="#d1d5db" />
      <Text style={tw`text-gray-500 text-lg font-semibold mt-4 text-center`}>
        {title}
      </Text>
      {subtitle && (
        <Text style={tw`text-gray-400 text-sm mt-2 text-center`}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
