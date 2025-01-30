import { View, Text, ScrollView } from "react-native";
import { Card } from "@/app/components/ui/Card";
import { TokenLaunch } from "@/app/components/TokenLaunch";

export default function LaunchScreen() {
  return (
    <View className="flex-1 bg-white dark:bg-dark-surface">
      <ScrollView className="p-4">
        <Card className="mb-6">
          <Text className="text-xl font-semibold text-text-primary dark:text-dark-text-primary mb-4">
            Launch Your Token
          </Text>
          <TokenLaunch />
        </Card>
      </ScrollView>
    </View>
  );
}
