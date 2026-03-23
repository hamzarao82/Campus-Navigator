import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Feather } from "@expo/vector-icons";
import { Card } from "../atoms/Card";
import { FormInput } from "../atoms/FormInput";
import { PrimaryButton } from "../atoms/PrimaryButton";

interface NotificationFormCardProps {
  notificationTitle: string;
  setNotificationTitle: (title: string) => void;
  notificationMessage: string;
  setNotificationMessage: (msg: string) => void;
  selectedRecipient: "all" | "student" | "faculty";
  setSelectedRecipient: (recipient: "all" | "student" | "faculty") => void;
  isSending: boolean;
  onSend: () => void;
}

export const NotificationFormCard: React.FC<NotificationFormCardProps> = ({
  notificationTitle,
  setNotificationTitle,
  notificationMessage,
  setNotificationMessage,
  selectedRecipient,
  setSelectedRecipient,
  isSending,
  onSend,
}) => {
  const getRecipientLabel = (type: string) => {
    switch (type) {
      case "student":
        return "Students";
      case "faculty":
        return "Faculty";
      default:
        return "All Users";
    }
  };

  return (
    <Card style={tw`mb-6`}>
      <Text style={tw`text-lg font-semibold text-gray-900 mb-4`}>
        Send New Notification
      </Text>

      <FormInput
        label="Title"
        placeholder="Enter notification title"
        value={notificationTitle}
        onChangeText={setNotificationTitle}
        containerStyle={tw`mb-2`}
      />

      <FormInput
        label="Message"
        placeholder="Enter your message"
        multiline
        numberOfLines={4}
        value={notificationMessage}
        onChangeText={setNotificationMessage}
        containerStyle={tw`mb-4`}
      />

      {/* Recipients */}
      <Text style={tw`text-sm font-medium text-gray-800 mb-2`}>Recipients</Text>
      <View style={tw`flex-row mb-4`}>
        {(["all", "student", "faculty"] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={tw.style(
              "px-4 py-2 rounded-full mr-2",
              selectedRecipient === type ? "bg-blue-600" : "bg-gray-100"
            )}
            onPress={() => setSelectedRecipient(type)}
          >
            <Text
              style={tw.style(
                "text-sm font-medium",
                selectedRecipient === type ? "text-white" : "text-gray-600"
              )}
            >
              {getRecipientLabel(type)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Send Button */}
      <PrimaryButton
        title="Send Notification"
        onPress={onSend}
        loading={isSending}
        icon={<Feather name="send" size={18} color="#fff" />}
        style={tw`mt-2`}
      />
    </Card>
  );
};
