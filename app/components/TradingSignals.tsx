import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWalletStore } from "@/app/stores/WalletStore";
import { placeOrder } from "@/app/services/tradingService";

interface Signal {
  token: string;
  type: "buy" | "sell";
  price: number;
  timestamp: Date;
  amount: number;
}

export const TradingSignals = () => {
  // Mock signals - would come from a store in real implementation
  const signals: Signal[] = [
    {
      token: "SOL",
      type: "buy",
      price: 98.45,
      timestamp: new Date(),
      amount: 1,
    },
    {
      token: "BONK",
      type: "sell",
      price: 0.00001234,
      timestamp: new Date(),
      amount: 1,
    },
  ];

  // Add function to handle copy trading
  const handleCopyTrade = async (signal: Signal) => {
    try {
      // 1. Check if user has sufficient balance
      const { publicKey } = useWalletStore.getState();
      if (!publicKey) throw new Error("Wallet not connected");

      // 2. Create the same trade for the copying user
      if (signal.type === "buy") {
        // Place a buy order with same parameters
        await placeOrder({
          tokenMint: signal.token,
          side: "buy",
          price: signal.price,
          size: signal.amount,
        });
      } else {
        // Place a sell order with same parameters
        await placeOrder({
          tokenMint: signal.token,
          side: "sell",
          price: signal.price,
          size: signal.amount,
        });
      }
    } catch (error) {
      console.error("Error copying trade:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Trading Signals</Text>
      {signals.map((signal, index) => (
        <View key={index} style={styles.signalItem}>
          <Ionicons
            name={signal.type === "buy" ? "trending-up" : "trending-down"}
            size={24}
            color={signal.type === "buy" ? "#4CAF50" : "#F44336"}
          />
          <View style={styles.signalInfo}>
            <Text style={styles.tokenName}>{signal.token}</Text>
            <Text style={styles.signalType}>
              {signal.type.toUpperCase()} @ ${signal.price}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.followButton}
            onPress={() => handleCopyTrade(signal)}
          >
            <Text style={styles.followButtonText}>Copy</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  signalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  signalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: "500",
  },
  signalType: {
    fontSize: 14,
    color: "#666",
  },
  followButton: {
    backgroundColor: "#512DA8",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
