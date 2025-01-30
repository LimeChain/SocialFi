import React from "react";
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/providers/ThemeProvider";

interface SearchBarProps extends TextInputProps {
  onClear?: () => void;
}

export const SearchBar = ({ onClear, className, ...props }: SearchBarProps) => {
  const { isDark } = useTheme();

  return (
    <View
      className={`flex-row items-center rounded-lg px-4 ${
        isDark ? "bg-dark-secondary" : "bg-gray-100"
      } ${className || ""}`}
    >
      <Ionicons name="search" size={20} color={isDark ? "#AAAAAA" : "#666"} />
      <TextInput
        className={`flex-1 py-2 px-3 text-base ${
          isDark ? "text-dark-text-primary" : "text-text-primary"
        }`}
        placeholderTextColor={isDark ? "#666" : "#999"}
        {...props}
      />
      {props.value && (
        <TouchableOpacity onPress={onClear}>
          <Ionicons
            name="close-circle"
            size={20}
            color={isDark ? "#AAAAAA" : "#666"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
