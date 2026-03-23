import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Ionicons, Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUserProfile } from '../../hooks/useUserProfile';
import { ProfileInfoSection } from '../../components/ui/organisms/ProfileInfoSection';
import { ActivityIndicator } from 'react-native';

export default function AdminProfileScreen() {
  const { profileData, loading, saving, isEditing, setIsEditing, handleSave, updateField } = useUserProfile({ role: 'admin' });

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <Text style={tw`text-gray-500`}>Profile not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-6 pt-4 pb-4`}>
        <TouchableOpacity
          style={tw`w-10 h-10 bg-transparent rounded-full items-center justify-center`}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={tw`text-xl font-bold text-gray-900`}>Admin Profile</Text>

        <TouchableOpacity
          style={tw`px-4 py-2 rounded-full bg-blue-600`}
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={tw`text-white text-sm font-medium`}>
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={tw`flex-1 px-6`} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={tw`items-center my-6`}>
          <View style={tw`relative`}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
              }}
              style={tw`w-28 h-28 rounded-full border-4 border-blue-600`}
            />
            {isEditing && (
              <TouchableOpacity
                style={tw`absolute bottom-0 right-0 bg-blue-600 w-9 h-9 rounded-full items-center justify-center border-2 border-white`}
                onPress={() =>
                  Alert.alert('Coming Soon', 'Change profile picture feature coming soon.')
                }
              >
                <Feather name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          <View style={tw`flex-row items-center mt-3 bg-blue-100 px-4 py-2 rounded-full`}>
            <FontAwesome5 name="user-shield" size={16} color="#2563eb" />
            <Text style={tw`ml-2 text-blue-700 font-medium text-sm`}>Admin</Text>
          </View>
        </View>

        {/* Personal Info */}
        <ProfileInfoSection
          title="Personal Information"
          fields={[
            {
              label: "Full Name",
              value: profileData.fullName,
              icon: <Feather name="user" size={16} color="#6b7280" />,
              isEditing,
              onChangeText: (text) => updateField("fullName", text),
            },
            {
              label: "Email",
              value: profileData.email,
              icon: <Feather name="mail" size={16} color="#6b7280" />,
              isEditing,
              editable: false, // Email acts as login, typically not editable here
              keyboardType: "email-address",
            },
            {
              label: "Phone",
              value: profileData.phone || "",
              icon: <Feather name="phone" size={16} color="#6b7280" />,
              isEditing,
              onChangeText: (text) => updateField("phone", text),
              keyboardType: "phone-pad",
            },
            {
              label: "Address",
              value: profileData.address || "",
              icon: <MaterialIcons name="location-on" size={16} color="#6b7280" />,
              isEditing,
              onChangeText: (text) => updateField("address", text),
            },
          ]}
        />

        {/* Admin Info */}
        <ProfileInfoSection
          title="Admin Information"
          fields={[
            {
              label: "Admin ID",
              value: profileData.adminId || "",
              icon: <FontAwesome5 name="id-badge" size={16} color="#6b7280" />,
              isEditing,
              onChangeText: (text) => updateField("adminId", text),
            },
            {
              label: "Department",
              value: profileData.department || "",
              icon: <FontAwesome5 name="building" size={16} color="#6b7280" />,
              isEditing,
              onChangeText: (text) => updateField("department", text),
            },
            {
              label: "Position",
              value: profileData.position || "",
              icon: <FontAwesome5 name="briefcase" size={16} color="#6b7280" />,
              isEditing,
              onChangeText: (text) => updateField("position", text),
            },
            {
              label: "Responsibilities",
              value: profileData.responsibilities || "",
              icon: <FontAwesome5 name="tasks" size={16} color="#6b7280" />,
              isEditing,
              onChangeText: (text) => updateField("responsibilities", text),
              multiline: true,
            },
          ]}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
