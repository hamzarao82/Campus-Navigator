import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import tw from 'twrnc';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Card } from '../atoms/Card';
import { PrimaryButton } from '../atoms/PrimaryButton';

interface NavigationOverlayProps {
  mode: 'preview' | 'active';
  distance: string | null;
  duration: string | null;
  destinationName?: string;
  onStartNavigation?: () => void;
  onCancelNavigation: () => void;
  style?: StyleProp<ViewStyle>;
}

export function NavigationOverlay({
  mode,
  distance,
  duration,
  destinationName,
  onStartNavigation,
  onCancelNavigation,
  style,
}: NavigationOverlayProps) {
  if (mode === 'preview') {
    return (
      <Card style={[tw`absolute bottom-0 left-0 right-0 m-4 shadow-xl border border-gray-100`, style]}>
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <View>
            <Text style={tw`text-xl font-bold text-gray-900`}>Route Info</Text>
            {destinationName && (
              <Text style={tw`text-sm text-gray-500 mt-1`}>To {destinationName}</Text>
            )}
          </View>
          <View style={tw`bg-blue-50 px-3 py-1.5 rounded-full`}>
            <Text style={tw`text-blue-700 font-bold`}>
              {distance || 'Calculating...'}
            </Text>
          </View>
        </View>
        <View style={tw`flex-row items-center mb-4`}>
          <View style={tw`w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3`}>
            <FontAwesome5 name="walking" size={18} color="#4B5563" />
          </View>
          <View>
            <Text style={tw`text-gray-900 font-semibold`}>
              {duration || 'Calculating...'}
            </Text>
            <Text style={tw`text-gray-500 text-sm`}>Walking time</Text>
          </View>
        </View>
        <View style={tw`flex-row gap-3`}>
          <PrimaryButton
            title="Cancel"
            onPress={onCancelNavigation}
            style={tw`flex-1 bg-gray-200`}
            textStyle={tw`text-gray-700`}
          />
          <PrimaryButton
            title="Start Route"
            onPress={onStartNavigation}
            style={tw`flex-2 bg-blue-600`}
            icon={<Ionicons name="navigate" size={18} color="white" />}
          />
        </View>
      </Card>
    );
  }

  // Active navigation mode
  return (
    <Card style={[tw`absolute bottom-0 left-0 right-0 m-4 shadow-xl border border-gray-100`, style]}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <View style={tw`flex-row items-center`}>
          <View style={tw`w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-3`}>
            <Ionicons name="navigate" size={24} color="#16A34A" />
          </View>
          <View>
            <Text style={tw`text-2xl font-bold text-gray-900`}>
              {duration || '-- min'}
            </Text>
            <Text style={tw`text-gray-600 font-medium`}>
              {distance || '-- km'} remaining
            </Text>
          </View>
        </View>
      </View>
      <PrimaryButton
        title="End Navigation"
        onPress={onCancelNavigation}
        style={tw`bg-red-500`}
        icon={<Ionicons name="close-circle" size={18} color="white" />}
      />
    </Card>
  );
}
