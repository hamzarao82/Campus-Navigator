import React, { useEffect } from "react";
import { Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import tw from "twrnc";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

export default function StartScreen() {
  const router = useRouter();

  // Animation values
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    const timing = { duration: 800, easing: Easing.bezier(0.16, 1, 0.3, 1) };

    logoOpacity.value = withTiming(1, timing);
    titleOpacity.value = withDelay(300, withTiming(1, timing));
    buttonOpacity.value = withDelay(600, withTiming(1, timing));
  }, []);

  // Animated styles
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      {
        translateY: withTiming(
          logoOpacity.value * 0 + (1 - logoOpacity.value) * 20,
          { duration: 800 }
        ),
      },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [
      {
        translateY: withTiming(
          titleOpacity.value * 0 + (1 - titleOpacity.value) * 20,
          { duration: 800 }
        ),
      },
    ],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [
      {
        translateY: withTiming(
          buttonOpacity.value * 0 + (1 - buttonOpacity.value) * 20,
          { duration: 800 }
        ),
      },
    ],
  }));

  const handleGetStarted = () => {
    router.replace("/login");
  };

  return (
    <View style={tw`flex-1 bg-blue-600 justify-between px-6 pb-8`}>
      <View style={tw`flex-1 justify-center items-center`}>
        {/* Logo */}
        <Animated.View style={[tw`mb-8`, logoStyle]}>
          <Image
            source={require("../assets/images/Group 1686554319.png")}
            style={tw`w-32 h-32`}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Title */}
        <Animated.View style={titleStyle}>
          <Text style={tw`text-white text-3xl font-bold text-center mb-4`}>
            Campus Navigator
          </Text>
          <Text style={tw`text-white text-base text-center opacity-80`}>
            Find your way around campus with ease
          </Text>
        </Animated.View>
      </View>

      {/* Button */}
      <Animated.View style={[buttonStyle]}>
        <Text
          onPress={handleGetStarted}
          style={tw`bg-white text-blue-600 text-lg font-semibold text-center py-4 rounded-2xl`}
        >
          Get Started
        </Text>
      </Animated.View>
    </View>
  );
}
