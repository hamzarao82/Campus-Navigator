import React from "react";
import { View, Text, TextInput } from "react-native";
import tw from "twrnc";

export interface ProfileFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  isEditing: boolean;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  editable?: boolean;
}

interface ProfileInfoSectionProps {
  title: string;
  fields: ProfileFieldProps[];
}

export const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({ title, fields }) => {
  return (
    <View style={tw`mb-6`}>
      <Text style={tw`text-lg font-semibold text-gray-900 mb-3`}>{title}</Text>
      <View style={tw`bg-gray-50 rounded-2xl p-4`}>
        {fields.map((field, index) => (
          <View key={index} style={tw`mb-4 ${index !== fields.length - 1 ? 'border-b border-gray-200 pb-2' : ''}`}>
            <View style={tw`flex-row items-center mb-1`}>
              {field.icon}
              <Text style={tw`ml-2 text-gray-600 text-sm`}>{field.label}</Text>
            </View>
            {field.isEditing && field.editable !== false ? (
              <TextInput
                style={tw`bg-gray-100 p-2 rounded text-gray-900 ${field.multiline ? 'min-h-20' : ''}`}
                value={field.value}
                onChangeText={field.onChangeText}
                keyboardType={field.keyboardType || "default"}
                multiline={field.multiline}
                numberOfLines={field.multiline ? 3 : 1}
                textAlignVertical={field.multiline ? "top" : "center"}
              />
            ) : (
              <Text style={tw`text-gray-900 text-base`}>{field.value || "Not specified"}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};
