import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import tw from 'twrnc';

interface PrimaryButtonProps {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
  icon?: React.ReactNode;
}

export function PrimaryButton({
  onPress,
  title,
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={[
        tw`bg-blue-600 rounded-xl py-4 flex-row justify-center items-center shadow-lg`,
        disabled ? tw`opacity-50` : null,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {icon && icon}
          <Text style={[tw`text-white text-lg font-bold`, icon ? tw`ml-2` : null, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
