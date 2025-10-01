import React from "react";
import { Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import tw from "twrnc";

export default function StartScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.replace("");
  };

  return (
    <View style={tw`flex-1 bg-blue-600 justify-between px-6 pb-8`}>
      {/* Logo in the middle */}
      <View style={tw`flex-1 justify-center items-center`}>
        <Image
          source={require("../assets/images/Group 1686554319.png")}
          style={tw`w-56 h-56`} // bigger size
          resizeMode="contain"
        />
      </View>

      {/* Button */}
      <View>
        <Text
          onPress={handleGetStarted}
          style={tw`bg-white text-blue-600 text-lg font-semibold text-center py-4 rounded-2xl`}
        >
          Get Started
        </Text>
      </View>
    </View>
  );
}
