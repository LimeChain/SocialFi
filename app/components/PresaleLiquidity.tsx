import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { AnimatedCard } from "./ui/AnimatedCard";
import { useTheme } from "@/app/providers/ThemeProvider";

interface PresaleConfig {
  enabled: boolean;
  softCap: number;
  hardCap: number;
  minContribution: number;
  maxContribution: number;
  startTime: Date;
  endTime: Date;
  vestingConfig: {
    initialUnlock: number;
    vestingPeriod: number;
    vestingSteps: number;
  };
  whitelistEnabled: boolean;
  whitelistedAddresses: string[];
  progress: number;
}

interface LiquidityConfig {
  percentage: number;
  lockPeriod: number;
  initialLiquidity: number;
  vestingSchedule: VestingPeriod[];
}

interface VestingPeriod {
  unlockTime: Date;
  percentage: number;
}

export const PresaleLiquidity = () => {
  const { isDark } = useTheme();
  const [presaleConfig, setPresaleConfig] = useState<PresaleConfig>({
    enabled: false,
    softCap: 50000,
    hardCap: 100000,
    minContribution: 100,
    maxContribution: 5000,
    startTime: new Date(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    vestingConfig: {
      initialUnlock: 20,
      vestingPeriod: 5, // in months
      vestingSteps: 5, // number of releases after TGE
    },
    whitelistEnabled: false,
    whitelistedAddresses: [],
    progress: 0,
  });

  const [liquidityConfig, setLiquidityConfig] = useState<LiquidityConfig>({
    percentage: 80,
    lockPeriod: 365,
    initialLiquidity: 50000,
    vestingSchedule: [],
  });

  const renderWhitelistSection = () => (
    <Card className="mt-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-semibold text-text-primary">
          Whitelist Management
        </Text>
        <Switch
          value={presaleConfig.whitelistEnabled}
          onValueChange={(enabled) =>
            setPresaleConfig({
              ...presaleConfig,
              whitelistEnabled: enabled,
            })
          }
        />
      </View>
      {presaleConfig.whitelistEnabled && (
        <TouchableOpacity className="bg-primary p-3 rounded-lg items-center">
          <Text className="text-white text-sm font-medium">
            Manage Whitelist
          </Text>
        </TouchableOpacity>
      )}
    </Card>
  );

  const renderProgressTracker = () => (
    <Card className="mt-4">
      <Text className="text-base font-semibold text-text-primary mb-3">
        Presale Progress
      </Text>
      <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-primary"
          style={{
            width: `${(presaleConfig.progress / presaleConfig.hardCap) * 100}%`,
          }}
        />
      </View>
      <Text className="text-sm text-text-secondary mt-2 text-center">
        {`${presaleConfig.progress} / ${presaleConfig.hardCap} USDC (${(
          (presaleConfig.progress / presaleConfig.hardCap) *
          100
        ).toFixed(1)}%)`}
      </Text>
    </Card>
  );

  const renderVestingSchedule = () => {
    const { initialUnlock, vestingPeriod, vestingSteps } =
      presaleConfig.vestingConfig;
    const remainingTokens = 100 - initialUnlock;
    const tokensPerStep = remainingTokens / vestingSteps;

    // Generate vesting data points based on configuration
    const vestingData = [
      { value: initialUnlock, label: "TGE" },
      ...Array.from({ length: vestingSteps }, (_, i) => ({
        value: initialUnlock + tokensPerStep * (i + 1),
        label: `${i + 1}m`,
      })),
    ];

    return (
      <Card>
        <Text className="text-lg font-semibold text-text-primary mb-4">
          Vesting Schedule
        </Text>
        <View className="mb-4">
          <Input
            label="Initial Unlock (%)"
            value={presaleConfig.vestingConfig.initialUnlock.toString()}
            onChangeText={(value) =>
              setPresaleConfig({
                ...presaleConfig,
                vestingConfig: {
                  ...presaleConfig.vestingConfig,
                  initialUnlock: Math.min(
                    Math.max(parseFloat(value) || 0, 0),
                    100
                  ),
                },
              })
            }
            keyboardType="decimal-pad"
          />
          <Input
            label="Vesting Period (months)"
            value={presaleConfig.vestingConfig.vestingPeriod.toString()}
            onChangeText={(value) =>
              setPresaleConfig({
                ...presaleConfig,
                vestingConfig: {
                  ...presaleConfig.vestingConfig,
                  vestingPeriod: parseInt(value) || 0,
                  vestingSteps: parseInt(value) || 0,
                },
              })
            }
            keyboardType="numeric"
          />
        </View>
        <View className="h-64 mb-4">
          <LineChart
            data={vestingData}
            height={200}
            width={300}
            hideDataPoints={false}
            color="#512DA8"
            thickness={2}
            startFillColor="rgba(81, 45, 168, 0.2)"
            endFillColor="rgba(81, 45, 168, 0.0)"
            initialSpacing={10}
            spacing={40}
            backgroundColor="transparent"
            xAxisColor={isDark ? "#333" : "#eee"}
            yAxisColor={isDark ? "#333" : "#eee"}
            yAxisTextStyle={{ color: isDark ? "#AAAAAA" : "#666666" }}
            xAxisLabelTextStyle={{ color: isDark ? "#AAAAAA" : "#666666" }}
            yAxisTextNumberOfLines={1}
            hideRules
            rulesType="solid"
            rulesColor={isDark ? "#333" : "#eee"}
            yAxisLabelWidth={40}
            curved
          />
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-text-secondary">Initial Unlock</Text>
          <Text className="text-text-primary font-semibold">
            {presaleConfig.vestingConfig.initialUnlock}%
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-text-secondary">Vesting Period</Text>
          <Text className="text-text-primary font-semibold">
            {presaleConfig.vestingConfig.vestingPeriod} months
          </Text>
        </View>
      </Card>
    );
  };

  const renderPresaleInputs = () => (
    <View className="space-y-4">
      <Input
        label="Soft Cap (USDC)"
        value={presaleConfig.softCap.toString()}
        onChangeText={(value) =>
          setPresaleConfig({
            ...presaleConfig,
            softCap: parseFloat(value) || 0,
          })
        }
        keyboardType="decimal-pad"
      />
      <Input
        label="Hard Cap (USDC)"
        value={presaleConfig.hardCap.toString()}
        onChangeText={(value) =>
          setPresaleConfig({
            ...presaleConfig,
            hardCap: parseFloat(value) || 0,
          })
        }
        keyboardType="decimal-pad"
      />
      {/* Add other inputs */}
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4 border-b border-gray-100">
        <Text className="text-2xl font-bold text-text-primary">
          Presale & Liquidity
        </Text>
      </View>

      <View className="p-4 space-y-6">
        {/* Presale Section */}
        <AnimatedCard>
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-text-primary">
              Presale Configuration
            </Text>
            <Switch
              value={presaleConfig.enabled}
              onValueChange={(enabled) =>
                setPresaleConfig({ ...presaleConfig, enabled })
              }
            />
          </View>
          {presaleConfig.enabled && renderPresaleInputs()}
          {presaleConfig.enabled && renderVestingSchedule()}
        </AnimatedCard>

        {renderWhitelistSection()}
        {renderProgressTracker()}

        {/* Liquidity Section */}
        <AnimatedCard>
          <Text className="text-lg font-semibold text-text-primary mb-4">
            Liquidity Configuration
          </Text>

          <View className="mb-4">
            <Text className="text-base text-text-secondary mb-2">
              Liquidity Percentage (%)
            </Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 text-base"
              value={liquidityConfig.percentage.toString()}
              onChangeText={(value) =>
                setLiquidityConfig({
                  ...liquidityConfig,
                  percentage: parseFloat(value) || 0,
                })
              }
              keyboardType="decimal-pad"
            />
          </View>

          {/* Add other liquidity inputs */}
        </AnimatedCard>

        <Button
          variant="primary"
          size="lg"
          label="Save Configuration"
          className="mt-6"
        />
      </View>
    </ScrollView>
  );
};
