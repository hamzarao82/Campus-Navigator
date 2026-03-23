import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleProp, ViewStyle } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { FormInput } from '../atoms/FormInput';

interface POI {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
}

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  isFocused: boolean;
  onFocus: () => void;
  searchResults: POI[];
  onSelectResult: (poi: POI) => void;
  style?: StyleProp<ViewStyle>;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  isFocused,
  onFocus,
  searchResults,
  onSelectResult,
  style,
}: SearchBarProps) {
  return (
    <View style={[tw`absolute top-12 left-4 right-4 z-50`, style]}>
      <View style={tw`bg-white rounded-full flex-row items-center px-4 py-3 shadow-lg border border-gray-100`}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <FormInput
          placeholder="Search for places, friends..."
          value={searchQuery}
          onChangeText={onSearchChange}
          onFocus={onFocus}
          containerStyle={tw`flex-1 ml-3 mb-0`}
          inputStyle={tw`bg-transparent border-0 px-0 py-0 text-gray-800`}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {isFocused && searchQuery.length > 0 && searchResults.length > 0 && (
        <View style={tw`bg-white rounded-2xl mt-2 p-2 shadow-xl border border-gray-100 max-h-60`}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {searchResults.map((result) => (
              <TouchableOpacity
                key={result.id}
                style={tw`px-4 py-3 border-b border-gray-50 flex-row items-center`}
                onPress={() => onSelectResult(result)}
              >
                <View style={tw`w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3`}>
                  <Ionicons name="location" size={16} color="#2563EB" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-900 font-medium`}>{result.name}</Text>
                  {result.description && (
                     <Text style={tw`text-gray-500 text-xs mt-0.5`} numberOfLines={1}>
                       {result.description}
                     </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
