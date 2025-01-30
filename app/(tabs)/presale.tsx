import React from "react";
import { View, StyleSheet } from "react-native";
import { PresaleLiquidity } from "@/app/components/PresaleLiquidity";

export default function PresaleScreen() {
  return (
    <View style={styles.container}>
      <PresaleLiquidity />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
