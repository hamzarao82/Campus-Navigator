import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '../atoms/IconButton';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  leftActionIcon?: any; // Ionicons name
  onLeftAction?: () => void;
  rightActionIcon?: any; // Ionicons name
  onRightAction?: () => void;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export function PageHeader({
  title,
  onBack,
  leftActionIcon = "arrow-back",
  onLeftAction,
  rightActionIcon,
  onRightAction,
  style,
  containerStyle,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onLeftAction) {
      onLeftAction();
    } else if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={[tw`flex-row items-center justify-between px-6 py-4`, containerStyle]}>
      <IconButton 
        onPress={handleBack} 
        icon={<Ionicons name={leftActionIcon} size={24} color="#111" />} 
        backgroundColor="bg-gray-100"
      />
      
      <Text style={[tw`text-xl font-bold text-gray-900 flex-1 text-center px-4`, style]} numberOfLines={1}>
        {title}
      </Text>

      {rightActionIcon && onRightAction ? (
        <IconButton 
          onPress={onRightAction} 
          icon={<Ionicons name={rightActionIcon} size={24} color="#2563eb" />} 
          backgroundColor="bg-blue-100"
        />
      ) : (
        <View style={tw`w-10`} /> // Placeholder for alignment
      )}
    </View>
  );
}
