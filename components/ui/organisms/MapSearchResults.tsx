import React from 'react';
import { ScrollView, ActivityIndicator, TouchableOpacity, Text, View } from 'react-native';
import tw from 'twrnc';
import { SearchResult } from '../../../types/map';
import { Icons } from '../../../constants/icons';

interface MapSearchResultsProps {
  searchResults: SearchResult[];
  searching: boolean;
  onSelect: (result: SearchResult) => void;
}

export function MapSearchResults({ searchResults, searching, onSelect }: MapSearchResultsProps) {
  if (searchResults.length === 0) return null;

  return (
    <ScrollView style={tw`mt-2.5 bg-white rounded-xl max-h-62 shadow-lg`}>
      {searching ? (
        <ActivityIndicator style={tw`py-4`} color="#2196F3" />
      ) : (
        searchResults.map((searchPoi: SearchResult) => (
          <TouchableOpacity
            key={searchPoi.id}
            style={tw`flex-row px-4 py-3 border-b border-gray-100 items-center`}
            onPress={() => onSelect(searchPoi)}
          >
            <Text style={tw`text-lg mr-3 text-gray-500`}>
              {Icons[searchPoi.type as keyof typeof Icons] || Icons.Pin}
            </Text>
            <View style={tw`flex-1`}>
              <Text style={tw`font-bold text-gray-800 text-base mb-0.5`}>{searchPoi.name}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}
