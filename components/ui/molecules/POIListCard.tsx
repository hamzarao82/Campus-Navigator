import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../atoms/Card';

interface POIListCardProps {
  name: string;
  description?: string;
  iconName?: any;
  iconColor?: string;
  iconBackgroundColor?: string;
  rightActionIcon?: any;
  onRightActionPress?: () => void;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function POIListCard({
  name,
  description,
  iconName = 'location',
  iconColor = '#2563EB',
  iconBackgroundColor = 'bg-blue-50',
  rightActionIcon = 'navigate',
  onRightActionPress,
  onPress,
  style,
}: POIListCardProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Card style={[tw`flex-row items-center justify-between p-4 mb-3`, style]}>
      <Container 
        style={tw`flex-1 flex-row items-center`} 
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={tw`w-12 h-12 rounded-full ${iconBackgroundColor} items-center justify-center mr-4`}>
          <Ionicons name={iconName} size={24} color={iconColor} />
        </View>
        <View style={tw`flex-1 pr-4`}>
          <Text style={tw`text-base font-bold text-gray-900 mb-1`} numberOfLines={1}>
            {name}
          </Text>
          {description && (
            <Text style={tw`text-sm text-gray-500`} numberOfLines={2}>
              {description}
            </Text>
          )}
        </View>
      </Container>
      
      {onRightActionPress && (
        <TouchableOpacity
          style={tw`w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100`}
          onPress={onRightActionPress}
        >
          <Ionicons name={rightActionIcon} size={20} color={iconColor} />
        </TouchableOpacity>
      )}
    </Card>
  );
}
