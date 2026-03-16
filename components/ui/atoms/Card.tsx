import React from 'react';
import { View, ViewProps, StyleProp, ViewStyle } from 'react-native';
import tw from 'twrnc';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, style, ...props }: CardProps) {
  return (
    <View
      style={[
        tw`bg-white rounded-2xl p-4 shadow-md border border-gray-100 mb-4`,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
