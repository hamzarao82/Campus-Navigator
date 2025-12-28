import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Ionicons, FontAwesome5, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

export default function FacultyProfileScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    phone: '+1 (555) 987-6543',
    address: 'Room 301, Science Building',
    facultyId: 'FAC789012',
    department: 'Computer Science',
    position: 'Associate Professor',
    research: 'Artificial Intelligence, Machine Learning',
  });

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Profile Saved', 'Faculty profile updated successfully.');
  };

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
          >
            <Text style={tw`text-white text-sm font-medium`}>
              {isEditing ? 'Save' : 'Edit'}
            </Text>
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
          <View style={tw`mb-6`}>
            <Text style={tw`text-lg font-semibold text-gray-900 mb-3`}>
              Personal Information
            </Text>
            <View style={tw`bg-gray-50 rounded-2xl p-4`}>
              {/* Full Name */}
              <View style={tw`mb-4 border-b border-gray-200 pb-2`}>
                <Text style={tw`text-gray-600 text-sm mb-1`}>Full Name</Text>
                {isEditing ? (
                  <TextInput
                    style={tw`bg-gray-100 p-2 rounded text-gray-900`}
                    value={profileData.name}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, name: text })
                    }
                  />
                ) : (
                  <Text style={tw`text-gray-900 text-base`}>{profileData.name}</Text>
                )}
              </View>

              {/* Email */}
              <View style={tw`mb-4 border-b border-gray-200 pb-2`}>
                <View style={tw`flex-row items-center mb-1`}>
                  <Feather name="mail" size={16} color="#6b7280" />
                  <Text style={tw`ml-2 text-gray-600 text-sm`}>Email</Text>
                </View>
                <Text style={tw`text-gray-900 text-base`}>{profileData.email}</Text>
              </View>

              {/* Phone */}
              <View style={tw`mb-4 border-b border-gray-200 pb-2`}>
                <View style={tw`flex-row items-center mb-1`}>
                  <Feather name="phone" size={16} color="#6b7280" />
                  <Text style={tw`ml-2 text-gray-600 text-sm`}>Phone</Text>
                </View>
                {isEditing ? (
                  <TextInput
                    style={tw`bg-gray-100 p-2 rounded text-gray-900`}
                    value={profileData.phone}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, phone: text })
                    }
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={tw`text-gray-900 text-base`}>{profileData.phone}</Text>
                )}
              </View>

              {/* Address / Office */}
              <View>
                <View style={tw`flex-row items-center mb-1`}>
                  <MaterialIcons name="location-on" size={16} color="#6b7280" />
                  <Text style={tw`ml-2 text-gray-600 text-sm`}>Office</Text>
                </View>
                {isEditing ? (
                  <TextInput
                    style={tw`bg-gray-100 p-2 rounded text-gray-900`}
                    value={profileData.address}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, address: text })
                    }
                  />
                ) : (
                  <Text style={tw`text-gray-900 text-base`}>{profileData.address}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Faculty Info */}
          <View style={tw`mb-12`}>
            <Text style={tw`text-lg font-semibold text-gray-900 mb-3`}>
              Faculty Information
            </Text>
            <View style={tw`bg-gray-50 rounded-2xl p-4`}>
              {/* Faculty ID */}
              <View style={tw`mb-4 border-b border-gray-200 pb-2`}>
                <Text style={tw`text-gray-600 text-sm mb-1`}>Faculty ID</Text>
                {isEditing ? (
                  <TextInput
                    style={tw`bg-gray-100 p-2 rounded text-gray-900`}
                    value={profileData.facultyId}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, facultyId: text })
                    }
                  />
                ) : (
                  <Text style={tw`text-gray-900 text-base`}>
                    {profileData.facultyId}
                  </Text>
                )}
              </View>

              {/* Department */}
              <View style={tw`mb-4 border-b border-gray-200 pb-2`}>
                <Text style={tw`text-gray-600 text-sm mb-1`}>Department</Text>
                {isEditing ? (
                  <TextInput
                    style={tw`bg-gray-100 p-2 rounded text-gray-900`}
                    value={profileData.department}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, department: text })
                    }
                  />
                ) : (
                  <Text style={tw`text-gray-900 text-base`}>
                    {profileData.department}
                  </Text>
                )}
              </View>

              {/* Position */}
              <View style={tw`mb-4 border-b border-gray-200 pb-2`}>
                <Text style={tw`text-gray-600 text-sm mb-1`}>Position</Text>
                {isEditing ? (
                  <TextInput
                    style={tw`bg-gray-100 p-2 rounded text-gray-900`}
                    value={profileData.position}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, position: text })
                    }
                  />
                ) : (
                  <Text style={tw`text-gray-900 text-base`}>
                    {profileData.position}
                  </Text>
                )}
              </View>

              {/* Research Interests */}
              <View>
                <Text style={tw`text-gray-600 text-sm mb-1`}>
                  Research Interests
                </Text>
                {isEditing ? (
                  <TextInput
                    style={tw`bg-gray-100 p-2 rounded text-gray-900`}
                    value={profileData.research}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, research: text })
                    }
                    multiline
                    numberOfLines={3}
                  />
                ) : (
                  <Text style={tw`text-gray-900 text-base`}>
                    {profileData.research}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
