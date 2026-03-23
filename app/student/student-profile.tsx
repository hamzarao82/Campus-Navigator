import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, FontAwesome5, Entypo, Feather } from "@expo/vector-icons";
import tw from "twrnc";
import { useRouter } from "expo-router";
import { useUserProfile } from "../../hooks/useUserProfile";
import { ProfileInfoSection } from "../../components/ui/organisms/ProfileInfoSection";
import { ActivityIndicator } from "react-native";

export default function StudentProfileScreen() {
  const router = useRouter();
  const { profileData, loading, saving, isEditing, setIsEditing, handleSave, updateField } = useUserProfile({ role: 'student' });

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#3b82f6" />
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
      <View style={tw`flex-row items-center justify-between px-6 pb-3 pt-4`}>
        <TouchableOpacity
          style={tw`w-10 h-10 rounded-full bg-gray-100 items-center justify-center`}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color="#1f2937" />
        </TouchableOpacity>

        <Text style={tw`text-xl font-bold text-gray-800`}>Student Profile</Text>

        <TouchableOpacity
          style={tw`bg-blue-500 rounded-full px-4 py-2`}
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={tw`text-white font-medium`}>
              {isEditing ? "Save" : "Edit"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`px-6`} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={tw`items-center mt-4 mb-8`}>
          <View style={tw`relative`}>
            <Image
              source={{
                uri: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
              }}
              style={tw`w-30 h-30 rounded-full border-4 border-blue-500`}
            />
            {isEditing && (
              <TouchableOpacity
                style={tw`absolute bottom-0 right-0 bg-blue-500 w-9 h-9 rounded-full items-center justify-center border-2 border-white`}
                onPress={() =>
                  Alert.alert(
                    "Feature Coming Soon",
                    "Change profile picture functionality will be added later."
                  )
                }
              >
                <Ionicons name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          <View
            style={tw`flex-row items-center bg-blue-100 px-4 py-2 mt-4 rounded-full`}
          >
            <FontAwesome5 name="user-graduate" size={16} color="#3b82f6" />
            <Text style={tw`ml-2 text-blue-500 font-medium`}>Student</Text>
          </View>
        </View>

        {/* Personal Information */}
        <ProfileInfoSection
          title="Personal Information"
          fields={[
            {
              label: "Full Name",
              value: profileData.fullName,
              icon: <Feather name="user" size={16} color="gray" />,
              isEditing,
              onChangeText: (text) => updateField("fullName", text),
            },
            {
              label: "Email",
              value: profileData.email,
              icon: <MaterialIcons name="email" size={16} color="gray" />,
              isEditing,
              editable: false,
              keyboardType: "email-address",
            },
            {
              label: "Phone",
              value: profileData.phone || "",
              icon: <Ionicons name="call-outline" size={16} color="gray" />,
              isEditing,
              onChangeText: (text) => updateField("phone", text),
              keyboardType: "phone-pad",
            },
            {
              label: "Address",
              value: profileData.address || "",
              icon: <Entypo name="location-pin" size={16} color="gray" />,
              isEditing,
              onChangeText: (text) => updateField("address", text),
            },
          ]}
        />

        {/* Student Information */}
        <ProfileInfoSection
          title="Student Information"
          fields={[
            {
              label: "Student ID",
              value: profileData.studentId || "",
              icon: <FontAwesome5 name="id-card" size={16} color="gray" />,
              isEditing,
              onChangeText: (text) => updateField("studentId", text),
            },
            {
              label: "Major",
              value: profileData.major || "",
              icon: <FontAwesome5 name="book" size={16} color="gray" />,
              isEditing,
              onChangeText: (text) => updateField("major", text),
            },
            {
              label: "Year",
              value: profileData.year || "",
              icon: <FontAwesome5 name="calendar-alt" size={16} color="gray" />,
              isEditing,
              onChangeText: (text) => updateField("year", text),
            },
            {
              label: "GPA",
              value: profileData.gpa || "",
              icon: <FontAwesome5 name="graduation-cap" size={16} color="gray" />,
              isEditing,
              onChangeText: (text) => updateField("gpa", text),
            },
            {
              label: "Advisor",
              value: profileData.advisor || "",
              icon: <FontAwesome5 name="chalkboard-teacher" size={16} color="gray" />,
              isEditing,
              onChangeText: (text) => updateField("advisor", text),
            },
          ]}
        />

        <View style={tw`mb-10`} />
      </ScrollView>
    </SafeAreaView>
  );
}
