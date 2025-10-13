// app/(screens)/SettingsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialIcons, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import tw from "twrnc";

export default function SettingsScreen() {
  const router = useRouter();

  const [settings, setSettings] = useState({
    notifications: {
      enabled: true,
      email: true,
      push: true,
      maintenance: true,
    },
    security: {
      twoFactor: true,
      biometric: false,
      sessionTimeout: "30",
    },
    system: {
      darkMode: false,
      autoUpdate: true,
      analytics: true,
    },
    backup: {
      automatic: true,
      retention: "30",
    },
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const sections = [
    {
      title: "Notifications",
      icon: "notifications",
      color: "#3b82f6",
      category: "notifications",
      settings: [
        { name: "enabled", label: "Enable Notifications", type: "switch" },
        { name: "email", label: "Email Notifications", type: "switch" },
        { name: "push", label: "Push Notifications", type: "switch" },
        { name: "maintenance", label: "Maintenance Alerts", type: "switch" },
      ],
    },
    {
      title: "Security",
      icon: "shield-checkmark",
      color: "#22c55e",
      category: "security",
      settings: [
        { name: "twoFactor", label: "Two-Factor Authentication", type: "switch" },
        { name: "biometric", label: "Biometric Authentication", type: "switch" },
        {
          name: "sessionTimeout",
          label: "Session Timeout (minutes)",
          type: "input",
        },
      ],
    },
    {
      title: "System",
      icon: "settings",
      color: "#f59e0b",
      category: "system",
      settings: [
        { name: "darkMode", label: "Dark Mode", type: "switch" },
        { name: "autoUpdate", label: "Automatic Updates", type: "switch" },
        { name: "analytics", label: "Usage Analytics", type: "switch" },
      ],
    },
    {
      title: "Backup & Recovery",
      icon: "cloud",
      color: "#2563eb",
      category: "backup",
      settings: [
        { name: "automatic", label: "Automatic Backup", type: "switch" },
        {
          name: "retention",
          label: "Retention Period (days)",
          type: "input",
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center p-5 pb-3`}>
        <TouchableOpacity
          style={tw`w-10 h-10 rounded-full bg-transparent items-center justify-center mr-3`}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color="#260f8eff" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-semibold text-gray-900`}>
          System Settings
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-5 pb-8`}
      >
        {sections.map((section, idx) => (
          <View key={section.title} style={tw`mb-6`}>
            {/* Section Header */}
            <View style={tw`flex-row items-center mb-3`}>
              <View
                style={tw`w-11 h-11 rounded-full items-center justify-center mr-3`}
              >
                <Ionicons name={section.icon} size={24} color={section.color} />
              </View>
              <Text style={tw`text-lg font-semibold text-gray-800`}>
                {section.title}
              </Text>
            </View>

            {/* Settings Card */}
            <View
              style={tw`bg-white rounded-2xl p-4 shadow-md border border-gray-100`}
            >
              {section.settings.map((item, i) => (
                <View
                  key={item.name}
                  style={tw`flex-row items-center justify-between py-3 border-b ${
                    i === section.settings.length - 1 ? "border-transparent" : "border-gray-100"
                  }`}
                >
                  <View style={tw`flex-1 mr-3`}>
                    <Text style={tw`text-base text-gray-900 font-medium`}>
                      {item.label}
                    </Text>
                  </View>

                  {item.type === "switch" ? (
                    <Switch
                      value={Boolean(settings[section.category][item.name])}
                      onValueChange={(value) =>
                        handleSettingChange(section.category, item.name, value)
                      }
                      trackColor={{
                        false: "#d1d5db",
                        true: `${section.color}55`,
                      }}
                      thumbColor={
                        settings[section.category][item.name]
                          ? section.color
                          : "#f9fafb"
                      }
                    />
                  ) : (
                    <TextInput
                      style={tw`bg-gray-100 text-gray-900 rounded-xl px-3 py-2 text-center w-20`}
                      value={String(settings[section.category][item.name])}
                      onChangeText={(value) =>
                        handleSettingChange(section.category, item.name, value)
                      }
                      keyboardType="numeric"
                      maxLength={3}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Reset Button */}
        <TouchableOpacity
          style={tw`flex-row items-center justify-center bg-red-50 py-3 rounded-xl mt-3`}
          onPress={() => alert("Resetting all settings to default")}
        >
          <Entypo name="warning" size={18} color="#ef4444" />
          <Text style={tw`ml-2 text-red-600 font-medium`}>
            Reset to Default Settings
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
