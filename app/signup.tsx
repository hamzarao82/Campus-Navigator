import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const roleOptions = ["Student", "Faculty", "Admin"];

  const handleSignup = () => {
    if (!fullName || !role || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!agreeTerms) {
      alert("You must agree to Terms & Conditions");
      return;
    }

    // For now, just navigate to login
    router.replace("/login");
  };

  return (
    <ScrollView contentContainerStyle={tw`flex-grow bg-white px-6 pt-12`}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={tw`text-blue-600 text-lg`}>← Back</Text>
      </TouchableOpacity>

      {/* Logo */}
      <View style={tw`items-center mt-10 mb-8`}>
        <Image
          source={require("../assets/images/Group 1686554319.png")}
          style={tw`w-32 h-32`}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>Sign Up</Text>
      <Text style={tw`text-gray-500 mb-6`}>Create your account</Text>

      {/* Full Name */}
      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={tw`border border-gray-300 rounded-lg px-4 py-3 mb-4`}
      />

      {/* Role Dropdown */}
      <View style={tw`mb-4`}>
        <TouchableOpacity
          onPress={() => setShowDropdown(!showDropdown)}
          style={tw`border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center`}
        >
          <Text style={tw`${role ? "text-gray-800" : "text-gray-400"}`}>
            {role || "Select your role"}
          </Text>
          <Ionicons
            name={showDropdown ? "chevron-up" : "chevron-down"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>

        {showDropdown && (
          <View style={tw`border border-gray-300 rounded-lg mt-2 bg-white`}>
            {roleOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={tw`px-4 py-3 border-b border-gray-200`}
                onPress={() => {
                  setRole(option);
                  setShowDropdown(false);
                }}
              >
                <Text style={tw`text-gray-800`}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Email */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={tw`border border-gray-300 rounded-lg px-4 py-3 mb-4`}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={tw`border border-gray-300 rounded-lg px-4 py-3 mb-4`}
        secureTextEntry
      />

      {/* Confirm Password */}
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={tw`border border-gray-300 rounded-lg px-4 py-3 mb-6`}
        secureTextEntry
      />

      {/* Terms & Conditions */}
      <TouchableOpacity
        style={tw`flex-row items-center mb-6`}
        onPress={() => setAgreeTerms(!agreeTerms)}
      >
        <View
          style={tw`w-5 h-5 mr-3 border rounded ${agreeTerms ? "bg-blue-600" : "bg-white"}`}
        />
        <Text style={tw`text-gray-600`}>I agree with Terms & Conditions</Text>
      </TouchableOpacity>

      {/* Signup Button */}
      <TouchableOpacity
        onPress={handleSignup}
        style={tw`bg-blue-600 py-4 rounded-xl`}
      >
        <Text style={tw`text-white text-center text-lg font-semibold`}>
          Sign Up
        </Text>
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity
        onPress={() => router.replace("/login")}
        style={tw`mt-6`}
      >
        <Text style={tw`text-gray-600 text-center`}>
          Already have an account?{" "}
          <Text style={tw`text-blue-600 font-semibold`}>Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
