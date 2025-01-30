import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styled } from "nativewind";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";

interface BondingCurveParams {
  initialPrice: number;
  reserveRatio: number;
  initialSupply: number;
}

export const TokenLaunch = () => {
  const [params, setParams] = useState<BondingCurveParams>({
    initialPrice: 0.1,
    reserveRatio: 0.5,
    initialSupply: 1000000,
  });

  // Calculate price based on bonding curve formula
  const calculatePrice = (supply: number) => {
    return (
      params.initialPrice *
      Math.pow(supply / params.initialSupply, 1 / params.reserveRatio)
    );
  };

  // Generate data points for the curve
  const generateCurveData = () => {
    const points = [];
    for (let i = 0; i <= 10; i++) {
      const supply = params.initialSupply * (1 + i * 0.5);
      points.push({
        supply,
        price: calculatePrice(supply),
      });
    }
    return points;
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-6">Launch New Token</Text>

      <View className="mb-4">
        <Text className="text-base text-text-secondary mb-2">
          Initial Price (USDC)
        </Text>
        <TextInput
          className="border border-gray-200 rounded-lg p-3 text-base"
          value={params.initialPrice.toString()}
          onChangeText={(value) =>
            setParams({ ...params, initialPrice: parseFloat(value) || 0 })
          }
          keyboardType="decimal-pad"
          placeholder="0.1"
        />
      </View>

      <View className="mb-4">
        <Text className="text-base text-text-secondary mb-2">
          Reserve Ratio (0-1)
        </Text>
        <TextInput
          className="border border-gray-200 rounded-lg p-3 text-base"
          value={params.reserveRatio.toString()}
          onChangeText={(value) =>
            setParams({ ...params, reserveRatio: parseFloat(value) || 0 })
          }
          keyboardType="decimal-pad"
          placeholder="0.5"
        />
      </View>

      <View className="mb-4">
        <Text className="text-base text-text-secondary mb-2">
          Initial Supply
        </Text>
        <TextInput
          className="border border-gray-200 rounded-lg p-3 text-base"
          value={params.initialSupply.toString()}
          onChangeText={(value) =>
            setParams({ ...params, initialSupply: parseInt(value) || 0 })
          }
          keyboardType="numeric"
          placeholder="1000000"
        />
      </View>

      <View className="mb-4">
        <Text className="text-base text-text-secondary mb-2">
          Bonding Curve
        </Text>
        <LineChart
          data={generateCurveData().map((p) => ({ value: p.price }))}
          height={220}
          width={350}
          color="#512DA8"
          thickness={2}
          hideDataPoints
          curved
        />
      </View>

      <TouchableOpacity className="bg-primary text-white px-4 py-3 rounded-lg text-base font-bold">
        <Text className="text-white">Launch Token</Text>
      </TouchableOpacity>

      <View className="p-4 bg-secondary rounded-lg mb-4">
        <Text className="text-base text-text-secondary mb-2">
          Launch Summary
        </Text>
        <Text className="text-base text-text-primary mb-2">
          Initial Market Cap: $
          {(params.initialPrice * params.initialSupply).toLocaleString()}
        </Text>
        <Text className="text-base text-text-primary">
          Price at 2x Supply: $
          {calculatePrice(params.initialSupply * 2).toFixed(4)}
        </Text>
      </View>
    </ScrollView>
  );
};
