import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Ionicons, FontAwesome5, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { useUserProfile } from '../../hooks/useUserProfile';
import { ProfileInfoSection } from '../../components/ui/organisms/ProfileInfoSection';

export default function FacultyProfileScreen() {
  const router = useRouter();
  const { profileData, loading, saving, isEditing, setIsEditing, handleSave, updateField } = useUserProfile({ role: 'faculty' });

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
      <View style={tw`flex-1`}>
        {/* Header */}
        <View style={tw`flex-row items-center justify-between px-6 pt-4 pb-4`}>
          <TouchableOpacity
            style={tw`w-10 h-10 bg-gray-100 rounded-full items-center justify-center`}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </TouchableOpacity>

          <Text style={tw`text-xl font-bold text-gray-900`}>Faculty Profile</Text>

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

        <ScrollView style={tw`flex-1 px-6`} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={tw`items-center my-6`}>
            <View style={tw`relative`}>
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
                }}
                style={tw`w-28 h-28 rounded-full border-4 border-blue-600`}
              />
              {isEditing && (
                <TouchableOpacity
                  style={tw`absolute bottom-0 right-0 bg-blue-600 w-9 h-9 rounded-full items-center justify-center border-2 border-white`}
                  onPress={() =>
                    Alert.alert(
                      'Coming Soon',
                      'Change profile picture feature coming soon.'
                    )
                  }
                >
                  <Feather name="camera" size={18} color="#fff" />
                </TouchableOpacity>
              )}
            </View>

            <View
              style={tw`flex-row items-center mt-3 bg-blue-100 px-4 py-2 rounded-full`}
            >
              <FontAwesome5 name="user-tie" size={16} color="#2563eb" />
              <Text style={tw`ml-2 text-blue-700 font-medium text-sm`}>Faculty</Text>
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
                editable: false, 
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
                label: "Office",
                value: profileData.address || "",
                icon: <MaterialIcons name="location-on" size={16} color="#6b7280" />,
                isEditing,
                onChangeText: (text) => updateField("address", text),
              },
            ]}
          />

          {/* Faculty Info */}
          <ProfileInfoSection
            title="Faculty Information"
            fields={[
              {
                label: "Faculty ID",
                value: profileData.facultyId || "",
                icon: <FontAwesome5 name="id-badge" size={16} color="#6b7280" />,
                isEditing,
                onChangeText: (text) => updateField("facultyId", text),
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
                label: "Research Interests",
                value: profileData.research || "",
                icon: <FontAwesome5 name="microscope" size={16} color="#6b7280" />,
                isEditing,
                onChangeText: (text) => updateField("research", text),
                multiline: true,
              },
            ]}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
