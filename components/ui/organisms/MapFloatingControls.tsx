import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';
import { Icons } from '../../../constants/icons';
import { IconButton } from '../atoms/IconButton';
import { POI } from '../../../types/map';

interface MapFloatingControlsProps {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  getCurrentLocation: () => void;
  navigationStarted: boolean;
  showSaveModal: boolean;
  showEditModal: boolean;
  isAdmin: boolean;
  selectedPOI: POI | null;
  deletePOI: (id: string | number) => void;
}

export function MapFloatingControls({
  drawerOpen,
  setDrawerOpen,
  getCurrentLocation,
  navigationStarted,
  showSaveModal,
  showEditModal,
  isAdmin,
  selectedPOI,
  deletePOI,
}: MapFloatingControlsProps) {
  return (
    <>
      {/* Menu Button */}
      <TouchableOpacity
        onPress={() => setDrawerOpen(!drawerOpen)}
        style={tw`absolute top-12 left-5 w-12 h-12 bg-blue-500 rounded-full justify-center items-center shadow-lg z-10`}
      >
        <Text style={tw`text-2xl text-white`}>{drawerOpen ? Icons.Close : Icons.List}</Text>
      </TouchableOpacity>

      {/* Bottom Right Position Button */}
      <View style={tw`absolute bottom-30 right-5 z-10`}>
        <TouchableOpacity
          onPress={getCurrentLocation}
          style={tw`w-14 h-14 bg-blue-500 rounded-full justify-center items-center shadow-lg`}
        >
          <Text style={tw`text-2xl text-white`}>{Icons.Position}</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`absolute ${navigationStarted ? 'top-16 right-4' : 'bottom-8 right-4'} items-end z-10`}>
        {/* User Location Button */}
        {!navigationStarted && !showSaveModal && !showEditModal && (
          <IconButton
            icon={<Text style={tw`text-2xl`}>{Icons.Current}</Text>}
            onPress={getCurrentLocation}
            style={tw`mb-4 shadow-xl`}
          />
        )}

        {/* Delete POI Button */}
        {selectedPOI && !navigationStarted && !showSaveModal && !showEditModal && isAdmin && (
          <IconButton
            icon={<Text style={tw`text-2xl text-red-600`}>{Icons.Trash}</Text>}
            onPress={() => deletePOI(selectedPOI.id)}
            style={tw`bg-red-50 mb-4`}
          />
        )}
      </View>
    </>
  );
}
