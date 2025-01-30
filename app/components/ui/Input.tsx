import React from "react";
import { TextInput, TextInputProps, View, Text } from "react-native";

interface InputProps extends TextInputProps {
  label: string;
}

export const Input = ({ label, ...props }: InputProps) => {
  return (
    <View className="mb-4">
      <Text className="text-base text-text-secondary mb-2">{label}</Text>
      <TextInput
        className="border border-gray-200 rounded-lg p-3 text-base"
        {...props}
      />
    </View>
  );
};
