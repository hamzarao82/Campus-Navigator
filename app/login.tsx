import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import tw from "twrnc";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // For now just navigate (no auth)
    router.replace("/dashboard");
  };

  return (
    <View style={tw`flex-1 bg-white px-6 pt-12`}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.replace("/")}>
        <Text style={tw`text-blue-600 text-lg`}>← Back</Text>
      </TouchableOpacity>

      {/* Logo */}
      <View style={tw`items-center mt-10 mb-12`}>
        <Image
          source={require("../assets/images/Group 1686554319.png")}
          style={tw`w-40 h-40`}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>Login</Text>
      <Text style={tw`text-gray-500 mb-8`}>Please sign in to continue</Text>

      {/* Email Input */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={tw`border border-gray-300 rounded-lg px-4 py-3 mb-4`}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={tw`border border-gray-300 rounded-lg px-4 py-3 mb-6`}
        secureTextEntry
      />

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin}
        style={tw`bg-blue-600 py-4 rounded-xl`}
      >
        <Text style={tw`text-white text-center text-lg font-semibold`}>
          Login
        </Text>
      </TouchableOpacity>

      {/* Signup Link */}
      <TouchableOpacity
        onPress={() => router.replace("/signup")}
        style={tw`mt-6`}
      >
        <Text style={tw`text-gray-600 text-center`}>
          Don't have an account?{" "}
          <Text style={tw`text-blue-600 font-semibold`}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
