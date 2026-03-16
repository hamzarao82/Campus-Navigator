import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import tw from 'twrnc';
import { router } from 'expo-router';
import { POI } from '../../../types/map';
import { Icons } from '../../../constants/icons';
import { POIListCard } from '../molecules/POIListCard';

interface MapDrawerProps {
  drawerOpen: boolean;
  toggleDrawer: () => void;
  overlayAnim: Animated.Value;
  drawerAnim: Animated.Value;
  drawerWidth: number;
  managedPOIs: POI[];
  onSelectPOI: (poi: POI) => void;
}

export function MapDrawer({
  drawerOpen,
  toggleDrawer,
  overlayAnim,
  drawerAnim,
  drawerWidth,
  managedPOIs,
  onSelectPOI,
}: MapDrawerProps) {
  if (!drawerOpen) return null;

  return (
    <>
      <Animated.View style={[tw`absolute inset-0 bg-black z-50`, { opacity: overlayAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] }) }]}>
        <TouchableOpacity style={tw`flex-1`} activeOpacity={1} onPress={toggleDrawer} />
      </Animated.View>

      <Animated.View
        style={[
          tw`absolute top-0 bottom-0 bg-white shadow-2xl z-50`,
          { width: drawerWidth, transform: [{ translateX: drawerAnim }] }
        ]}
      >
        {/* Drawer Header */}
        <View style={tw`flex-row justify-between items-center px-5 pt-12 pb-4 bg-blue-500`}>
          <View style={tw`flex-row items-center gap-3`}>
            <Text style={tw`text-3xl text-white`}>{Icons.List}</Text>
            <Text style={tw`text-2xl font-bold text-white`}>Saved Locations</Text>
          </View>
          <TouchableOpacity onPress={toggleDrawer} style={tw`p-2`}>
            <Text style={tw`text-3xl text-white`}>{Icons.Close}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
          <Text style={tw`text-sm font-semibold text-gray-500 ml-4 mb-3 uppercase tracking-wider`}>Campus Locations</Text>
          {managedPOIs.map((poi) => (
            <View key={poi.id}>
              <POIListCard
                name={poi.name}
                description={poi.description}
                iconName={Icons[poi.category as keyof typeof Icons] || Icons.Pin}
                onRightActionPress={() => {
                  toggleDrawer();
                  onSelectPOI(poi);
                }}
                onPress={() => {
                  toggleDrawer();
                  onSelectPOI(poi);
                }}
                style={tw`mx-4 mb-2`}
              />
            </View>
          ))}

          <View style={tw`mt-8`}>
            <Text style={tw`text-sm font-semibold text-gray-500 ml-4 mb-3 uppercase tracking-wider`}>Management</Text>
            <POIListCard
              name="Manage All POIs"
              description="Edit or delete existing POIs"
              iconName="settings"
              iconColor="#8B5CF6"
              iconBackgroundColor="bg-purple-100"
              rightActionIcon="chevron-forward"
              onPress={() => {
                toggleDrawer();
                router.push("/features/manage-poi");
              }}
              onRightActionPress={() => {
                toggleDrawer();
                router.push("/features/manage-poi");
              }}
              style={tw`mx-4`}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={tw`px-5 py-4 bg-gray-50 border-t border-gray-200`}>
          <Text style={tw`text-xs text-gray-600 text-center`}>
            {Icons.Pin} Tap any location to navigate
          </Text>
        </View>
      </Animated.View>
    </>
  );
}
