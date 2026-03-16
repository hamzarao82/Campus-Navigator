import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import tw from 'twrnc';

interface FormInputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  containerStyle?: any;
  inputStyle?: any;
  labelStyle?: any;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  containerStyle,
  inputStyle,
  labelStyle,
  ...props
}) => {
  return (
    <View style={[tw`mb-4`, containerStyle]}>
      {label && (
        <Text style={[tw`text-sm font-medium text-gray-700 mb-2`, labelStyle]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-800`,
          props.multiline ? tw`h-28` : null,
          inputStyle,
        ]}
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  );
}
