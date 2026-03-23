import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import tw from 'twrnc';

interface IconButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}

export function IconButton({ onPress, icon, style, backgroundColor = 'bg-gray-100' }: IconButtonProps) {
  return (
    <TouchableOpacity
      style={[
        tw`w-10 h-10 rounded-full items-center justify-center`,
        tw`${backgroundColor}`,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon}
    </TouchableOpacity>
  );
}
